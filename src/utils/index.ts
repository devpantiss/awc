import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LearningDomain, DifficultyLevel, NutritionStatus, RiskLevel } from '../types';

/**
 * A utility function to merge Tailwind CSS classes.
 * Combines clsx for conditional class names and tailwind-merge to resolve conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Adaptive Learning Engine Functions

/**
 * Calculate the next difficulty level based on performance
 * Uses a threshold-based approach with hysteresis to avoid oscillation
 */
export function calculateNextDifficulty(
  currentDifficulty: DifficultyLevel,
  score: number,
  accuracy: number,
  timeSpent: number,
  totalQuestions: number
): DifficultyLevel {
  // Calculate performance index (0-100)
  const performanceIndex = (score * 0.5) + (accuracy * 0.3) + (Math.min(100, (100 - timeSpent / totalQuestions)) * 0.2);
  
  // Increase difficulty if performing well (threshold: 80)
  if (performanceIndex >= 80 && currentDifficulty < 5) {
    return Math.min(5, currentDifficulty + 1) as DifficultyLevel;
  }
  
  // Decrease difficulty if struggling (threshold: 45)
  if (performanceIndex <= 45 && currentDifficulty > 1) {
    return Math.max(1, currentDifficulty - 1) as DifficultyLevel;
  }
  
  // Maintain current difficulty
  return currentDifficulty;
}

/**
 * Get recommended questions count based on difficulty level
 */
export function getRecommendedQuestionCount(difficulty: DifficultyLevel): number {
  const baseCount = 10;
  const adjustment = (difficulty - 3) * 2; // Fewer questions at higher difficulty
  return Math.max(5, Math.min(15, baseCount + adjustment));
}

/**
 * Calculate mastery level for a domain (0-100)
 */
export function calculateMasteryLevel(
  recentScores: number[],
  currentDifficulty: DifficultyLevel,
  _domain: LearningDomain
): number {
  if (recentScores.length === 0) return 0;
  
  // Weight recent performances more heavily
  const weightedScore = recentScores.reduce((sum, score, index) => {
    const weight = 0.5 + (index / recentScores.length) * 0.5;
    return sum + score * weight;
  }, 0) / recentScores.reduce((sum, _, index) => sum + 0.5 + (index / recentScores.length) * 0.5, 0);
  
  // Factor in difficulty level
  const difficultyMultiplier = 0.8 + (currentDifficulty / 5) * 0.4;
  
  return Math.min(100, Math.round(weightedScore * difficultyMultiplier));
}

/**
 * Determine if a child needs intervention in a domain
 */
export function needsIntervention(
  domainScore: number,
  _ageMonths: number,
  domain: LearningDomain
): boolean {
  // Age-appropriate thresholds
  const thresholds: Record<string, { min: number; max: number }> = {
    language: { min: 50, max: 100 },
    numeracy: { min: 45, max: 100 },
    cognitive: { min: 50, max: 100 },
    socio_emotional: { min: 55, max: 100 }
  };
  
  const threshold = thresholds[domain];
  return domainScore < threshold.min;
}

// Nutrition-Learning Correlation Functions

/**
 * Calculate correlation between nutrition status and learning outcomes
 */
export function calculateNutritionLearningCorrelation(
  nutritionStatus: NutritionStatus,
  learningScores: Record<LearningDomain, number>
): number {
  const nutritionWeight: Record<NutritionStatus, number> = {
    'Normal': 1.0,
    'MAM': 0.7,
    'SAM': 0.4
  };
  
  const avgLearningScore = Object.values(learningScores).reduce((a, b) => a + b, 0) / 4;
  const weight = nutritionWeight[nutritionStatus];
  
  // Correlation coefficient (simulated)
  return Math.round((avgLearningScore / 100) * weight * 100) / 100;
}

/**
 * Predict nutrition risk based on trends
 */
