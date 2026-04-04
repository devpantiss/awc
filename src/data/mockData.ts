import type { AWC, Block, Child, GP, Insight, LearningAssessment, LearningPathway, NutritionLearningPrediction, ProgressDataPoint, SyncQueueItem, DashboardIndicator } from '../types';

export const mockBlocks: Block[] = [
  { id: 'b1', name: 'Alpha Block', districtId: 'd1', gpCount: 15 },
  { id: 'b2', name: 'Beta Block', districtId: 'd1', gpCount: 12 },
  { id: 'b3', name: 'Gamma Block', districtId: 'd1', gpCount: 18 },
];

export const mockGPs: GP[] = [
  { id: 'gp1', name: 'Village One', blockId: 'b1', awcCount: 5 },
  { id: 'gp2', name: 'Village Two', blockId: 'b1', awcCount: 8 },
  { id: 'gp3', name: 'Village Three', blockId: 'b2', awcCount: 6 },
];

export const mockAWCs: AWC[] = [
  {
    id: 'awc1',
    name: 'AWC Alpha-1',
    workerName: 'Sita Devi',
    workerPhone: '9876543210',
    deviceStatus: 'Online',
    gpId: 'gp1',
    totalChildren: 45,
    presentToday: 40,
    criticalCases: 2,
    infrastructureScore: 85,
    syncStatus: 'synced',
    lastSyncTime: new Date(Date.now() - 300000).toISOString(),
    pendingSyncCount: 0,
    avgLearningScores: { language: 78, numeracy: 72, cognitive: 80, socio_emotional: 85 },
    riskDistribution: { low: 38, medium: 5, high: 2 },
    nutritionLearningCorrelation: 0.72
  },
  {
    id: 'awc2',
    name: 'AWC Alpha-2',
    workerName: 'Geeta Kumari',
    workerPhone: '9876543211',
    deviceStatus: 'Offline',
    gpId: 'gp1',
    totalChildren: 30,
    presentToday: 15,
    criticalCases: 5,
    infrastructureScore: 40,
    syncStatus: 'pending',
    lastSyncTime: new Date(Date.now() - 86400000 * 3).toISOString(),
    pendingSyncCount: 45,
    avgLearningScores: { language: 52, numeracy: 48, cognitive: 55, socio_emotional: 60 },
    riskDistribution: { low: 18, medium: 7, high: 5 },
    nutritionLearningCorrelation: 0.45
  },
  {
    id: 'awc3',
    name: 'AWC Alpha-3',
    workerName: 'Radha Sharma',
    workerPhone: '9876543212',
    deviceStatus: 'Online',
    gpId: 'gp2',
    totalChildren: 50,
    presentToday: 48,
    criticalCases: 0,
    infrastructureScore: 92,
    syncStatus: 'synced',
    lastSyncTime: new Date(Date.now() - 60000).toISOString(),
    pendingSyncCount: 0,
    avgLearningScores: { language: 88, numeracy: 85, cognitive: 90, socio_emotional: 92 },
    riskDistribution: { low: 48, medium: 2, high: 0 },
    nutritionLearningCorrelation: 0.85
  },
  {
    id: 'awc4',
    name: 'AWC Beta-1',
    workerName: 'Priya Singh',
    workerPhone: '9876543213',
    deviceStatus: 'Online',
    gpId: 'gp3',
    totalChildren: 35,
    presentToday: 30,
    criticalCases: 1,
    infrastructureScore: 78,
    syncStatus: 'syncing',
    lastSyncTime: new Date(Date.now() - 1800000).toISOString(),
    pendingSyncCount: 12,
    avgLearningScores: { language: 70, numeracy: 65, cognitive: 72, socio_emotional: 75 },
    riskDistribution: { low: 28, medium: 6, high: 1 },
    nutritionLearningCorrelation: 0.68
  },
];

