import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { mockInsights, mockPredictions, mockChildren, mockAWCs } from '@/data/mockData';
import { t } from '@/data/localization';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, BrainCircuit, CheckSquare, Clock, AlertTriangle, 
  TrendingUp, Heart, BookOpen, Users, Activity, ChevronRight,
  Building
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function AIInsights() {
  const { language } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAWC, setSelectedAWC] = useState<string>('all');
  
  // Get children for selected AWC
  const childrenInSelectedAWC = useMemo(() => {
    if (selectedAWC === 'all') return mockChildren;
    return mockChildren.filter((child: any) => child.awcId === selectedAWC);
  }, [selectedAWC]);

  // Get child IDs for selected AWC
  const childIdsInAWC = useMemo(() => new Set(childrenInSelectedAWC.map((c: any) => c.id)), [childrenInSelectedAWC]);

  // Filter insights based on category and AWC
  const filteredInsights = useMemo(() => {
    return mockInsights.filter((insight: any) => {
      // Filter by category
      if (selectedCategory !== 'all' && insight.category !== selectedCategory) return false;
      
      // Filter by AWC - show insights for this AWC or for children in this AWC
      if (selectedAWC !== 'all') {
        // Check if insight target is the AWC itself
        if (insight.targetId === selectedAWC) return true;
        // Check if insight target is a child in this AWC
        if (childIdsInAWC.has(insight.targetId)) return true;
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedAWC, childIdsInAWC]);

  // Filter predictions for selected AWC
  const filteredPredictions = useMemo(() => {
    if (selectedAWC === 'all') return mockPredictions;
    return mockPredictions.filter((prediction: any) => childIdsInAWC.has(prediction.childId));
  }, [selectedAWC, childIdsInAWC]);
  
  // Get risk color classes
  const getRiskColorClasses = (level: 'High' | 'Medium' | 'Low') => {
    switch (level) {
      case 'High': return {
        border: 'border-l-red-500', bg: 'bg-red-50/30',
        badge: 'bg-red-100 text-red-800 border-red-200', icon: 'text-red-500', iconBg: 'bg-red-100'
      };
      case 'Medium': return {
        border: 'border-l-amber-500', bg: 'bg-amber-50/30',
        badge: 'bg-amber-100 text-amber-800 border-amber-200', icon: 'text-amber-500', iconBg: 'bg-amber-100'
      };
      case 'Low': return {
        border: 'border-l-blue-500', bg: 'bg-blue-50/30',
        badge: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'text-blue-500', iconBg: 'bg-blue-100'
      };
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return <Heart size={14} />;
      case 'learning': return <BookOpen size={14} />;
      case 'attendance': return <Users size={14} />;
      case 'infrastructure': return <Activity size={14} />;
      case 'combined': return <AlertTriangle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };
  
  // Get category label
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, Record<string, string>> = {
      combined: { en: 'Combined', hi: 'संयुक्त', od: 'ସମ୍ମିଳିତ' },
      nutrition: { en: 'Nutrition', hi: 'पोषण', od: 'ପୁଷ୍ଟି' },
      learning: { en: 'Learning', hi: 'सीखना', od: 'ଶିଖିବା' },
      attendance: { en: 'Attendance', hi: 'उपस्थिति', od: 'ଉପସ୍ଥିତି' },
    };
    return labels[category]?.[language] || category;
  };
  
  // Get intervention label
  const getInterventionLabel = (intervention: string) => {
    const labels: Record<string, Record<string, string>> = {
      nutrition_counseling: { en: 'Nutrition Counseling', hi: 'पोषण परामर्श', od: 'ପୁଷ୍ଟି ପରାମର୍ଶ' },
      health_referral: { en: 'Health Referral', hi: 'स्वास्थ्य रेफरल', od: 'ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ' },
      learning_support: { en: 'Learning Support', hi: 'सीखने का समर्थन', od: 'ଶିଖିବା ସମର୍ଥନ' },
      parent_meeting: { en: 'Parent Meeting', hi: 'अभिभावक बैठक', od: 'ଅଭିଭାବକ ବୈଠକ' },
      home_visit: { en: 'Home Visit', hi: 'गृह भ्रमण', od: 'ଘର ପରିଦର୍ଶନ' },
      sync_now: { en: 'Sync Device', hi: 'डिवाइस सिंक करें', od: 'ଡିଭାଇସ୍ ସିଙ୍କ କରନ୍ତୁ' },
    };
    return labels[intervention]?.[language] || intervention.replace(/_/g, ' ');
  };
  
  // Predictions summary
  const predictionsCount = filteredPredictions.length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-700">
          <BrainCircuit size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            {t('dashboard.insights', language)}
          </h2>
          <p className="text-slate-500">
            {language === 'en' ? 'AI-powered risk alerts, predictions, and actionable recommendations' : 
             language === 'hi' ? 'एआई-संचालित जोखिम अलर्ट, भविष्यवाणियां और कार्रवाई योग्य सिफारिशें' : 
             'ଏଆଇ-ଚାଳିତ ବିପଦ ଅଲର୍ଟ, ଭବିଷ୍ୟବାଣୀ ଏବଂ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ଯୋଗ୍ୟ ସୁପାରିଶ'}
          </p>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{language === 'en' ? 'High Risk' : language === 'hi' ? 'उच्च जोखिम' : 'ଉଚ୍ଚ ବିପଦ'}</p>
                <p className="text-2xl font-bold text-red-600">{filteredInsights.filter((i: any) => i.level === 'High').length}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="text-red-600" size={20} /></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{language === 'en' ? 'Medium Risk' : language === 'hi' ? 'मध्यम जोखिम' : 'ମଧ୍ୟମ ବିପଦ'}</p>
                <p className="text-2xl font-bold text-amber-600">{filteredInsights.filter((i: any) => i.level === 'Medium').length}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg"><Activity className="text-amber-600" size={20} /></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{language === 'en' ? 'Predictions' : language === 'hi' ? 'भविष्यवाणियाँ' : 'ଭବିଷ୍ୟବାଣୀ'}</p>
                <p className="text-2xl font-bold text-indigo-600">{predictionsCount}</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg"><TrendingUp className="text-indigo-600" size={20} /></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{language === 'en' ? 'Resolved' : language === 'hi' ? 'हल किया गया' : 'ସମାଧାନ କରାଯାଇଛି'}</p>
                <p className="text-2xl font-bold text-emerald-600">3</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg"><CheckSquare className="text-emerald-600" size={20} /></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="all">{language === 'en' ? 'All' : language === 'hi' ? 'सभी' : 'ସମସ୍ତ'}</TabsTrigger>
            <TabsTrigger value="combined"><AlertTriangle size={14} className="mr-1" />{language === 'en' ? 'Combined' : language === 'hi' ? 'संयुक्त' : 'ସମ୍ମିଳିତ'}</TabsTrigger>
            <TabsTrigger value="nutrition"><Heart size={14} className="mr-1" />{language === 'en' ? 'Nutrition' : language === 'hi' ? 'पोषण' : 'ପୁଷ୍ଟି'}</TabsTrigger>
            <TabsTrigger value="learning"><BookOpen size={14} className="mr-1" />{language === 'en' ? 'Learning' : language === 'hi' ? 'सीखना' : 'ଶିଖିବା'}</TabsTrigger>
            <TabsTrigger value="attendance"><Users size={14} className="mr-1" />{language === 'en' ? 'Attendance' : language === 'hi' ? 'उपस्थिति' : 'ଉପସ୍ଥିତି'}</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* AWC Filter */}
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
              {mockAWCs.map((awc: any) => (
                <SelectItem key={awc.id} value={awc.id}>
                  {awc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Insights Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredInsights.map((insight: any) => {
          const colors = getRiskColorClasses(insight.level);
          const prediction = mockPredictions.find((p: any) => p.childId === insight.targetId);
          
          return (
            <Card key={insight.id} className={`${colors.border} ${colors.bg} shadow-sm hover:shadow-md transition-shadow`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge className={`${colors.badge} text-xs`}>
                    {getCategoryIcon(insight.category)}
                    <span className="ml-1">{getCategoryLabel(insight.category)}</span>
                  </Badge>
                  <div className="text-xs text-slate-400 flex items-center">
                    <Clock size={12} className="mr-1" />Today
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{insight.type}</CardTitle>
                <CardDescription className="text-slate-600 font-medium">{insight.targetName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {language === 'en' ? insight.messageEn : language === 'hi' ? insight.messageHi : insight.messageOd || insight.messageEn}
                </p>
                
                {/* Prediction info if available */}
                {prediction && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
                      <TrendingUp size={14} />
                      {language === 'en' ? 'Prediction:' : language === 'hi' ? 'भविष्यवाणी:' : 'ଭବିଷ୍ୟବାଣୀ:'}
                      {' '}{prediction.currentNutritionStatus} → {prediction.predictedNutritionStatus}
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      {prediction.predictionConfidence}% confidence • {prediction.daysToPrediction} days
                    </p>
                  </div>
                )}
                
                {/* Suggested Interventions */}
                {insight.suggestedInterventions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2">
                      {language === 'en' ? 'Suggested Actions:' : language === 'hi' ? 'सुझाए गए कार्य:' : 'ସୁପାରିଶ କରାଯାଇଥିବା କାର୍ଯ୍ୟ:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {insight.suggestedInterventions.map((intervention: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs bg-white">
                          {getInterventionLabel(intervention)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                  <Button size="sm" variant={insight.level === 'High' ? 'destructive' : 'default'} className="flex-1">
                    {language === 'en' ? 'Take Action' : language === 'hi' ? 'कार्रवाई करें' : 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ନିଅନ୍ତୁ'}
                  </Button>
                  <Button size="sm" variant="outline" className="px-2">
                    <CheckSquare size={14} />
                  </Button>
                  <Button size="sm" variant="outline" className="px-2">
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {/* Placeholder */}
        {filteredInsights.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3 border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center text-slate-500 shadow-none">
            <CheckSquare size={48} className="mb-4 text-emerald-400" />
            <p className="font-medium text-slate-600 text-lg">{language === 'en' ? 'All caught up!' : language === 'hi' ? 'सब कुछ ठीक है!' : 'ସମସ୍ତ କିଛି ଠିକ୍ ଅଛି!'}</p>
            <p className="text-sm mt-1">{language === 'en' ? 'No insights requiring attention.' : language === 'hi' ? 'कोई अंतर्दृष्टि ध्यान देने की आवश्यकता नहीं।' : 'କୌଣସି ଅନ୍ତର୍ଦୃଷ୍ଟି ଧ୍ୟାନ ଦେବାର ଆବଶ୍ୟକତା ନାହିଁ।'}</p>
          </Card>
        )}
      </div>
      
        {/* Predictions Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              {language === 'en' ? 'Nutrition-Learning Predictions (30-day)' : 
               language === 'hi' ? 'पोषण-सीखने की भविष्यवाणियाँ (30-दिन)' : 
               'ପୁଷ୍ଟି-ଶିଖିବା ଭବିଷ୍ୟବାଣୀ (୩୦-ଦିନ)'}
            </h3>
            {selectedAWC !== 'all' && (
              <Badge variant="outline" className="text-xs">
                {mockAWCs.find((a: any) => a.id === selectedAWC)?.name}
              </Badge>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPredictions.map((prediction: any) => {
            const child = mockChildren.find((c: any) => c.id === prediction.childId);
            if (!child) return null;
            
            return (
              <Card key={prediction.childId} className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-lg">{child.name}</p>
                        <Badge className="bg-red-100 text-red-800">{prediction.predictionConfidence}% confidence</Badge>
                      </div>
                      <p className="text-sm text-slate-500">{Math.floor(child.ageMonths / 12)} years • {child.awcId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">{language === 'en' ? 'Days to prediction:' : language === 'hi' ? 'भविष्यवाणी के दिन:' : 'ଭବିଷ୍ୟବାଣୀ ଦିନ:'}</p>
                      <p className="text-xl font-bold text-red-600">{prediction.daysToPrediction}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">{language === 'en' ? 'Current Status' : language === 'hi' ? 'वर्तमान स्थिति' : 'ବର୍ତ୍ତମାନ ସ୍ଥିତି'}</p>
                      <Badge className={
                        prediction.currentNutritionStatus === 'Normal' ? 'bg-emerald-100 text-emerald-800' :
                        prediction.currentNutritionStatus === 'MAM' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }>{prediction.currentNutritionStatus}</Badge>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-500">{language === 'en' ? 'Predicted Status' : language === 'hi' ? 'अनुमानित स्थिति' : 'ଅନୁମାନିତ ସ୍ଥିତି'}</p>
                      <Badge className="bg-red-600 text-white">{prediction.predictedNutritionStatus}</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">{language === 'en' ? 'Risk Factors:' : language === 'hi' ? 'जोखिम कारक:' : 'ବିପଦ କାରକ:'}</p>
                    <div className="flex flex-wrap gap-1">
                      {prediction.riskFactors.map((factor: string, i: number) => (
                        <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">{factor}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="destructive" className="flex-1">
                      {language === 'en' ? 'Intervene Now' : language === 'hi' ? 'अब हस्तक्षेप करें' : 'ଏବେ ହସ୍ତକ୍ଷେପ କରନ୍ତୁ'}
                    </Button>
                    <Button size="sm" variant="outline">{language === 'en' ? 'View Profile' : language === 'hi' ? 'प्रोफ़ाइल देखें' : 'ପ୍ରୋଫାଇଲ୍ ଦେଖନ୍ତୁ'}</Button>
                  </div>
                </CardContent>
              </Card>
            );
            })}
            
            {filteredPredictions.length === 0 && (
              <Card className="md:col-span-2 border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center text-slate-500 shadow-none">
                <TrendingUp size={48} className="mb-4 text-slate-300" />
                <p className="font-medium text-slate-600 text-lg">
                  {language === 'en' ? 'No predictions for this center' : 
                   language === 'hi' ? 'इस केंद्र के लिए कोई भविष्यवाणी नहीं' : 
                   'ଏହି କେନ୍ଦ୍ର ପାଇଁ କୌଣସି ଭବିଷ୍ୟବାଣୀ ନାହିଁ'}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }
