// ============================================================
// SUPERVISOR AWC DETAIL - Drill down into a specific AWC
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { mockAWCs, mockChildren } from '../../data/mockData';
import { cn, simulateAPI, formatAge, formatRelativeTime } from '../../utils';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import type { AWC, Child } from '../../types';
import {
  ArrowLeft, Users, Utensils, BookOpen, Activity,
  Phone, MapPin, Wifi, WifiOff, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export function AWCDetail() {
  const { awcId } = useParams<{ awcId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [awc, setAwc] = useState<AWC | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const foundAWC = mockAWCs.find(a => a.id === awcId);
    // Mock: show all children for now
    simulateAPI({ awc: foundAWC, children: mockChildren }, 800).then(({ awc, children }) => {
      setAwc(awc || null);
      setChildren(children);
      setLoading(false);
    });
  }, [awcId]);

  if (loading) return <DashboardSkeleton />;
  if (!awc) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">{t('awc_detail.not_found')}</p>
      <button onClick={() => navigate('/supervisor')} className="mt-4 text-blue-600 hover:underline text-sm">
        ← {t('awc_detail.back')}
      </button>
    </div>
  );

  const nutritionChart = [
    { name: t('nutrition.normal'), count: awc.nutritionBreakdown.normal, fill: '#10b981' },
    { name: t('nutrition.mam'), count: awc.nutritionBreakdown.mam, fill: '#f59e0b' },
    { name: t('nutrition.sam'), count: awc.nutritionBreakdown.sam, fill: '#ef4444' },
  ];

  const getRiskLocal = (risk: string) => {
    switch (risk) {
      case 'Low': return t('risk.low');
      case 'Medium': return t('risk.medium');
      case 'High': return t('risk.high');
      default: return risk;
    }
  };

  const getNutritionLocal = (status: string) => {
    switch (status) {
      case 'Normal': return t('nutrition.normal');
      case 'MAM': return t('nutrition.mam');
      case 'SAM': return t('nutrition.sam');
      default: return status;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/supervisor')} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">{awc.name}</h2>
            <span className={cn(
              'px-2.5 py-1 rounded-full text-xs font-semibold',
              awc.status === 'Good' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' :
              awc.status === 'Warning' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' :
              'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
            )}>
              {awc.status === 'Good' ? t('status.good') : awc.status === 'Warning' ? t('status.warning') : t('status.critical')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1"><MapPin size={12} /> {awc.location}</span>
            <span className="flex items-center gap-1"><Phone size={12} /> {awc.workerName} · {awc.workerPhone}</span>
          </p>
        </div>
      </div>

      {/* Alerts */}
      {awc.alerts.length > 0 && (
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 flex items-center gap-2 mb-2">
            <AlertTriangle size={16} /> {t('awc_detail.active_alerts')}
          </h4>
          <ul className="space-y-1">
            {awc.alerts.map((alert, i) => (
              <li key={i} className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <Users size={18} className="mx-auto text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-foreground">{awc.presentToday}/{awc.totalChildren}</p>
          <p className="text-xs text-muted-foreground">{t('awc_detail.present_today')}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <BookOpen size={18} className="mx-auto text-indigo-600 mb-2" />
          <p className={cn('text-2xl font-bold', awc.avgLearningScore >= 70 ? 'text-emerald-600' : 'text-amber-600')}>{awc.avgLearningScore}%</p>
          <p className="text-xs text-muted-foreground">{t('awc_detail.avg_learning')}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <Activity size={18} className="mx-auto text-emerald-600 mb-2" />
          <p className={cn('text-2xl font-bold', awc.attendanceRate >= 85 ? 'text-emerald-600' : 'text-amber-600')}>{awc.attendanceRate}%</p>
          <p className="text-xs text-muted-foreground">{t('awc_detail.attendance_rate')}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <Utensils size={18} className="mx-auto text-red-600 mb-2" />
          <p className="text-2xl font-bold text-red-600">{awc.criticalCases}</p>
          <p className="text-xs text-muted-foreground">{t('awc_detail.critical_cases')}</p>
        </div>
      </div>

      {/* Nutrition Breakdown Chart */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t('awc_detail.nutrition_breakdown')}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={nutritionChart} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} width={80} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {nutritionChart.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Children List */}
      <div className="p-5 rounded-xl border border-border bg-card overflow-x-auto">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t('awc_detail.children_enrolled', { count: children.length })}</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">{t('awc_detail.table.name')}</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">{t('awc_detail.table.age')}</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">{t('awc_detail.table.learning')}</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">{t('awc_detail.table.nutrition')}</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">{t('awc_detail.table.attendance')}</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">{t('awc_detail.table.risk')}</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child) => (
              <tr key={child.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                <td className="py-2.5 px-3 font-medium text-foreground">{child.name}</td>
                <td className="py-2.5 px-3 text-center text-muted-foreground">{formatAge(child.ageMonths, t)}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={cn('font-semibold',
                    child.learningScore >= 70 ? 'text-emerald-600' : child.learningScore >= 40 ? 'text-amber-600' : 'text-red-600'
                  )}>{child.learningScore}%</span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold',
                    child.nutritionStatus === 'Normal' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' :
                    child.nutritionStatus === 'MAM' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' :
                    'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
                  )}>{getNutritionLocal(child.nutritionStatus)}</span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={cn('font-semibold',
                    child.attendanceRate >= 85 ? 'text-emerald-600' : child.attendanceRate >= 70 ? 'text-amber-600' : 'text-red-600'
                  )}>{child.attendanceRate}%</span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold',
                    child.riskFlags.combinedRisk === 'Low' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' :
                    child.riskFlags.combinedRisk === 'Medium' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' :
                    'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
                  )}>{getRiskLocal(child.riskFlags.combinedRisk)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
