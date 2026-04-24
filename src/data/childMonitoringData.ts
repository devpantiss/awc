import { mockChildren } from './mockData';

export type ChildNutritionBand = 'Normal' | 'Moderate' | 'Severe';

export type ManagedChild = {
  id: string;
  name: string;
  dob: string;
  ageLabel: string;
  gender: 'Male' | 'Female';
  parentName: string;
  phoneNumber: string;
  birthWeight: number;
  nutritionStatus: ChildNutritionBand;
};

export type GrowthEntry = {
  date: string;
  weight: number;
  height: number;
  muac: number;
};

export type ImmunizationRecord = {
  BCG: boolean;
  OPV: boolean;
  DPT: boolean;
  Measles: boolean;
  vitaminA: boolean;
};

export type DevelopmentChecklist = {
  grossMotor: { label: string; done: boolean }[];
  fineMotor: { label: string; done: boolean }[];
  language: { label: string; done: boolean }[];
  social: { label: string; done: boolean }[];
};

export type AttendanceEntry = {
  id: string;
  name: string;
  present: boolean;
};

export type HealthLog = {
  childId: string;
  fever: boolean;
  diarrhea: boolean;
  cough: boolean;
  hospitalVisit: boolean;
};

const phoneBase = ['9876501110', '9876501111', '9876501112', '9876501113', '9876501114', '9876501115'];

export const managedChildren: ManagedChild[] = mockChildren.slice(0, 6).map((child, index) => ({
  id: child.id,
  name: child.name,
  dob: ['2021-03-14', '2022-05-09', '2020-11-03', '2021-08-28', '2022-01-16', '2020-07-04'][index] ?? '2021-01-01',
  ageLabel: `${Math.floor(child.ageMonths / 12)}y ${child.ageMonths % 12}m`,
  gender: child.gender === 'M' ? 'Male' : 'Female',
  parentName: child.parentName,
  phoneNumber: phoneBase[index] ?? '9876501119',
  birthWeight: [2.8, 2.6, 2.4, 3.1, 2.9, 2.5][index] ?? 2.7,
  nutritionStatus:
    child.nutritionStatus === 'status.normal'
      ? 'Normal'
      : child.nutritionStatus === 'status.mam'
        ? 'Moderate'
        : 'Severe',
}));

export const growthHistoryByChild: Record<string, GrowthEntry[]> = {
  c1: [
    { date: '2026-01-10', weight: 13.1, height: 93.4, muac: 13.8 },
    { date: '2026-02-10', weight: 13.5, height: 94.1, muac: 14.0 },
    { date: '2026-03-10', weight: 13.8, height: 95.0, muac: 14.2 },
    { date: '2026-04-10', weight: 14.1, height: 95.8, muac: 14.3 },
  ],
  c2: [
    { date: '2026-01-10', weight: 11.2, height: 88.4, muac: 12.0 },
    { date: '2026-02-10', weight: 11.4, height: 89.0, muac: 12.1 },
    { date: '2026-03-10', weight: 11.7, height: 89.8, muac: 12.3 },
    { date: '2026-04-10', weight: 12.0, height: 90.4, muac: 12.4 },
  ],
  c3: [
    { date: '2026-01-10', weight: 9.0, height: 84.2, muac: 11.2 },
    { date: '2026-02-10', weight: 9.2, height: 84.9, muac: 11.3 },
    { date: '2026-03-10', weight: 9.5, height: 85.5, muac: 11.4 },
    { date: '2026-04-10', weight: 9.8, height: 86.0, muac: 11.5 },
  ],
  c4: [
    { date: '2026-01-10', weight: 14.4, height: 97.1, muac: 14.1 },
    { date: '2026-02-10', weight: 14.7, height: 97.8, muac: 14.2 },
    { date: '2026-03-10', weight: 15.0, height: 98.3, muac: 14.4 },
    { date: '2026-04-10', weight: 15.2, height: 99.0, muac: 14.5 },
  ],
  c5: [
    { date: '2026-01-10', weight: 12.8, height: 91.2, muac: 12.8 },
    { date: '2026-02-10', weight: 13.0, height: 91.7, muac: 13.0 },
    { date: '2026-03-10', weight: 13.2, height: 92.5, muac: 13.1 },
    { date: '2026-04-10', weight: 13.5, height: 93.1, muac: 13.3 },
  ],
  c6: [
    { date: '2026-01-10', weight: 11.0, height: 87.8, muac: 11.8 },
    { date: '2026-02-10', weight: 11.2, height: 88.2, muac: 11.9 },
    { date: '2026-03-10', weight: 11.5, height: 88.9, muac: 12.0 },
    { date: '2026-04-10', weight: 11.7, height: 89.4, muac: 12.1 },
  ],
};

