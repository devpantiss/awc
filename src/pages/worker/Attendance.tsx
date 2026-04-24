import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Clock,
  Flame,
  History,
  Info,
  LineChart as LineChartIcon,
  Plus,
  Ruler,
  Scale,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import {
  BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  LineChart, Line, Legend,
} from 'recharts';
import * as Tabs from '@radix-ui/react-tabs';
import {
  dailyAttendanceSeed,
  managedChildren,
  monthlyAttendanceTrend,
  monthlyIntakeByChild,
  generateGrowthInsights,
  consolidatedAttendanceHistory,
  type ManagedChild,
  type MonthlyIntake,
  type GrowthInsight,
  type MonthAttendanceBlock,
} from '../../data/childMonitoringData';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { SideDrawer } from '../../components/ui/side-drawer';
import { cn } from '../../utils';

type WorkerAttendanceStatus = 'pending' | 'present' | 'absent';
type Flow = 'none' | 'register' | 'track';

type RegistrationForm = {
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | '';
  parentName: string;
  phoneNumber: string;
  birthWeight: string;
};

type ChildMetrics = {
  childId: string;
  weight: string;
  height: string;
  muac: string;
  learningScore: string;
  attendanceRate: string;
  nutritionStatus: 'Normal' | 'Moderate' | 'Severe';
  notes: string;
  lastUpdated: string;
};

const emptyRegistrationForm: RegistrationForm = {
  name: '',
  dob: '',
  gender: '',
  parentName: '',
  phoneNumber: '',
  birthWeight: '',
};

const initialMetrics: ChildMetrics[] = managedChildren.map((child, index) => ({
  childId: child.id,
  weight: ['14.1', '12.0', '9.8', '15.2', '13.5', '11.7'][index] ?? '12.5',
  height: ['95.8', '90.4', '86.0', '99.0', '93.1', '89.4'][index] ?? '90.0',
  muac: ['14.3', '12.4', '11.5', '14.5', '13.3', '12.1'][index] ?? '12.5',
  learningScore: ['92', '78', '35', '88', '71', '54'][index] ?? '60',
  attendanceRate: ['94', '88', '65', '91', '82', '72'][index] ?? '80',
  nutritionStatus: child.nutritionStatus,
  notes:
    child.nutritionStatus === 'Severe'
      ? 'Needs nutrition follow-up and home visit.'
      : child.nutritionStatus === 'Moderate'
        ? 'Monitor meals and THR consumption.'
        : 'On track.',
  lastUpdated: '2026-04-22',
}));

function getMetricStatusClass(status: ChildMetrics['nutritionStatus']) {
  if (status === 'Normal') return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300';
  if (status === 'Moderate') return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300';
  return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300';
}

function getAgeLabel(dob: string) {
  const birthDate = new Date(dob);
  const now = new Date('2026-04-23');
  const months = Math.max(0, (now.getFullYear() - birthDate.getFullYear()) * 12 + now.getMonth() - birthDate.getMonth());
  return `${Math.floor(months / 12)}y ${months % 12}m`;
}