// Generate progress history helper
function generateProgressHistory(baseScore: number, days: number = 30): ProgressDataPoint[] {
  const history: ProgressDataPoint[] = [];
  const domains: Array<'language' | 'numeracy' | 'cognitive' | 'socio_emotional'> = 
    ['language', 'numeracy', 'cognitive', 'socio_emotional'];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    domains.forEach(domain => {
      const variation = Math.random() * 10 - 5;
      const trend = (days - i) * 0.2; // slight upward trend
      const score = Math.min(100, Math.max(0, baseScore + variation + trend));
      history.push({
        date,
        domain,
        score: Math.round(score),
        difficultyLevel: score > 80 ? 4 : score > 60 ? 3 : score > 40 ? 2 : 1,
        percentile: Math.round(Math.random() * 40 + 50)
      });
    });
  }
  return history;
}

// Generate nutrition history helper
function generateNutritionHistory(currentStatus: string, days: number = 90) {
  const history: { date: string; weight: number; height: number; muac: number; status: 'Normal' | 'MAM' | 'SAM' }[] = [];
  let weight = currentStatus === 'SAM' ? 10 : currentStatus === 'MAM' ? 12 : 14;
  let muac = currentStatus === 'SAM' ? 105 : currentStatus === 'MAM' ? 115 : 130;
  
  for (let i = days; i >= 0; i -= 15) {
    const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    // Simulate gradual change
    if (currentStatus === 'SAM') {
      weight += Math.random() * 0.5;
      muac += Math.random() * 2;
    } else if (currentStatus === 'MAM') {
      weight += Math.random() * 0.3;
      muac += Math.random() * 1;
    }
    
    let status: 'Normal' | 'MAM' | 'SAM' = 'Normal';
    if (muac < 110) status = 'SAM';
    else if (muac < 125) status = 'MAM';
    
    history.push({
      date,
      weight: Math.round(weight * 10) / 10,
      height: 90 + (days - i) * 0.1,
      muac: Math.round(muac),
      status
    });
  }
  return history.reverse();
}

export const mockChildren: Child[] = [
  {
    id: 'c1',
    name: 'Aarav',
    ageMonths: 36,
    gender: 'M',
    nutritionStatus: 'Normal',
    learningScore: 85,
    awcId: 'awc1',
    domainScores: { language: 88, numeracy: 82, cognitive: 85, socio_emotional: 85 },
    currentDifficulty: { language: 4, numeracy: 3, cognitive: 4, socio_emotional: 4 },
    progressHistory: generateProgressHistory(85),
    attendanceRate: 92,
    lastAttendanceDate: new Date().toISOString().split('T')[0],
    nutritionHistory: generateNutritionHistory('Normal'),
    riskFlags: { learningRisk: 'Low', nutritionRisk: 'Low', combinedRisk: 'Low', flags: [] }
  },
  {
    id: 'c2',
    name: 'Diya',
    ageMonths: 24,
    gender: 'F',
    nutritionStatus: 'Normal',
    learningScore: 70,
    awcId: 'awc1',
    domainScores: { language: 75, numeracy: 65, cognitive: 70, socio_emotional: 70 },
    currentDifficulty: { language: 3, numeracy: 2, cognitive: 3, socio_emotional: 3 },
    progressHistory: generateProgressHistory(70),
    attendanceRate: 85,
    lastAttendanceDate: new Date().toISOString().split('T')[0],
    nutritionHistory: generateNutritionHistory('Normal'),
    riskFlags: { learningRisk: 'Low', nutritionRisk: 'Low', combinedRisk: 'Low', flags: [] }
  },
  {
    id: 'c3',
    name: 'Rohan',
    ageMonths: 48,
    gender: 'M',
    nutritionStatus: 'SAM',
    learningScore: 45,
    awcId: 'awc2',
    domainScores: { language: 42, numeracy: 40, cognitive: 48, socio_emotional: 50 },
    currentDifficulty: { language: 1, numeracy: 1, cognitive: 2, socio_emotional: 2 },
    progressHistory: generateProgressHistory(45),
    attendanceRate: 65,
    lastAttendanceDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    nutritionHistory: generateNutritionHistory('SAM'),
    riskFlags: { 
      learningRisk: 'High', 
      nutritionRisk: 'High', 
      combinedRisk: 'High', 
      flags: ['Declining nutrition', 'Low attendance', 'Below age-level learning'] 
    }
  },
  {
    id: 'c4',
    name: 'Meera',
    ageMonths: 18,
    gender: 'F',
    nutritionStatus: 'MAM',
    learningScore: 50,
    awcId: 'awc2',
    domainScores: { language: 55, numeracy: 45, cognitive: 50, socio_emotional: 50 },
    currentDifficulty: { language: 2, numeracy: 1, cognitive: 2, socio_emotional: 2 },
    progressHistory: generateProgressHistory(50),
    attendanceRate: 78,
    lastAttendanceDate: new Date().toISOString().split('T')[0],
    nutritionHistory: generateNutritionHistory('MAM'),
    riskFlags: { 
      learningRisk: 'Medium', 
      nutritionRisk: 'High', 
      combinedRisk: 'High', 
      flags: ['At risk of SAM', 'Needs nutrition support'] 
    }
  },
  {
    id: 'c5',
    name: 'Kabir',
    ageMonths: 60,
    gender: 'M',
    nutritionStatus: 'Normal',
    learningScore: 95,
    awcId: 'awc3',
    domainScores: { language: 95, numeracy: 92, cognitive: 96, socio_emotional: 97 },
    currentDifficulty: { language: 5, numeracy: 5, cognitive: 5, socio_emotional: 5 },
    progressHistory: generateProgressHistory(95),
    attendanceRate: 98,
    lastAttendanceDate: new Date().toISOString().split('T')[0],
    nutritionHistory: generateNutritionHistory('Normal'),
    riskFlags: { learningRisk: 'Low', nutritionRisk: 'Low', combinedRisk: 'Low', flags: [] }
  },
  {
    id: 'c6',
    name: 'Priya',
    ageMonths: 42,
    gender: 'F',
    nutritionStatus: 'Normal',
    learningScore: 62,
    awcId: 'awc4',
    domainScores: { language: 68, numeracy: 58, cognitive: 60, socio_emotional: 62 },
    currentDifficulty: { language: 3, numeracy: 2, cognitive: 2, socio_emotional: 3 },
    progressHistory: generateProgressHistory(62),
    attendanceRate: 88,
    lastAttendanceDate: new Date().toISOString().split('T')[0],
    nutritionHistory: generateNutritionHistory('Normal'),
    riskFlags: { learningRisk: 'Medium', nutritionRisk: 'Low', combinedRisk: 'Low', flags: ['Needs numeracy support'] }
  },
];