export function predictNutritionRisk(
  currentStatus: NutritionStatus,
  attendanceRate: number,
  learningTrend: 'improving' | 'declining' | 'stable',
  muacTrend: 'increasing' | 'decreasing' | 'stable'
): RiskLevel {
  let riskScore = 0;
  
  // Current status weight
  if (currentStatus === 'SAM') riskScore += 40;
  else if (currentStatus === 'MAM') riskScore += 25;
  
  // Attendance weight
  if (attendanceRate < 60) riskScore += 25;
  else if (attendanceRate < 80) riskScore += 15;
  
  // Learning trend weight
  if (learningTrend === 'declining') riskScore += 20;
  else if (learningTrend === 'stable') riskScore += 10;
  
  // MUAC trend weight
  if (muacTrend === 'decreasing') riskScore += 15;
  else if (muacTrend === 'stable') riskScore += 5;
  
  if (riskScore >= 60) return 'High';
  if (riskScore >= 35) return 'Medium';
  return 'Low';
}

/**
 * Calculate days to predicted nutrition status change
 */
export function calculateDaysToPrediction(
  currentMUAC: number,
  muacTrend: number, // mm per week
  samThreshold: number = 110,
  mamThreshold: number = 125
): number {
  if (muacTrend >= 0) return 999; // Not declining
  
  const weeksToSAM = Math.max(0, (currentMUAC - samThreshold) / Math.abs(muacTrend));
  const weeksToMAM = Math.max(0, (currentMUAC - mamThreshold) / Math.abs(muacTrend));
  
  // Return weeks to next threshold
  const weeksToNext = currentMUAC > mamThreshold ? weeksToMAM : weeksToSAM;
  return Math.round(weeksToNext * 7);
}

// Risk Assessment Functions

/**
 * Calculate combined risk level for a child
 */
export function calculateCombinedRisk(
  learningRisk: RiskLevel,
  nutritionRisk: RiskLevel,
  attendanceRisk: RiskLevel
): RiskLevel {
  const riskValues: Record<RiskLevel, number> = {
    'Low': 1,
    'Medium': 2,
    'High': 3
  };
  
  const avgRisk = (riskValues[learningRisk] + riskValues[nutritionRisk] + riskValues[attendanceRisk]) / 3;
  
  if (avgRisk >= 2.5) return 'High';
  if (avgRisk >= 1.5) return 'Medium';
  return 'Low';
}

/**
 * Get risk flags based on child data
 */
export function getRiskFlags(
  child: {
    nutritionStatus: NutritionStatus;
    attendanceRate: number;
    learningScore: number;
    domainScores: Record<LearningDomain, number>;
    ageMonths: number;
  }
): string[] {
  const flags: string[] = [];
  
  // Nutrition flags
  if (child.nutritionStatus === 'SAM') {
    flags.push('Severe acute malnutrition');
  } else if (child.nutritionStatus === 'MAM') {
    flags.push('Moderate acute malnutrition');
  }
  
  // Attendance flags
  if (child.attendanceRate < 60) {
    flags.push('Critical attendance (<60%)');
  } else if (child.attendanceRate < 80) {
    flags.push('Low attendance (<80%)');
  }
  
  // Learning flags
  if (child.learningScore < 50) {
    flags.push('Below age-level learning');
  }
  
  // Domain-specific flags
  if (child.domainScores.numeracy < 50) {
    flags.push('Needs numeracy support');
  }
  if (child.domainScores.language < 50) {
    flags.push('Needs language support');
  }
  
  return flags;
}

// Dashboard Analytics Functions

/**
 * Calculate trend direction and percentage change
 */
export function calculateTrend(
  currentValue: number,
  previousValue: number
): { direction: 'up' | 'down' | 'stable'; changePercent: number } {
  if (previousValue === 0) return { direction: 'stable', changePercent: 0 };
  
  const changePercent = Math.round(((currentValue - previousValue) / previousValue) * 1000) / 10;
  
  let direction: 'up' | 'down' | 'stable';
  if (changePercent > 2) direction = 'up';
  else if (changePercent < -2) direction = 'down';
  else direction = 'stable';
  
  return { direction, changePercent };
}

