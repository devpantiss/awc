import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { mockAWCs, mockChildren, mockPredictions } from '@/data/mockData';
import {
  TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Zap,
  Award,
  Minus, Eye, Brain,
  Wifi, WifiOff, ChevronRight, Star,
  Heart, Users, RefreshCcw
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart,
  Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// Generate historical trend data
const generateTrendData = (days: number = 30) => {
  const data = [];
  const baseValues = { attendance: 78, learning: 68, nutrition: 82, enrollment: 145 };
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      attendance: Math.round(baseValues.attendance + Math.random() * 15 - 7 - (isWeekend ? 20 : 0)),
      learning: Math.round(baseValues.learning + Math.random() * 10 - 5 + (days - i) * 0.15),
      nutrition: Math.round(baseValues.nutrition + Math.random() * 8 - 4 + (days - i) * 0.1),
      enrollment: Math.round(baseValues.enrollment + Math.random() * 20 - 10 + (days - i) * 0.5),
    });
  }
  return data;
};

// Generate domain performance data
const domainPerformanceData = [
  { domain: 'Language', score: 75, target: 80, children: 142 },
  { domain: 'Numeracy', score: 68, target: 75, children: 138 },
  { domain: 'Cognitive', score: 72, target: 80, children: 145 },
  { domain: 'Socio-Emotional', score: 81, target: 85, children: 150 },
];

// Generate age distribution data
const ageDistributionData = [
  { name: '0-2 years', value: 35, color: '#6366f1' },
  { name: '2-3 years', value: 45, color: '#8b5cf6' },
  { name: '3-4 years', value: 42, color: '#a855f7' },
  { name: '4-5 years', value: 38, color: '#d946ef' },
  { name: '5-6 years', value: 28, color: '#ec4899' },
];

// Generate nutrition status distribution
const nutritionStatusData = [
  { name: 'Normal', value: 128, color: '#10b981' },
  { name: 'MAM', value: 22, color: '#f59e0b' },
  { name: 'SAM', value: 8, color: '#ef4444' },
];

// Recent activities feed
const recentActivities = [
  { id: 1, type: 'achievement', message: 'AWC Alpha-3 achieved 95% attendance this week', time: '5 min ago', icon: Award },
  { id: 2, type: 'alert', message: '3 children in AWC Alpha-2 flagged for nutrition risk', time: '12 min ago', icon: AlertTriangle },
  { id: 3, type: 'milestone', message: 'Meera improved numeracy score by 15 points', time: '28 min ago', icon: Star },
  { id: 4, type: 'sync', message: 'AWC Beta-1 completed data sync (45 records)', time: '45 min ago', icon: RefreshCcw },
  { id: 5, type: 'assessment', message: '12 learning assessments completed today', time: '1 hour ago', icon: Brain },
  { id: 6, type: 'growth', message: 'District learning score improved by 4.2% this month', time: '2 hours ago', icon: TrendingUp },
];

export function InsightsDashboard() {
  const { language } = useAppStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [trendData] = useState(generateTrendData(30));
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate key metrics
  const totalChildren = useMemo(() => mockChildren.length * 15, [mockChildren.length]);
  const totalAWCs = mockAWCs.length;
  const onlineAWCs = mockAWCs.filter(a => a.deviceStatus === 'Online').length;
  const avgAttendance = useMemo(() => {
    const total = mockAWCs.reduce((sum, awc) => sum + (awc.presentToday / awc.totalChildren) * 100, 0);
    return Math.round(total / mockAWCs.length);
  }, [mockAWCs]);
  const avgLearningScore = useMemo(() => {
    const scores = mockChildren.map(c => c.learningScore);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [mockChildren]);
  const normalNutritionRate = useMemo(() => {
    const normal = mockChildren.filter(c => c.nutritionStatus === 'Normal').length;
    return Math.round((normal / mockChildren.length) * 100);
  }, [mockChildren]);
  const criticalCases = useMemo(() => mockAWCs.reduce((sum, a) => sum + a.criticalCases, 0), [mockAWCs]);
  const highRiskChildren = useMemo(() => 
    mockChildren.filter(c => c.riskFlags.combinedRisk === 'High').length, [mockChildren]);

  // Calculate predictions count
  const activePredictions = mockPredictions.length;

  // Get trend direction
  const getTrendIcon = (change: number) => {
    if (change > 3) return <TrendingUp className="text-emerald-500" size={16} />;
    if (change < -3) return <TrendingDown className="text-red-500" size={16} />;
    return <Minus className="text-slate-400" size={16} />;
  };

  const getTrendColor = (change: number) => {
    if (change > 3) return 'text-emerald-600';
    if (change < -3) return 'text-red-600';
    return 'text-slate-500';
  };

  const getStatusBg = (change: number) => {
    if (change > 3) return 'bg-emerald-50';
    if (change < -3) return 'bg-red-50';
    return 'bg-slate-50';
  };

  // Activity feed icon color
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-amber-100 text-amber-600';
      case 'alert': return 'bg-red-100 text-red-600';
      case 'milestone': return 'bg-indigo-100 text-indigo-600';
      case 'sync': return 'bg-blue-100 text-blue-600';
      case 'assessment': return 'bg-purple-100 text-purple-600';
      case 'growth': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with real-time indicator */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              {language === 'en' ? 'Center Growth Dashboard' : language === 'hi' ? 'केंद्र विकास डैशबोर्ड' : 'କେନ୍ଦ୍ର ବିକାଶ ଡାସବୋର୍ଡ'}
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">
                {language === 'en' ? 'Live' : language === 'hi' ? 'लाईव' : 'ସଜୀବ'}
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {language === 'en' 
              ? `Real-time insights on child development, nutrition, and learning progress • Updated ${lastUpdated.toLocaleTimeString()}` 
              : language === 'hi'
              ? `बाल विकास, पोषण और सीखने की प्रगति पर रीयल-टाइम अंतर्दृष्टि • ${lastUpdated.toLocaleTimeString()} को अपडेट किया गया`
              : `ଶିଶୁ ବିକାଶ, ପୁଷ୍ଟି ଏବଂ ଶିଖିବା ପ୍ରଗତି ଉପରେ ବାସ୍ତବ-ସମୟ ଅନ୍ତର୍ଦୃଷ୍ଟି • ${lastUpdated.toLocaleTimeString()} ରେ ନବୀକରଣ କରାଯାଇଛି`}
          </p>
        </div>
        
        <Tabs value={selectedTimeRange} onValueChange={(v) => setSelectedTimeRange(v as any)}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Growth Velocity Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Attendance Rate</span>
              <div className={`p-1.5 rounded-lg ${getStatusBg(7.9)}`}>
                {getTrendIcon(7.9)}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800">{avgAttendance}%</span>
              <span className={`text-sm font-medium ${getTrendColor(7.9)}`}>
                +{7.9}% from last month
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Target: 85%</span>
                <span>{Math.round((avgAttendance / 85) * 100)}% of target</span>
              </div>
              <Progress value={(avgAttendance / 85) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Learning Score</span>
              <div className={`p-1.5 rounded-lg ${getStatusBg(5.9)}`}>
                {getTrendIcon(5.9)}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800">{avgLearningScore}</span>
              <span className={`text-sm font-medium ${getTrendColor(5.9)}`}>
                +{5.9}% from last month
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Target: 80</span>
                <span>{Math.round((avgLearningScore / 80) * 100)}% of target</span>
              </div>
              <Progress value={(avgLearningScore / 80) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Nutrition Status</span>
              <div className={`p-1.5 rounded-lg ${getStatusBg(3.5)}`}>
                {getTrendIcon(3.5)}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800">{normalNutritionRate}%</span>
              <span className={`text-sm font-medium ${getTrendColor(3.5)}`}>
                +{3.5}% from last month
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Target: 90%</span>
                <span>{Math.round((normalNutritionRate / 90) * 100)}% of target</span>
              </div>
              <Progress value={(normalNutritionRate / 90) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Children Enrolled</span>
              <div className={`p-1.5 rounded-lg ${getStatusBg(7.7)}`}>
                {getTrendIcon(7.7)}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800">{totalChildren}</span>
              <span className={`text-sm font-medium ${getTrendColor(7.7)}`}>
                +{7.7}% from last month
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Across {totalAWCs} centers</span>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(onlineAWCs / totalAWCs) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs text-slate-400">{onlineAWCs}/{totalAWCs} centers online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Trend Charts - Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Attendance & Learning Trend Chart */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Growth Trajectory</CardTitle>
                  <CardDescription>
                    Tracking attendance and learning progress over time
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                    <span className="text-slate-500">Attendance</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-slate-500">Learning</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLearning" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[40, 100]} />
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
                      dataKey="attendance" 
                      stroke="#6366f1" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorAttendance)" 
                      name="Attendance %"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="learning" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorLearning)" 
                      name="Learning Score"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Domain Performance */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Learning Domain Performance</CardTitle>
              <CardDescription>
                Average scores across developmental domains with targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainPerformanceData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis dataKey="domain" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} width={75} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Bar dataKey="target" fill="#e2e8f0" radius={[0, 4, 4, 0]} name="Target" />
                    <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]} name="Current Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AWC Performance Table */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Center Performance Rankings</CardTitle>
                  <CardDescription>
                    Comparative analysis across all anganwadi centers
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye size={14} />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Center</TableHead>
                    <TableHead className="text-center">Attendance</TableHead>
                    <TableHead className="text-center">Learning</TableHead>
                    <TableHead className="text-center">Nutrition</TableHead>
                    <TableHead className="text-center">Overall</TableHead>
                    <TableHead className="text-right">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAWCs.map((awc) => {
                    const attendancePct = Math.round((awc.presentToday / awc.totalChildren) * 100);
                    const learningAvg = Math.round(
                      (awc.avgLearningScores.language + awc.avgLearningScores.numeracy + 
                       awc.avgLearningScores.cognitive + awc.avgLearningScores.socio_emotional) / 4
                    );
                    const nutritionPct = Math.round((awc.riskDistribution.low / awc.totalChildren) * 100);
                    const overallScore = Math.round((attendancePct + learningAvg + nutritionPct) / 3);
                    
                    const getOverallColor = (score: number) => {
                      if (score >= 80) return 'bg-emerald-100 text-emerald-700';
                      if (score >= 60) return 'bg-amber-100 text-amber-700';
                      return 'bg-red-100 text-red-700';
                    };

                    return (
                      <TableRow key={awc.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div>
                            <span className="font-medium">{awc.name}</span>
                            <div className="flex items-center gap-1 mt-1">
                              {awc.deviceStatus === 'Online' ? (
                                <span className="flex items-center gap-1 text-xs text-emerald-600">
                                  <Wifi size={10} /> Online
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-red-500">
                                  <WifiOff size={10} /> Offline
                                </span>
                              )}
                              {awc.criticalCases > 0 && (
                                <span className="flex items-center gap-1 text-xs text-red-500">
                                  <AlertTriangle size={10} /> {awc.criticalCases} critical
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className={`font-semibold ${attendancePct >= 80 ? 'text-emerald-600' : attendancePct >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                              {attendancePct}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1">
                              <div 
                                className={`h-1.5 rounded-full ${attendancePct >= 80 ? 'bg-emerald-500' : attendancePct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${attendancePct}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className={`font-semibold ${learningAvg >= 80 ? 'text-emerald-600' : learningAvg >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                              {learningAvg}
                            </span>
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1">
                              <div 
                                className={`h-1.5 rounded-full ${learningAvg >= 80 ? 'bg-indigo-500' : learningAvg >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${(learningAvg / 100) * 100}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className={`font-semibold ${nutritionPct >= 80 ? 'text-emerald-600' : nutritionPct >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                              {nutritionPct}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1">
                              <div 
                                className={`h-1.5 rounded-full ${nutritionPct >= 80 ? 'bg-purple-500' : nutritionPct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${nutritionPct}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${getOverallColor(overallScore)} border-0 font-semibold`}>
                            {overallScore}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TrendingUp size={14} className="text-emerald-500" />
                            <span className="text-xs text-emerald-600 font-medium">+{Math.round(Math.random() * 8)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Insights & Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Real-time Activity Feed */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap size={18} className="text-amber-500" />
                  Live Activity
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-600 font-medium">Real-time</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex gap-3 items-start">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} flex-shrink-0`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 leading-snug">{activity.message}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4 gap-2">
                View All Activity
                <ChevronRight size={14} />
              </Button>
            </CardContent>
          </Card>

          {/* Alerts & Predictions */}
          <Card className="shadow-sm border-red-200 bg-red-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                  <AlertTriangle size={18} />
                  Attention Needed
                </CardTitle>
                <Badge className="bg-red-100 text-red-700 border-0">
                  {criticalCases + activePredictions} items
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Critical Cases */}
              <div className="p-3 bg-white rounded-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-100 rounded-lg">
                      <Heart size={14} className="text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">SAM Cases</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">{criticalCases}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Children requiring immediate nutrition intervention</p>
              </div>

              {/* Predictions */}
              <div className="p-3 bg-white rounded-lg border border-amber-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <Brain size={14} className="text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">At-Risk Predictions</span>
                  </div>
                  <span className="text-xl font-bold text-amber-600">{activePredictions}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Children predicted to decline in next 30 days</p>
              </div>

              {/* High Risk Children */}
              <div className="p-3 bg-white rounded-lg border border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                      <Users size={14} className="text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">High Risk Children</span>
                  </div>
                  <span className="text-xl font-bold text-orange-600">{highRiskChildren}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Combined learning & nutrition risk</p>
              </div>

              <Button variant="destructive" size="sm" className="w-full">
                Review All Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Nutrition Distribution */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Nutrition Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={nutritionStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {nutritionStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(_value, entry) => {
                        const payload = entry.payload as { name: string; value: number } | undefined;
                        return (
                          <span className="text-xs text-slate-600">
                            {payload?.name}: {payload?.value}
                          </span>
                        );
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Milestones & Achievements */}
          <Card className="shadow-sm border-amber-200 bg-amber-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award size={18} className="text-amber-500" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Star size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Perfect Attendance Week</p>
                  <p className="text-xs text-slate-500">AWC Alpha-3 achieved 100% attendance</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <TrendingUp size={14} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Learning Breakthrough</p>
                  <p className="text-xs text-slate-500">15 children improved by 20+ points</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Nutrition Recovery</p>
                  <p className="text-xs text-slate-500">5 SAM cases moved to Normal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row - Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Age Distribution */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Age Distribution</CardTitle>
            <CardDescription>Children enrolled by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageDistributionData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {ageDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Learning Radar Chart */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Learning Profile</CardTitle>
            <CardDescription>Domain-wise skill distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                  { subject: 'Language', A: 75, fullMark: 100 },
                  { subject: 'Numeracy', A: 68, fullMark: 100 },
                  { subject: 'Cognitive', A: 72, fullMark: 100 },
                  { subject: 'Socio-Emotional', A: 81, fullMark: 100 },
                  { subject: 'Motor Skills', A: 70, fullMark: 100 },
                ]}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Current"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
            <CardDescription>Children by risk level across centers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAWCs.map((awc) => {
                const total = awc.riskDistribution.low + awc.riskDistribution.medium + awc.riskDistribution.high;
                return (
                  <div key={awc.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{awc.name}</span>
                      <span className="text-xs text-slate-500">{total} children</span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 transition-all" 
                        style={{ width: `${(awc.riskDistribution.low / total) * 100}%` }}
                      />
                      <div 
                        className="bg-amber-500 transition-all" 
                        style={{ width: `${(awc.riskDistribution.medium / total) * 100}%` }}
                      />
                      <div 
                        className="bg-red-500 transition-all" 
                        style={{ width: `${(awc.riskDistribution.high / total) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-xs text-slate-500">Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-xs text-slate-500">Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs text-slate-500">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}