// Nutrition-Learning Predictions
export const mockPredictions: NutritionLearningPrediction[] = [
  {
    childId: 'c4',
    currentNutritionStatus: 'MAM',
    predictedNutritionStatus: 'SAM',
    predictionConfidence: 78,
    daysToPrediction: 28,
    riskFactors: ['Declining MUAC', 'Irregular attendance', 'Low learning engagement'],
    learningImpact: {
      currentScore: 50,
      predictedScore: 38,
      affectedDomains: ['cognitive', 'language']
    },
    recommendedInterventions: ['nutrition_counseling', 'home_visit', 'learning_support']
  },
  {
    childId: 'c3',
    currentNutritionStatus: 'SAM',
    predictedNutritionStatus: 'SAM',
    predictionConfidence: 92,
    daysToPrediction: 30,
    riskFactors: ['Persistent SAM', 'Very low attendance', 'Poor learning outcomes'],
    learningImpact: {
      currentScore: 45,
      predictedScore: 35,
      affectedDomains: ['language', 'numeracy', 'cognitive']
    },
    recommendedInterventions: ['health_referral', 'nutrition_counseling', 'parent_meeting', 'home_visit']
  },
];

// Learning Assessments (recent sessions)
export const mockAssessments: LearningAssessment[] = [
  {
    id: 'a1',
    childId: 'c1',
    domain: 'language',
    score: 90,
    difficultyLevel: 4,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    duration: 420,
    correctAnswers: 9,
    totalQuestions: 10
  },
  {
    id: 'a2',
    childId: 'c3',
    domain: 'numeracy',
    score: 40,
    difficultyLevel: 1,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    duration: 600,
    correctAnswers: 4,
    totalQuestions: 10
  },
  {
    id: 'a3',
    childId: 'c5',
    domain: 'cognitive',
    score: 96,
    difficultyLevel: 5,
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    duration: 300,
    correctAnswers: 10,
    totalQuestions: 10
  },
];

