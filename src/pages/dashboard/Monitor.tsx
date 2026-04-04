import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockAWCs, mockChildren, mockAssessments, mockPathways } from '@/data/mockData';
import {
  Brain, BookOpen, Calculator, Heart, Users,
  TrendingUp, TrendingDown, AlertTriangle,
  Wifi, WifiOff, RefreshCcw, Target, Award,
  ChevronRight, Activity, BarChart3,
  ArrowUpRight, ArrowDownRight, Minus, Eye,
  Filter, Download,
  Play, GitBranch
} from 'lucide-react';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, Legend
} from 'recharts';

// Learning domain configuration
const learningDomains = [
  {
    key: 'language' as const,
    name: 'Language',
    nameOd: 'ଭାଷା',
    icon: BookOpen,
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-600',
    bgColorLight: 'bg-indigo-100',
    progressColor: 'bg-indigo-500'
  },
  {
    key: 'numeracy' as const,
    name: 'Numeracy',
    nameOd: 'ଗଣନା',
    icon: Calculator,
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    bgColorLight: 'bg-purple-100',
    progressColor: 'bg-purple-500'
  },
  {
    key: 'cognitive' as const,
    name: 'Cognitive',
    nameOd: 'ସଂଜ୍ଞାନାତ୍ମକ',
    icon: Brain,
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    bgColorLight: 'bg-blue-100',
    progressColor: 'bg-blue-500'
  },
  {
    key: 'socio_emotional' as const,
    name: 'Socio-Emotional',
    nameOd: 'ସାମାଜିକ-ଭାବନାତ୍ମକ',
    icon: Heart,
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    bgColorLight: 'bg-emerald-100',
    progressColor: 'bg-emerald-500'
  }
];

// Difficulty level labels
const difficultyLabels = {
  1: { en: 'Foundational', hi: 'आधारभूत', od: 'ମୌଳିକ' },
  2: { en: 'Basic', hi: 'मौलिक', od: 'ପ୍ରାଥମିକ' },
  3: { en: 'Intermediate', hi: 'मध्यवर्ती', od: 'ମଧ୍ୟବର୍ତ୍ତୀ' },
  4: { en: 'Advanced', hi: 'उन्नत', od: 'ଉନ୍ନତ' },
  5: { en: 'Expert', hi: 'विशेषज्ञ', od: 'ବିଶେଷଜ୍ଞ' }
};

// Generate learning progress trend data
interface TrendDataPoint {
  date: string;
  score: number;
  target: number;
}

const generateLearningTrendData = (_domain: string, baseScore: number, days: number = 30): TrendDataPoint[] => {
  const data: TrendDataPoint[] = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const variation = Math.random() * 8 - 4;
    const trend = (days - i) * 0.3;
    const score = Math.min(100, Math.max(0, baseScore + variation + trend));
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.round(score),
      target: 80
    });
  }
  return data;
};

// Learning activity data for heatmap
interface ActivityDataPoint {
  day: string;
  hour: string;
  activity: number;
}

const generateActivityData = (): ActivityDataPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'];
  const data: ActivityDataPoint[] = [];
  days.forEach(day => {
    hours.forEach(hour => {
      const isWeekend = day === 'Sat' || day === 'Sun';
      const isAfternoon = hour === '1pm' || hour === '2pm';
      const baseActivity = isWeekend ? 20 : isAfternoon ? 40 : 70;
      data.push({
        day,
        hour,
        activity: Math.round(baseActivity + Math.random() * 30)
      });
    });
  });
  return data;
};

