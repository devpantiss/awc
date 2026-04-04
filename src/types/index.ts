// Language support including Odia
export type Language = 'en' | 'hi' | 'od';
export type Role = 'executive' | 'block_officer' | 'cdpo' | 'aww';

// Learning domains
export type LearningDomain = 'language' | 'numeracy' | 'cognitive' | 'socio_emotional';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5; // 1=easiest, 5=hardest

// Nutrition status with prediction
export type NutritionStatus = 'Normal' | 'MAM' | 'SAM';
export type RiskLevel = 'Low' | 'Medium' | 'High';

// Sync status for offline-first
export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'error';

// Learning assessment result
export interface LearningAssessment {
  id: string;
  childId: string;
  domain: LearningDomain;
  score: number; // 0-100
  difficultyLevel: DifficultyLevel;
  timestamp: string;
  duration: number; // seconds spent
  correctAnswers: number;
  totalQuestions: number;
}

// Learning pathway for a child
export interface LearningPathway {
  childId: string;
  domain: LearningDomain;
  currentDifficulty: DifficultyLevel;
  recommendedNext: DifficultyLevel;
  masteryLevel: number; // 0-100
  sessionsCompleted: number;
  lastAssessmentDate: string;
}

// Progress tracking data point
export interface ProgressDataPoint {
  date: string;
  domain: LearningDomain;
  score: number;
  difficultyLevel: DifficultyLevel;
  percentile?: number; // compared to age group
}

// Nutrition-Learning prediction
export interface NutritionLearningPrediction {
  childId: string;
  currentNutritionStatus: NutritionStatus;
  predictedNutritionStatus: NutritionStatus;
  predictionConfidence: number; // 0-100
  daysToPrediction: number; // e.g., 30 days
  riskFactors: string[];
  learningImpact: {
    currentScore: number;
    predictedScore: number;
    affectedDomains: LearningDomain[];
  };
  recommendedInterventions: string[];
}

// Child profile with comprehensive data
export interface Child {
  id: string;
  name: string;
  ageMonths: number;
  gender: 'M' | 'F';
  nutritionStatus: NutritionStatus;
  learningScore: number;
  awcId: string;
  // New fields for enhanced profiling
  domainScores: {
    language: number;
    numeracy: number;
    cognitive: number;
    socio_emotional: number;
  };
  currentDifficulty: {
    language: DifficultyLevel;
    numeracy: DifficultyLevel;
    cognitive: DifficultyLevel;
    socio_emotional: DifficultyLevel;
  };
  // Progress history (last 30 data points)
  progressHistory: ProgressDataPoint[];
  // Attendance data
  attendanceRate: number; // 0-100
  lastAttendanceDate: string;
  // Nutrition history
  nutritionHistory: {
    date: string;
    weight: number; // kg
    height: number; // cm
    muac: number; // mm
    status: NutritionStatus;
  }[];
  // Risk flags
  riskFlags: {
    learningRisk: RiskLevel;
    nutritionRisk: RiskLevel;
    combinedRisk: RiskLevel;
    flags: string[];
  };
}

// AWC with enhanced data
export interface AWC {
  id: string;
  name: string;
  workerName: string;
  workerPhone: string;
  deviceStatus: 'Online' | 'Offline';
  gpId: string;
  totalChildren: number;
  presentToday: number;
  criticalCases: number;
  infrastructureScore: number; // 0-100
  // New fields
  syncStatus: SyncStatus;
  lastSyncTime: string | null;
  pendingSyncCount: number;
  // Aggregated learning data
  avgLearningScores: {
    language: number;
    numeracy: number;
    cognitive: number;
    socio_emotional: number;
  };
  // Risk distribution
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  // Nutrition-Learning correlation
  nutritionLearningCorrelation: number; // -1 to 1
}

export interface GP {
  id: string;
  name: string;
  blockId: string;
  awcCount: number;
}

export interface Block {
  id: string;
  name: string;
  districtId: string;
  gpCount: number;
}

// Enhanced Insight with intervention suggestions
export interface Insight {
  id: string;
  type: 'Risk' | 'Suggestion' | 'Alert' | 'Recommendation';
  level: 'High' | 'Medium' | 'Low';
  category: 'learning' | 'nutrition' | 'attendance' | 'infrastructure' | 'combined';
  messageEn: string;
  messageHi: string;
  messageOd: string;
  targetId: string;
  targetName: string;
  // Intervention suggestions
  suggestedInterventions: string[];
  // Timestamps
  createdAt: string;
  expiresAt?: string;
  // Status
  status: 'active' | 'resolved' | 'escalated';
}

// Adaptive learning session
export interface LearningSession {
  id: string;
  childId: string;
  domain: LearningDomain;
  startTime: string;
  endTime: string;
  questions: {
    id: string;
    difficulty: DifficultyLevel;
    correct: boolean;
    timeSpent: number;
  }[];
  adjustedDifficulty: DifficultyLevel;
  score: number;
}

// Offline sync queue item
export interface SyncQueueItem {
  id: string;
  type: 'assessment' | 'attendance' | 'nutrition' | 'profile_update';
  data: unknown;
  timestamp: string;
  status: SyncStatus;
  retryCount: number;
}

// Dashboard indicator
export interface DashboardIndicator {
  id: string;
  name: string;
  nameOd: string;
  value: number;
  unit: string;
  status: 'green' | 'yellow' | 'red';
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  target: number;
}

// Localization strings type
export interface LocalizationStrings {
  [key: string]: {
    en: string;
    hi: string;
    od: string;
  };
}