// Learning Pathways
export const mockPathways: LearningPathway[] = mockChildren.map(child => ({
  childId: child.id,
  domain: 'language',
  currentDifficulty: child.currentDifficulty.language,
  recommendedNext: child.learningScore > 80 ? Math.min(5, child.currentDifficulty.language + 1) as any : 
                   child.learningScore < 50 ? Math.max(1, child.currentDifficulty.language - 1) as any : 
                   child.currentDifficulty.language,
  masteryLevel: child.domainScores.language,
  sessionsCompleted: Math.floor(Math.random() * 50) + 10,
  lastAssessmentDate: new Date(Date.now() - Math.random() * 86400000).toISOString().split('T')[0]
}));

// Sync Queue (for offline-first)
export const mockSyncQueue: SyncQueueItem[] = [
  {
    id: 'sq1',
    type: 'assessment',
    data: { childId: 'c3', domain: 'language', score: 45 },
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: 'pending',
    retryCount: 0
  },
  {
    id: 'sq2',
    type: 'attendance',
    data: { awcId: 'awc2', presentCount: 15, totalChildren: 30 },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'pending',
    retryCount: 1
  },
];

// Dashboard Indicators
export const mockIndicators: DashboardIndicator[] = [
  {
    id: 'ind1',
    name: 'Average Attendance Rate',
    nameOd: 'ଗଡ଼ିଆ ଉପସ୍ଥିତି ହାର',
    value: 82,
    unit: '%',
    status: 'green',
    trend: 'up',
    changePercent: 5.2,
    target: 85
  },
  {
    id: 'ind2',
    name: 'Learning Proficiency',
    nameOd: 'ଶିଖିବା ଦକ୍ଷତା',
    value: 72,
    unit: '%',
    status: 'yellow',
    trend: 'stable',
    changePercent: 1.1,
    target: 80
  },
  {
    id: 'ind3',
    name: 'Nutrition Status Normal',
    nameOd: 'ସାଧାରଣ ପୁଷ୍ଟି ସ୍ଥିତି',
    value: 88,
    unit: '%',
    status: 'green',
    trend: 'up',
    changePercent: 3.5,
    target: 90
  },
  {
    id: 'ind4',
    name: 'Children at Combined Risk',
    nameOd: 'ସମ୍ମିଳିତ ବିପଦରେ ଥିବା ଶିଶୁ',
    value: 7,
    unit: 'children',
    status: 'red',
    trend: 'down',
    changePercent: -12.5,
    target: 3
  },
];

