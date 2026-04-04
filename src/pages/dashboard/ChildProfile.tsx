import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockChildren, mockPredictions, mockAssessments, getRiskColor } from '@/data/mockData';
import { t, getDomainNames, getDifficultyLabel } from '@/data/localization';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, 
  Activity, BookOpen, Target
} from 'lucide-react';
import type { Child, LearningDomain } from '../../types';

export function ChildProfile() {
  const { language } = useAppStore();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  
  const domainNames = getDomainNames(language);
  
  const getDomainStatus = (score: number): 'green' | 'yellow' | 'red' => {
    if (score >= 75) return 'green';
    if (score >= 50) return 'yellow';
    return 'red';
  };
  
  const getDomainStatusText = (score: number): string => {
    if (score >= 75) return language === 'od' ? 'ଉନ୍ନତ' : language === 'hi' ? 'उन्नत' : 'Advanced';
    if (score >= 50) return language === 'od' ? 'ମଧ୍ୟମ' : language === 'hi' ? 'मध्यम' : 'Developing';
    return language === 'od' ? 'ଆଧାର' : language === 'hi' ? 'आधार' : 'Needs Support';
  };
  
  const getPredictionForChild = (childId: string) => {
    return mockPredictions.find(p => p.childId === childId);
  };
  
  const getRecentAssessments = (childId: string) => {
    return mockAssessments.filter(a => a.childId === childId);
  };
  
  // Progress chart data (simplified visualization)
  const renderProgressSparkline = (history: Child['progressHistory'], domain: LearningDomain) => {
    const domainHistory = history.filter(h => h.domain === domain).slice(-14);
    const scores = domainHistory.map(h => h.score);
    const maxScore = Math.max(...scores, 100);
    const minScore = Math.min(...scores, 0);
    const range = maxScore - minScore || 1;
    
    const points = scores.map((score, i) => {
      const x = (i / (scores.length - 1)) * 100;
      const y = 100 - ((score - minScore) / range) * 80 - 10;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg viewBox="0 0 100 100" className="w-full h-8" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
          className={scores[scores.length - 1] >= 75 ? 'text-emerald-500' : 
                    scores[scores.length - 1] >= 50 ? 'text-amber-500' : 'text-red-500'}
        />
      </svg>
    );
  };
  
  if (selectedChild) {
    const prediction = getPredictionForChild(selectedChild.id);
    const assessments = getRecentAssessments(selectedChild.id);
    
    return (
      <div className="space-y-6">
        {/* Back button and child header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedChild(null)}>
            ← {language === 'en' ? 'Back to List' : language === 'hi' ? 'वापस जाएं' : 'ଫେରିଯାଆନ୍ତୁ'}
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{selectedChild.name}</h2>
            <p className="text-slate-500">
              {selectedChild.ageMonths / 12} {language === 'en' ? 'years' : language === 'hi' ? 'वर्ष' : 'ବର୍ଷ'} | 
              {selectedChild.gender === 'M' ? 
                (language === 'en' ? ' Male' : language === 'hi' ? ' पुरुष' : ' ପୁରୁଷ') : 
                (language === 'en' ? ' Female' : language === 'hi' ? ' महिला' : ' ମହିଳା')}
            </p>
          </div>
        </div>
        
        {/* Risk Status Banner */}
        <Card className={`border-l-4 ${
          selectedChild.riskFlags.combinedRisk === 'High' ? 'border-l-red-500 bg-red-50' :
          selectedChild.riskFlags.combinedRisk === 'Medium' ? 'border-l-amber-500 bg-amber-50' :
          'border-l-emerald-500 bg-emerald-50'
        }`}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedChild.riskFlags.combinedRisk === 'High' ? (
                  <AlertTriangle className="text-red-500" size={24} />
                ) : selectedChild.riskFlags.combinedRisk === 'Medium' ? (
                  <Activity className="text-amber-500" size={24} />
                ) : (
                  <CheckCircle className="text-emerald-500" size={24} />
                )}
                <div>
                  <p className="font-semibold">
                    {language === 'en' ? 'Combined Risk Level:' : language === 'hi' ? 'संयुक्त जोखिम स्तर:' : 'ସମ୍ମିଳିତ ବିପଦ ସ୍ତର:'}
                    <span className={`ml-2 ${getRiskColor(selectedChild.riskFlags.combinedRisk)}`}>
                      {selectedChild.riskFlags.combinedRisk}
                    </span>
                  </p>
                  {selectedChild.riskFlags.flags.length > 0 && (
                    <p className="text-sm text-slate-600 mt-1">
                      {selectedChild.riskFlags.flags.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              {selectedChild.riskFlags.combinedRisk === 'High' && (
                <Button variant="destructive" size="sm">
                  {language === 'en' ? 'Take Action' : language === 'hi' ? 'कार्रवाई करें' : 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ନିଅନ୍ତୁ'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Prediction Alert */}
        {prediction && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <AlertTriangle size={20} />
                {language === 'en' ? 'Nutrition-Learning Prediction Alert' : 
                  language === 'hi' ? 'पोषण-सीखने की भविष्यवाणी चेतावनी' : 
                  'ପୁଷ୍ଟି-ଶିଖିବା ପୂର୍ବାନୁମାନ ସତର୍କତା'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">{language === 'en' ? 'Current Status' : language === 'hi' ? 'वर्तमान स्थिति' : 'ବର୍ତ୍ତମାନ ସ୍ଥିତି'}</p>
                  <p className="font-semibold">{prediction.currentNutritionStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{language === 'en' ? 'Predicted Status' : language === 'hi' ? 'अनुमानित स्थिति' : 'ଅନୁମାନିତ ସ୍ଥିତି'}</p>
                  <p className="font-semibold text-red-600">{prediction.predictedNutritionStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{language === 'en' ? 'Days to Prediction' : language === 'hi' ? 'भविष्यवाणी के दिन' : 'ଭବିଷ୍ୟବାଣୀ ଦିନ'}</p>
                  <p className="font-semibold">{prediction.daysToPrediction} {language === 'en' ? 'days' : language === 'hi' ? 'दिन' : 'ଦିନ'}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-500 mb-2">{language === 'en' ? 'Risk Factors' : language === 'hi' ? 'जोखिम कारक' : 'ବିପଦ କାରକ'}</p>
                <div className="flex flex-wrap gap-2">
                  {prediction.riskFactors.map((factor, i) => (
                    <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-red-200">
                <p className="text-sm text-slate-500 mb-2">{language === 'en' ? 'Recommended Interventions' : language === 'hi' ? 'अनुशंसित हस्तक्षेप' : 'ସୁପାରିଶ କରାଯାଇଥିବା ହସ୍ତକ୍ଷେପ'}</p>
                <div className="flex flex-wrap gap-2">
                  {prediction.recommendedInterventions.map((intervention, i) => (
                    <Badge key={i} className="bg-red-600 hover:bg-red-700">
                      {intervention.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Domain Scores */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(selectedChild.domainScores) as LearningDomain[]).map((domain) => (
            <Card key={domain}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {domainNames[domain]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{selectedChild.domainScores[domain]}</p>
                    <p className="text-xs text-slate-500">
                      {getDomainStatusText(selectedChild.domainScores[domain])}
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${
                    getDomainStatus(selectedChild.domainScores[domain]) === 'green' ? 'bg-emerald-100' :
                    getDomainStatus(selectedChild.domainScores[domain]) === 'yellow' ? 'bg-amber-100' :
                    'bg-red-100'
                  }`}>
                    {getDomainStatus(selectedChild.domainScores[domain]) === 'green' ? (
                      <TrendingUp className={getDomainStatus(selectedChild.domainScores[domain]) === 'green' ? 'text-emerald-600' : 
                        getDomainStatus(selectedChild.domainScores[domain]) === 'yellow' ? 'text-amber-600' : 'text-red-600'} size={20} />
                    ) : getDomainStatus(selectedChild.domainScores[domain]) === 'yellow' ? (
                      <Minus className="text-amber-600" size={20} />
                    ) : (
                      <TrendingDown className="text-red-600" size={20} />
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        getDomainStatus(selectedChild.domainScores[domain]) === 'green' ? 'bg-emerald-500' :
                        getDomainStatus(selectedChild.domainScores[domain]) === 'yellow' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${selectedChild.domainScores[domain]}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {language === 'en' ? 'Difficulty:' : language === 'hi' ? 'कठिनाई:' : 'କଠିନତା:'} 
                  {' '}{getDifficultyLabel(selectedChild.currentDifficulty[domain], language)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Tabs for detailed views */}
        <Tabs defaultValue="progress">
          <TabsList>
            <TabsTrigger value="progress">
              {language === 'en' ? 'Progress Tracking' : language === 'hi' ? 'प्रगति ट्रैकिंग' : 'ଅଗ୍ରଗତି ଟ୍ରାକିଂ'}
            </TabsTrigger>
            <TabsTrigger value="assessments">
              {language === 'en' ? 'Assessments' : language === 'hi' ? 'मूल्यांकन' : 'ମୂଲ୍ୟାଙ୍କନ'}
            </TabsTrigger>
            <TabsTrigger value="nutrition">
              {language === 'en' ? 'Nutrition History' : language === 'hi' ? 'पोषण इतिहास' : 'ପୁଷ୍ଟି ଇତିହାସ'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Learning Progress by Domain' : language === 'hi' ? 'डोमेन द्वारा सीखने की प्रगति' : 'ଡୋମେନ ଅନୁସାରେ ଶିଖିବା ଅଗ୍ରଗତି'}</CardTitle>
                <CardDescription>{language === 'en' ? 'Last 30 days trend' : language === 'hi' ? 'पिछले 30 दिनों का रुझान' : 'ଗତ ୩୦ ଦିନର ପ୍ରବୃତ୍ତି'}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'en' ? 'Domain' : language === 'hi' ? 'डोमेन' : 'ଡୋମେନ'}</TableHead>
                      <TableHead>{language === 'en' ? 'Current Score' : language === 'hi' ? 'वर्तमान स्कोर' : 'ବର୍ତ୍ତମାନ ସ୍କୋର'}</TableHead>
                      <TableHead>{language === 'en' ? 'Trend' : language === 'hi' ? 'रुझान' : 'ପ୍ରବୃତ୍ତି'}</TableHead>
                      <TableHead>{language === 'en' ? 'Percentile' : language === 'hi' ? 'पर्सेंटाइल' : 'ପାର୍ସେଣ୍ଟାଇଲ'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(Object.keys(selectedChild.domainScores) as LearningDomain[]).map((domain) => {
                      const domainHistory = selectedChild.progressHistory.filter(h => h.domain === domain);
                      const recentScore = domainHistory[domainHistory.length - 1]?.score || 0;
                      const olderScore = domainHistory[0]?.score || 0;
                      const trend = recentScore > olderScore ? 'up' : recentScore < olderScore ? 'down' : 'stable';
                      
                      return (
                        <TableRow key={domain}>
                          <TableCell className="font-medium">{domainNames[domain]}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{selectedChild.domainScores[domain]}</span>
                              {renderProgressSparkline(selectedChild.progressHistory, domain)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {trend === 'up' ? (
                              <TrendingUp className="text-emerald-500" size={16} />
                            ) : trend === 'down' ? (
                              <TrendingDown className="text-red-500" size={16} />
                            ) : (
                              <Minus className="text-slate-500" size={16} />
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {Math.round(Math.random() * 40 + 50)}th
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Recent Assessments' : language === 'hi' ? 'हाल के आकलन' : 'ସାମ୍ପ୍ରତିକ ମୂଲ୍ୟାଙ୍କନ'}</CardTitle>
              </CardHeader>
              <CardContent>
                {assessments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'en' ? 'Date' : language === 'hi' ? 'तारीख' : 'ତାରିଖ'}</TableHead>
                        <TableHead>{language === 'en' ? 'Domain' : language === 'hi' ? 'डोमेन' : 'ଡୋମେନ'}</TableHead>
                        <TableHead>{language === 'en' ? 'Score' : language === 'hi' ? 'स्कोर' : 'ସ୍କୋର'}</TableHead>
                        <TableHead>{language === 'en' ? 'Difficulty' : language === 'hi' ? 'कठिनाई' : 'କଠିନତା'}</TableHead>
                        <TableHead>{language === 'en' ? 'Duration' : language === 'hi' ? 'अवधि' : 'ଅବଧି'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessments.map((assessment) => (
                        <TableRow key={assessment.id}>
                          <TableCell>{new Date(assessment.timestamp).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{domainNames[assessment.domain]}</TableCell>
                          <TableCell>
                            <Badge className={assessment.score >= 80 ? 'bg-emerald-100 text-emerald-800' : 
                                           assessment.score >= 50 ? 'bg-amber-100 text-amber-800' : 
                                           'bg-red-100 text-red-800'}>
                              {assessment.score}
                            </Badge>
                          </TableCell>
                          <TableCell>{getDifficultyLabel(assessment.difficultyLevel, language)}</TableCell>
                          <TableCell className="text-slate-500">
                            {Math.floor(assessment.duration / 60)}m {assessment.duration % 60}s
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <BookOpen className="mx-auto mb-2 text-slate-300" size={32} />
                    <p>{language === 'en' ? 'No assessments yet' : language === 'hi' ? 'अभी तक कोई आकलन नहीं' : 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ମୂଲ୍ୟାଙ୍କନ ନାହିଁ'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Nutrition History' : language === 'hi' ? 'पोषण इतिहास' : 'ପୁଷ୍ଟି ଇତିହାସ'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">{language === 'en' ? 'Current Weight' : language === 'hi' ? 'वर्तमान वजन' : 'ବର୍ତ୍ତମାନ ଓଜନ'}</p>
                    <p className="text-2xl font-bold">
                      {selectedChild.nutritionHistory[selectedChild.nutritionHistory.length - 1]?.weight} kg
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">{language === 'en' ? 'Current MUAC' : language === 'hi' ? 'वर्तमान MUAC' : 'ବର୍ତ୍ତମାନ MUAC'}</p>
                    <p className="text-2xl font-bold">
                      {selectedChild.nutritionHistory[selectedChild.nutritionHistory.length - 1]?.muac} mm
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">{language === 'en' ? 'Nutrition Status' : language === 'hi' ? 'पोषण स्थिति' : 'ପୁଷ୍ଟି ସ୍ଥିତି'}</p>
                    <Badge className={
                      selectedChild.nutritionStatus === 'Normal' ? 'bg-emerald-100 text-emerald-800' :
                      selectedChild.nutritionStatus === 'MAM' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {selectedChild.nutritionStatus}
                    </Badge>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'en' ? 'Date' : language === 'hi' ? 'तारीख' : 'ତାରିଖ'}</TableHead>
                      <TableHead>{language === 'en' ? 'Weight (kg)' : language === 'hi' ? 'वजन (किग्रा)' : 'ଓଜନ (କିଗ୍ରା)'}</TableHead>
                      <TableHead>{language === 'en' ? 'Height (cm)' : language === 'hi' ? 'ऊंचाई (सेमी)' : 'ଉଚ୍ଚତା (ସେମି)'}</TableHead>
                      <TableHead>MUAC (mm)</TableHead>
                      <TableHead>{language === 'en' ? 'Status' : language === 'hi' ? 'स्थिति' : 'ସ୍ଥିତି'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...selectedChild.nutritionHistory].reverse().slice(0, 10).map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.weight}</TableCell>
                        <TableCell>{record.height}</TableCell>
                        <TableCell>{record.muac}</TableCell>
                        <TableCell>
                          <Badge className={
                            record.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' :
                            record.status === 'MAM' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  // Main list view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          {t('dashboard.children', language)}
        </h2>
        <p className="text-slate-500">
          {language === 'en' ? 'Individual learning profiles with progress tracking and risk assessment' : 
           language === 'hi' ? 'प्रगति ट्रैकिंग और जोखिम आकलन के साथ व्यक्तिगत सीखने वाले प्रोफाइल' : 
           'ଅଗ୍ରଗତି ଟ୍ରାକିଂ ଏବଂ ବିପଦ ମୂଲ୍ୟାଙ୍କନ ସହିତ ବ୍ୟକ୍ତିଗତ ଶିଖିବା ପ୍ରୋଫାଇଲ୍'}
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockChildren.filter(c => c.riskFlags.combinedRisk === 'Low').length}
                </p>
                <p className="text-sm text-slate-500">
                  {language === 'en' ? 'Low Risk' : language === 'hi' ? 'कम जोखिम' : 'କମ୍ ବିପଦ'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Activity className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockChildren.filter(c => c.riskFlags.combinedRisk === 'Medium').length}
                </p>
                <p className="text-sm text-slate-500">
                  {language === 'en' ? 'Medium Risk' : language === 'hi' ? 'मध्यम जोखिम' : 'ମଧ୍ୟମ ବିପଦ'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockChildren.filter(c => c.riskFlags.combinedRisk === 'High').length}
                </p>
                <p className="text-sm text-slate-500">
                  {language === 'en' ? 'High Risk' : language === 'hi' ? 'उच्च जोखिम' : 'ଉଚ୍ଚ ବିପଦ'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="text-indigo-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockPredictions.length}
                </p>
                <p className="text-sm text-slate-500">
                  {language === 'en' ? 'Predictions' : language === 'hi' ? 'भविष्यवाणियाँ' : 'ଭବିଷ୍ୟବାଣୀ'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Children Table */}
      <Card className="border-indigo-100 shadow-sm">
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Registered Children' : language === 'hi' ? 'पंजीकृत बच्चे' : 'ପଞ୍ଜୀକୃତ ଶିଶୁ'}</CardTitle>
          <p className="text-sm text-slate-500">
            {language === 'en' ? 'Click on a child to view detailed profile' : 
             language === 'hi' ? 'विस्तृत प्रोफ़ाइल देखने के लिए बच्चे पर क्लिक करें' : 
             'ବିସ୍ତୃତ ପ୍ରୋଫାଇଲ୍ ଦେଖିବା ପାଇଁ ଶିଶୁ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ'}
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? 'Name' : language === 'hi' ? 'नाम' : 'ନାମ'}</TableHead>
                <TableHead>{language === 'en' ? 'Age' : language === 'hi' ? 'आयु' : 'ବୟସ'}</TableHead>
                <TableHead>{language === 'en' ? 'AWC' : language === 'hi' ? 'AWC' : 'AWC'}</TableHead>
                <TableHead>{language === 'en' ? 'Learning Score' : language === 'hi' ? 'सीखने का स्कोर' : 'ଶିଖିବା ସ୍କୋର'}</TableHead>
                <TableHead>{language === 'en' ? 'Nutrition' : language === 'hi' ? 'पोषण' : 'ପୁଷ୍ଟି'}</TableHead>
                <TableHead>{language === 'en' ? 'Risk Level' : language === 'hi' ? 'जोखिम स्तर' : 'ବିପଦ ସ୍ତର'}</TableHead>
                <TableHead>{language === 'en' ? 'Attendance' : language === 'hi' ? 'उपस्थिति' : 'ଉପସ୍ଥିତି'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockChildren.map((child) => (
                <TableRow 
                  key={child.id} 
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => setSelectedChild(child)}
                >
                  <TableCell className="font-medium text-slate-800">{child.name}</TableCell>
                  <TableCell>{Math.floor(child.ageMonths / 12)}y {child.ageMonths % 12}m</TableCell>
                  <TableCell className="text-slate-500">{child.awcId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            child.learningScore >= 75 ? 'bg-emerald-500' : 
                            child.learningScore >= 50 ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`} 
                          style={{ width: `${child.learningScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-6">{child.learningScore}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      child.nutritionStatus === 'Normal' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none shadow-none' :
                      child.nutritionStatus === 'MAM' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-none shadow-none' :
                      'bg-red-100 text-red-800 hover:bg-red-100 border-none shadow-none'
                    }>
                      {child.nutritionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRiskColor(child.riskFlags.combinedRisk)} border-none shadow-none`}>
                      {child.riskFlags.combinedRisk}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {child.attendanceRate >= 90 ? (
                        <CheckCircle className="text-emerald-500" size={16} />
                      ) : child.attendanceRate >= 70 ? (
                        <Activity className="text-amber-500" size={16} />
                      ) : (
                        <AlertTriangle className="text-red-500" size={16} />
                      )}
                      <span className="text-sm">{child.attendanceRate}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}