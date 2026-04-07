import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowLeft, BadgeCheck, Brain, HeartPulse, MessageSquareHeart, Ruler, Scale, Sparkles } from 'lucide-react';
import { badgeAwards, childDevelopmentInsights, mealLogs, mockChildren, weeklyParentReports } from '../../data/mockData';
import { cn, formatAge, getGrowthStatus, getProgressStatus } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';

export function ChildProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const child = mockChildren.find((entry) => entry.id === childId) ?? null;

  const latestGrowth = child?.nutritionHistory.at(-1);
  const report = weeklyParentReports[childId as keyof typeof weeklyParentReports]?.at(0);
  const badges = badgeAwards.filter((entry) => entry.childId === childId);
  const insights = (childDevelopmentInsights[childId as keyof typeof childDevelopmentInsights] || []);
  const meals = mealLogs.filter((entry) => entry.childId === childId);

  const radarData = useMemo(() => {
    if (!child) return [];
    return [
      { domain: t('domain.cognitive'), score: child.domainScores.cognitive },
      { domain: t('domain.language'), score: child.domainScores.language },
      { domain: t('progress.attendance'), score: Math.min(100, child.attendanceRate + 4) },
      { domain: t('domain.social'), score: child.domainScores.socio_emotional },
      { domain: t('domain.creativity'), score: Math.min(100, child.learningScore + 5) },
    ];
  }, [child, t]);

  if (!child) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-muted-foreground">{t('common.no_results')}</p>
      </div>
    );
  }

  const rawGrowthStatus = getGrowthStatus(child.learningScore);
  const rawProgressStatus = getProgressStatus(child.learningScore);

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => navigate('/worker/children')} className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
          <ArrowLeft size={16} />
          {t('common.back')}
        </button>
        <button onClick={() => navigate('/worker/parents')} className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-colors">
          <MessageSquareHeart size={16} />
          {t('parents.btn_share')}
        </button>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.22),_transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.7))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.14),_transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.7))] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className={cn(
                'flex h-20 w-20 items-center justify-center rounded-[1.75rem] text-3xl font-bold text-white shadow-lg',
                child.gender === 'M'
                  ? 'bg-gradient-to-br from-sky-500 to-blue-600'
                  : 'bg-gradient-to-br from-amber-500 to-orange-500',
              )}>
                {child.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{t('dashboard.development.title')}</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{child.name}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatAge(child.ageMonths, t)} · {child.gender === 'M' ? t('status.boy') : t('status.girl')} · {child.parentName}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    rawGrowthStatus === 'common.healthy' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                    rawGrowthStatus === 'common.monitor' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                    rawGrowthStatus === 'common.needs_attention' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                  )}>
                    {t(rawGrowthStatus)}
                  </span>
                  <span className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    rawProgressStatus === 'common.on_track' && 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
                    rawProgressStatus === 'common.developing' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                    rawProgressStatus === 'common.needs_attention' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                  )}>
                    {t(rawProgressStatus)}
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{t(child.persona)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: t('common.height'), value: `${latestGrowth?.height ?? '-'} ${t('units.cm')}`, icon: Ruler },
                { label: t('common.weight'), value: `${latestGrowth?.weight ?? '-'} ${t('units.kg')}`, icon: Scale },
                { label: t('common.muac'), value: `${latestGrowth?.muac ?? '-'} ${t('units.mm')}`, icon: HeartPulse },
              ].map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <metric.icon size={16} />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">{metric.label}</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-foreground">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">{t('nutrition.chart.title')}</h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                { label: t('common.physical_growth'), value: child.learningScore, note: t('status.just_now') },
                { label: t('progress.attendance'), value: child.attendanceRate, note: t('status.just_now') },
                { label: t('learning.stats.assessment'), value: Math.round((child.learningScore + child.attendanceRate) / 2), note: t('status.just_now') },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <span className="text-sm font-bold text-foreground">{item.value}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-2 rounded-full',
                        item.value >= 75 && 'bg-emerald-500',
                        item.value >= 50 && item.value < 75 && 'bg-amber-500',
                        item.value < 50 && 'bg-red-500',
                      )}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{item.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={child.nutritionHistory}>
                  <defs>
                    <linearGradient id="childWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="weight" stroke="#22c55e" fill="url(#childWeight)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-sky-500" />
              <h2 className="text-xl font-semibold text-foreground">{t('dashboard.development.title')}</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {insights.map((insight) => (
                <div key={insight.id} className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">{t(insight.title)}</p>
                    <span className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold',
                      insight.severity === 'good' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                      insight.severity === 'average' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                      insight.severity === 'critical' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                    )}>
                      {t(`status.${insight.severity || 'good'}`)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{t(insight.detail)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">{t('dashboard.radar.title')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('dashboard.radar.desc')}</p>
            <div className="mt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="domain" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.28} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid gap-3">
              {radarData.map((domain) => (
                <div key={domain.domain} className="rounded-2xl border border-border bg-background/70 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{domain.domain}</span>
                    <span className="font-semibold text-foreground">{domain.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">{t('parents.title')}</h2>
            {report ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl border border-border bg-background/70 p-4">
                  <p className="text-sm font-semibold text-foreground">{t(report.week)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t(report.summary)}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background/70 p-4">
                  <p className="font-semibold text-foreground">{t('parents.report.home_activities')}</p>
                  <div className="mt-3 space-y-2">
                    {report.learningHighlights.map((highlight) => (
                      <div key={highlight} className="rounded-2xl bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
                        {t(highlight)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">{t('common.no_results')}</p>
            )}
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BadgeCheck size={18} className="text-amber-500" />
              <h2 className="text-xl font-semibold text-foreground">{t('dashboard.actions.badges')}</h2>
            </div>
            <div className="mt-4 space-y-3">
              {badges.map((badge) => (
                <div key={badge.id} className="rounded-3xl border border-border bg-background/70 p-4">
                  <p className="font-semibold text-foreground">{t(badge.title)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(badge.description)}</p>
                </div>
              ))}
              {meals.map((meal) => (
                <div key={meal.id} className="rounded-3xl border border-border bg-background/70 p-4">
                  <p className="font-semibold text-foreground">{t(meal.menu)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(meal.nutritionalContent)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