export const mockInsights: Insight[] = [
  {
    id: 'i1',
    type: 'Risk',
    level: 'High',
    category: 'combined',
    messageEn: 'AWC Alpha-2 device offline for 3 days. High number of SAM cases detected. 5 children at combined learning-nutrition risk.',
    messageHi: 'AWC Alpha-2 डिवाइस 3 दिनों से ऑफ़लाइन है। अधिक SAM मामले मिले हैं। 5 बच्चे संयुक्त जोखिम में।',
    messageOd: 'AWC Alpha-2 ଡିଭାଇସ୍ 3 ଦିନ ଧରି ଅଫଲାଇନ୍ ଅଛି। ଅଧିକ SAM ମାମଲା ଚିହ୍ନଟ ହୋଇଛି। 5 ଜଣ ଶିଶୁ ସମ୍ମିଳିତ ବିପଦରେ ଅଛନ୍ତି।',
    targetId: 'awc2',
    targetName: 'AWC Alpha-2',
    suggestedInterventions: ['health_referral', 'home_visit', 'sync_now'],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'active'
  },
  {
    id: 'i2',
    type: 'Recommendation',
    level: 'Medium',
    category: 'learning',
    messageEn: 'Ensure local CDPO visit to AWC Alpha-2 to verify attendance records and learning progress.',
    messageHi: 'उपस्थिति की जाँच के लिए CDPO का दौरा सुनिश्चित करें।',
    messageOd: 'ଉପସ୍ଥିତି ଯାଞ୍ଚ ପାଇଁ CDPO ଙ୍କ ଦୌରା ନିଶ୍ଚିତ କରନ୍ତୁ।',
    targetId: 'awc2',
    targetName: 'AWC Alpha-2',
    suggestedInterventions: ['parent_meeting', 'learning_support'],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'active'
  },
  {
    id: 'i3',
    type: 'Alert',
    level: 'High',
    category: 'nutrition',
    messageEn: 'Child Rohan has fallen into SAM category this month. Immediate nutritional intervention required. Predicted learning decline of 22% if not addressed.',
    messageHi: 'रोहन इस महीने SAM श्रेणी में आ गया है। तत्काल पोषण सहायता की आवश्यकता है।',
    messageOd: 'ରୋହନ ଏହି ମାସରେ SAM ଶ୍ରେଣୀକୁ ଆସିଯାଇଛନ୍ତି। ତତ୍କ୍ଷଣାତ୍ ପୁଷ୍ଟି ହସ୍ତକ୍ଷେପ ଆବଶ୍ୟକ।',
    targetId: 'c3',
    targetName: 'Rohan',
    suggestedInterventions: ['health_referral', 'nutrition_counseling', 'home_visit'],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'active'
  },
  {
    id: 'i4',
    type: 'Suggestion',
    level: 'Low',
    category: 'learning',
    messageEn: 'Child Meera (MAM) showing improvement in language domain. Consider increasing difficulty level from 2 to 3.',
    messageHi: 'मीरा (MAM) भाषा क्षेत्र में सुधार दिखा रही है। कठिनाई स्तर 2 से 3 बढ़ाने पर विचार करें।',
    messageOd: 'ମୀରା (MAM) ଭାଷା କ୍ଷେତ୍ରରେ ଉନ୍ନତି ଦେଖାଉଛନ୍ତି। କଠିନତା ସ୍ତର 2 ରୁ 3 କୁ ବୃଦ୍ଧି କରିବାକୁ ବିଚାର କରନ୍ତୁ।',
    targetId: 'c4',
    targetName: 'Meera',
    suggestedInterventions: ['learning_support'],
    createdAt: new Date(Date.now() - 900000).toISOString(),
    status: 'active'
  },
  {
    id: 'i5',
    type: 'Recommendation',
    level: 'Medium',
    category: 'attendance',
    messageEn: 'AWC Alpha-2 attendance dropped to 50%. Correlation with monsoon season. Consider community awareness program.',
    messageHi: 'AWC Alpha-2 उपस्थिति 50% तक गिर गई। मानसून season के साथ संबंध।',
    messageOd: 'AWC Alpha-2 ରେ ଉପସ୍ଥିତି 50% କୁ ଖସିଆସିଛି। ବର୍ଷା ଋତୁ ସହିତ ସମ୍ପର୍କ।',
    targetId: 'awc2',
    targetName: 'AWC Alpha-2',
    suggestedInterventions: ['parent_meeting', 'home_visit'],
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    status: 'active'
  },
];

// Helper functions for adaptive learning
export function calculateNextDifficulty(currentDifficulty: number, score: number): number {
  if (score >= 85 && currentDifficulty < 5) {
    return Math.min(5, currentDifficulty + 1);
  } else if (score <= 50 && currentDifficulty > 1) {
    return Math.max(1, currentDifficulty - 1);
  }
  return currentDifficulty;
}

export function getRiskColor(riskLevel: 'Low' | 'Medium' | 'High'): string {
  switch (riskLevel) {
    case 'High': return 'text-red-600 bg-red-50';
    case 'Medium': return 'text-amber-600 bg-amber-50';
    case 'Low': return 'text-emerald-600 bg-emerald-50';
    default: return 'text-slate-600 bg-slate-50';
  }
}

export function getStatusColor(status: 'green' | 'yellow' | 'red'): string {
  switch (status) {
    case 'green': return 'bg-emerald-500';
    case 'yellow': return 'bg-amber-500';
    case 'red': return 'bg-red-500';
    default: return 'bg-slate-500';
  }
}