/* ── Monthly Intake Tracking for "Track Child Metrics" ── */

export type MonthlyIntake = {
  month: string;        // e.g. 'Nov 2025'
  date: string;         // ISO date of intake YYYY-MM-DD
  weight: number;       // kg
  height: number;       // cm
  muac: number;         // cm
  bmi: number;
  learningScore: number;   // 0-100
  attendanceRate: number;  // 0-100
  nutritionStatus: ChildNutritionBand;
  notes: string;
};

export type GrowthInsight = {
  id: string;
  type: 'positive' | 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  metric?: string;
};

function bmiCalc(w: number, hCm: number) {
  const hM = hCm / 100;
  return hM > 0 ? Number((w / (hM * hM)).toFixed(1)) : 0;
}

function buildMonthlyHistory(
  entries: { m: string; d: string; w: number; h: number; muac: number; ls: number; ar: number; ns: ChildNutritionBand; n: string }[]
): MonthlyIntake[] {
  return entries.map((e) => ({
    month: e.m,
    date: e.d,
    weight: e.w,
    height: e.h,
    muac: e.muac,
    bmi: bmiCalc(e.w, e.h),
    learningScore: e.ls,
    attendanceRate: e.ar,
    nutritionStatus: e.ns,
    notes: e.n,
  }));
}