/**
 * Get status color based on value and thresholds
 */
export function getStatusByThreshold(
  value: number,
  greenThreshold: number,
  yellowThreshold: number,
  higherIsBetter: boolean = true
): 'green' | 'yellow' | 'red' {
  if (higherIsBetter) {
    if (value >= greenThreshold) return 'green';
    if (value >= yellowThreshold) return 'yellow';
    return 'red';
  } else {
    if (value <= greenThreshold) return 'green';
    if (value <= yellowThreshold) return 'yellow';
    return 'red';
  }
}

/**
 * Calculate percentile rank
 */
export function calculatePercentile(value: number, values: number[]): number {
  if (values.length === 0) return 50;
  
  const sorted = [...values].sort((a, b) => a - b);
  const position = sorted.findIndex(v => v >= value);
  
  if (position === -1) return 100;
  return Math.round((position / sorted.length) * 100);
}

/**
 * Format duration in seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) return `${remainingSeconds}s`;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Calculate age-appropriate learning expectations
 */
export function getAgeExpectations(ageMonths: number): Record<LearningDomain, { min: number; max: number }> {
  // Age groups: 12-24 months, 24-36 months, 36-48 months, 48-60 months, 60+ months
  if (ageMonths < 24) {
    return {
      language: { min: 30, max: 70 },
      numeracy: { min: 20, max: 50 },
      cognitive: { min: 30, max: 65 },
      socio_emotional: { min: 40, max: 75 }
    };
  } else if (ageMonths < 36) {
    return {
      language: { min: 40, max: 80 },
      numeracy: { min: 30, max: 65 },
      cognitive: { min: 40, max: 75 },
      socio_emotional: { min: 50, max: 85 }
    };
  } else if (ageMonths < 48) {
    return {
      language: { min: 50, max: 85 },
      numeracy: { min: 40, max: 80 },
      cognitive: { min: 50, max: 85 },
      socio_emotional: { min: 55, max: 90 }
    };
  } else if (ageMonths < 60) {
    return {
      language: { min: 60, max: 90 },
      numeracy: { min: 50, max: 85 },
      cognitive: { min: 60, max: 90 },
      socio_emotional: { min: 60, max: 92 }
    };
  } else {
    return {
      language: { min: 65, max: 95 },
      numeracy: { min: 55, max: 90 },
      cognitive: { min: 65, max: 95 },
      socio_emotional: { min: 65, max: 95 }
    };
  }
}

/**
 * Generate intervention recommendations based on assessment
 */
export function generateInterventionRecommendations(
  domain: LearningDomain,
  score: number,
  difficulty: DifficultyLevel,
  nutritionStatus: NutritionStatus
): string[] {
  const recommendations: string[] = [];
  
  // Learning-based recommendations
  if (score < 50) {
    recommendations.push('Provide additional learning support');
    if (difficulty > 1) {
      recommendations.push('Consider reducing difficulty level');
    }
  } else if (score > 85) {
    recommendations.push('Consider advancing to higher difficulty');
  }
  
  // Domain-specific recommendations
  switch (domain) {
    case 'language':
      if (score < 60) recommendations.push('Focus on vocabulary building activities');
      break;
    case 'numeracy':
      if (score < 60) recommendations.push('Use manipulatives for number concepts');
      break;
    case 'cognitive':
      if (score < 60) recommendations.push('Incorporate problem-solving games');
      break;
    case 'socio_emotional':
      if (score < 60) recommendations.push('Encourage group activities and sharing');
      break;
  }
  
  // Nutrition-based recommendations
  if (nutritionStatus === 'MAM' || nutritionStatus === 'SAM') {
    recommendations.push('Coordinate with nutrition program');
    recommendations.push('Schedule parent counseling session');
  }
  
  return recommendations;
}