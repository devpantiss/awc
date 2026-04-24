// ============================================================
// SUPERVISOR DASHBOARD
// Block-level overview with metrics, charts, and AWC table
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAWCs, mockChildren } from '../../data/mockData';
import { cn, simulateAPI, formatIndianNumber } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import {
  Users, TrendingUp, AlertTriangle, Building2, BarChart3,
  ChevronRight, Activity, Utensils, Syringe, Apple, Wifi, WifiOff,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export function SupervisorDashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    simulateAPI(null, 1000).then(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  // Calculate block-level metrics
  const totalChildren = mockAWCs.reduce((a, awc) => a + awc.totalChildren, 0);
  const totalPresent = mockAWCs.reduce((a, awc) => a + awc.presentToday, 0);
  const totalCritical = mockAWCs.reduce((a, awc) => a + awc.criticalCases, 0);
  const avgLearning = Math.round(mockAWCs.reduce((a, awc) => a + awc.avgLearningScore, 0) / mockAWCs.length);

  const nutritionTotal = mockAWCs.reduce((a, awc) => ({
    normal: a.normal + awc.nutritionBreakdown.normal,
    mam: a.mam + awc.nutritionBreakdown.mam,
    sam: a.sam + awc.nutritionBreakdown.sam,
  }), { normal: 0, mam: 0, sam: 0 });
  const nutritionRiskPercent = Math.round(((nutritionTotal.mam + nutritionTotal.sam) / totalChildren) * 100);

  // Chart data
  const centerWiseData = mockAWCs.map(awc => {
    const seed = awc.name.charCodeAt(0) + awc.name.charCodeAt(awc.name.length-1);
    const thrCoverage = Math.floor((seed % 30) + 70);
    const mddScore = parseFloat(((seed % 20) / 10 + 3).toFixed(1));
    const immCoverage = Math.floor((seed % 25) + 75);

    return {
      name: awc.name.replace('AWC ', ''),
      learning: awc.avgLearningScore,
      attendance: awc.attendanceRate,
      thrCoverage,
      mddScore,
      immCoverage,
    };
  });

  const pieChartData = [
    { name: t('nutrition.normal'), value: nutritionTotal.normal },
    { name: t('nutrition.mam'), value: nutritionTotal.mam },
    { name: t('nutrition.sam'), value: nutritionTotal.sam },
  ];

  const kpis = [
    { 
      label: t('supervisor.kpi.total_children'), 
      value: formatIndianNumber(totalChildren), 
      icon: Users, 
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-50 dark:bg-blue-950/40', 
      sub: t('supervisor.kpi.present_today', { count: totalPresent }) 
    },
    { 
      label: t('supervisor.kpi.nutrition_risk'), 
      value: `${nutritionRiskPercent}%`, 
      icon: Utensils, 
      color: nutritionRiskPercent > 20 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400', 
      bg: nutritionRiskPercent > 20 ? 'bg-red-50 dark:bg-red-950/40' : 'bg-amber-50 dark:bg-amber-950/40', 
      sub: t('supervisor.kpi.nutrition_sub', { sam: nutritionTotal.sam, mam: nutritionTotal.mam }) 
    },
    { 
      label: t('supervisor.kpi.avg_learning'), 
      value: `${avgLearning}%`, 
      icon: TrendingUp, 
      color: avgLearning >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400', 
      bg: avgLearning >= 70 ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-amber-50 dark:bg-amber-950/40' 
    },
    { 
      label: t('supervisor.kpi.critical_cases'), 
      value: totalCritical.toString(), 
      icon: AlertTriangle, 
      color: totalCritical > 3 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400', 
      bg: totalCritical > 3 ? 'bg-red-50 dark:bg-red-950/40' : 'bg-amber-50 dark:bg-amber-950/40' 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">{t('supervisor.dashboard_title')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('supervisor.block_overview')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className="p-5 rounded-xl border border-border bg-card card-hover animate-fade-in-up opacity-0"
            style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', kpi.bg)}>
                <kpi.icon size={18} className={kpi.color} />
              </div>
            </div>
            <div className={cn('text-2xl font-bold', kpi.color)}>{kpi.value}</div>
            {'sub' in kpi && kpi.sub && <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - AWC-wise Performance */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-600" />
            {t('supervisor.chart.awc_performance')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={centerWiseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="learning" fill="#3b82f6" name={t('supervisor.chart.learning')} radius={[3, 3, 0, 0]} />
              <Bar dataKey="attendance" fill="#10b981" name={t('supervisor.chart.attendance')} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Nutrition Categories */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Utensils size={16} className="text-amber-600" />
            {t('supervisor.chart.nutrition_categories')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {pieChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts Row for detailed center-wise aspects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Immunization Coverage Bar Chart */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Syringe size={16} className="text-emerald-600" />
            Centre-wise Immunization Coverage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={centerWiseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="immCoverage" fill="#14b8a6" name="Immunization Coverage (%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* THR Coverage Bar Chart */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Apple size={16} className="text-rose-500" />
            Centre-wise THR Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={centerWiseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="thrCoverage" fill="#f43f5e" name="THR Coverage (%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AWC List Table */}
      <div className="p-5 rounded-xl border border-border bg-card overflow-hidden">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 size={16} className="text-indigo-600" />
          {t('supervisor.table.title')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.centre_name')}</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.worker')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.status')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.children')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.learning')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.attendance')}</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.alerts')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {mockAWCs.map((awc, i) => (
                <tr
                  key={awc.id}
                  className="border-b border-border/50 hover:bg-accent/50 transition-colors cursor-pointer animate-fade-in opacity-0"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
                  onClick={() => navigate(`/supervisor/awc/${awc.id}`)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full',
                        awc.status === 'Good' ? 'bg-emerald-500' : awc.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'
                      )} />
                      <span className="font-medium text-foreground">{awc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{awc.workerName}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold',
                      awc.status === 'Good' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' :
                      awc.status === 'Warning' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' :
                      'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
                    )}>
                      {awc.status === 'Good' ? t('status.good') : awc.status === 'Warning' ? t('status.warning') : t('status.critical')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-foreground font-medium">{awc.presentToday}/{awc.totalChildren}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn('font-semibold',
                      awc.avgLearningScore >= 70 ? 'text-emerald-600' : awc.avgLearningScore >= 50 ? 'text-amber-600' : 'text-red-600'
                    )}>{awc.avgLearningScore}%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn('font-semibold',
                      awc.attendanceRate >= 85 ? 'text-emerald-600' : awc.attendanceRate >= 70 ? 'text-amber-600' : 'text-red-600'
                    )}>{awc.attendanceRate}%</span>
                  </td>
                  <td className="py-3 px-4">
                    {awc.alerts.length > 0 ? (
                      <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        {t('supervisor.table.alerts_count', { count: awc.alerts.length })}
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-600">{t('supervisor.table.all_clear')}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