export const monthlyIntakeByChild: Record<string, MonthlyIntake[]> = {
  c1: buildMonthlyHistory([
    { m: 'Nov 2025', d: '2025-11-10', w: 12.5, h: 92.0, muac: 13.4, ls: 78, ar: 90, ns: 'Normal', n: 'Good appetite, active.' },
    { m: 'Dec 2025', d: '2025-12-10', w: 12.8, h: 92.8, muac: 13.5, ls: 82, ar: 88, ns: 'Normal', n: 'Slight cold, recovered.' },
    { m: 'Jan 2026', d: '2026-01-10', w: 13.1, h: 93.4, muac: 13.8, ls: 85, ar: 92, ns: 'Normal', n: 'Started new learning module.' },
    { m: 'Feb 2026', d: '2026-02-10', w: 13.5, h: 94.1, muac: 14.0, ls: 88, ar: 94, ns: 'Normal', n: 'Excellent progress.' },
    { m: 'Mar 2026', d: '2026-03-10', w: 13.8, h: 95.0, muac: 14.2, ls: 90, ar: 93, ns: 'Normal', n: 'On track across all areas.' },
    { m: 'Apr 2026', d: '2026-04-10', w: 14.1, h: 95.8, muac: 14.3, ls: 92, ar: 94, ns: 'Normal', n: 'Strong growth trajectory.' },
  ]),
  c2: buildMonthlyHistory([
    { m: 'Nov 2025', d: '2025-11-10', w: 10.5, h: 87.0, muac: 11.6, ls: 60, ar: 82, ns: 'Moderate', n: 'Weight below curve.' },
    { m: 'Dec 2025', d: '2025-12-10', w: 10.8, h: 87.6, muac: 11.8, ls: 65, ar: 80, ns: 'Moderate', n: 'THR distributed, partial consumption.' },
    { m: 'Jan 2026', d: '2026-01-10', w: 11.2, h: 88.4, muac: 12.0, ls: 70, ar: 85, ns: 'Moderate', n: 'Improving, still below target.' },
    { m: 'Feb 2026', d: '2026-02-10', w: 11.4, h: 89.0, muac: 12.1, ls: 72, ar: 86, ns: 'Moderate', n: 'Slow but steady gain.' },
    { m: 'Mar 2026', d: '2026-03-10', w: 11.7, h: 89.8, muac: 12.3, ls: 75, ar: 88, ns: 'Moderate', n: 'Crossed 12 cm MUAC.' },
    { m: 'Apr 2026', d: '2026-04-10', w: 12.0, h: 90.4, muac: 12.4, ls: 78, ar: 88, ns: 'Moderate', n: 'Close to normal band.' },
  ]),
  c3: buildMonthlyHistory([
    { m: 'Nov 2025', d: '2025-11-10', w: 8.2, h: 82.5, muac: 10.8, ls: 25, ar: 58, ns: 'Severe', n: 'SAM case. Started therapeutic feeding.' },
    { m: 'Dec 2025', d: '2025-12-10', w: 8.5, h: 83.2, muac: 10.9, ls: 28, ar: 60, ns: 'Severe', n: 'Marginal gain. Home visit scheduled.' },
    { m: 'Jan 2026', d: '2026-01-10', w: 9.0, h: 84.2, muac: 11.2, ls: 30, ar: 62, ns: 'Severe', n: 'Responding to intervention.' },
    { m: 'Feb 2026', d: '2026-02-10', w: 9.2, h: 84.9, muac: 11.3, ls: 32, ar: 64, ns: 'Severe', n: 'Slow recovery. Needs continued support.' },
    { m: 'Mar 2026', d: '2026-03-10', w: 9.5, h: 85.5, muac: 11.4, ls: 33, ar: 63, ns: 'Severe', n: 'MUAC still below 12cm. Flag for referral.' },
    { m: 'Apr 2026', d: '2026-04-10', w: 9.8, h: 86.0, muac: 11.5, ls: 35, ar: 65, ns: 'Severe', n: 'Slight gain. Continue follow-up.' },
  ]),
  c4: buildMonthlyHistory([
    { m: 'Nov 2025', d: '2025-11-10', w: 13.8, h: 95.5, muac: 13.8, ls: 80, ar: 88, ns: 'Normal', n: 'Healthy, consistent growth.' },
    { m: 'Dec 2025', d: '2025-12-10', w: 14.1, h: 96.2, muac: 13.9, ls: 82, ar: 90, ns: 'Normal', n: 'Good dietary diversity.' },
    { m: 'Jan 2026', d: '2026-01-10', w: 14.4, h: 97.1, muac: 14.1, ls: 84, ar: 89, ns: 'Normal', n: 'Active and learning well.' },
    { m: 'Feb 2026', d: '2026-02-10', w: 14.7, h: 97.8, muac: 14.2, ls: 85, ar: 91, ns: 'Normal', n: 'On WHO growth curve.' },
    { m: 'Mar 2026', d: '2026-03-10', w: 15.0, h: 98.3, muac: 14.4, ls: 87, ar: 90, ns: 'Normal', n: 'Excellent all-round progress.' },
    { m: 'Apr 2026', d: '2026-04-10', w: 15.2, h: 99.0, muac: 14.5, ls: 88, ar: 91, ns: 'Normal', n: 'On track. No concerns.' },
  ]),
  c5: buildMonthlyHistory([
    { m: 'Nov 2025', d: '2025-11-10', w: 12.2, h: 90.0, muac: 12.5, ls: 55, ar: 78, ns: 'Moderate', n: 'Below average for age.' },
    { m: 'Dec 2025', d: '2025-12-10', w: 12.4, h: 90.5, muac: 12.6, ls: 60, ar: 80, ns: 'Moderate', n: 'Attendance improved.' },
    { m: 'Jan 2026', d: '2026-01-10', w: 12.8, h: 91.2, muac: 12.8, ls: 63, ar: 80, ns: 'Moderate', n: 'Weight gain on track.' },
    { m: 'Feb 2026', d: '2026-02-10', w: 13.0, h: 91.7, muac: 13.0, ls: 66, ar: 82, ns: 'Normal', n: 'Crossed into normal band!' },
    { m: 'Mar 2026', d: '2026-03-10', w: 13.2, h: 92.5, muac: 13.1, ls: 69, ar: 81, ns: 'Normal', n: 'Maintaining normal status.' },
    { m: 'Apr 2026', d: '2026-04-10', w: 13.5, h: 93.1, muac: 13.3, ls: 71, ar: 82, ns: 'Normal', n: 'Good recovery track.' },
  ]),
  c6: buildMonthlyHistory([
    { m: 'Nov 2025', d: '2025-11-10', w: 10.4, h: 86.5, muac: 11.4, ls: 40, ar: 68, ns: 'Moderate', n: 'Irregular attendance affecting growth.' },
    { m: 'Dec 2025', d: '2025-12-10', w: 10.6, h: 87.0, muac: 11.5, ls: 42, ar: 70, ns: 'Moderate', n: 'Home visit completed.' },
    { m: 'Jan 2026', d: '2026-01-10', w: 11.0, h: 87.8, muac: 11.8, ls: 45, ar: 72, ns: 'Moderate', n: 'Slight improvement after intervention.' },
    { m: 'Feb 2026', d: '2026-02-10', w: 11.2, h: 88.2, muac: 11.9, ls: 48, ar: 70, ns: 'Moderate', n: 'Dietary counselling given to mother.' },
    { m: 'Mar 2026', d: '2026-03-10', w: 11.5, h: 88.9, muac: 12.0, ls: 51, ar: 72, ns: 'Moderate', n: 'Crossed 12cm MUAC threshold.' },
    { m: 'Apr 2026', d: '2026-04-10', w: 11.7, h: 89.4, muac: 12.1, ls: 54, ar: 72, ns: 'Moderate', n: 'Needs continued monitoring.' },
  ]),
};