export function Monitor() {
  const { language } = useAppStore();
  const [selectedAWCId, setSelectedAWCId] = useState<string>(mockAWCs[0]?.id || 'awc1');
  const [activeDomain, setActiveDomain] = useState<string>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get selected AWC data
  const selectedAWC = useMemo(() =>
    mockAWCs.find(awc => awc.id === selectedAWCId),
    [selectedAWCId]
  );

  // Get children for selected AWC
  const awcChildren = useMemo(() =>
    mockChildren.filter(child => child.awcId === selectedAWCId),
    [selectedAWCId]
  );

  // Calculate learning metrics for selected AWC
  const learningMetrics = useMemo(() => {
    if (!selectedAWC) return null;

    const metrics = {
      language: {
        avgScore: selectedAWC.avgLearningScores.language,
        target: 80,
        childrenAssessed: awcChildren.length,
        trend: 'up',
        changePercent: 5.2
      },
      numeracy: {
        avgScore: selectedAWC.avgLearningScores.numeracy,
        target: 75,
        childrenAssessed: awcChildren.length,
        trend: 'stable',
        changePercent: 1.1
      },
      cognitive: {
        avgScore: selectedAWC.avgLearningScores.cognitive,
        target: 80,
        childrenAssessed: awcChildren.length,
        trend: 'up',
        changePercent: 3.8
      },
      socio_emotional: {
        avgScore: selectedAWC.avgLearningScores.socio_emotional,
        target: 85,
        childrenAssessed: awcChildren.length,
        trend: 'up',
        changePercent: 4.2
      }
    };
    return metrics;
  }, [selectedAWC, awcChildren.length]);

  // Get children by difficulty level for each domain
  const childrenByDifficulty = useMemo(() => {
    return learningDomains.map(domain => {
      const difficultyDistribution = [0, 0, 0, 0, 0]; // Levels 1-5
      awcChildren.forEach(child => {
        const level = child.currentDifficulty[domain.key];
        difficultyDistribution[level - 1]++;
      });
      return {
        domain: domain.key,
        name: domain.name,
        distribution: difficultyDistribution
      };
    });
  }, [awcChildren]);

  useMemo(() => {
    return awcChildren.slice(0, 8).map(child => ({
      name: child.name.substring(0, 8),
      language: child.domainScores.language,
      numeracy: child.domainScores.numeracy,
      cognitive: child.domainScores.cognitive,
      socio_emotional: child.domainScores.socio_emotional,
      overall: child.learningScore
    }));
  }, [awcChildren]);

  // Recent assessments for selected AWC
  const recentAssessments = useMemo(() => {
    return mockAssessments
      .filter(a => awcChildren.some(c => c.id === a.childId))
      .slice(0, 5)
      .map(assessment => ({
        ...assessment,
        childName: awcChildren.find(c => c.id === assessment.childId)?.name || 'Unknown'
      }));
  }, [awcChildren]);

  // Get status color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: string, _change: number) => {
    if (trend === 'up') return <TrendingUp size={14} className="text-emerald-500" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-red-500" />;
    return <Minus size={14} className="text-slate-400" />;
  };

  // Activity heatmap data
  const activityData = generateActivityData();

  return (
    <div className="space-y-6 pb-12">
      {/* Header with AWC Selector */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              {language === 'en' ? 'AWC Monitor' : language === 'hi' ? 'AWC मॉनिटर' : 'AWC ମନିଟର'}
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">Live</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {language === 'en'
              ? `Central monitoring hub for tracking AWC progress • Updated ${lastUpdated.toLocaleTimeString()}`
              : language === 'hi'
                ? `AWC प्रगति ट्रैकिंग के लिए केंद्रीय मॉनिटरिंग हब • ${lastUpdated.toLocaleTimeString()} को अपडेट किया गया`
                : `AWC ପ୍ରଗତି ଟ୍ରାକିଂ ପାଇଁ କେନ୍ଦ୍ରୀୟ ପର୍ଯ୍ୟବେକ୍ଷଣ ହବ୍ • ${lastUpdated.toLocaleTimeString()} ରେ ନବୀକରଣ କରାଯାଇଛି`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedAWCId} onValueChange={setSelectedAWCId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select AWC" />
            </SelectTrigger>
            <SelectContent>
              {mockAWCs.map(awc => (
                <SelectItem key={awc.id} value={awc.id}>
                  <div className="flex items-center gap-2">
                    <span>{awc.name}</span>
                    {awc.deviceStatus === 'Online' ? (
                      <Wifi size={12} className="text-emerald-500" />
                    ) : (
                      <WifiOff size={12} className="text-red-500" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* AWC Quick Status Bar */}
      {selectedAWC && (
        <Card className="border-indigo-100 shadow-sm bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedAWC.deviceStatus === 'Online' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {selectedAWC.deviceStatus === 'Online' ? (
                    <Wifi className="text-emerald-600" size={18} />
                  ) : (
                    <WifiOff className="text-red-600" size={18} />
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Device Status</p>
                  <p className={`text-sm font-semibold ${selectedAWC.deviceStatus === 'Online' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedAWC.deviceStatus}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Attendance Today</p>
                  <p className="text-sm font-semibold">{selectedAWC.presentToday}/{selectedAWC.totalChildren}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <RefreshCcw className="text-amber-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Sync Status</p>
                  <p className="text-sm font-semibold">
                    {selectedAWC.pendingSyncCount > 0 ? `${selectedAWC.pendingSyncCount} pending` : 'Synced'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Brain className="text-purple-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Avg Learning</p>
                  <p className="text-sm font-semibold">
                    {Math.round((selectedAWC.avgLearningScores.language + selectedAWC.avgLearningScores.numeracy +
                      selectedAWC.avgLearningScores.cognitive + selectedAWC.avgLearningScores.socio_emotional) / 4)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle className="text-red-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Critical Cases</p>
                  <p className="text-sm font-semibold text-red-600">{selectedAWC.criticalCases}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Target className="text-emerald-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Infrastructure</p>
                  <p className="text-sm font-semibold">{selectedAWC.infrastructureScore}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Modules Section - Enhanced Layout */}
      <Card className="border-indigo-100 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="text-indigo-500" size={20} />
                Learning Modules Progress
              </CardTitle>
              <CardDescription>
                Track progress across all learning domains with detailed metrics and trends
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={14} />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={14} />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Domain Tabs */}
          <Tabs value={activeDomain} onValueChange={setActiveDomain} className="space-y-4">
            <TabsList className="grid grid-cols-5 bg-slate-100 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Overview
              </TabsTrigger>
              {learningDomains.map(domain => (
                <TabsTrigger
                  key={domain.key}
                  value={domain.key}
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
                >
                  <domain.icon size={14} className={domain.textColor} />
                  <span className="hidden lg:inline">{domain.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Domain Cards Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {learningDomains.map(domain => {
                  const metric = learningMetrics?.[domain.key];
                  if (!metric) return null;
                  const Icon = domain.icon;
                  const progressPercent = (metric.avgScore / metric.target) * 100;

                  return (
                    <Card
                      key={domain.key}
                      className={`border-l-4 ${domain.borderColor} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                      onClick={() => setActiveDomain(domain.key)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg ${domain.bgColor}`}>
                            <Icon className={domain.textColor} size={20} />
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(metric.avgScore)}`}>
                            {getTrendIcon(metric.trend, metric.changePercent)}
                            {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-slate-500">{domain.name}</p>
                            <p className="text-2xl font-bold text-slate-800">{metric.avgScore}</p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Target: {metric.target}</span>
                              <span className="text-slate-500">{Math.round(progressPercent)}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                            <span>{metric.childrenAssessed} children</span>
                            <span className={domain.textColor}>View details →</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Learning Trends Chart */}
              <Card className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Learning Trends Over Time</CardTitle>
                  <CardDescription>Progress trajectory across all domains</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generateLearningTrendData('overall', 72, 30)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorLanguage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorNumeracy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorCognitive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorSocio" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[40, 100]} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '12px'
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorLanguage)"
                          name="Language"
                        />
                        <Area
                          type="monotone"
                          dataKey="target"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorNumeracy)"
                          name="Numeracy"
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorCognitive)"
                          name="Cognitive"
                        />
                        <Area
                          type="monotone"
                          dataKey="target"
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorSocio)"
                          name="Socio-Emotional"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Child Progress Table */}
              <Card className="border-slate-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Child Progress Overview</CardTitle>
                      <CardDescription>Individual learning progress across domains</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye size={14} />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-3 text-sm font-medium text-slate-500">Child</th>
                          <th className="text-center py-3 px-3 text-sm font-medium text-slate-500">
                            <div className="flex items-center justify-center gap-1">
                              <BookOpen size={14} /> Language
                            </div>
                          </th>
                          <th className="text-center py-3 px-3 text-sm font-medium text-slate-500">
                            <div className="flex items-center justify-center gap-1">
                              <Calculator size={14} /> Numeracy
                            </div>
                          </th>
                          <th className="text-center py-3 px-3 text-sm font-medium text-slate-500">
                            <div className="flex items-center justify-center gap-1">
                              <Brain size={14} /> Cognitive
                            </div>
                          </th>
                          <th className="text-center py-3 px-3 text-sm font-medium text-slate-500">
                            <div className="flex items-center justify-center gap-1">
                              <Heart size={14} /> Socio-Emotional
                            </div>
                          </th>
                          <th className="text-center py-3 px-3 text-sm font-medium text-slate-500">Overall</th>
                        </tr>
                      </thead>
                      <tbody>
                        {awcChildren.slice(0, 6).map(child => (
                          <tr key={child.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-3">
                              <div>
                                <p className="font-medium text-slate-800">{child.name}</p>
                                <p className="text-xs text-slate-500">Age: {Math.floor(child.ageMonths / 12)}y {child.ageMonths % 12}m</p>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col items-center">
                                <span className={`font-semibold text-sm ${child.domainScores.language >= 80 ? 'text-emerald-600' : child.domainScores.language >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                  {child.domainScores.language}
                                </span>
                                <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1">
                                  <div
                                    className={`h-1.5 rounded-full ${child.domainScores.language >= 80 ? 'bg-indigo-500' : child.domainScores.language >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${child.domainScores.language}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col items-center">
                                <span className={`font-semibold text-sm ${child.domainScores.numeracy >= 80 ? 'text-emerald-600' : child.domainScores.numeracy >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                  {child.domainScores.numeracy}
                                </span>
                                <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1">
                                  <div
                                    className={`h-1.5 rounded-full ${child.domainScores.numeracy >= 80 ? 'bg-purple-500' : child.domainScores.numeracy >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${child.domainScores.numeracy}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col items-center">
                                <span className={`font-semibold text-sm ${child.domainScores.cognitive >= 80 ? 'text-emerald-600' : child.domainScores.cognitive >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                  {child.domainScores.cognitive}
                                </span>
                                <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1">
                                  <div
                                    className={`h-1.5 rounded-full ${child.domainScores.cognitive >= 80 ? 'bg-blue-500' : child.domainScores.cognitive >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${child.domainScores.cognitive}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col items-center">
                                <span className={`font-semibold text-sm ${child.domainScores.socio_emotional >= 80 ? 'text-emerald-600' : child.domainScores.socio_emotional >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                  {child.domainScores.socio_emotional}
                                </span>
                                <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1">
                                  <div
                                    className={`h-1.5 rounded-full ${child.domainScores.socio_emotional >= 80 ? 'bg-emerald-500' : child.domainScores.socio_emotional >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${child.domainScores.socio_emotional}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <Badge className={`${getScoreColor(child.learningScore)} border-0 font-semibold`}>
                                {child.learningScore}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Individual Domain Tabs */}
            {learningDomains.map(domain => {
              const metric = learningMetrics?.[domain.key];
              if (!metric) return null;
              const Icon = domain.icon;
              const trendData = generateLearningTrendData(domain.key, metric.avgScore, 30);

              return (
                <TabsContent key={domain.key} value={domain.key} className="space-y-6">
                  {/* Domain Header Card */}
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Score Card */}
                    <Card className={`border-l-4 ${domain.borderColor}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg ${domain.bgColor}`}>
                            <Icon className={domain.textColor} size={24} />
                          </div>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(metric.avgScore)}`}>
                            {getTrendIcon(metric.trend, metric.changePercent)}
                            {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">{domain.name} Score</p>
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-slate-800">{metric.avgScore}</span>
                            <span className="text-sm text-slate-500">/ {metric.target} target</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Progress value={(metric.avgScore / metric.target) * 100} className="h-3" />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>{Math.round((metric.avgScore / metric.target) * 100)}% of target</span>
                            <span>{metric.target - metric.avgScore > 0 ? `${metric.target - metric.avgScore} points to go` : 'Target achieved!'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Difficulty Distribution */}
                    <Card className={`border-l-4 ${domain.borderColor}`}>
                      <CardContent className="pt-6">
                        <p className="text-sm text-slate-500 mb-4">Difficulty Level Distribution</p>
                        <div className="space-y-3">
                          {childrenByDifficulty.find(d => d.domain === domain.key)?.distribution.map((count, idx) => {
                            const level = idx + 1;
                            const percent = awcChildren.length > 0 ? (count / awcChildren.length) * 100 : 0;
                            const label = difficultyLabels[level as 1 | 2 | 3 | 4 | 5];
                            return (
                              <div key={level} className="flex items-center gap-3">
                                <span className="text-xs text-slate-500 w-20">{label?.[language] || level}</span>
                                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${domain.progressColor} rounded-full transition-all duration-500`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-slate-600 w-8 text-right">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className={`border-l-4 ${domain.borderColor}`}>
                      <CardContent className="pt-6">
                        <p className="text-sm text-slate-500 mb-4">Quick Stats</p>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-slate-500" />
                              <span className="text-sm text-slate-600">Children Assessed</span>
                            </div>
                            <span className="font-semibold">{metric.childrenAssessed}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Target size={16} className="text-slate-500" />
                              <span className="text-sm text-slate-600">On Track</span>
                            </div>
                            <span className="font-semibold text-emerald-600">
                              {awcChildren.filter(c => c.domainScores[domain.key] >= metric.target).length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={16} className="text-slate-500" />
                              <span className="text-sm text-slate-600">Needs Support</span>
                            </div>
                            <span className="font-semibold text-amber-600">
                              {awcChildren.filter(c => c.domainScores[domain.key] < 60).length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Award size={16} className="text-slate-500" />
                              <span className="text-sm text-slate-600">Excelling</span>
                            </div>
                            <span className="font-semibold text-indigo-600">
                              {awcChildren.filter(c => c.domainScores[domain.key] >= 90).length}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Trend Chart for Domain */}
                  <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp size={18} className={domain.textColor} />
                        {domain.name} Progress Trend
                      </CardTitle>
                      <CardDescription>
                        Score progression over the last 30 days with target benchmarks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                              <linearGradient id={`color${domain.key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={domain.key === 'language' ? '#6366f1' : domain.key === 'numeracy' ? '#8b5cf6' : domain.key === 'cognitive' ? '#3b82f6' : '#10b981'} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={domain.key === 'language' ? '#6366f1' : domain.key === 'numeracy' ? '#8b5cf6' : domain.key === 'cognitive' ? '#3b82f6' : '#10b981'} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[40, 100]} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                fontSize: '12px'
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="score"
                              stroke={domain.key === 'language' ? '#6366f1' : domain.key === 'numeracy' ? '#8b5cf6' : domain.key === 'cognitive' ? '#3b82f6' : '#10b981'}
                              strokeWidth={3}
                              fillOpacity={1}
                              fill={`url(#color${domain.key})`}
                              name="Score"
                            />
                            <Line
                              type="monotone"
                              dataKey="target"
                              stroke="#94a3b8"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              name="Target"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Children needing attention in this domain */}
                  <Card className="border-amber-200 bg-amber-50/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2 text-amber-700">
                            <AlertTriangle size={18} />
                            Children Needing Support in {domain.name}
                          </CardTitle>
                          <CardDescription>
                            Children scoring below 60 who may need additional intervention
                          </CardDescription>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 border-0">
                          {awcChildren.filter(c => c.domainScores[domain.key] < 60).length} children
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {awcChildren
                          .filter(c => c.domainScores[domain.key] < 60)
                          .sort((a, b) => a.domainScores[domain.key] - b.domainScores[domain.key])
                          .slice(0, 5)
                          .map(child => (
                            <div key={child.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${domain.bgColor} flex items-center justify-center`}>
                                  <span className={`font-semibold ${domain.textColor}`}>
                                    {child.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">{child.name}</p>
                                  <p className="text-xs text-slate-500">
                                    Current level: {difficultyLabels[child.currentDifficulty[domain.key]]?.[language]}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className={`text-xl font-bold ${getScoreColor(child.domainScores[domain.key]).split(' ')[0]}`}>
                                    {child.domainScores[domain.key]}
                                  </p>
                                  <p className="text-xs text-slate-500">/ 100</p>
                                </div>
                                <Button size="sm" variant="outline" className={domain.textColor}>
                                  Intervene
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Monitoring Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Assessments */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity size={18} className="text-purple-500" />
                  Recent Assessments
                </CardTitle>
                <CardDescription>Latest learning assessment results</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                View All <ChevronRight size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAssessments.length > 0 ? (
                recentAssessments.map(assessment => (
                  <div key={assessment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Brain size={14} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{assessment.childName}</p>
                        <p className="text-xs text-slate-500">
                          {assessment.domain} • Level {assessment.difficultyLevel} • {Math.round(assessment.duration / 60)}min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-bold ${assessment.score >= 80 ? 'text-emerald-600' : assessment.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {assessment.score}%
                      </span>
                      <span className="text-xs text-slate-500">
                        {assessment.correctAnswers}/{assessment.totalQuestions}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No recent assessments available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Activity Heatmap */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-500" />
                  Learning Activity Patterns
                </CardTitle>
                <CardDescription>Activity intensity by time and day</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Heatmap Grid */}
              <div className="grid grid-cols-8 gap-1">
                <div className="text-xs text-slate-400 p-1"></div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-xs text-slate-500 text-center p-1 font-medium">{day}</div>
                ))}
                {['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'].map(hour => (
                  activityData.filter(d => d.hour === hour).map(slot => (
                    <div
                      key={`${slot.day}-${slot.hour}`}
                      className={`h-8 rounded ${slot.activity > 70 ? 'bg-indigo-600' : slot.activity > 50 ? 'bg-indigo-400' : slot.activity > 30 ? 'bg-indigo-300' : 'bg-indigo-100'}`}
                      title={`${slot.day} ${slot.hour}: ${slot.activity}% activity`}
                    />
                  ))
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-100 rounded" />
                  <span className="text-xs text-slate-500">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-300 rounded" />
                  <span className="text-xs text-slate-500">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-400 rounded" />
                  <span className="text-xs text-slate-500">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded" />
                  <span className="text-xs text-slate-500">Very High</span>
                </div>
              </div>

              {/* Insights */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium mb-1">Peak Activity</p>
                  <p className="text-sm text-slate-700">10am - 12pm on weekdays</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Best Performance</p>
                  <p className="text-sm text-slate-700">Morning sessions (9-11am)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Learning Pathways */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <GitBranch size={18} className="text-emerald-500" />
                Learning Pathways
              </CardTitle>
              <CardDescription>
                Recommended next steps for each child based on their current progress
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download size={14} />
              Export Recommendations
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 text-sm font-medium text-slate-500">Child</th>
                  <th className="text-center py-3 px-3 text-sm font-medium text-slate-500">Current Level</th>
                  <th className="text-center py-3 px-3 text-sm font-medium text-slate-500">Mastery</th>
                  <th className="text-center py-3 px-3 text-sm font-medium text-slate-500">Recommended Next</th>
                  <th className="text-center py-3 px-3 text-sm font-medium text-slate-500">Sessions Completed</th>
                  <th className="text-center py-3 px-3 text-sm font-medium text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {awcChildren.slice(0, 5).map(child => {
                  const pathway = mockPathways.find(p => p.childId === child.id);
                  if (!pathway) return null;
                  const currentLabel = difficultyLabels[pathway.currentDifficulty];
                  const nextLabel = difficultyLabels[pathway.recommendedNext];

                  return (
                    <tr key={child.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-slate-800">{child.name}</p>
                          <p className="text-xs text-slate-500">{child.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          Level {pathway.currentDifficulty}: {currentLabel?.[language]}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <Progress value={pathway.masteryLevel} className="w-20 h-2" />
                          <span className="text-sm font-medium">{pathway.masteryLevel}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            Level {pathway.recommendedNext}: {nextLabel?.[language]}
                          </Badge>
                          {pathway.recommendedNext > pathway.currentDifficulty ? (
                            <ArrowUpRight size={14} className="text-emerald-500" />
                          ) : pathway.recommendedNext < pathway.currentDifficulty ? (
                            <ArrowDownRight size={14} className="text-amber-500" />
                          ) : (
                            <Minus size={14} className="text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-medium">{pathway.sessionsCompleted}</span>
                        <span className="text-xs text-slate-500 ml-1">sessions</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Play size={12} />
                          Start
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}