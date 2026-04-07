import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  BookOpen,
  Download,
  HeartPulse,
  MessageSquareHeart,
  Sparkles,
  Stars,
  TrendingUp,
  Users,
  PieChart as PieIcon,
  CalendarCheck2,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  mockBadgeAwards,
  learningJourneyByTheme,
  mockMealLogs,
  mockChildren,
  offlineContentPacks,
  mockWeeklyParentReports,
} from '../../data/mockData';
import { average, cn } from '../../utils';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { AttendanceScannerModal } from './AttendanceScannerModal';

export function WorkerDashboard() {
  const navigate = useNavigate();
  const { isOnline } = useAppStore();
  const { t } = useTranslation();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const todayActivities = learningJourneyByTheme['data.theme.family'];
  const totalStars = todayActivities.reduce((sum, activity) => sum + activity.stars, 0);
  const completedActivities = todayActivities.filter((activity) => activity.completed).length;
  
  const activeAlerts = mockChildren.filter((child) => child.nutritionStatus !== 'status.normal' || child.riskFlags.combinedRisk === 'High').length;
  const avgAttendance = average(mockChildren.map((child) => child.attendanceRate));
  const avgLearning = average(mockChildren.map((child) => child.learningScore));
  const mealsServed = mockMealLogs.filter((meal: any) => meal.status === 'Served' || meal.portionCount > 0).length;
  const parentUpdates = Object.values(mockWeeklyParentReports).reduce((sum: number, reports: any) => sum + reports.length, 0);

  // Aggregate Data for Charts
  const attendanceTrendData = [
    { name: 'Mon', rate: 82 },
    { name: 'Tue', rate: 88 },
    { name: 'Wed', rate: 85 },
    { name: 'Thu', rate: avgAttendance },
    { name: 'Fri', rate: 91 },
  ];

  const nutritionData = [
    { name: t('status.normal'), value: mockChildren.filter(c => c.nutritionStatus === 'status.normal').length, color: '#10b981' },
    { name: t('status.mam'), value: mockChildren.filter(c => c.nutritionStatus === 'status.mam').length, color: '#f59e0b' },
    { name: t('status.sam'), value: mockChildren.filter(c => c.nutritionStatus === 'status.sam').length, color: '#ef4444' },
  ];

  const handleAttendanceConfirm = (results: Record<string, boolean>) => {
    console.log('Attendance submitted:', results);
    // In a real app, we would sync this to the backend.
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.24),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.7))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.72))] p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Sparkles size={14} />
                {t('dashboard.hero.badge')}
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t('dashboard.hero.title')}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                {t('dashboard.hero.desc')}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowAttendanceModal(true)} 
                  className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CalendarCheck2 size={18} />
                  {t('dashboard.actions.mark_attendance')}
                </button>
                <button onClick={() => navigate('/worker/learning')} className="rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
                  {t('dashboard.hero.btn_learning')}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:w-[30rem]">
              {[
                { label: t('dashboard.stats.current_theme'), value: t('data.theme.family'), meta: t('dashboard.stats.theme_meta') },
                { label: t('dashboard.stats.sync_status'), value: isOnline ? t('dashboard.stats.online') : t('dashboard.stats.offline'), meta: isOnline ? t('dashboard.stats.sync_ready') : t('dashboard.stats.sync_queue') },
                { label: t('dashboard.stats.stars_earned'), value: `${totalStars} ⭐`, meta: t('dashboard.stats.activities_meta', { completed: completedActivities }) },
                { label: t('dashboard.stats.offline_packs'), value: `${offlineContentPacks.filter((pack) => pack.downloaded).length}`, meta: t('dashboard.stats.offline_meta') },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/50">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                  <p className="mt-3 text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t('dashboard.stats.enrolled'), value: mockChildren.length, icon: Users, tone: 'sky' },
          { label: t('dashboard.stats.avg_learning'), value: `${avgLearning}%`, icon: BookOpen, tone: 'emerald' },
          { label: t('dashboard.stats.attendance'), value: `${avgAttendance}%`, icon: Activity, tone: 'amber' },
          { label: t('dashboard.stats.nutrition_alerts'), value: activeAlerts, icon: HeartPulse, tone: 'red' },
        ].map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{card.label}</p>
                <p className="mt-3 text-4xl font-bold tracking-tight text-foreground">{card.value}</p>
              </div>
              <div className={cn(
                'flex h-12 w-12 items-center justify-center rounded-2xl',
                card.tone === 'sky' && 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
                card.tone === 'emerald' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                card.tone === 'amber' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                card.tone === 'red' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
              )}>
                <card.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Aggregate Charts & Insights */}
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column: Learning & Attendance Trends */}
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{t('dashboard.charts.attendance_trend')}</h3>
                <p className="text-sm text-muted-foreground mt-2">{t('dashboard.charts.attendance_desc')}</p>
              </div>
              <Activity className="text-amber-500" size={24} />
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '1rem', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{t('dashboard.charts.nutrition_distribution')}</h3>
                <p className="text-sm text-muted-foreground mt-2">{t('dashboard.charts.nutrition_desc')}</p>
              </div>
              <PieIcon className="text-emerald-500" size={24} />
            </div>
            <div className="grid md:grid-cols-2 items-center">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nutritionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {nutritionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {nutritionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-background/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value} {t('children.subtitle')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights & Quick Actions */}
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles size={120} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Stars className="text-primary" size={20} />
              {t('dashboard.insights.center_alerts')}
            </h3>
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {t('insights.attendance_warning', { count: 3 })}
                </p>
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                   {t('dashboard.insights.attendance_drop_msg')}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                <p className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
                  <Activity size={16} />
                  {t('insights.sam_critical', { count: 1 })}
                </p>
                <p className="mt-2 text-xs text-red-700 dark:text-red-400">
                  {t('dashboard.insights.sam_critical_msg')}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Learning Growth Success!
                </p>
                <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
                  92% of the center has completed this month\'s "Family" theme modules.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">{t('dashboard.actions.title')}</h3>
            <div className="grid gap-3">
              {[
                { label: t('dashboard.actions.notifications', { count: parentUpdates }), icon: MessageSquareHeart, action: '/worker/parents' },
                { label: t('dashboard.actions.meals', { count: mealsServed }), icon: HeartPulse, action: '/worker/nutrition' },
                { label: t('dashboard.actions.badges', { count: mockBadgeAwards.length }), icon: Stars, action: '/worker/children' },
                { label: t('dashboard.actions.download'), icon: Download, action: '/worker/nutrition' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.action)}
                  className="flex items-center justify-between rounded-[1.25rem] border border-border bg-background/50 px-4 py-4 text-left hover:bg-accent transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
                      <item.icon size={18} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{item.label}</span>
                  </div>
                  <TrendingUp size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Attendance */}
      <AttendanceScannerModal 
        open={showAttendanceModal} 
        onClose={() => setShowAttendanceModal(false)} 
        childrenList={mockChildren}
        onConfirm={handleAttendanceConfirm}
      />
    </div>
  );
}