export function generateGrowthInsights(history: MonthlyIntake[]): GrowthInsight[] {
  if (history.length < 2) return [{ id: 'no-data', type: 'info', title: 'Insufficient Data', description: 'At least 2 monthly records are needed to generate growth insights.', metric: 'general' }];

  const insights: GrowthInsight[] = [];
  const latest = history[history.length - 1];
  const prev = history[history.length - 2];
  const oldest = history[0];

  // Weight trend
  const weightDelta = latest.weight - prev.weight;
  const totalWeightGain = latest.weight - oldest.weight;
  const monthsSpan = history.length - 1;

  if (weightDelta > 0.3) {
    insights.push({ id: 'wt-gain', type: 'positive', title: 'Healthy Weight Gain', description: `Gained ${weightDelta.toFixed(1)} kg since last month. Average monthly gain: ${(totalWeightGain / monthsSpan).toFixed(2)} kg/month over ${monthsSpan} months.`, metric: 'weight' });
  } else if (weightDelta > 0) {
    insights.push({ id: 'wt-slow', type: 'warning', title: 'Slow Weight Gain', description: `Only ${weightDelta.toFixed(1)} kg gained since last intake. Expected ≥0.3 kg/month for this age group. Consider reviewing dietary intake.`, metric: 'weight' });
  } else {
    insights.push({ id: 'wt-loss', type: 'critical', title: 'Weight Loss Detected', description: `Lost ${Math.abs(weightDelta).toFixed(1)} kg since last month. Immediate follow-up and nutritional intervention recommended.`, metric: 'weight' });
  }

  // Height trend
  const heightDelta = latest.height - prev.height;
  if (heightDelta >= 0.8) {
    insights.push({ id: 'ht-good', type: 'positive', title: 'Normal Height Growth', description: `Grew ${heightDelta.toFixed(1)} cm this month — on track with expected growth velocity.`, metric: 'height' });
  } else if (heightDelta >= 0.3) {
    insights.push({ id: 'ht-slow', type: 'info', title: 'Moderate Height Growth', description: `Height increased by ${heightDelta.toFixed(1)} cm. Within acceptable range but below optimal.`, metric: 'height' });
  } else {
    insights.push({ id: 'ht-stunt', type: 'warning', title: 'Stunting Risk', description: `Minimal height gain (${heightDelta.toFixed(1)} cm). Potential stunting — monitor over next 2 months.`, metric: 'height' });
  }

  // MUAC assessment
  if (latest.muac >= 13.5) {
    insights.push({ id: 'muac-normal', type: 'positive', title: 'MUAC in Normal Range', description: `Current MUAC ${latest.muac} cm is above 13.5 cm threshold. No malnutrition risk.`, metric: 'muac' });
  } else if (latest.muac >= 12.0) {
    const muacTrend = latest.muac - prev.muac;
    insights.push({ id: 'muac-moderate', type: 'warning', title: 'MUAC in Moderate Zone', description: `MUAC ${latest.muac} cm (${muacTrend >= 0 ? '↑' : '↓'} ${Math.abs(muacTrend).toFixed(1)} cm). Between 12.0–13.5 cm indicates moderate acute malnutrition risk.`, metric: 'muac' });
  } else {
    insights.push({ id: 'muac-severe', type: 'critical', title: 'MUAC Below Critical Threshold', description: `MUAC ${latest.muac} cm is below 12.0 cm — indicates severe acute malnutrition (SAM). Immediate referral to NRC recommended.`, metric: 'muac' });
  }

  // BMI trend
  const bmiDelta = latest.bmi - prev.bmi;
  if (latest.bmi >= 14 && latest.bmi <= 18) {
    insights.push({ id: 'bmi-ok', type: 'positive', title: 'BMI Within Normal Range', description: `BMI ${latest.bmi} (${bmiDelta >= 0 ? '+' : ''}${bmiDelta.toFixed(1)} from last month) is in the healthy range for this age.`, metric: 'bmi' });
  } else if (latest.bmi < 14) {
    insights.push({ id: 'bmi-low', type: 'warning', title: 'Low BMI', description: `BMI ${latest.bmi} is below normal range (<14). Combined with other metrics, this may signal underweightness.`, metric: 'bmi' });
  }

  // Nutrition status trajectory
  const statusOrder: Record<ChildNutritionBand, number> = { Normal: 2, Moderate: 1, Severe: 0 };
  const statusDelta = statusOrder[latest.nutritionStatus] - statusOrder[prev.nutritionStatus];
  if (statusDelta > 0) {
    insights.push({ id: 'ns-improve', type: 'positive', title: 'Nutrition Status Improved', description: `Status upgraded from ${prev.nutritionStatus} → ${latest.nutritionStatus}. Dietary interventions are working.`, metric: 'nutrition' });
  } else if (statusDelta < 0) {
    insights.push({ id: 'ns-decline', type: 'critical', title: 'Nutrition Status Declined', description: `Status dropped from ${prev.nutritionStatus} → ${latest.nutritionStatus}. Urgent attention required — schedule home visit.`, metric: 'nutrition' });
  }

  // Learning score trend
  const lsDelta = latest.learningScore - prev.learningScore;
  const totalLsGain = latest.learningScore - oldest.learningScore;
  if (lsDelta >= 3) {
    insights.push({ id: 'ls-up', type: 'positive', title: 'Learning Progress', description: `Learning score improved by ${lsDelta} points this month (${oldest.learningScore}→${latest.learningScore} over ${monthsSpan} months).`, metric: 'learning' });
  } else if (lsDelta < 0) {
    insights.push({ id: 'ls-down', type: 'warning', title: 'Learning Score Declined', description: `Score dropped by ${Math.abs(lsDelta)} points. Low attendance (${latest.attendanceRate}%) may be a factor.`, metric: 'learning' });
  }

  // Attendance correlation
  if (latest.attendanceRate < 75) {
    insights.push({ id: 'att-low', type: 'warning', title: 'Low Attendance Impact', description: `Attendance at ${latest.attendanceRate}% is below 75% threshold. Research shows strong correlation between centre attendance and growth outcomes.`, metric: 'attendance' });
  }

  // Overall trajectory
  const allGains = totalWeightGain > 0 && latest.muac > oldest.muac && latest.learningScore > oldest.learningScore;
  if (allGains && latest.nutritionStatus === 'Normal') {
    insights.push({ id: 'overall-good', type: 'positive', title: 'Excellent Overall Trajectory', description: `All key metrics are trending positive over ${monthsSpan} months. This child is developing well across physical and cognitive dimensions.`, metric: 'overall' });
  } else if (latest.nutritionStatus === 'Severe') {
    insights.push({ id: 'overall-critical', type: 'critical', title: 'Requires Immediate Intervention', description: `Child remains in Severe malnutrition status. Coordinate with supervisor for NRC referral and intensified home-based care.`, metric: 'overall' });
  }

  return insights;
}