const todayFormatted = new Date('2026-04-23').toLocaleDateString('en-IN', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function Attendance() {
  const [workerStatus, setWorkerStatus] = useState<WorkerAttendanceStatus>('pending');
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [activeFlow, setActiveFlow] = useState<Flow>('none');
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [metricsTab, setMetricsTab] = useState<'intake' | 'history' | 'insights'>('intake');
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>(emptyRegistrationForm);
  const [registrationErrors, setRegistrationErrors] = useState<Record<string, string>>({});
  const [children, setChildren] = useState<ManagedChild[]>(managedChildren);
  const [attendance, setAttendance] = useState(dailyAttendanceSeed);
  const [metrics, setMetrics] = useState<ChildMetrics[]>(initialMetrics);
  const [selectedChildId, setSelectedChildId] = useState(managedChildren[0].id);
  const [studentSearch, setStudentSearch] = useState('');
  const [historyMonthIndex, setHistoryMonthIndex] = useState(consolidatedAttendanceHistory.length - 1);
  const [expandedHistoryDate, setExpandedHistoryDate] = useState<string | null>(null);

  const selectedMonthBlock: MonthAttendanceBlock = consolidatedAttendanceHistory[historyMonthIndex];

  const presentStudents = attendance.filter((child) => child.present).length;
  const absentStudents = attendance.length - presentStudents;
  const attendancePercentage = Math.round((presentStudents / attendance.length) * 100);
  const selectedChild = children.find((child) => child.id === selectedChildId) ?? children[0];
  const selectedMetrics = metrics.find((item) => item.childId === selectedChildId) ?? metrics[0];

  const filteredAttendance = useMemo(() => {
    if (!studentSearch.trim()) return attendance;
    const query = studentSearch.toLowerCase();
    return attendance.filter((child) => child.name.toLowerCase().includes(query));
  }, [attendance, studentSearch]);

  const bmi = useMemo(() => {
    const weight = Number(selectedMetrics.weight);
    const heightM = Number(selectedMetrics.height) / 100;
    if (!weight || !heightM) return '0.0';
    return (weight / (heightM * heightM)).toFixed(1);
  }, [selectedMetrics.height, selectedMetrics.weight]);

  // Monthly intake history for the selected child
  const childIntakeHistory: MonthlyIntake[] = useMemo(
    () => monthlyIntakeByChild[selectedChildId] ?? [],
    [selectedChildId]
  );

  const childGrowthInsights: GrowthInsight[] = useMemo(
    () => generateGrowthInsights(childIntakeHistory),
    [childIntakeHistory]
  );

  const markWorkerPresent = () => {
    setWorkerStatus('present');
    setShowNextSteps(true);
    setActiveFlow('none');
  };

  const markWorkerAbsent = () => {
    setWorkerStatus('absent');
    setShowNextSteps(false);
    setActiveFlow('none');
    setRegistrationOpen(false);
    setMetricsOpen(false);
  };

  const validateRegistration = () => {
    const errors: Record<string, string> = {};
    if (!registrationForm.name.trim()) errors.name = 'Child name is required.';
    if (!registrationForm.dob) errors.dob = 'Date of birth is required.';
    if (!registrationForm.gender) errors.gender = 'Gender is required.';
    if (!registrationForm.parentName.trim()) errors.parentName = 'Parent name is required.';
    if (!/^\d{10}$/.test(registrationForm.phoneNumber)) errors.phoneNumber = 'Enter a valid 10-digit phone number.';
    const birthWeight = Number(registrationForm.birthWeight);
    if (!birthWeight || Number.isNaN(birthWeight) || birthWeight <= 0 || birthWeight > 6) {
      errors.birthWeight = 'Birth weight should be between 0.1 and 6 kg.';
    }
    setRegistrationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterCandidate = () => {
    if (!validateRegistration()) return;

    const child: ManagedChild = {
      id: `child-${Date.now()}`,
      name: registrationForm.name.trim(),
      dob: registrationForm.dob,
      ageLabel: getAgeLabel(registrationForm.dob),
      gender: registrationForm.gender as 'Male' | 'Female',
      parentName: registrationForm.parentName.trim(),
      phoneNumber: registrationForm.phoneNumber,
      birthWeight: Number(registrationForm.birthWeight),
      nutritionStatus: 'Normal',
    };

    setChildren((current) => [child, ...current]);
    setAttendance((current) => [{ id: child.id, name: child.name, present: true }, ...current]);
    setMetrics((current) => [
      {
        childId: child.id,
        weight: String(child.birthWeight),
        height: '50.0',
        muac: '12.5',
        learningScore: '0',
        attendanceRate: '100',
        nutritionStatus: 'Normal',
        notes: 'New candidate registered from worker attendance flow.',
        lastUpdated: '2026-04-23',
      },
      ...current,
    ]);
    setSelectedChildId(child.id);
    setRegistrationForm(emptyRegistrationForm);
    setRegistrationErrors({});
    setRegistrationOpen(false);
    setMetricsOpen(true);
    setActiveFlow('track');
  };

  const updateSelectedMetrics = (updates: Partial<ChildMetrics>) => {
    setMetrics((current) =>
      current.map((item) =>
        item.childId === selectedChildId
          ? { ...item, ...updates, lastUpdated: '2026-04-23' }
          : item
      )
    );
  };

  const openRegistrationDrawer = () => {
    setActiveFlow('register');
    setRegistrationOpen(true);
  };

  const openMetricsDrawer = () => {
    setActiveFlow('track');
    setMetricsOpen(true);
  };

  const markAllPresent = () => {
    setAttendance((current) => current.map((entry) => ({ ...entry, present: true })));
  };

  const markAllAbsent = () => {
    setAttendance((current) => current.map((entry) => ({ ...entry, present: false })));
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* ─── Compact Header with Date & Status ─── */}
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_40%)] p-6 dark:bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.1),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.08),_transparent_40%)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <Clock size={14} />
                {todayFormatted}
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Daily Attendance</h2>
            </div>
            <div className="flex items-center gap-2">
              {workerStatus === 'present' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                  <CheckCircle2 size={14} />
                  Worker Checked In
                </motion.div>
              )}
              {workerStatus === 'absent' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                >
                  <XCircle size={14} />
                  Worker Absent
                </motion.div>
              )}
            </div>
          </div>

          {/* ─── Stat Chips ─── */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              {
                label: 'Present',
                value: presentStudents,
                total: `/${attendance.length}`,
                color: 'emerald',
              },
              {
                label: 'Absent',
                value: absentStudents,
                total: `/${attendance.length}`,
                color: 'red',
              },
              {
                label: 'Rate',
                value: `${attendancePercentage}%`,
                total: '',
                color: 'sky',
              },
            ].map((chip) => (
              <div
                key={chip.label}
                className={cn(
                  'rounded-2xl border p-3 text-center backdrop-blur-sm',
                  chip.color === 'emerald' && 'border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20',
                  chip.color === 'red' && 'border-red-200/70 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/20',
                  chip.color === 'sky' && 'border-sky-200/70 bg-sky-50/60 dark:border-sky-900/50 dark:bg-sky-950/20',
                )}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{chip.label}</p>
                <p className={cn(
                  'mt-1 text-xl font-bold',
                  chip.color === 'emerald' && 'text-emerald-700 dark:text-emerald-300',
                  chip.color === 'red' && 'text-red-700 dark:text-red-300',
                  chip.color === 'sky' && 'text-sky-700 dark:text-sky-300',
                )}>
                  {chip.value}
                  {chip.total && <span className="text-sm font-medium text-muted-foreground">{chip.total}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Worker Check-In (only when pending) ─── */}
      <AnimatePresence>
        {workerStatus === 'pending' && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, height: 0, marginTop: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
            className="rounded-[2rem] border border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-orange-50/60 p-5 shadow-sm dark:border-amber-900/60 dark:from-amber-950/20 dark:to-orange-950/10"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <UserCheck size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Mark your attendance first</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Check yourself in before marking student attendance.</p>
                <div className="mt-4 flex gap-3">
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-xl bg-emerald-600 px-5 text-xs font-bold hover:bg-emerald-700"
                    onClick={markWorkerPresent}
                  >
                    <CheckCircle2 size={14} />
                    I'm Present
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl px-5 text-xs font-bold"
                    onClick={markWorkerAbsent}
                  >
                    Mark Absent
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── Quick Actions (after worker check-in) ─── */}
      <AnimatePresence>
        {showNextSteps && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <button
              type="button"
              onClick={openRegistrationDrawer}
              className={cn(
                'group flex items-center gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg',
                activeFlow === 'register' ? 'border-emerald-400 ring-1 ring-emerald-400/30' : 'border-border'
              )}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.25rem] bg-emerald-100 text-emerald-700 transition-transform group-hover:scale-110 dark:bg-emerald-950/40 dark:text-emerald-300">
                <UserPlus size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">Register New Child</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">Add a new candidate to the centre</p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={openMetricsDrawer}
              className={cn(
                'group flex items-center gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg',
                activeFlow === 'track' ? 'border-sky-400 ring-1 ring-sky-400/30' : 'border-border'
              )}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.25rem] bg-sky-100 text-sky-700 transition-transform group-hover:scale-110 dark:bg-sky-950/40 dark:text-sky-300">
                <ClipboardList size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">Track Child Metrics</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">Update growth & nutrition data</p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── Student Attendance Cards ─── */}
      <section className="rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Student Attendance</h3>
              <p className="text-xs text-muted-foreground">Tap a child to toggle present / absent</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56 sm:flex-none">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="h-9 rounded-xl pl-8 text-xs"
              />
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={markAllPresent}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
              >
                All ✓
              </button>
              <button
                type="button"
                onClick={markAllAbsent}
                className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-700 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
              >
                All ✗
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAttendance.map((child, index) => {
            const isPresent = child.present;
            return (
              <motion.button
                key={child.id}
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() =>
                  setAttendance((current) =>
                    current.map((entry) => (entry.id === child.id ? { ...entry, present: !entry.present } : entry))
                  )
                }
                className={cn(
                  'group flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98]',
                  isPresent
                    ? 'border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/15 dark:hover:bg-emerald-950/25'
                    : 'border-red-200/60 bg-red-50/30 hover:bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/10 dark:hover:bg-red-950/20'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors',
                    isPresent
                      ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                      : 'bg-red-200/60 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  )}
                >
                  {child.name.charAt(0)}
                </div>

                {/* Name */}
                <span className="flex-1 truncate text-sm font-semibold text-foreground">{child.name}</span>

                {/* Status Chip */}
                <span
                  className={cn(
                    'shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors',
                    isPresent
                      ? 'bg-emerald-200/80 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-red-200/60 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  )}
                >
                  {isPresent ? '✓ Present' : '✗ Absent'}
                </span>
              </motion.button>
            );
          })}
          {filteredAttendance.length === 0 && (
            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No students match "{studentSearch}"
            </div>
          )}
        </div>
      </section>

      {/* ─── Monthly Trend Chart ─── */}
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Monthly Attendance Trend</h3>
            <p className="mt-1 text-xs text-muted-foreground">Centre-wide attendance percentage over the past 6 months</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
            <BarChart3 size={18} />
          </div>
        </div>
        <div className="mt-5 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyAttendanceTrend} barCategoryGap="24%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderRadius: '1rem',
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
                cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              />
              <Bar dataKey="attendance" radius={[10, 10, 4, 4]} fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ─── Date-Wise Attendance History ─── */}
      <section className="rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
              <History size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Attendance History</h3>
              <p className="text-xs text-muted-foreground">Complete date-wise attendance record · Nov 2025 – Apr 2026</p>
            </div>
          </div>
        </div>

        {/* Month tabs */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-3">
          {consolidatedAttendanceHistory.map((block, idx) => (
            <button
              key={block.monthKey}
              onClick={() => { setHistoryMonthIndex(idx); setExpandedHistoryDate(null); }}
              className={cn(
                'shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all',
                historyMonthIndex === idx
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {block.monthKey}
            </button>
          ))}
        </div>

        {/* Month summary */}
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/70 p-3.5 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Working Days</p>
            <p className="mt-1 text-xl font-bold text-foreground">{selectedMonthBlock.workingDays}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-3.5 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Total Days</p>
            <p className="mt-1 text-xl font-bold text-foreground">{selectedMonthBlock.dates.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-3.5 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Overall Attendance</p>
            <p className={cn(
              'mt-1 text-xl font-bold',
              selectedMonthBlock.overallPercent >= 85 ? 'text-emerald-600' : selectedMonthBlock.overallPercent >= 70 ? 'text-amber-600' : 'text-red-600'
            )}>
              {selectedMonthBlock.overallPercent}%
            </p>
          </div>
        </div>

        {/* Per-student monthly stats */}
        <div className="border-t border-border px-4 py-4">
          <h4 className="mb-3 text-sm font-bold text-foreground">Student Summary — {selectedMonthBlock.monthKey}</h4>
          <div className="space-y-2">
            {selectedMonthBlock.stats.map((stat) => {
              const tone = stat.percent >= 85 ? 'emerald' : stat.percent >= 70 ? 'amber' : 'red';
              return (
                <div key={stat.childId} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5">
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    tone === 'emerald' && 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
                    tone === 'amber' && 'bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
                    tone === 'red' && 'bg-red-200 text-red-800 dark:bg-red-900/60 dark:text-red-200',
                  )}>
                    {stat.childName.charAt(0)}
                  </div>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{stat.childName}</span>
                  <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-1.5 text-[10px] font-semibold text-muted-foreground sm:flex">
                      <span className="text-emerald-600 dark:text-emerald-400">{stat.present}P</span>
                      <span>·</span>
                      <span className="text-red-600 dark:text-red-400">{stat.absent}A</span>
                    </div>
                    {/* Mini progress bar */}
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-muted/50">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          tone === 'emerald' && 'bg-emerald-500',
                          tone === 'amber' && 'bg-amber-500',
                          tone === 'red' && 'bg-red-500',
                        )}
                        style={{ width: `${stat.percent}%` }}
                      />
                    </div>
                    <span className={cn(
                      'w-10 text-right text-xs font-bold',
                      tone === 'emerald' && 'text-emerald-600',
                      tone === 'amber' && 'text-amber-600',
                      tone === 'red' && 'text-red-600',
                    )}>
                      {stat.percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Date-wise records */}
        <div className="border-t border-border px-4 py-4">
          <h4 className="mb-3 text-sm font-bold text-foreground">Day-by-Day Records</h4>
          <div className="mb-3 flex items-center justify-center gap-5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Present</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-400" /> Absent</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-300 dark:bg-slate-600" /> Holiday</span>
          </div>
          <div className="max-h-[480px] space-y-1.5 overflow-y-auto pr-1">
            {[...selectedMonthBlock.dates].reverse().map((rec) => {
              const dateObj = new Date(rec.date);
              const dayNum = dateObj.getDate();
              const isExpanded = expandedHistoryDate === rec.date;
              const presentCount = rec.holiday ? 0 : Object.values(rec.childStatus).filter(Boolean).length;
              const totalCount = managedChildren.length;

              return (
                <div key={rec.date}>
                  <button
                    type="button"
                    onClick={() => !rec.holiday && setExpandedHistoryDate(isExpanded ? null : rec.date)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all',
                      rec.holiday
                        ? 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/30 cursor-default'
                        : isExpanded
                          ? 'border-primary/30 bg-primary/5'
                          : 'border-border bg-background/50 hover:bg-accent/50 cursor-pointer'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-9 w-9 flex-col items-center justify-center rounded-lg text-[10px] font-bold',
                        rec.holiday
                          ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                          : 'bg-primary/10 text-primary'
                      )}>
                        <span className="text-sm">{dayNum}</span>
                        <span className="text-[8px] font-semibold opacity-60">{rec.dayName}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {rec.holiday ? 'Holiday (Sunday)' : `${presentCount}/${totalCount} present`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {rec.holiday ? (
                        <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">HOLIDAY</span>
                      ) : (
                        <>
                          {/* Mini dot indicators */}
                          <div className="hidden gap-1 sm:flex">
                            {managedChildren.map((child) => (
                              <div
                                key={child.id}
                                title={`${child.name}: ${rec.childStatus[child.id] ? 'Present' : 'Absent'}`}
                                className={cn(
                                  'h-2.5 w-2.5 rounded-full',
                                  rec.childStatus[child.id] ? 'bg-emerald-400' : 'bg-red-400'
                                )}
                              />
                            ))}
                          </div>
                          {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                        </>
                      )}
                    </div>
                  </button>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && !rec.holiday && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 grid gap-1.5 rounded-xl border border-border bg-card p-3 sm:grid-cols-2 lg:grid-cols-3">
                          {managedChildren.map((child) => {
                            const isPresent = rec.childStatus[child.id];
                            return (
                              <div
                                key={child.id}
                                className={cn(
                                  'flex items-center gap-2.5 rounded-lg px-3 py-2',
                                  isPresent
                                    ? 'bg-emerald-50/80 dark:bg-emerald-950/15'
                                    : 'bg-red-50/80 dark:bg-red-950/15'
                                )}
                              >
                                <div className={cn(
                                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                                  isPresent
                                    ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200'
                                    : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                                )}>
                                  {child.name.charAt(0)}
                                </div>
                                <span className="flex-1 truncate text-xs font-medium text-foreground">{child.name}</span>
                                <span className={cn(
                                  'rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase',
                                  isPresent
                                    ? 'bg-emerald-200/80 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                                    : 'bg-red-200/60 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                )}>
                                  {isPresent ? '✓ Present' : '✗ Absent'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low-attendance alerts */}
        {selectedMonthBlock.stats.some((s) => s.percent < 75) && (
          <div className="border-t border-border p-4">
            <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 dark:border-red-900 dark:bg-red-950/20">
              <p className="flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-300">
                <AlertTriangle size={16} />
                Low Attendance Alert — {selectedMonthBlock.monthKey}
              </p>
              <div className="mt-2 space-y-1">
                {selectedMonthBlock.stats.filter((s) => s.percent < 75).map((s) => (
                  <p key={s.childId} className="text-xs text-red-600 dark:text-red-400">
                    • {s.childName} — {s.percent}% ({s.present}/{selectedMonthBlock.workingDays} days). Consider scheduling a home visit.
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══ Registration Drawer ═══ */}
      <SideDrawer
        open={registrationOpen}
        onOpenChange={setRegistrationOpen}
        title="Register New Candidate"
        description="Add a child candidate without leaving the attendance screen."
        footer={
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setRegistrationOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleRegisterCandidate}>
              Register Candidate
            </Button>
          </div>
        }
      >
        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Child Name</label>
              <Input value={registrationForm.name} onChange={(event) => setRegistrationForm((current) => ({ ...current, name: event.target.value }))} />
              {registrationErrors.name ? <p className="text-xs text-red-500">{registrationErrors.name}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date of Birth</label>
              <Input type="date" value={registrationForm.dob} onChange={(event) => setRegistrationForm((current) => ({ ...current, dob: event.target.value }))} />
              {registrationErrors.dob ? <p className="text-xs text-red-500">{registrationErrors.dob}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Gender</label>
              <Select value={registrationForm.gender} onValueChange={(value: 'Male' | 'Female') => setRegistrationForm((current) => ({ ...current, gender: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
              {registrationErrors.gender ? <p className="text-xs text-red-500">{registrationErrors.gender}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Parent Name</label>
              <Input value={registrationForm.parentName} onChange={(event) => setRegistrationForm((current) => ({ ...current, parentName: event.target.value }))} />
              {registrationErrors.parentName ? <p className="text-xs text-red-500">{registrationErrors.parentName}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input
                value={registrationForm.phoneNumber}
                onChange={(event) => setRegistrationForm((current) => ({ ...current, phoneNumber: event.target.value.replace(/\D/g, '').slice(0, 10) }))}
              />
              {registrationErrors.phoneNumber ? <p className="text-xs text-red-500">{registrationErrors.phoneNumber}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Birth Weight</label>
              <Input
                type="number"
                step="0.1"
                value={registrationForm.birthWeight}
                onChange={(event) => setRegistrationForm((current) => ({ ...current, birthWeight: event.target.value }))}
              />
              {registrationErrors.birthWeight ? <p className="text-xs text-red-500">{registrationErrors.birthWeight}</p> : null}
            </div>
          </div>
        </div>
      </SideDrawer>

      {/* ═══ Metrics Drawer — Tabbed ═══ */}
      <SideDrawer
        open={metricsOpen}
        onOpenChange={(open) => { setMetricsOpen(open); if (!open) setMetricsTab('intake'); }}
        title="Track Child Metrics"
        description="Monthly growth intake, history, and AI-powered insights."
        footer={
          metricsTab === 'intake' ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Last updated: {selectedMetrics.lastUpdated}</p>
              <Button type="button" onClick={() => updateSelectedMetrics({ lastUpdated: '2026-04-23' })}>
                Save Metrics
              </Button>
            </div>
          ) : null
        }
      >
        <div className="space-y-5">
          {/* Child selector */}
          <div>
            <label className="text-sm font-medium text-foreground">Select Child</label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="mt-2 h-12 rounded-2xl">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Child info badge */}
          <div className="rounded-[1.5rem] border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-foreground">{selectedChild?.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedChild?.ageLabel} · {selectedChild?.gender} · Parent: {selectedChild?.parentName}
                </p>
              </div>
              <Badge variant="outline" className={cn('rounded-full px-3 py-1', getMetricStatusClass(selectedMetrics.nutritionStatus))}>
                {selectedMetrics.nutritionStatus}
              </Badge>
            </div>
          </div>

          {/* ─── Tabs ─── */}
          <Tabs.Root value={metricsTab} onValueChange={(v) => setMetricsTab(v as typeof metricsTab)}>
            <Tabs.List className="flex gap-1 rounded-2xl border border-border bg-muted/30 p-1">
              {[
                { value: 'intake' as const, label: 'Record Intake', icon: Scale },
                { value: 'history' as const, label: 'Growth History', icon: LineChartIcon },
                { value: 'insights' as const, label: 'AI Insights', icon: Sparkles },
              ].map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all',
                    metricsTab === tab.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <tab.icon size={13} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* ── Tab: Record Intake ── */}
            <Tabs.Content value="intake" className="mt-5 space-y-5">
              {/* Quick stat chips */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'BMI', value: bmi, icon: BarChart3 },
                  { label: 'MUAC', value: `${selectedMetrics.muac} cm`, icon: Ruler },
                  { label: 'Attendance', value: `${selectedMetrics.attendanceRate}%`, icon: CalendarCheck2 },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-[1.25rem] border border-border bg-card p-3">
                    <metric.icon size={14} className="text-primary" />
                    <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{metric.label}</p>
                    <p className="mt-0.5 text-lg font-bold text-foreground">{metric.value}</p>
                  </div>
                ))}
              </div>

              {/* Form fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Weight (kg)</label>
                  <div className="relative">
                    <Scale size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input type="number" step="0.1" className="pl-9" value={selectedMetrics.weight} onChange={(event) => updateSelectedMetrics({ weight: event.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Height (cm)</label>
                  <div className="relative">
                    <Ruler size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input type="number" step="0.1" className="pl-9" value={selectedMetrics.height} onChange={(event) => updateSelectedMetrics({ height: event.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">MUAC (cm)</label>
                  <Input type="number" step="0.1" value={selectedMetrics.muac} onChange={(event) => updateSelectedMetrics({ muac: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Learning Score (%)</label>
                  <Input type="number" value={selectedMetrics.learningScore} onChange={(event) => updateSelectedMetrics({ learningScore: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Attendance Rate (%)</label>
                  <Input type="number" value={selectedMetrics.attendanceRate} onChange={(event) => updateSelectedMetrics({ attendanceRate: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nutrition Status</label>
                  <Select value={selectedMetrics.nutritionStatus} onValueChange={(value: ChildMetrics['nutritionStatus']) => updateSelectedMetrics({ nutritionStatus: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Notes</label>
                  <textarea
                    value={selectedMetrics.notes}
                    onChange={(event) => updateSelectedMetrics({ notes: event.target.value })}
                    className="min-h-24 w-full rounded-2xl border border-input bg-transparent px-3 py-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </Tabs.Content>

            {/* ── Tab: Growth History ── */}
            <Tabs.Content value="history" className="mt-5 space-y-5">
              {childIntakeHistory.length === 0 ? (
                <div className="rounded-2xl border border-border bg-muted/20 py-12 text-center">
                  <History size={32} className="mx-auto text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">No monthly intake records found for this child.</p>
                </div>
              ) : (
                <>
                  {/* Growth chart */}
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                      <TrendingUp size={14} className="text-primary" />
                      Growth Trend (6 months)
                    </h4>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={childIntakeHistory}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
                          />
                          <YAxis
                            yAxisId="weight"
                            orientation="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                            domain={['dataMin - 1', 'dataMax + 1']}
                            unit="kg"
                          />
                          <YAxis
                            yAxisId="height"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                            domain={['dataMin - 2', 'dataMax + 2']}
                            unit="cm"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderRadius: '0.75rem',
                              border: '1px solid hsl(var(--border))',
                              fontSize: '12px',
                              fontWeight: 500,
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 600 }} />
                          <Line yAxisId="weight" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} />
                          <Line yAxisId="height" type="monotone" dataKey="height" name="Height (cm)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6' }} />
                          <Line yAxisId="weight" type="monotone" dataKey="muac" name="MUAC (cm)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2.5, fill: '#f59e0b' }} strokeDasharray="5 3" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Learning & Attendance mini chart */}
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                      <BarChart3 size={14} className="text-primary" />
                      Learning & Attendance Trend
                    </h4>
                    <div className="h-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={childIntakeHistory} barCategoryGap="18%">
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} unit="%" />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', fontSize: '12px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 600 }} />
                          <Bar dataKey="learningScore" name="Learning" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="attendanceRate" name="Attendance" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly cards */}
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-foreground">Monthly Records</h4>
                    <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                      {[...childIntakeHistory].reverse().map((intake) => {
                        const statusTone = intake.nutritionStatus === 'Normal' ? 'emerald' : intake.nutritionStatus === 'Moderate' ? 'amber' : 'red';
                        return (
                          <div key={intake.date} className="rounded-2xl border border-border bg-card p-3.5">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-foreground">{intake.month}</span>
                              <Badge variant="outline" className={cn('rounded-full px-2 py-0.5 text-[10px]', getMetricStatusClass(intake.nutritionStatus))}>
                                {intake.nutritionStatus}
                              </Badge>
                            </div>
                            <div className="mt-2.5 grid grid-cols-4 gap-2">
                              {[
                                { l: 'Weight', v: `${intake.weight}kg` },
                                { l: 'Height', v: `${intake.height}cm` },
                                { l: 'MUAC', v: `${intake.muac}cm` },
                                { l: 'BMI', v: `${intake.bmi}` },
                              ].map((d) => (
                                <div key={d.l} className="text-center">
                                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{d.l}</p>
                                  <p className="text-xs font-bold text-foreground">{d.v}</p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <div className="rounded-lg bg-violet-50 px-2 py-1 text-center dark:bg-violet-950/20">
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">Learning</p>
                                <p className="text-xs font-bold text-violet-700 dark:text-violet-300">{intake.learningScore}%</p>
                              </div>
                              <div className="rounded-lg bg-cyan-50 px-2 py-1 text-center dark:bg-cyan-950/20">
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Attendance</p>
                                <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">{intake.attendanceRate}%</p>
                              </div>
                            </div>
                            {intake.notes && (
                              <p className="mt-2 text-[11px] italic text-muted-foreground">"{intake.notes}"</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </Tabs.Content>

            {/* ── Tab: AI Insights ── */}
            <Tabs.Content value="insights" className="mt-5 space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 dark:bg-primary/10">
                <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Sparkles size={16} className="text-primary" />
                  Growth Analysis for {selectedChild?.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Based on {childIntakeHistory.length} monthly intake records from {childIntakeHistory[0]?.month ?? 'N/A'} to {childIntakeHistory[childIntakeHistory.length - 1]?.month ?? 'N/A'}.
                </p>
              </div>

              {childGrowthInsights.map((insight) => {
                const iconMap = {
                  positive: CheckCircle2,
                  warning: AlertTriangle,
                  critical: XCircle,
                  info: Info,
                };
                const colorMap = {
                  positive: 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
                  warning: 'border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20',
                  critical: 'border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/20',
                  info: 'border-sky-200 bg-sky-50/70 dark:border-sky-900 dark:bg-sky-950/20',
                };
                const iconColorMap = {
                  positive: 'text-emerald-600 dark:text-emerald-400',
                  warning: 'text-amber-600 dark:text-amber-400',
                  critical: 'text-red-600 dark:text-red-400',
                  info: 'text-sky-600 dark:text-sky-400',
                };
                const titleColorMap = {
                  positive: 'text-emerald-800 dark:text-emerald-300',
                  warning: 'text-amber-800 dark:text-amber-300',
                  critical: 'text-red-800 dark:text-red-300',
                  info: 'text-sky-800 dark:text-sky-300',
                };
                const Icon = iconMap[insight.type];
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn('rounded-2xl border p-4', colorMap[insight.type])}
                  >
                    <p className={cn('flex items-center gap-2 text-sm font-bold', titleColorMap[insight.type])}>
                      <Icon size={16} className={iconColorMap[insight.type]} />
                      {insight.title}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {insight.description}
                    </p>
                    {insight.metric && (
                      <span className="mt-2 inline-block rounded-md bg-background/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        {insight.metric}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </SideDrawer>
    </div>
  );
}
