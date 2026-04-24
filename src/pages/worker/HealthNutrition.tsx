import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, Download, HeartPulse, Soup, WifiOff } from 'lucide-react';
import { mockMealLogs, mockChildren, offlineContentPacks } from '../../data/mockData';
import { average, cn, formatRelativeTime, getGrowthStatus } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import type { OfflineContentPack } from '../../types';

const themeToKey = {
  'My World': 'theme.world',
  'Body & Health': 'theme.body',
  'Family': 'theme.family',
  'Animals': 'theme.animals',
  'Seasons': 'theme.seasons',
  'Community Helpers': 'theme.helpers',
};

export function HealthNutrition() {
  const { t } = useTranslation();
  
  const chartData = useMemo(() => {
    const months = mockChildren[0]?.nutritionHistory ?? [];
    return months.map((entry) => ({
      month: new Date(entry.date).toLocaleDateString(t('locale') === 'od' ? 'or-IN' : 'en-IN', { month: 'short' }),
      weight: average(mockChildren.map((child) => child.nutritionHistory.find((item) => item.date === entry.date)?.weight ?? 0)),
      height: average(mockChildren.map((child) => child.nutritionHistory.find((item) => item.date === entry.date)?.height ?? 0)),
    }));
  }, [t]);

  const missedMeals = mockMealLogs.filter((meal) => meal.status === 'Missed').length;
  const underweightChildren = mockChildren.filter((child) => child.nutritionStatus !== 'Normal').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('nutrition.title')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('nutrition.subtitle')}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
          <Download size={16} />
          {t('nutrition.btn_download')}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: t('nutrition.stats.meals'), value: mockMealLogs.length, icon: Soup, tone: 'emerald' },
          { label: t('nutrition.stats.underweight'), value: underweightChildren, icon: AlertTriangle, tone: 'amber' },
          { label: t('nutrition.stats.missed'), value: missedMeals, icon: HeartPulse, tone: 'red' },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                <p className="mt-3 text-4xl font-bold text-foreground">{item.value}</p>
              </div>
              <div className={cn(
                'flex h-12 w-12 items-center justify-center rounded-2xl',
                item.tone === 'emerald' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                item.tone === 'amber' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                item.tone === 'red' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
              )}>
                <item.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">{t('nutrition.chart.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('nutrition.chart.desc')}</p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="heightFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="weight" stroke="#22c55e" fill="url(#weightFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="height" stroke="#38bdf8" fill="url(#heightFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">{t('nutrition.alerts.title')}</h3>
            <div className="mt-4 space-y-3">
              {mockChildren
                .filter((child) => child.nutritionStatus !== 'Normal' || child.riskFlags.nutritionRisk !== 'Low')
                .slice(0, 4)
                .map((child) => {
                  const statusKey = getGrowthStatus((child.nutritionHistory.at(-1)?.muac ?? 120) - 40);
                  return (
                    <div key={child.id} className="rounded-2xl border border-border bg-background/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{child.name}</p>
                          <p className="text-xs text-muted-foreground">{child.nutritionAlert ? t('nutrition.alerts.desc') : t('nutrition.alerts.desc')}</p>
                        </div>
                        <span className={cn(
                          'rounded-full px-3 py-1 text-xs font-semibold',
                          statusKey === 'common.healthy' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                          statusKey === 'common.monitor' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                          statusKey === 'common.needs_attention' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                        )}>
                          {t(statusKey)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <WifiOff size={18} className="text-sky-500" />
              <h3 className="text-lg font-semibold text-foreground">{t('nutrition.offline.title')}</h3>
            </div>
            <div className="mt-4 space-y-3">
              {offlineContentPacks.map((pack: OfflineContentPack) => (
                <div key={pack.id} className="flex items-center justify-between rounded-2xl border border-border bg-background/70 p-4">
                  <div>
                    <p className="font-semibold text-foreground">{t(themeToKey[pack.theme as keyof typeof themeToKey] || 'theme.world')}</p>
                    <p className="text-xs text-muted-foreground">
                      {pack.weekLabel} · {t('nutrition.offline.items', { count: pack.itemCount ?? 0 })}
                    </p>
                  </div>
                  <span className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    pack.downloaded
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  )}>
                    {pack.downloaded ? t('nutrition.offline.synced', { time: formatRelativeTime(pack.lastUpdated || '', t) }) : t('nutrition.offline.ready')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