export const nutritionTrackingByChild = {
  c1: { breastfeedingStatus: 'Completed', mealsPerDay: 4, diversityScore: 82, thrReceived: true, thrConsumed: true },
  c2: { breastfeedingStatus: 'Partial', mealsPerDay: 3, diversityScore: 68, thrReceived: true, thrConsumed: true },
  c3: { breastfeedingStatus: 'Partial', mealsPerDay: 2, diversityScore: 44, thrReceived: true, thrConsumed: false },
  c4: { breastfeedingStatus: 'Completed', mealsPerDay: 4, diversityScore: 76, thrReceived: false, thrConsumed: false },
  c5: { breastfeedingStatus: 'Partial', mealsPerDay: 3, diversityScore: 63, thrReceived: true, thrConsumed: true },
  c6: { breastfeedingStatus: 'Partial', mealsPerDay: 3, diversityScore: 51, thrReceived: true, thrConsumed: false },
};

export const immunizationByChild: Record<string, ImmunizationRecord> = {
  c1: { BCG: true, OPV: true, DPT: true, Measles: true, vitaminA: true },
  c2: { BCG: true, OPV: true, DPT: true, Measles: false, vitaminA: false },
  c3: { BCG: true, OPV: true, DPT: false, Measles: false, vitaminA: false },
  c4: { BCG: true, OPV: true, DPT: true, Measles: true, vitaminA: false },
  c5: { BCG: true, OPV: true, DPT: true, Measles: false, vitaminA: false },
  c6: { BCG: true, OPV: false, DPT: false, Measles: false, vitaminA: false },
};

