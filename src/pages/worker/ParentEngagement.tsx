import { BellRing, HeartHandshake, Home, Share2 } from 'lucide-react';
import { mockChildren, mockWeeklyParentReports } from '../../data/mockData';
import { cn } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import type { WeeklyParentReport } from '../../types';

export function ParentEngagement() {
  const { t } = useTranslation();
  const reports: WeeklyParentReport[] = Object.values(mockWeeklyParentReports).flat();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('parents.title')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('parents.subtitle')}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-colors">
          <Share2 size={16} />
          {t('parents.btn_share')}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: t('parents.stats.families'), value: `${reports.length}/${mockChildren.length}`, icon: HeartHandshake, tone: 'emerald' },
          { label: t('parents.stats.notifications'), value: reports.reduce((sum: number, report) => sum + (report.notifications?.length || 0), 0), icon: BellRing, tone: 'amber' },
          { label: t('parents.stats.home_activities'), value: reports.reduce((sum: number, report) => sum + (report.homeActivities?.length || 0), 0), icon: Home, tone: 'sky' },
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
                item.tone === 'sky' && 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
              )}>
                <item.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {reports.map((report) => {
          const child = mockChildren.find((entry) => entry.id === report.childId);

          return (
            <section key={report.id || Math.random()} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{child?.name ?? t('parents.report.child_report')}</h3>
                  <p className="text-sm text-muted-foreground">{report.weekLabel}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {t('parents.report.shareable')}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">{report.summary}</p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {report.progress && Object.entries(report.progress).map(([key, val]) => {
                  const value = val as number;
                  const progressKey = `progress.${key.toLowerCase()}`;
                  return (
                    <div key={key} className="rounded-2xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t(progressKey)}</p>
                      <div className="mt-3 h-2 rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-2 rounded-full',
                            value >= 80 && 'bg-emerald-500',
                            value >= 55 && value < 80 && 'bg-amber-500',
                            value < 55 && 'bg-red-500',
                          )}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <p className="mt-2 text-lg font-bold text-foreground">{value}%</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <h4 className="font-semibold text-foreground">{t('parents.report.skills_learned')}</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {report.skillsLearned?.map((skill: string) => (
                      <span key={skill} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <h4 className="font-semibold text-foreground">{t('parents.report.areas_improve')}</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {report.areasToImprove?.map((area: string) => (
                      <span key={area} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-border bg-background/70 p-4">
                <h4 className="font-semibold text-foreground">{t('parents.report.home_activities')}</h4>
                <div className="mt-3 space-y-2">
                  {report.homeActivities?.map((activity: string) => (
                    <div key={activity} className="rounded-xl bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
                      {activity}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-border bg-background/70 p-4">
                <h4 className="font-semibold text-foreground">{t('parents.report.notifications')}</h4>
                <div className="mt-3 space-y-2">
                  {report.notifications?.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 rounded-xl bg-card px-3 py-3 shadow-sm">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                        <BellRing size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

