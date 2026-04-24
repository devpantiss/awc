import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { mockBlocks, districtKPIs, mockInsights } from '../../data/mockData';
import { cn, simulateAPI, formatIndianNumber, formatRelativeTime } from '../../utils';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import {
  Building2, Users, TrendingUp, TrendingDown, AlertTriangle,
  Brain, CheckCircle2, AlertCircle, Info,
  ArrowRight, BarChart3, Activity, Target, Shield,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, LineChart, Line,
} from 'recharts';

export function AdminDashboard() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    simulateAPI(null, 1200).then(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const kpis = districtKPIs;

  // Chart data from blocks
  const blockChartData = mockBlocks.map((b: any) => ({
    name: b.name.length > 10 ? b.name.slice(0, 10) + '..' : b.name,
    learning: b.avgLearningScore,
    nutrition_risk: b.nutritionRiskPercent,
  }));

  const trendData = [
    { month: t('months.jan'), learning: 58, nutrition: 20 },
    { month: t('months.feb'), learning: 60, nutrition: 19 },
    { month: t('months.mar'), learning: 63, nutrition: 18 },
    { month: t('months.apr'), learning: 65, nutrition: 16 },
    { month: t('months.may'), learning: 68, nutrition: 15 },
    { month: t('months.jun'), learning: t('months.jun'), learningVal: 72, nutrition: 13 },
  ];

  // Fix: use learningVal if needed, keeping month as key
  const finalTrendData = [
    { month: t('months.jan'), learning: 58, nutrition: 20 },
    { month: t('months.feb'), learning: 60, nutrition: 19 },
    { month: t('months.mar'), learning: 63, nutrition: 18 },
    { month: t('months.apr'), learning: 65, nutrition: 16 },
    { month: t('months.may'), learning: 68, nutrition: 15 },
    { month: t('months.jun'), learning: 72, nutrition: 13 },
  ];

  const getPerformanceLabel = (perf: string) => {
    switch (perf) {
      case 'Good': return t('status.good');
      case 'Average': return t('status.average');
      case 'Poor': return t('status.poor');
      default: return perf;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield size={24} className="text-purple-600 dark:text-purple-400" />
            {t('district.dashboard_title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{t('district.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 text-xs font-medium">
          <Brain size={14} /> {t('district.ai_analytics')}
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: t('district.kpi.total_awcs'), value: formatIndianNumber(kpis.totalAWCs), icon: Building2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { label: t('district.kpi.total_children'), value: formatIndianNumber(kpis.totalChildren), icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
          { label: t('district.kpi.learning_improvement'), value: `+${kpis.learningImprovement}%`, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', sub: t('district.kpi.sub_improvement') },
          { label: t('district.kpi.malnutrition_reduction'), value: `-${kpis.malnutritionReduction}%`, icon: TrendingDown, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', sub: t('district.kpi.sub_reduction') },
          { label: t('district.kpi.avg_attendance'), value: `${kpis.avgAttendance}%`, icon: Activity, color: kpis.avgAttendance >= 85 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400', bg: kpis.avgAttendance >= 85 ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-amber-50 dark:bg-amber-950/40' },
          { label: t('district.kpi.active_alerts'), value: kpis.activeAlerts.toString(), icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className="p-4 rounded-xl border border-border bg-card card-hover animate-fade-in-up opacity-0"
            style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', kpi.bg)}>
                <kpi.icon size={16} className={kpi.color} />
              </div>
            </div>
            <div className={cn('text-xl font-bold', kpi.color)}>{kpi.value}</div>
            {'sub' in kpi && kpi.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-600" />
            {t('district.chart.block_performance')}
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={blockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="learning" fill="#3b82f6" name={t('district.chart.avg_learning')} radius={[3, 3, 0, 0]} />
              <Bar dataKey="nutrition_risk" fill="#ef4444" name={t('district.chart.nutrition_risk')} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Line */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600" />
            {t('district.chart.trend_6months')}
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={finalTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="learning" stroke="#3b82f6" strokeWidth={2} name={t('progress.learning')} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="nutrition" stroke="#ef4444" strokeWidth={2} name={t('district.chart.nutrition_risk')} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap View */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target size={16} className="text-purple-600" />
          {t('district.heatmap.title')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mockBlocks.map((block: any, i: number) => (
            <div
              key={block.id}
              className={cn(
                'p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md cursor-pointer animate-fade-in-up opacity-0',
                block.performance === 'Good'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : block.performance === 'Average'
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                  : 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800'
              )}
              style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'forwards' }}
            >
              <h4 className="font-semibold text-foreground text-sm mb-2">{block.name}</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t('district.heatmap.awcs')}</span>
                  <span className="font-semibold text-foreground">{block.totalAWCs}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t('district.heatmap.children')}</span>
                  <span className="font-semibold text-foreground">{formatIndianNumber(block.totalChildren)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t('district.heatmap.learning')}</span>
                  <span className={cn('font-semibold', block.avgLearningScore >= 65 ? 'text-emerald-600' : block.avgLearningScore >= 50 ? 'text-amber-600' : 'text-red-600')}>
                    {block.avgLearningScore}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t('district.heatmap.nutrition_risk')}</span>
                  <span className={cn('font-semibold', block.nutritionRiskPercent <= 15 ? 'text-emerald-600' : block.nutritionRiskPercent <= 25 ? 'text-amber-600' : 'text-red-600')}>
                    {block.nutritionRiskPercent}%
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <span className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                  block.performance === 'Good' ? 'bg-emerald-200 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300' :
                  block.performance === 'Average' ? 'bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' :
                  'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                )}>
                  {getPerformanceLabel(block.performance)}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">{t('district.heatmap.performance_legend')}</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded bg-emerald-400" /> {t('status.good')}</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded bg-amber-400" /> {t('status.average')}</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded bg-red-400" /> {t('status.poor')}</span>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain size={16} className="text-purple-600" />
          {t('district.insights.title')}
        </h3>
        <div className="space-y-4">
          {mockInsights.map((insight: any, i: number) => {
            const getIcon = () => {
              switch (insight.type) {
                case 'critical': return <AlertCircle size={20} className="text-red-600 dark:text-red-400" />;
                case 'warning': return <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />;
                case 'success': return <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />;
                default: return <Info size={20} className="text-blue-600 dark:text-blue-400" />;
              }
            };
            const getBg = () => {
              switch (insight.type) {
                case 'critical': return 'bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900';
                case 'warning': return 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900';
                case 'success': return 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900';
                default: return 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900';
              }
            };

            return (
              <div
                key={insight.id}
                className={cn('p-4 rounded-xl border transition-all hover:shadow-sm animate-fade-in opacity-0', getBg())}
                style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon()}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-foreground text-sm">{t(insight.title as any)}</h4>
                      {insight.blockName && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                          {insight.blockName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t(insight.message as any)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(insight.timestamp, t)}</span>
                      {insight.actionRequired && (
                        <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                          {t('district.insights.take_action')} <ArrowRight size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