export const developmentByChild: Record<string, DevelopmentChecklist> = {
  c1: {
    grossMotor: [{ label: 'Sitting', done: true }, { label: 'Walking', done: true }, { label: 'Running', done: true }],
    fineMotor: [{ label: 'Holding Objects', done: true }, { label: 'Drawing', done: true }],
    language: [{ label: 'Speaking Words', done: true }, { label: 'Following Instructions', done: true }],
    social: [{ label: 'Playing with Others', done: true }],
  },
  c2: {
    grossMotor: [{ label: 'Sitting', done: true }, { label: 'Walking', done: true }, { label: 'Running', done: false }],
    fineMotor: [{ label: 'Holding Objects', done: true }, { label: 'Drawing', done: false }],
    language: [{ label: 'Speaking Words', done: true }, { label: 'Following Instructions', done: false }],
    social: [{ label: 'Playing with Others', done: true }],
  },
  c3: {
    grossMotor: [{ label: 'Sitting', done: true }, { label: 'Walking', done: false }, { label: 'Running', done: false }],
    fineMotor: [{ label: 'Holding Objects', done: true }, { label: 'Drawing', done: false }],
    language: [{ label: 'Speaking Words', done: false }, { label: 'Following Instructions', done: false }],
    social: [{ label: 'Playing with Others', done: false }],
  },
  c4: {
    grossMotor: [{ label: 'Sitting', done: true }, { label: 'Walking', done: true }, { label: 'Running', done: true }],
    fineMotor: [{ label: 'Holding Objects', done: true }, { label: 'Drawing', done: true }],
    language: [{ label: 'Speaking Words', done: true }, { label: 'Following Instructions', done: true }],
    social: [{ label: 'Playing with Others', done: true }],
  },
  c5: {
    grossMotor: [{ label: 'Sitting', done: true }, { label: 'Walking', done: true }, { label: 'Running', done: false }],
    fineMotor: [{ label: 'Holding Objects', done: true }, { label: 'Drawing', done: false }],
    language: [{ label: 'Speaking Words', done: true }, { label: 'Following Instructions', done: true }],
    social: [{ label: 'Playing with Others', done: true }],
  },
  c6: {
    grossMotor: [{ label: 'Sitting', done: true }, { label: 'Walking', done: false }, { label: 'Running', done: false }],
    fineMotor: [{ label: 'Holding Objects', done: true }, { label: 'Drawing', done: false }],
    language: [{ label: 'Speaking Words', done: false }, { label: 'Following Instructions', done: true }],
    social: [{ label: 'Playing with Others', done: false }],
  },
};

export const dailyAttendanceSeed: AttendanceEntry[] = managedChildren.map((child, index) => ({
  id: child.id,
  name: child.name,
  present: index !== 2 && index !== 5,
}));

