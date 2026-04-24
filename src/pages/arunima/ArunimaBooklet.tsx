import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { mockChildren, mockAWCs } from '@/data/mockData';
import { t } from '@/data/localization';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen, TrendingUp, Award, Target, Users, Building,
  ChevronRight, Star, Brain, Heart, Calculator, MessageCircle,
  Eye, FileText, CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import type { Child, LearningDomain } from '../../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Arunima competency levels
type CompetencyLevel = 'emerging' | 'developing' | 'proficient' | 'advanced';

interface DomainCompetency {
  domain: LearningDomain;
  level: CompetencyLevel;
  score: number;
  milestones: string[];
  activities: string[];
}

interface StudentReport {
  child: Child;
  domains: DomainCompetency[];
  overallProgress: number;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  nextSteps: string[];
}

export function ArunimaBooklet() {
  const { language } = useAppStore();
  const [selectedAWC, setSelectedAWC] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('progress');

  // Get children for selected AWC
  const childrenInSelectedAWC = useMemo(() => {
    if (selectedAWC === 'all') return mockChildren;
    return mockChildren.filter(child => child.awcId === selectedAWC);
  }, [selectedAWC]);

  // Generate competency level based on score
  const getCompetencyLevel = (score: number): CompetencyLevel => {
    if (score >= 90) return 'advanced';
    if (score >= 70) return 'proficient';
    if (score >= 50) return 'developing';
    return 'emerging';
  };

  // Get competency level label
  const getCompetencyLevelLabel = (level: CompetencyLevel): string => {
    switch (level) {
      case 'emerging': return t('arunima.level_emerging', language);
      case 'developing': return t('arunima.level_developing', language);
      case 'proficient': return t('arunima.level_proficient', language);
      case 'advanced': return t('arunima.level_advanced', language);
    }
  };

  // Get competency level color
  const getCompetencyLevelColor = (level: CompetencyLevel): string => {
    switch (level) {
      case 'emerging': return 'bg-red-100 text-red-800 border-red-200';
      case 'developing': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'proficient': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  // Get domain icon
  const getDomainIcon = (domain: LearningDomain) => {
    switch (domain) {
      case 'language': return <MessageCircle size={16} />;
      case 'numeracy': return <Calculator size={16} />;
      case 'cognitive': return <Brain size={16} />;
      case 'socio_emotional': return <Heart size={16} />;
    }
  };

  // Sample milestones for each domain
  const getDomainMilestones = (domain: LearningDomain, score: number): string[] => {
    const milestones: Record<LearningDomain, string[]> = {
      language: [
        language === 'en' ? 'Identifies letters and sounds' : language === 'hi' ? 'अक्षर और ध्वनियों की पहचान' : 'ଅକ୍ଷର ଏବଂ ଧ୍ୱନି ଚିହ୍ନଟ',
        language === 'en' ? 'Forms simple words' : language === 'hi' ? 'साधारण शब्द बनाता है' : 'ସାଧାରଣ ଶବ୍ଦ ଗଠନ କରେ',
        language === 'en' ? 'Understands basic instructions' : language === 'hi' ? 'बुनियादी निर्देश समझता है' : 'ମୌଳିକ ନିର୍ଦ୍ଦେଶ ବୁଝେ',
        language === 'en' ? 'Tells simple stories' : language === 'hi' ? 'साधारण कहानियां सुनाता है' : 'ସାଧାରଣ ଗପ କୁହେ',
      ],
      numeracy: [
        language === 'en' ? 'Counts objects up to 10' : language === 'hi' ? '10 तक गिनती' : '୧୦ ପର୍ଯ୍ୟନ୍ତ ଗଣନା',
        language === 'en' ? 'Recognizes numbers' : language === 'hi' ? 'संख्याओं को पहचानता है' : 'ସଂଖ୍ୟା ଚିhnt',
        language === 'en' ? 'Understands basic addition' : language === 'hi' ? 'बुनियादी जोड़ समझता है' : 'ମୌଳିକ ଯୋଗଫଳ ବୁଝେ',
        language === 'en' ? 'Solves simple patterns' : language === 'hi' ? 'साधारण पैटर्न हल करता है' : 'ସାଧାରଣ ପ୍ୟାଟର୍ଣ୍ଣ ସମାଧାନ କରେ',
      ],
      cognitive: [
        language === 'en' ? 'Sorts objects by color/shape' : language === 'hi' ? 'रंग/आकार से वस्तुएं अलग करता है' : 'ରଙ୍ଗ/ଆକାର ଅନୁସାରେ ବସ୍ତୁ ଅଲଗା କରେ',
        language === 'en' ? 'Completes simple puzzles' : language === 'hi' ? 'साधारण पहेलियां पूरी करता है' : 'ସାଧାରଣ ଧାଡ଼ି ପୂରଣ କରେ',
        language === 'en' ? 'Remembers sequences' : language === 'hi' ? 'अनुक्रम याद रखता है' : 'କ୍ରମ ମନେରଖେ',
        language === 'en' ? 'Makes predictions' : language === 'hi' ? 'पूर्वानुमान लगाता है' : 'ପୂର୍ବାନୁମାନ କରେ',
      ],
      socio_emotional: [
        language === 'en' ? 'Shares with peers' : language === 'hi' ? 'साथियों के साथ साझा करता है' : 'ସାଥୀମାନଙ୍କ ସହ ବାଣ୍ଟେ',
        language === 'en' ? 'Follows classroom rules' : language === 'hi' ? 'कक्षा के नियमों का पालन करता है' : 'ଶ୍ରେଣୀ ନିୟମ ପାଳନ କରେ',
        language === 'en' ? 'Expresses emotions appropriately' : language === 'hi' ? 'भावनाओं को उचित तरीके से व्यक्त करता है' : 'ଭାବନାକୁ ଉଚିତ ଭାବେ ପ୍ରକାଶ କରେ',
        language === 'en' ? 'Works in groups' : language === 'hi' ? 'समूह में काम करता है' : 'ଗୋଷ୍ଠୀରେ କାମ କରେ',
      ],
    };

    // Return milestones based on score level
    const milestoneCount = score >= 90 ? 4 : score >= 70 ? 3 : score >= 50 ? 2 : 1;
    return milestones[domain].slice(0, milestoneCount);
  };

  // Sample activities for each domain
  const getDomainActivities = (domain: LearningDomain): string[] => {
    const activities: Record<LearningDomain, string[]> = {
      language: [
        language === 'en' ? 'Storytelling sessions' : language === 'hi' ? 'कहानी सुनाने का सत्र' : 'ଗପ କୁହା ସତ୍ର',
        language === 'en' ? 'Letter recognition games' : language === 'hi' ? 'अक्षर पहचान खेल' : 'ଅକ୍ଷର ଚିhnt ଖେଳ',
        language === 'en' ? 'Rhyme recitation' : language === 'hi' ? 'कविता पाठ' : 'କବିତା ପାଠ',
      ],
      numeracy: [
        language === 'en' ? 'Counting with objects' : language === 'hi' ? 'वस्तुओं के साथ गिनती' : 'ବସ୍ତୁ ସହ ଗଣନା',
        language === 'en' ? 'Number matching games' : language === 'hi' ? 'संख्या मिलान खेल' : 'ସଂଖ୍ୟା ମିଳାନ ଖେଳ',
        language === 'en' ? 'Pattern block activities' : language === 'hi' ? 'पैटर्न ब्लॉक गतिविधियां' : 'ପ୍ୟାଟର୍ଣ୍ଣ ବ୍ଲକ୍ କାର୍ଯ୍ୟକଳାପ',
      ],
      cognitive: [
        language === 'en' ? 'Sorting and classification' : language === 'hi' ? 'छंटाई और वर्गीकरण' : 'ଛାଣ୍ଟା ଏବଂ ବର୍ଗୀକରଣ',
        language === 'en' ? 'Memory games' : language === 'hi' ? 'स्मृति खेल' : 'ସ୍ମୃତି ଖେଳ',
        language === 'en' ? 'Problem-solving puzzles' : language === 'hi' ? 'समस्या-समाधान पहेलियां' : 'ସମସ୍ୟା-ସମାଧାନ ଧାଡ଼ି',
      ],
      socio_emotional: [
        language === 'en' ? 'Group play activities' : language === 'hi' ? 'समूह खेल गतिविधियां' : 'ଗୋଷ୍ଠୀ ଖେଳ କାର୍ଯ୍ୟକଳାପ',
        language === 'en' ? 'Role-playing scenarios' : language === 'hi' ? 'भूमिका-निर्वाह परिदृश्य' : 'ଭୂମିକା-ନିର୍ବାହ ପରିଦୃଶ୍ୟ',
        language === 'en' ? 'Emotion identification cards' : language === 'hi' ? 'भावना पहचान कार्ड' : 'ଭାବନା ଚିhnt କାର୍ଡ',
      ],
    };
    return activities[domain];
  };

  // Generate student report
  const generateStudentReport = (child: Child): StudentReport => {
    const domains: DomainCompetency[] = (Object.keys(child.domainScores) as LearningDomain[]).map(domain => ({
      domain,
      level: getCompetencyLevel(child.domainScores[domain]),
      score: child.domainScores[domain],
      milestones: getDomainMilestones(domain, child.domainScores[domain]),
      activities: getDomainActivities(domain),
    }));

    const overallProgress = Math.round(
      (child.domainScores.language + child.domainScores.numeracy + 
       child.domainScores.cognitive + child.domainScores.socio_emotional) / 4
    );

    // Identify strengths (scores >= 80)
    const strengths = domains
      .filter(d => d.score >= 80)
      .map(d => `${d.domain.charAt(0).toUpperCase() + d.domain.slice(1)} (${d.score}%)`);

    // Identify areas for improvement (scores < 70)
    const areasForImprovement = domains
      .filter(d => d.score < 70)
      .map(d => `${d.domain.charAt(0).toUpperCase() + d.domain.slice(1)} (${d.score}%)`);

    // Generate recommendations
    const recommendations: string[] = [];
    if (overallProgress < 60) {
      recommendations.push(
        language === 'en' ? 'Increase one-on-one learning support' :
        language === 'hi' ? 'एक-एक करके सीखने का समर्थन बढ़ाएं' :
        'ଏକ-ଏକ ଧରି ଶିଖିବା ସମର୍ଥନ ବୃଦ୍ଧି କରନ୍ତୁ'
      );
    }
    if (child.attendanceRate < 80) {
      recommendations.push(
        language === 'en' ? 'Focus on improving attendance' :
        language === 'hi' ? 'उपस्थिति सुधारने पर ध्यान दें' :
        'ଉପସ୍ଥିତି ଉନ୍ନତି ଉପରେ ଧ୍ୟାନ ଦିଅନ୍ତୁ'
      );
    }
    if (areasForImprovement.length > 0) {
      recommendations.push(
        language === 'en' ? 'Provide targeted activities for weaker domains' :
        language === 'hi' ? 'कमजोर डोमेन के लिए लक्षित गतिविधियां प्रदान करें' :
        'ଦୁର୍ବଳ ଡୋମେନ ପାଇଁ ଲକ୍ଷିତ କାର୍ଯ୍ୟକଳାପ ପ୍ରଦାନ କରନ୍ତୁ'
      );
    }
    if (recommendations.length === 0) {
      recommendations.push(
        language === 'en' ? 'Continue current learning pathway' :
        language === 'hi' ? 'वर्तमान सीखने के मार्ग को जारी रखें' :
        'ବର୍ତ୍ତମାନ ଶିଖିବା ମାର୍ଗ ଜାରି ରଖନ୍ତୁ'
      );
    }

    // Generate next steps
    const nextSteps: string[] = [];
    domains.forEach(d => {
      if (d.level === 'emerging') {
        nextSteps.push(
          language === 'en' ? `Focus on foundational ${d.domain} skills` :
          language === 'hi' ? `${d.domain} कौशल पर ध्यान दें` :
          `${d.domain} ଦକ୍ଷତା ଉପରେ ଧ୍ୟାନ ଦିଅନ୍ତୁ`
        );
      } else if (d.level === 'developing') {
        nextSteps.push(
          language === 'en' ? `Practice ${d.domain} activities regularly` :
          language === 'hi' ? `${d.domain} गतिविधियों का नियमित अभ्यास करें` :
          `${d.domain} କାର୍ଯ୍ୟକଳାପ ନିୟମିତ ଅଭ୍ୟାସ କରନ୍ତୁ`
        );
      }
    });

    return {
      child,
      domains,
      overallProgress,
      strengths,
      areasForImprovement,
      recommendations,
      nextSteps,
    };
  };

  // Get selected student report
  const selectedStudentReport = useMemo(() => {
    if (!selectedStudent) return null;
    const child = mockChildren.find(c => c.id === selectedStudent);
    if (!child) return null;
    return generateStudentReport(child);
  }, [selectedStudent]);

  // Progress indicator color
  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-emerald-500';
    if (value >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 rounded-lg text-purple-700">
          <BookOpen size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            {t('arunima.title', language)}
          </h2>
          <p className="text-slate-500">
            {language === 'en' ? 'Track child development across learning domains with Arunima framework' :
             language === 'hi' ? 'अरुणिमा फ्रेमवर्क के साथ सीखने के डोमेन में बाल विकास ट्रैक करें' :
             'ଅରୁଣିମା ଫ୍ରେମୱାର୍କ ସହ ଶିଖିବା ଡୋମେନରେ ବାଳ ବିକାଶ ଟ୍ରାକ୍ କରନ୍ତୁ'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="progress">
              <TrendingUp size={14} className="mr-1" />
              {t('arunima.progress', language)}
            </TabsTrigger>
            <TabsTrigger value="modules">
              <FileText size={14} className="mr-1" />
              {t('arunima.modules', language)}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Building size={16} className="text-slate-500" />
          <Select value={selectedAWC} onValueChange={setSelectedAWC}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={language === 'en' ? 'All Centers' : language === 'hi' ? 'सभी केंद्र' : 'ସମସ୍ତ କେନ୍ଦ୍ର'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'en' ? 'All Centers' : language === 'hi' ? 'सभी केंद्र' : 'ସମସ୍ତ କେନ୍ଦ୍ର'}
              </SelectItem>
              {mockAWCs.map(awc => (
                <SelectItem key={awc.id} value={awc.id}>
                  {awc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Student List - Clickable Stream */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                {language === 'en' ? 'Student Progress Stream' : language === 'hi' ? 'छात्र प्रगति स्ट्रीम' : 'ଛାତ୍ର ଅଗ୍ରଗତି ଷ୍ଟ୍ରିମ୍'}
              </CardTitle>
              <CardDescription>
                {language === 'en' ? 'Click on a student to view detailed report' :
                 language === 'hi' ? 'विस्तृत रिपोर्ट देखने के लिए किसी छात्र पर क्लिक करें' :
                 'ବିସ୍ତୃତ ରିପୋର୍ଟ ଦେଖିବାକୁ ଜଣେ ଛାତ୍ରଙ୍କୁ କ୍ଲିକ୍ କରନ୍ତୁ'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {childrenInSelectedAWC.map(child => {
                  const overallScore = Math.round(
                    (child.domainScores.language + child.domainScores.numeracy +
                     child.domainScores.cognitive + child.domainScores.socio_emotional) / 4
                  );
                  return (
                    <div
                      key={child.id}
                      onClick={() => setSelectedStudent(child.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedStudent === child.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-lg">{child.name}</p>
                          <p className="text-sm text-slate-500">
                            {Math.floor(child.ageMonths / 12)} {language === 'en' ? 'years' : language === 'hi' ? 'साल' : 'ବର୍ଷ'} • 
                            {mockAWCs.find(a => a.id === child.awcId)?.name}
                          </p>
                        </div>
                        <Badge className={getCompetencyLevelColor(getCompetencyLevel(overallScore))}>
                          {getCompetencyLevelLabel(getCompetencyLevel(overallScore))}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">{t('arunima.overall_progress', language)}</span>
                          <span className="font-semibold">{overallScore}%</span>
                        </div>
                        <Progress value={overallScore} className={`h-2 ${getProgressColor(overallScore)}`} />
                      </div>
                      <div className="mt-3 flex items-center text-purple-600 text-sm font-medium">
                        <Eye size={14} className="mr-1" />
                        {t('arunima.view_report', language)}
                        <ChevronRight size={14} className="ml-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Student Report */}
          {selectedStudentReport && (
            <div className="space-y-6">
              {/* Student Overview */}
              <Card className="border-purple-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText size={20} />
                        {t('arunima.student_report', language)} - {selectedStudentReport.child.name}
                      </CardTitle>
                      <CardDescription>
                        {Math.floor(selectedStudentReport.child.ageMonths / 12)} {language === 'en' ? 'years old' : language === 'hi' ? 'साल के' : 'ବର୍ଷ ବୟସ'} • 
                        {mockAWCs.find(a => a.id === selectedStudentReport.child.awcId)?.name}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">{t('arunima.overall_progress', language)}</p>
                      <p className="text-3xl font-bold text-purple-600">{selectedStudentReport.overallProgress}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Domain Progress Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedStudentReport.domains.map(domain => (
                      <div key={domain.domain} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-white rounded-lg">
                              {getDomainIcon(domain.domain)}
                            </div>
                            <div>
                              <p className="font-semibold">{t(`domain.${domain.domain}`, language)}</p>
                              <Badge className={getCompetencyLevelColor(domain.level)}>
                                {getCompetencyLevelLabel(domain.level)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-slate-700">{domain.score}%</p>
                        </div>
                        <Progress value={domain.score} className={`h-2 ${getProgressColor(domain.score)}`} />
                        
                        {/* Milestones */}
                        <div className="mt-4">
                          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                            <Award size={12} />
                            {t('arunima.milestone', language)}:
                          </p>
                          <ul className="space-y-1">
                            {domain.milestones.map((milestone, i) => (
                              <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                                <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                {milestone}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Activities */}
                        <div className="mt-3">
                          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                            <Target size={12} />
                            {t('arunima.activity', language)}:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {domain.activities.map((activity, i) => (
                              <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strengths, Areas for Improvement, Recommendations */}
              <div className="grid gap-4 md:grid-cols-3">
                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-emerald-700">
                      <Star size={18} className="text-emerald-500" />
                      {t('arunima.strengths', language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedStudentReport.strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedStudentReport.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        {language === 'en' ? 'No specific strengths identified yet' :
                         language === 'hi' ? 'अभी तक कोई विशिष्ट ताकत नहीं पहचानी गई' :
                         'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ନିର୍ଦ୍ଦିଷ୍ଟ ଶକ୍ତି ଚିhnt ହୋଇନାହିଁ'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Areas for Improvement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                      <AlertCircle size={18} className="text-amber-500" />
                      {t('arunima.areas_for_improvement', language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedStudentReport.areasForImprovement.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedStudentReport.areasForImprovement.map((area, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                            {area}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        {language === 'en' ? 'All domains are performing well' :
                         language === 'hi' ? 'सभी डोमेन अच्छा प्रदर्शन कर रहे हैं' :
                         'ସମସ୍ତ ଡୋମେନ ଭଲ ପ୍ରଦର୍ଶନ କରୁଛନ୍ତି'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                      <Target size={18} className="text-blue-500" />
                      {t('arunima.recommendations', language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedStudentReport.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <Target size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Next Steps */}
              {selectedStudentReport.nextSteps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp size={18} />
                      {t('arunima.next_steps', language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-2">
                      {selectedStudentReport.nextSteps.map((step, i) => (
                        <div key={i} className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                          <ChevronRight size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!selectedStudent && childrenInSelectedAWC.length > 0 && (
            <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
              <BookOpen size={48} className="mb-4 text-slate-300" />
              <p className="font-medium text-slate-600 text-lg">
                {t('arunima.select_student', language)}
              </p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'modules' && (
        <ArunimaModules language={language} />
      )}
    </div>
  );
}

// Arunima Learning Modules Component - Based on NCERT ECCE / Aadharshila Framework
function ArunimaModules({ language }: { language: string }) {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const modules = [
    {
      id: 1,
      title: {
        en: 'Physical & Motor Development',
        hi: 'शारीरिक और मोटर विकास',
        od: 'ଶାରୀରିକ ଏବଂ ମୋଟର ବିକାଶ'
      },
      description: {
        en: 'Develop gross and fine motor skills, body coordination, balance, and physical health awareness through play-based activities.',
        hi: 'खेल-आधारित गतिविधियों के माध्यम से स्थूल और सूक्ष्म मोटर कौशल, शरीर समन्वय, संतुलन और शारीरिक स्वास्थ्य जागरूकता विकसित करें।',
        od: 'ଖେଳ-ଆଧାରିତ କାର୍ଯ୍ୟକଳାପ ମାଧ୍ୟମରେ ସ୍ଥୂଳ ଏବଂ ସୂକ୍ଷ୍ମ ମୋଟର ଦକ୍ଷତା, ଶରୀର ସମନ୍ୱୟ, ସନ୍ତୁଳନ ଏବଂ ଶାରୀରିକ ସ୍ୱାସ୍ଥ୍ୟ ସଚେତନତା ବିକାଶ କରନ୍ତୁ।'
      },
      icon: Users,
      color: 'bg-emerald-500',
      learningOutcomes: {
        en: [
          'Demonstrates gross motor skills (running, jumping, climbing)',
          'Develops fine motor coordination (grasping, drawing, stacking)',
          'Shows body awareness and spatial understanding',
          'Practices self-help skills (feeding, dressing, hygiene)'
        ],
        hi: [
          'स्थूल मोटर कौशल प्रदर्शित करता है (दौड़ना, कूदना, चढ़ना)',
          'सूक्ष्म मोटर समन्वय विकसित करता है (पकड़ना, चित्र बनाना, ढेर लगाना)',
          'शरीर की जागरूकता और स्थानिक समझ दिखाता है',
          'स्व-सहायता कौशल का अभ्यास करता है (खिलाना, कपड़े पहनना, स्वच्छता)'
        ],
        od: [
          'ସ୍ଥୂଳ ମୋଟର ଦକ୍ଷତା ପ୍ରଦର୍ଶନ କରେ (ଦୌଡ଼ିବା, ଡେଇଁବା, ଚଢ଼ିବା)',
          'ସୂକ୍ଷ୍ମ ମୋଟର ସମନ୍ୱୟ ବିକାଶ କରେ (ଧରିବା, ଚିତ୍ର ଅଙ୍କନ, ଗଦା କରିବା)',
          'ଶରୀର ସଚେତନତା ଏବଂ ସ୍ଥାନିକ ବୁଝାମଣା ଦେଖାଏ',
          'ସ୍ୱ-ସହାୟତା ଦକ୍ଷତା ଅଭ୍ୟାସ କରେ (ଖାଦ୍ୟ ଖୁଆଇବା, ପୋଷାକ ପିନ୍ଧିବା, ସ୍ୱଚ୍ଛତା)'
        ]
      },
      activities: [
        {
          name: { en: 'Obstacle Course', hi: 'रुकावटों वाला रास्ता', od: 'ଅବରୋଧ କୋର୍ସ' },
          desc: {
            en: 'Navigate through tunnels, steps, and balance beams to develop gross motor coordination.',
            hi: 'स्थूल मोटर समन्वय विकसित करने के लिए सुरंगों, कदमों और संतुलन बीम के माध्यम से नेविगेट करें।',
            od: 'ସ୍ଥୂଳ ମୋଟର ସମନ୍ୱୟ ବିକାଶ କରିବା ପାଇଁ ସୁରଙ୍ଗ, ପଦକ୍ଷେପ ଏବଂ ସନ୍ତୁଳନ ବିମ ମାଧ୍ୟମରେ ନେଭିଗେଟ୍ କରନ୍ତୁ।'
          },
          materials: {
            en: 'Cones, hoops, balance beam, stepping stones',
            hi: 'कोन, हूप, संतुलन बीम, स्टेपिंग स्टोन',
            od: 'କୋନ୍, ହୁପ୍, ସନ୍ତୁଳନ ବିମ, ଷ୍ଟେପିଂ ଷ୍ଟୋନ୍'
          },
          duration: '20-25 minutes',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        },
        {
          name: { en: 'Beading & Threading', hi: 'माला बनाना', od: 'ମାଳା ତିଆରି' },
          desc: {
            en: 'Thread beads, pasta, or buttons onto strings to enhance fine motor precision and hand-eye coordination.',
            hi: 'सूक्ष्म मोटर सटीकता और हाथ-आंख समन्वय को बढ़ावा देने के लिए धागों में मोती, पास्ता या बटन पिरोएं।',
            od: 'ସୂକ୍ଷ୍ମ ମୋଟର ସଠିକତା ଏବଂ ହାତ-ଆଖି ସମନ୍ୱୟକୁ ବୃଦ୍ଧି କରିବା ପାଇଁ ଧାଗାରେ ମୋତି, ପାସ୍ତା କିମ୍ବା ବଟନ୍ ପିରୋଅନ୍ତୁ।'
          },
          materials: {
            en: 'Beads, shoelaces, pipe cleaners, large buttons',
            hi: 'मोती, जूते के फीते, पाइप क्लीनर, बड़े बटन',
            od: 'ମୋତି, ଜୁତା ଫିତା, ପାଇପ୍ କ୍ଲିନର, ବଡ଼ ବଟନ୍'
          },
          duration: '15-20 minutes',
          ageGroup: { en: '3-5 years', hi: '3-5 वर्ष', od: '3-5 ବର୍ଷ' }
        },
        {
          name: { en: 'Self-Help Skills Practice', hi: 'स्व-सहायता कौशल अभ्यास', od: 'ସ୍ୱ-ସହାୟତା ଦକ୍ଷତା ଅଭ୍ୟାସ' },
          desc: {
            en: 'Practice buttoning, zipping, spoon-feeding, and handwashing through guided play stations.',
            hi: 'मार्गदर्शित खेल स्टेशनों के माध्यम से बटन लगाना, ज़िप खोलना, चम्मच से खिलाना और हाथ धोने का अभ्यास करें।',
            od: 'ମାର୍ଗଦର୍ଶିତ ଖେଳ ଷ୍ଟେସନ୍ ମାଧ୍ୟମରେ ବଟନ୍ ଲଗାଇବା, ଜିପ୍ ଖୋଲିବା, ଚାମଚରେ ଖାଦ୍ୟ ଖୁଆଇବା ଏବଂ ହାତ ଧୋଇବା ଅଭ୍ୟାସ କରନ୍ତୁ।'
          },
          materials: {
            en: 'Dress-up clothes, dolls, soap, water basin',
            hi: 'ड्रेस-अप कपड़े, गुड़िया, साबुन, पानी का तालाब',
            od: 'ଡ୍ରେସ୍-ଅପ୍ କପଡ଼ା, ପୁତୁଲ, ସାବୁନ, ପାଣି ପାତ୍ର'
          },
          duration: '20 minutes',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        }
      ]
    },
    {
      id: 2,
      title: {
        en: 'Language & Literacy',
        hi: 'भाषा और साक्षरता',
        od: 'ଭାଷା ଏବଂ ସାକ୍ଷରତା'
      },
      description: {
        en: 'Develop listening, speaking, pre-reading and pre-writing skills through stories, rhymes, conversations and print-rich environments.',
        hi: 'कहानियों, कविताओं, बातचीत और प्रिंट-समृद्ध वातावरण के माध्यम से सुनने, बोलने, पूर्व-पठन और पूर्व-लेखन कौशल विकसित करें।',
        od: 'ଗପ, କବିତା, କଥାବାର୍ତ୍ତା ଏବଂ ପ୍ରିଣ୍ଟ-ସମୃଦ୍ଧ ପରିବେଶ ମାଧ୍ୟମରେ ଶୁଣିବା, କୁହା, ପୂର୍ବ-ପଠନ ଏବଂ ପୂର୍ବ-ଲେଖନ ଦକ୍ଷତା ବିକାଶ କରନ୍ତୁ।'
      },
      icon: MessageCircle,
      color: 'bg-blue-500',
      learningOutcomes: {
        en: [
          'Understands and follows oral instructions',
          'Expresses needs, ideas and experiences verbally',
          'Recognizes letters, sounds and simple words',
          'Demonstrates print awareness and book handling skills'
        ],
        hi: [
          'मौखिक निर्देशों को समझता है और उनका पालन करता है',
          'जरूरतों, विचारों और अनुभवों को मौखिक रूप से व्यक्त करता है',
          'अक्षरों, ध्वनियों और सरल शब्दों को पहचानता है',
          'प्रिंट जागरूकता और पुस्तक संचालन कौशल प्रदर्शित करता है'
        ],
        od: [
          'ମୌଖିକ ନିର୍ଦ୍ଦେଶ ବୁଝେ ଏବଂ ପାଳନ କରେ',
          'ଆବଶ୍ୟକତା, ଧାରଣା ଏବଂ ଅନୁଭୂତିକୁ ମୌଖିକ ଭାବେ ପ୍ରକାଶ କରେ',
          'ଅକ୍ଷର, ଧ୍ୱନି ଏବଂ ସରଳ ଶବ୍ଦ ଚିhnt କରେ',
          'ପ୍ରିଣ୍ଟ ସଚେତନତା ଏବଂ ପୁସ୍ତକ ପରିଚାଳନା ଦକ୍ଷତା ପ୍ରଦର୍ଶନ କରେ'
        ]
      },
      activities: [
        {
          name: { en: 'Storytelling Circle', hi: 'कहानी सुनाने का गोला', od: 'ଗପ କୁହା ବୃତ୍ତ' },
          desc: {
            en: 'Interactive storytelling with props, puppets and picture cards to build vocabulary and comprehension.',
            hi: 'शब्दावली और समझ का निर्माण करने के लिए प्रॉप्स, कठपुतलियों और चित्र कार्ड के साथ इंटरएक्टिव कहानी सुनाना।',
            od: 'ଶବ୍ଦାବଳୀ ଏବଂ ବୁଝାମଣା ନିର୍ମାଣ କରିବା ପାଇଁ ପ୍ରପ୍ସ, କଠପୁତଳି ଏବଂ ଚିତ୍ର କାର୍ଡ ସହ ଇଣ୍ଟରଆକ୍ଟିଭ୍ ଗପ କୁହା।'
          },
          materials: {
            en: 'Story books, puppets, flannel board, picture cards',
            hi: 'कहानी की किताबें, कठपुतलियां, फ्लैनल बोर्ड, चित्र कार्ड',
            od: 'ଗପ ପୁସ୍ତକ, କଠପୁତଳି, ଫ୍ଲାନେଲ୍ ବୋର୍ଡ, ଚିତ୍ର କାର୍ଡ'
          },
          duration: '20-25 minutes',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        },
        {
          name: { en: 'Rhyme & Action Songs', hi: 'कविता और एक्शन गाने', od: 'କବିତା ଏବଂ ଏକ୍ସନ୍ ଗୀତ' },
          desc: {
            en: 'Learn rhymes with hand movements and actions to develop phonological awareness and memory.',
            hi: 'ध्वन्यात्मक जागरूकता और स्मृति विकसित करने के लिए हाथ की गति और कार्रवाई के साथ कविताएं सीखें।',
            od: 'ଧ୍ୱନ୍ୟାତ୍ମକ ସଚେତନତା ଏବଂ ସ୍ମୃତି ବିକାଶ କରିବା ପାଇଁ ହାତ ଗତି ଏବଂ କାର୍ଯ୍ୟ ସହ କବିତା ଶିଖନ୍ତୁ।'
          },
          materials: {
            en: 'Rhyme charts, musical instruments, action cards',
            hi: 'कविता चार्ट, संगीत वाद्ययंत्र, एक्शन कार्ड',
            od: 'କବିତା ଚାର୍ଟ, ସଙ୍ଗୀତ ବାଦ୍ୟଯନ୍ତ୍ର, ଏକ୍ସନ୍ କାର୍ଡ'
          },
          duration: '15-20 minutes',
          ageGroup: { en: '3-5 years', hi: '3-5 वर्ष', od: '3-5 ବର୍ଷ' }
        },
        {
          name: { en: 'Letter & Sound Hunt', hi: 'अक्षर और ध्वनि खोज', od: 'ଅକ୍ଷର ଏବଂ ଧ୍ୱନି ଖୋଜ' },
          desc: {
            en: 'Find objects and pictures that start with specific letter sounds to build phonemic awareness.',
            hi: 'ध्वन्यात्मक जागरूकता का निर्माण करने के लिए विशिष्ट अक्षर ध्वनियों के साथ शुरू होने वाली वस्तुओं और चित्रों को खोजें।',
            od: 'ଧ୍ୱନ୍ୟାତ୍ମକ ସଚେତନତା ନିର୍ମାଣ କରିବା ପାଇଁ ନିର୍ଦ୍ଦିଷ୍ଟ ଅକ୍ଷର ଧ୍ୱନି ସହ ଆରମ୍ଭ ହେଉଥିବା ବସ୍ତୁ ଏବଂ ଚିତ୍ର ଖୋଜନ୍ତୁ।'
          },
          materials: {
            en: 'Alphabet cards, object baskets, sound mats',
            hi: 'वर्णमाला कार्ड, वस्तु टोकरियां, ध्वनि चटाई',
            od: 'ବର୍ଣ୍ଣମାଳା କାର୍ଡ, ବସ୍ତୁ ଟୋକରି, ଧ୍ୱନି ଚଟାଇ'
          },
          duration: '20 minutes',
          ageGroup: { en: '4-6 years', hi: '4-6 वर्ष', od: '4-6 ବର୍ଷ' }
        }
      ]
    },
    {
      id: 3,
      title: {
        en: 'Early Numeracy & Mathematics',
        hi: 'प्रारंभिक गणना और गणित',
        od: 'ପ୍ରାରମ୍ଭିକ ଗଣନା ଏବଂ ଗଣିତ'
      },
      description: {
        en: 'Build number sense, counting, classification, patterns, measurement and spatial understanding through hands-on math experiences.',
        hi: 'हाथों से गणित के अनुभवों के माध्यम से संख्या ज्ञान, गिनती, वर्गीकरण, पैटर्न, माप और स्थानिक समझ का निर्माण करें।',
        od: 'ହାତରେ ଗଣିତ ଅନୁଭୂତି ମାଧ୍ୟମରେ ସଂଖ୍ୟା ଜ୍ଞାନ, ଗଣନା, ବର୍ଗୀକରଣ, ପ୍ୟାଟର୍ଣ୍ଣ, ମାପ ଏବଂ ସ୍ଥାନିକ ବୁଝାମଣା ନିର୍ମାଣ କରନ୍ତୁ।'
      },
      icon: Calculator,
      color: 'bg-amber-500',
      learningOutcomes: {
        en: [
          'Counts objects with one-to-one correspondence up to 20',
          'Recognizes and writes numbers 1-20',
          'Sorts and classifies objects by attributes',
          'Identifies and extends patterns (AB, ABC, AAB)',
          'Compares quantities using more/less/same'
        ],
        hi: [
          'एक-से-एक पत्राचार के साथ 20 तक वस्तुओं को गिनता है',
          '1-20 संख्याओं को पहचानता और लिखता है',
          'विशेषताओं के अनुसार वस्तुओं को क्रमबद्ध और वर्गीकृत करता है',
          'पैटर्न की पहचान करता है और उन्हें बढ़ाता है (AB, ABC, AAB)',
          'अधिक/कम/समान का उपयोग करके मात्रा की तुलना करता है'
        ],
        od: [
          'ଗୋଟିଏ-ରୁ-ଗୋଟିଏ ପତ୍ରାଚାର ସହ 20 ପର୍ଯ୍ୟନ୍ତ ବସ୍ତୁ ଗଣନା କରେ',
          '1-20 ସଂଖ୍ୟା ଚିhnt କରେ ଏବଂ ଲେଖେ',
          'ବିଶେଷତା ଅନୁସାରେ ବସ୍ତୁକୁ କ୍ରମବଦ୍ଧ ଏବଂ ବର୍ଗୀକୃତ କରେ',
          'ପ୍ୟାଟର୍ଣ୍ଣ ଚିhnt କରେ ଏବଂ ସେଗୁଡ଼ିକୁ ବୃଦ୍ଧି କରେ (AB, ABC, AAB)',
          'ଅଧିକ/କମ୍/ସମାନ ବ୍ୟବହାର କରି ମାତ୍ରା ତୁଳନା କରେ'
        ]
      },
      activities: [
        {
          name: { en: 'Counting Market', hi: 'गिनती बाजार', od: 'ଗଣନା ବଜାର' },
          desc: {
            en: 'Role-play buying and selling with play money and objects to practice counting, addition and subtraction.',
            hi: 'गिनती, जोड़ और घटाव का अभ्यास करने के लिए प्ले मनी और वस्तुओं के साथ खरीदने और बेचने की भूमिका निभाएं।',
            od: 'ଗଣନା, ଯୋଗ ଏବଂ ବିୟୋଗ ଅଭ୍ୟାସ କରିବା ପାଇଁ ପ୍ଲେ ମନି ଏବଂ ବସ୍ତୁ ସହ କିଣାବିକା ଭୂମିକା ନିର୍ବାହ କରନ୍ତୁ।'
          },
          materials: {
            en: 'Play money, toy fruits/vegetables, price tags, baskets',
            hi: 'खिलौना पैसा, खिलौना फल/सब्जियां, मूल्य टैग, टोकरियां',
            od: 'ଖିଲୌଣା ଟଙ୍କା, ଖିଲୌଣା ଫଳ/ସବ୍ଜି, ମୂଲ୍ୟ ଟ୍ୟାଗ୍, ଟୋକରି'
          },
          duration: '25-30 minutes',
          ageGroup: { en: '4-6 years', hi: '4-6 वर्ष', od: '4-6 ବର୍ଷ' }
        },
        {
          name: { en: 'Pattern Block Designs', hi: 'पैटर्न ब्लॉक डिजाइन', od: 'ପ୍ୟାଟର୍ଣ୍ଣ ବ୍ଲକ୍ ଡିଜାଇନ୍' },
          desc: {
            en: 'Create and extend color and shape patterns using pattern blocks, beads, or natural materials.',
            hi: 'पैटर्न ब्लॉक, मोतियों या प्राकृतिक सामग्री का उपयोग करके रंग और आकार पैटर्न बनाएं और बढ़ाएं।',
            od: 'ପ୍ୟାଟର୍ଣ୍ଣ ବ୍ଲକ୍, ମୋତି କିମ୍ବା ପ୍ରାକୃତିକ ସାମଗ୍ରୀ ବ୍ୟବହାର କରି ରଙ୍ଗ ଏବଂ ଆକାର ପ୍ୟାଟର୍ଣ୍ଣ ତିଆରି କରନ୍ତୁ ଏବଂ ବୃଦ୍ଧି କରନ୍ତୁ।'
          },
          materials: {
            en: 'Pattern blocks, colored tiles, buttons, leaves, shells',
            hi: 'पैटर्न ब्लॉक, रंगीन टाइल्स, बटन, पत्ते, गोले',
            od: 'ପ୍ୟାଟର୍ଣ୍ଣ ବ୍ଲକ୍, ରଙ୍ଗୀନ ଟାଇଲ୍ସ, ବଟନ୍, ପତ୍ର, ଖୋଳ'
          },
          duration: '20 minutes',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        },
        {
          name: { en: 'Measurement Station', hi: 'माप स्टेशन', od: 'ମାପ ଷ୍ଟେସନ୍' },
          desc: {
            en: 'Compare lengths, weights and capacities using non-standard units (hand spans, blocks, cups).',
            hi: 'गैर-मानक इकाइयों (हाथ फैलाव, ब्लॉक, कप) का उपयोग करके लंबाई, वजन और क्षमता की तुलना करें।',
            od: 'ଅ-ମାନକ ଏକକ (ହାତ ଫେଲା, ବ୍ଲକ୍, କପ) ବ୍ୟବହାର କରି ଲମ୍ବା, ଓଜନ ଏବଂ କ୍ଷମତା ତୁଳନା କରନ୍ତୁ।'
          },
          materials: {
            en: 'Rulers, balance scale, measuring cups, blocks, sand/water table',
            hi: 'पैमाना, संतुलन तराजू, मापने वाले कप, ब्लॉक, रेत/पानी टेबल',
            od: 'ପିମାନା, ସନ୍ତୁଳନ ତରାଜୁ, ମାପିବା କପ, ବ୍ଲକ୍, ବାଲି/ପାଣି ଟେବୁଲ୍'
          },
          duration: '20-25 minutes',
          ageGroup: { en: '4-6 years', hi: '4-6 वर्ष', od: '4-6 ବର୍ଷ' }
        }
      ]
    },
    {
      id: 4,
      title: {
        en: 'Cognitive Development',
        hi: 'संज्ञानात्मक विकास',
        od: 'ସଂଜ୍ଞାନାତ୍ମକ ବିକାଶ'
      },
      description: {
        en: 'Enhance problem-solving, memory, attention, reasoning and scientific thinking through exploration, discovery and inquiry-based learning.',
        hi: 'खोज, खोज और जांच-आधारित सीखने के माध्यम से समस्या-समाधान, स्मृति, ध्यान, तर्क और वैज्ञानिक सोच को बढ़ावा दें।',
        od: 'ଅନୁସନ୍ଧାନ, ଆବିଷ୍କାର ଏବଂ ଅନୁସନ୍ଧାନ-ଆଧାରିତ ଶିଖିବା ମାଧ୍ୟମରେ ସମସ୍ୟା-ସମାଧାନ, ସ୍ମୃତି, ଧ୍ୟାନ, ଯୁକ୍ତି ଏବଂ ବୈଜ୍ଞାନିକ ଚିନ୍ତାକୁ ବୃଦ୍ଧି କରନ୍ତୁ।'
      },
      icon: Brain,
      color: 'bg-purple-500',
      learningOutcomes: {
        en: [
          'Sorts and classifies objects by multiple attributes',
          'Solves simple puzzles and problems through trial and error',
          'Demonstrates cause-and-effect understanding',
          'Shows curiosity and asks questions about the environment',
          'Remembers and follows multi-step directions'
        ],
        hi: [
          'कई विशेषताओं के अनुसार वस्तुओं को क्रमबद्ध और वर्गीकृत करता है',
          'प्रयास और गलती के माध्यम से सरल पहेलियों और समस्याओं को हल करता है',
          'कारण-और-प्रभाव समझ प्रदर्शित करता है',
          'जिज्ञासा दिखाता है और पर्यावरण के बारे में प्रश्न पूछता है',
          'बहु-चरणीय दिशाओं को याद रखता है और उनका पालन करता है'
        ],
        od: [
          'ଏକାଧିକ ବିଶେଷତା ଅନୁସାରେ ବସ୍ତୁକୁ କ୍ରମବଦ୍ଧ ଏବଂ ବର୍ଗୀକୃତ କରେ',
          'ପ୍ରୟାସ ଏବଂ ଭୁଲ୍ ମାଧ୍ୟମରେ ସରଳ ଧାଡ଼ି ଏବଂ ସମସ୍ୟା ସମାଧାନ କରେ',
          'କାରଣ-ଏବଂ-ପ୍ରଭାବ ବୁଝାମଣା ପ୍ରଦର୍ଶନ କରେ',
          'ଜିଜ୍ଞାସା ଦେଖାଏ ଏବଂ ପରିବେଶ ବିଷୟରେ ପ୍ରଶ୍ନ ପଚାରେ',
          'ବହୁ-ଚରଣୀୟ ଦିଗ ମନେରଖେ ଏବଂ ପାଳନ କରେ'
        ]
      },
      activities: [
        {
          name: { en: 'Science Discovery Corner', hi: 'विज्ञान खोज कोना', od: 'ବିଜ୍ଞାନ ଖୋଜ କୋଣ' },
          desc: {
            en: 'Hands-on experiments with magnets, water, shadows, and plants to explore scientific concepts.',
            hi: 'वैज्ञानिक अवधारणाओं का पता लगाने के लिए चुंबक, पानी, छाया और पौधों के साथ हाथों से प्रयोग।',
            od: 'ବୈଜ୍ଞାନିକ ଧାରଣା ଅନୁସନ୍ଧାନ କରିବା ପାଇଁ ଚୁମ୍ବକ, ପାଣି, ଛାୟା ଏବଂ ଗଛ ସହ ହାତରେ ପରୀକ୍ଷା।'
          },
          materials: {
            en: 'Magnets, magnifying glasses, prisms, seeds, water trays',
            hi: 'चुंबक, आवर्धक कांच, प्रिज्म, बीज, पानी की ट्रे',
            od: 'ଚୁମ୍ବକ, ଆବର୍ଦ୍ଧକ କାଚ, ପ୍ରିଜ୍ମ, ବୀଜ, ପାଣି ଟ୍ରେ'
          },
          duration: '25-30 minutes',
          ageGroup: { en: '4-6 years', hi: '4-6 वर्ष', od: '4-6 ବର୍ଷ' }
        },
        {
          name: { en: 'Memory & Matching Games', hi: 'स्मृति और मिलान खेल', od: 'ସ୍ମୃତି ଏବଂ ମିଳାନ ଖେଳ' },
          desc: {
            en: 'Play memory card games, lotto, and matching activities to strengthen working memory and visual discrimination.',
            hi: 'कार्यशील स्मृति और दृश्य भेदभाव को मजबूत करने के लिए स्मृति कार्ड खेल, लॉटो और मिलान गतिविधियां खेलें।',
            od: 'କାର୍ଯ୍ୟଶୀଳ ସ୍ମୃତି ଏବଂ ଦୃଶ୍ୟ ଭେଦଭାବକୁ ମଜବୁତ୍ କରିବା ପାଇଁ ସ୍ମୃତି କାର୍ଡ ଖେଳ, ଲଟୋ ଏବଂ ମିଳାନ କାର୍ଯ୍ୟକଳାପ ଖେଳନ୍ତୁ।'
          },
          materials: {
            en: 'Memory cards, lotto boards, picture dominoes',
            hi: 'स्मृति कार्ड, लॉटो बोर्ड, चित्र डोमिनोज',
            od: 'ସ୍ମୃତି କାର୍ଡ, ଲଟୋ ବୋର୍ଡ, ଚିତ୍ର ଡୋମିନୋଜ୍'
          },
          duration: '15-20 minutes',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        },
        {
          name: { en: 'Sorting & Classification Lab', hi: 'सॉर्टिंग और वर्गीकरण प्रयोगशाला', od: 'ସର୍ଟିଂ ଏବଂ ବର୍ଗୀକରଣ ପ୍ରୟୋଗଶାଳା' },
          desc: {
            en: 'Sort objects by color, shape, size, texture and function using real objects and picture cards.',
            hi: 'वास्तविक वस्तुओं और चित्र कार्ड का उपयोग करके रंग, आकार, आकार, बनावट और कार्य के अनुसार वस्तुओं को क्रमबद्ध करें।',
            od: 'ବାସ୍ତବ ବସ୍ତୁ ଏବଂ ଚିତ୍ର କାର୍ଡ ବ୍ୟବହାର କରି ରଙ୍ଗ, ଆକାର, ଆକାର, ବनावଟ ଏବଂ କାର୍ୟ ଅନୁସାରେ ବସ୍ତୁକୁ କ୍ରମବଦ୍ଧ କରନ୍ତୁ।'
          },
          materials: {
            en: 'Sorting trays, attribute blocks, natural objects, picture cards',
            hi: 'सॉर्टिंग ट्रे, विशेषता ब्लॉक, प्राकृतिक वस्तुएं, चित्र कार्ड',
            od: 'ସର୍ଟିଂ ଟ୍ରେ, ବିଶେଷତା ବ୍ଲକ୍, ପ୍ରାକୃତିକ ବସ୍ତୁ, ଚିତ୍ର କାର୍ଡ'
          },
          duration: '20 minutes',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        }
      ]
    },
    {
      id: 5,
      title: {
        en: 'Socio-Emotional & Ethical Development',
        hi: 'सामाजिक-भावनात्मक और नैतिक विकास',
        od: 'ସାମାଜିକ-ଭାବନାତ୍ମକ ଏବଂ ନୈତିକ ବିକାଶ'
      },
      description: {
        en: 'Develop self-awareness, emotional regulation, empathy, cooperation, and moral values through group activities, role-play and cultural experiences.',
        hi: 'समूह गतिविधियों, भूमिका-निर्वाह और सांस्कृतिक अनुभवों के माध्यम से आत्म-जागरूकता, भावनात्मक नियमन, सहानुभूति, सहयोग और नैतिक मूल्य विकसित करें।',
        od: 'ଗୋଷ୍ଠୀ କାର୍ଯ୍ୟକଳାପ, ଭୂମିକା-ନିର୍ବାହ ଏବଂ ସାଂସ୍କୃତିକ ଅନୁଭୂତି ମାଧ୍ୟମରେ ଆତ୍ମ-ସଚେତନତା, ଭାବନାତ୍ମକ ନିୟନ୍ତ୍ରଣ, ସହାନୁଭୂତି, ସହଯୋଗ ଏବଂ ନୈତିକ ମୂଲ୍ୟ ବିକାଶ କରନ୍ତୁ।'
      },
      icon: Heart,
      color: 'bg-pink-500',
      learningOutcomes: {
        en: [
          'Identifies and labels own emotions appropriately',
          'Demonstrates empathy and helps others in distress',
          'Shares, takes turns and cooperates in group activities',
          'Follows classroom rules and routines',
          'Shows respect for diversity and cultural differences'
        ],
        hi: [
          'अपनी भावनाओं की पहचान करता है और उन्हें उचित तरीके से लेबल करता है',
          'सहानुभूति प्रदर्शित करता है और संकट में दूसरों की मदद करता है',
          'साझा करता है, बारी लेता है और समूह गतिविधियों में सहयोग करता है',
          'कक्षा के नियमों और दिनचर्या का पालन करता है',
          'विविधता और सांस्कृतिक अंतर के प्रति सम्मान दिखाता है'
        ],
        od: [
          'ନିଜ ଭାବନା ଚିhnt କରେ ଏବଂ ଉଚିତ ଭାବେ ଲେବଲ୍ କରେ',
          'ସହାନୁଭୂତି ପ୍ରଦର୍ଶନ କରେ ଏବଂ ସଙ୍କଟରେ ଅନ୍ୟମାନଙ୍କୁ ସାହାଯ୍ୟ କରେ',
          'ବାଣ୍ଟେ, ବାରୀ ନିଏ ଏବଂ ଗୋଷ୍ଠୀ କାର୍ଯ୍ୟକଳାପରେ ସହଯୋଗ କରେ',
          'ଶ୍ରେଣୀ ନିୟମ ଏବଂ ଦିନଚର୍ଯ୍ୟା ପାଳନ କରେ',
          'ବିବିଧତା ଏବଂ ସାଂସ୍କୃତିକ ଅନ୍ତର ପ୍ରତି ସମ୍ମାନ ଦେଖାଏ'
        ]
      },
      activities: [
        {
          name: { en: 'Emotion Circle Time', hi: 'भावना गोला समय', od: 'ଭାବନା ବୃତ୍ତ ସମୟ' },
          desc: {
            en: 'Daily check-in where children identify feelings using emotion cards and discuss coping strategies.',
            hi: 'दैनिक चेक-इन जहां बच्चे भावना कार्ड का उपयोग करके भावनाओं की पहचान करते हैं और मुकाबला रणनीतियों पर चर्चा करते हैं।',
            od: 'ଦୈନିକ ଚେକ୍-ଇନ୍ ଯେଉଁଠାରେ ପିଲାମାନେ ଭାବନା କାର୍ଡ ବ୍ୟବହାର କରି ଭାବନା ଚିhnt କରନ୍ତି ଏବଂ ମୁକାବିଲା ରଣନୀତି ଉପରେ ଆଲୋଚନା କରନ୍ତି।'
          },
          materials: {
            en: 'Emotion cards, feeling chart, calm-down corner props',
            hi: 'भावना कार्ड, भावना चार्ट, शांत कोना प्रॉप्स',
            od: 'ଭାବନା କାର୍ଡ, ଭାବନା ଚାର୍ଟ, ଶାନ୍ତ କୋଣ ପ୍ରପ୍ସ'
          },
          duration: '15 minutes daily',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        },
        {
          name: { en: 'Cooperative Group Projects', hi: 'सहयोगी समूह परियोजनाएं', od: 'ସହଯୋଗୀ ଗୋଷ୍ଠୀ ପ୍ରକଳ୍ପ' },
          desc: {
            en: 'Work together on art murals, building projects, or gardening to practice sharing, turn-taking and teamwork.',
            hi: 'साझा करने, बारी-बारी से और टीमवर्क का अभ्यास करने के लिए कला म्यूरल, निर्माण परियोजनाओं या बागवानी पर एक साथ काम करें।',
            od: 'ବାଣ୍ଟିବା, ବାରୀ-ବାରୀ ଏବଂ ଟିମୱର୍କ ଅଭ୍ୟାସ କରିବା ପାଇଁ କଳା ମ୍ୟୁରାଲ୍, ନିର୍ମାଣ ପ୍ରକଳ୍ପ କିମ୍ବା ବାଗିଚା ଉପରେ ଏକତ୍ର କାମ କରନ୍ତୁ।'
          },
          materials: {
            en: 'Large paper, art supplies, building blocks, gardening tools',
            hi: 'बड़ा कागज, कला की आपूर्ति, निर्माण ब्लॉक, बागवानी उपकरण',
            od: 'ବଡ଼ କାଗଜ, କଳା ସାମଗ୍ରୀ, ନିର୍ମାଣ ବ୍ଲକ୍, ବାଗିଚା ଉପକରଣ'
          },
          duration: '30-40 minutes',
          ageGroup: { en: '4-6 years', hi: '4-6 वर्ष', od: '4-6 ବର୍ଷ' }
        },
        {
          name: { en: 'Cultural Celebration Days', hi: 'सांस्कृतिक उत्सव दिन', od: 'ସାଂସ୍କୃତିକ ଉତ୍ସବ ଦିନ' },
          desc: {
            en: 'Celebrate festivals, share family traditions, and learn about diverse cultures through food, music, dance and stories.',
            hi: 'त्योहार मनाएं, पारिवारिक परंपराओं को साझा करें, और भोजन, संगीत, नृत्य और कहानियों के माध्यम से विविध संस्कृतियों के बारे में जानें।',
            od: 'ପର୍ବ ପାଳନ କରନ୍ତୁ, ପାରିବାରିକ ପରମ୍ପରା ସାଝା କରନ୍ତୁ, ଏବଂ ଖାଦ୍ୟ, ସଙ୍ଗୀତ, ନୃତ୍ୟ ଏବଂ ଗପ ମାଧ୍ୟମରେ ବିବିଧ ସଂସ୍କୃତି ବିଷୟରେ ଶିଖନ୍ତୁ।'
          },
          materials: {
            en: 'Traditional clothing, musical instruments, story books, art materials',
            hi: 'पारंपरिक कपड़े, संगीत वाद्ययंत्र, कहानी की किताबें, कला सामग्री',
            od: 'ପାରମ୍ପାରିକ କପଡ଼ା, ସଙ୍ଗୀତ ବାଦ୍ୟଯନ୍ତ୍ର, ଗପ ପୁସ୍ତକ, କଳା ସାମଗ୍ରୀ'
          },
          duration: 'Special events',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        }
      ]
    },
    {
      id: 6,
      title: {
        en: 'Creative Arts & Expression',
        hi: 'रचनात्मक कला और अभिव्यक्ति',
        od: 'ରଚନାତ୍ମକ କଳା ଏବଂ ଅଭିବ୍ୟକ୍ତି'
      },
      description: {
        en: 'Foster creativity, imagination and self-expression through visual arts, music, dance, drama and imaginative play.',
        hi: 'दृश्य कला, संगीत, नृत्य, नाटक और काल्पनिक खेल के माध्यम से रचनात्मकता, कल्पना और आत्म-अभिव्यक्ति को बढ़ावा दें।',
        od: 'ଦୃଶ୍ୟ କଳା, ସଙ୍ଗୀତ, ନୃତ୍ୟ, ନାଟକ ଏବଂ କାଳ୍ପନିକ ଖେଳ ମାଧ୍ୟମରେ ରଚନାତ୍ମକତା, କଳ୍ପନା ଏବଂ ଆତ୍ମ-ଅଭିବ୍ୟକ୍ତିକୁ ବୃଦ୍ଧି କରନ୍ତୁ।'
      },
      icon: Star,
      color: 'bg-orange-500',
      learningOutcomes: {
        en: [
          'Uses art materials creatively to express ideas and feelings',
          'Participates in singing, dancing and musical activities',
          'Engages in pretend play and role-playing scenarios',
          'Appreciates beauty in nature and art',
          'Takes pride in own creative work'
        ],
        hi: [
          'विचारों और भावनाओं को व्यक्त करने के लिए कला सामग्री का रचनात्मक उपयोग करता है',
          'गाने, नृत्य और संगीत गतिविधियों में भाग लेता है',
          'नाटक और भूमिका-निर्वाह परिदृश्यों में संलग्न होता है',
          'प्रकृति और कला में सुंदरता की सराहना करता है',
          'अपने रचनात्मक काम पर गर्व करता है'
        ],
        od: [
          'ଧାରଣା ଏବଂ ଭାବନା ପ୍ରକାଶ କରିବା ପାଇଁ କଳା ସାମଗ୍ରୀର ରଚନାତ୍ମକ ବ୍ୟବହାର କରେ',
          'ଗାନ, ନୃତ୍ୟ ଏବଂ ସଙ୍ଗୀତ କାର୍ଯ୍ୟକଳାପରେ ଅଂଶଗ୍ରହଣ କରେ',
          'ନାଟକ ଏବଂ ଭୂମିକା-ନିର୍ବାହ ପରିଦୃଶ୍ୟରେ ସଂଯୁକ୍ତ ହୁଏ',
          'ପ୍ରକୃତି ଏବଂ କଳାରେ ସୌନ୍ଦର୍ଯ୍ୟର ସରାହନା କରେ',
          'ନିଜ ରଚନାତ୍ମକ କାମ ଉପରେ ଗର୍ବ କରେ'
        ]
      },
      activities: [
        {
          name: { en: 'Process Art Studio', hi: 'प्रक्रिया कला स्टूडियो', od: 'ପ୍ରକ୍ରିୟା କଳା ଷ୍ଟୁଡିଓ' },
          desc: {
            en: 'Open-ended art exploration with various materials (paint, clay, collage) focusing on process over product.',
            hi: 'उत्पाद पर प्रक्रिया पर ध्यान केंद्रित करते हुए विभिन्न सामग्री (पेंट, मिट्टी, कोलाज) के साथ खुले अंत की कला खोज।',
            od: 'ଉତ୍ପାଦ ଉପରେ ପ୍ରକ୍ରିୟା ଉପରେ ଧ୍ୟାନ ଦେଇ ବିଭିନ୍ନ ସାମଗ୍ରୀ (ପେଣ୍ଟ, ମାଟି, କୋଲାଜ୍) ସହ ଖୋଲା-ଅନ୍ତ କଳା ଅନୁସନ୍ଧାନ।'
          },
          materials: {
            en: 'Paints, brushes, clay, collage materials, natural objects',
            hi: 'पेंट, ब्रश, मिट्टी, कोलाज सामग्री, प्राकृतिक वस्तुएं',
            od: 'ପେଣ୍ଟ, ବ୍ରସ୍, ମାଟି, କୋଲାଜ୍ ସାମଗ୍ରୀ, ପ୍ରାକୃତିକ ବସ୍ତୁ'
          },
          duration: '30-40 minutes',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        },
        {
          name: { en: 'Music & Movement', hi: 'संगीत और आंदोलन', od: 'ସଙ୍ଗୀତ ଏବଂ ଆନ୍ଦୋଳନ' },
          desc: {
            en: 'Explore rhythm, melody and movement through singing, dancing, playing instruments and creative expression.',
            hi: 'गाने, नृत्य, वाद्ययंत्र बजाने और रचनात्मक अभिव्यक्ति के माध्यम से लय, सुर और आंदोलन का पता लगाएं।',
            od: 'ଗାନ, ନୃତ୍ୟ, ବାଦ୍ୟଯନ୍ତ୍ର ବଜାଇବା ଏବଂ ରଚନାତ୍ମକ ଅଭିବ୍ୟକ୍ତି ମାଧ୍ୟମରେ ଲୟ, ସୁର ଏବଂ ଆନ୍ଦୋଳନ ଅନୁସନ୍ଧାନ କରନ୍ତୁ।'
          },
          materials: {
            en: 'Drums, tambourines, scarves, rhythm sticks, music player',
            hi: 'ढोल, तंबूरीन, स्कार्फ, रिदम स्टिक्स, संगीत प्लेयर',
            od: 'ଢୋଲ, ତମ୍ବୁରିନ୍, ସ୍କାର୍ଫ, ରିଦମ୍ ଷ୍ଟିକ୍ସ, ସଙ୍ଗୀତ ପ୍ଲେୟର'
          },
          duration: '20-25 minutes',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        },
        {
          name: { en: 'Dramatic Play Center', hi: 'नाटकीय खेल केंद्र', od: 'ନାଟକୀୟ ଖେଳ କେନ୍ଦ୍ର' },
          desc: {
            en: 'Pretend play scenarios (kitchen, shop, doctor, post office) to develop imagination, language and social skills.',
            hi: 'कल्पना, भाषा और सामाजिक कौशल विकसित करने के लिए नाटक खेल परिदृश्य (रसोई, दुकान, डॉक्टर, डाकघर)।',
            od: 'କଳ୍ପନା, ଭାଷା ଏବଂ ସାମାଜିକ ଦକ୍ଷତା ବିକାଶ କରିବା ପାଇଁ ନାଟକ ଖେଳ ପରିଦୃଶ୍ୟ (ରୋଷେଇ ଘର, ଦୋକାନ, ଡାକ୍ତର, ଡାକଘର)।'
          },
          materials: {
            en: 'Dress-up clothes, play kitchen, props, puppets, themed sets',
            hi: 'ड्रेस-अप कपड़े, प्ले किचन, प्रॉप्स, कठपुतलियां, थीम वाले सेट',
            od: 'ଡ୍ରେସ୍-ଅପ୍ କପଡ଼ା, ପ୍ଲେ କିଚନ୍, ପ୍ରପ୍ସ, କଠପୁତଳି, ଥିମ୍ ସେଟ୍'
          },
          duration: 'Free play / 30+ minutes',
          ageGroup: { en: '3-6 years', hi: '3-6 वर्ष', od: '3-6 ବର୍ଷ' }
        }
      ]
    }
  ];

  const getLocalizedText = (obj: Record<string, string>, lang: string): string => {
    return obj[lang as keyof typeof obj] || obj.en;
  };

  return (
    <div className="space-y-6">
      {/* Module Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map(module => (
          <Card 
            key={module.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
          >
            <div className={`${module.color} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <module.icon size={28} />
                  <h3 className="text-xl font-bold">
                    {getLocalizedText(module.title, language)}
                  </h3>
                </div>
                <ChevronRight 
                  size={20} 
                  className={`transition-transform ${expandedModule === module.id ? 'rotate-90' : ''}`} 
                />
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-slate-600 mb-4 text-sm">
                {getLocalizedText(module.description, language)}
              </p>
              
              {/* Learning Outcomes */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Award size={14} />
                  {t('arunima.competency', language)}:
                </p>
                <ul className="space-y-1">
                  {(module.learningOutcomes[language as keyof typeof module.learningOutcomes] as string[] || module.learningOutcomes.en).slice(0, 2).map((outcome, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                      <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activity Count */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Target size={14} />
                <span>{module.activities.length} {language === 'en' ? 'activities' : language === 'hi' ? 'गतिविधियां' : 'କାର୍ଯ୍ୟକଳାପ'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expanded Module Details */}
      {expandedModule && (
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const module = modules.find(m => m.id === expandedModule);
                  const Icon = module?.icon || FileText;
                  return <Icon size={24} className="text-purple-600" />;
                })()}
                <CardTitle>
                  {getLocalizedText(
                    modules.find(m => m.id === expandedModule)?.title || { en: '' },
                    language
                  )}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedModule(null)}
              >
                {language === 'en' ? 'Close' : language === 'hi' ? 'बंद करें' : 'ବନ୍ଦ କରନ୍ତୁ'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {(() => {
              const module = modules.find(m => m.id === expandedModule);
              if (!module) return null;

              return (
                <>
                  {/* Description */}
                  <p className="text-slate-700">
                    {getLocalizedText(module.description, language)}
                  </p>

                  {/* Learning Outcomes */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Award size={18} className="text-emerald-500" />
                      {t('arunima.competency', language)}:
                    </h4>
                    <ul className="space-y-2">
                      {module.learningOutcomes[language as keyof typeof module.learningOutcomes] 
                        ? (module.learningOutcomes[language as keyof typeof module.learningOutcomes] as string[]).map((outcome, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                              {outcome}
                            </li>
                          ))
                        : module.learningOutcomes.en.map((outcome, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                              {outcome}
                            </li>
                          ))
                      }
                    </ul>
                  </div>

                  {/* Activities */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Target size={18} className="text-blue-500" />
                      {t('arunima.activity', language)}:
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {module.activities.map((activity, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <h5 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${module.color}`} />
                            {getLocalizedText(activity.name, language)}
                          </h5>
                          <p className="text-sm text-slate-600 mb-3">
                            {getLocalizedText(activity.desc, language)}
                          </p>
                          <div className="space-y-2 text-xs text-slate-500">
                            <div className="flex items-start gap-2">
                              <FileText size={12} className="mt-0.5 flex-shrink-0" />
                              <span><strong>{language === 'en' ? 'Materials:' : language === 'hi' ? 'सामग्री:' : 'ସାମଗ୍ରୀ:'}</strong> {getLocalizedText(activity.materials, language)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={12} className="flex-shrink-0" />
                              <span><strong>{language === 'en' ? 'Duration:' : language === 'hi' ? 'अवधि:' : 'ଅବଧି:'}</strong> {activity.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={12} className="flex-shrink-0" />
                              <span><strong>{language === 'en' ? 'Age:' : language === 'hi' ? 'आयु:' : 'ବୟସ:'}</strong> {getLocalizedText(activity.ageGroup, language)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