export const monthlyAttendanceTrend = [
  { month: 'Nov', attendance: 82 },
  { month: 'Dec', attendance: 84 },
  { month: 'Jan', attendance: 81 },
  { month: 'Feb', attendance: 86 },
  { month: 'Mar', attendance: 88 },
  { month: 'Apr', attendance: 85 },
];

export const healthLogsSeed: HealthLog[] = [
  { childId: 'c1', fever: false, diarrhea: false, cough: true, hospitalVisit: false },
  { childId: 'c2', fever: false, diarrhea: false, cough: false, hospitalVisit: false },
  { childId: 'c3', fever: true, diarrhea: true, cough: true, hospitalVisit: true },
  { childId: 'c4', fever: false, diarrhea: false, cough: false, hospitalVisit: false },
  { childId: 'c5', fever: false, diarrhea: true, cough: false, hospitalVisit: false },
  { childId: 'c6', fever: true, diarrhea: false, cough: true, hospitalVisit: false },
];

export const dashboardHealthSnapshot = {
  underweightChildren: managedChildren.filter((child) => child.nutritionStatus !== 'Normal').length,
  severeMalnutrition: managedChildren.filter((child) => child.nutritionStatus === 'Severe').length,
  fullyImmunized: Object.values(immunizationByChild).filter((record) => Object.values(record).every(Boolean)).length,
  attendancePercent: Math.round(monthlyAttendanceTrend.reduce((sum, item) => sum + item.attendance, 0) / monthlyAttendanceTrend.length),
  nutritionPie: [
    { name: 'Normal', value: managedChildren.filter((child) => child.nutritionStatus === 'Normal').length, color: '#10b981' },
    { name: 'Moderate', value: managedChildren.filter((child) => child.nutritionStatus === 'Moderate').length, color: '#f59e0b' },
    { name: 'Severe', value: managedChildren.filter((child) => child.nutritionStatus === 'Severe').length, color: '#ef4444' },
  ],
  immunizationBar: [
    { vaccine: 'BCG', coverage: 100 },
    { vaccine: 'OPV', coverage: 83 },
    { vaccine: 'DPT', coverage: 66 },
    { vaccine: 'Measles', coverage: 33 },
    { vaccine: 'Vitamin A', coverage: 16 },
  ],
};


/* ── Date-Wise Consolidated Attendance History (Nov 2025 – Apr 2026) ── */

export type DateAttendanceRecord = {
  date: string;          // YYYY-MM-DD
  dayName: string;       // Mon, Tue, ...
  holiday: boolean;
  childStatus: Record<string, boolean>;   // childId → present
};

export type ChildMonthStat = {
  childId: string;
  childName: string;
  present: number;
  absent: number;
  percent: number;
};

export type MonthAttendanceBlock = {
  monthKey: string;       // e.g. "Nov 2025"
  dates: DateAttendanceRecord[];
  workingDays: number;
  overallPercent: number;
  stats: ChildMonthStat[];
};

function buildConsolidatedHistory(): MonthAttendanceBlock[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Seeds per-child per-month (1 = present, 0 = absent). Each seed is 10 values that cycle.
  const seeds: Record<string, number[][]> = {};
  managedChildren.forEach((c, idx) => {
    seeds[c.id] = [
      // Nov, Dec, Jan, Feb, Mar, Apr
      [[1,1,1,1,0,1,1,1,0,1],[1,1,0,1,1,1,1,0,1,1],[1,1,1,0,1,1,1,1,0,1],[1,0,1,1,1,1,1,1,0,1],[1,1,1,1,1,0,1,1,1,1],[1,1,1,1,1,1,1,0,1,1]],  // Aarav ~85-90%
      [[1,1,1,0,1,1,1,1,0,1],[1,0,1,1,1,0,1,1,1,1],[1,1,0,1,1,1,0,1,1,1],[1,1,1,0,1,1,1,0,1,1],[1,1,1,1,0,1,1,1,1,0],[1,1,1,0,1,1,1,1,0,1]],  // Priya ~75-80%
      [[1,0,1,0,1,1,0,1,0,1],[0,1,1,0,1,0,1,1,0,1],[1,0,0,1,1,0,1,0,1,1],[1,0,1,0,1,1,0,1,0,0],[0,1,1,0,1,0,1,1,0,1],[1,0,1,0,1,1,0,1,0,1]],  // Ishan ~55-60% at-risk
      [[1,1,1,1,1,1,1,1,1,0],[1,1,1,1,0,1,1,1,1,1],[1,1,1,1,1,1,0,1,1,1],[1,1,1,1,1,0,1,1,1,1],[1,1,1,1,1,1,1,0,1,1],[1,1,1,1,1,1,1,1,1,0]],  // Meera ~90%
      [[1,1,0,1,1,1,0,1,1,1],[1,1,1,0,1,1,1,0,1,1],[1,0,1,1,1,1,0,1,1,1],[1,1,1,0,1,1,1,1,0,1],[1,1,0,1,1,1,1,0,1,1],[1,1,0,1,1,1,0,1,1,1]],  // Arjun ~78%
      [[1,0,0,1,1,0,1,0,1,1],[0,1,0,1,1,0,1,0,1,1],[1,0,0,1,1,0,1,0,1,0],[0,1,1,0,1,0,0,1,1,0],[1,0,0,1,1,0,1,0,1,1],[1,0,0,1,1,0,1,0,1,1]],  // Kavya ~50% at-risk
    ][idx];
  });

  const months = [
    { year: 2025, month: 10, label: 'Nov 2025' },
    { year: 2025, month: 11, label: 'Dec 2025' },
    { year: 2026, month: 0,  label: 'Jan 2026' },
    { year: 2026, month: 1,  label: 'Feb 2026' },
    { year: 2026, month: 2,  label: 'Mar 2026' },
    { year: 2026, month: 3,  label: 'Apr 2026' },
  ];

  return months.map((m, monthIdx) => {
    const dates: DateAttendanceRecord[] = [];
    const daysInMonth = new Date(m.year, m.month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(m.year, m.month, d);
      const dow = dt.getDay();
      const isHoliday = dow === 0; // Sunday
      const dateStr = dt.toISOString().split('T')[0];

      const childStatus: Record<string, boolean> = {};
      managedChildren.forEach((c) => {
        const seed = seeds[c.id][monthIdx];
        childStatus[c.id] = isHoliday ? false : seed[(d - 1) % seed.length] === 1;
      });

      dates.push({ date: dateStr, dayName: dayNames[dow], holiday: isHoliday, childStatus });
    }

    const workingDates = dates.filter((r) => !r.holiday);
    const workingDays = workingDates.length;

    const stats: ChildMonthStat[] = managedChildren.map((c) => {
      const present = workingDates.filter((r) => r.childStatus[c.id]).length;
      const absent = workingDays - present;
      return { childId: c.id, childName: c.name, present, absent, percent: Math.round((present / workingDays) * 100) };
    });

    const totalPresent = stats.reduce((s, c) => s + c.present, 0);
    const totalPossible = workingDays * managedChildren.length;
    const overallPercent = Math.round((totalPresent / totalPossible) * 100);

    return { monthKey: m.label, dates, workingDays, overallPercent, stats };
  });
}

export const consolidatedAttendanceHistory: MonthAttendanceBlock[] = buildConsolidatedHistory();


export function getNutritionTone(status: ChildNutritionBand) {
  if (status === 'Normal') return 'emerald';
  if (status === 'Moderate') return 'amber';
  return 'red';
}

export function getGrowthStatusFromMuac(muac: number): ChildNutritionBand {
  if (muac >= 13.5) return 'Normal';
  if (muac >= 12.0) return 'Moderate';
  return 'Severe';
}

export function calculateBMI(weight: number, heightCm: number) {
  const heightM = heightCm / 100;
  if (!heightM) return 0;
  return Number((weight / (heightM * heightM)).toFixed(1));
}

export function getVaccineCompletionCount(record: ImmunizationRecord) {
  return Object.values(record).filter(Boolean).length;
}

export function getDevelopmentCompletion(checklist: DevelopmentChecklist) {
  const items = [...checklist.grossMotor, ...checklist.fineMotor, ...checklist.language, ...checklist.social];
  const completed = items.filter((item) => item.done).length;
  return Math.round((completed / items.length) * 100);
}
