import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Baby,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Footprints,
  Hand,
  Languages,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { managedChildren, developmentByChild, getDevelopmentCompletion, type DevelopmentChecklist } from '../../data/childMonitoringData';
import { Progress } from '../../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../utils';

type DomainKey = 'grossMotor' | 'fineMotor' | 'language' | 'social';

const domainConfig: Record<DomainKey, { title: string; icon: typeof Footprints; color: string; bgLight: string; bgDark: string }> = {
  grossMotor: {
    title: 'Gross Motor',
    icon: Footprints,
    color: 'text-sky-600 dark:text-sky-400',
    bgLight: 'bg-sky-100 dark:bg-sky-950/40',
    bgDark: 'bg-sky-500',
  },
  fineMotor: {
    title: 'Fine Motor',
    icon: Hand,
    color: 'text-violet-600 dark:text-violet-400',
    bgLight: 'bg-violet-100 dark:bg-violet-950/40',
    bgDark: 'bg-violet-500',
  },
  language: {
    title: 'Language',
    icon: Languages,
    color: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-100 dark:bg-amber-950/40',
    bgDark: 'bg-amber-500',
  },
  social: {
    title: 'Social',
    icon: Smile,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-100 dark:bg-emerald-950/40',
    bgDark: 'bg-emerald-500',
  },
};

function getDomainProgress(items: { label: string; done: boolean }[]) {
  if (items.length === 0) return 0;
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}

function getOverallTier(progress: number): { label: string; tone: string } {
  if (progress >= 90) return { label: 'On Track', tone: 'emerald' };
  if (progress >= 70) return { label: 'Progressing', tone: 'sky' };
  if (progress >= 50) return { label: 'Needs Support', tone: 'amber' };
  return { label: 'At Risk', tone: 'red' };
}

export function Development() {
  const [selectedChildId, setSelectedChildId] = useState(managedChildren[0].id);
  const checklist = useMemo(() => developmentByChild[selectedChildId], [selectedChildId]);
  const progress = getDevelopmentCompletion(checklist);
  const selectedChild = managedChildren.find((c) => c.id === selectedChildId)!;
  const tier = getOverallTier(progress);

  const domains: { key: DomainKey; items: { label: string; done: boolean }[] }[] = [
    { key: 'grossMotor', items: checklist.grossMotor },
    { key: 'fineMotor', items: checklist.fineMotor },
    { key: 'language', items: checklist.language },
    { key: 'social', items: checklist.social },
  ];

  // Summary across all children
  const allChildrenSummary = useMemo(() => {
    return managedChildren.map((child) => {
      const cl = developmentByChild[child.id];
      const pct = getDevelopmentCompletion(cl);
      const t = getOverallTier(pct);
      return { ...child, progress: pct, tier: t };
    }).sort((a, b) => a.progress - b.progress);
  }, []);

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Hero header */}
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.18),_transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,255,255,0.72))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.14),_transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.72))] p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                <BrainCircuit size={14} />
                Developmental Milestones
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Development Tracker</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Monitor and track developmental milestones across four key domains — Gross Motor, Fine Motor, Language, and Social skills. Based on NEP 2020 Early Childhood Development guidelines.
              </p>
            </div>
            <div className="w-full max-w-xs">
              <label className="text-xs font-semibold text-muted-foreground">Select Child</label>
              <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                <SelectTrigger className="mt-2 h-12 rounded-2xl">
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  {managedChildren.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Child profile + Overall progress */}
      <section className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                <Baby size={28} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{selectedChild.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedChild.ageLabel} · {selectedChild.gender} · Parent: {selectedChild.parentName}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={cn(
              'rounded-full px-3 py-1.5 text-xs font-bold',
              tier.tone === 'emerald' && 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300',
              tier.tone === 'sky' && 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-300',
              tier.tone === 'amber' && 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300',
              tier.tone === 'red' && 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300',
            )}>
              {tier.label}
            </Badge>
          </div>

          {/* Domain progress bars */}
          <div className="mt-6 space-y-4">
            {domains.map(({ key, items }) => {
              const config = domainConfig[key];
              const domainPct = getDomainProgress(items);
              const Icon = config.icon;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={config.color} />
                      <span className="text-sm font-semibold text-foreground">{config.title}</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      {items.filter((i) => i.done).length}/{items.length} · {domainPct}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted/40">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${domainPct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={cn('h-full rounded-full', config.bgDark)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall progress card */}
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-[1.1rem] bg-violet-100 p-3 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
              <Target size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Overall Progress</p>
              <p className="text-4xl font-bold text-foreground">{progress}%</p>
            </div>
          </div>
          <div className="mt-5">
            <Progress value={progress} className="h-4 bg-violet-100 dark:bg-violet-950/40" />
            <p className="mt-3 text-xs text-muted-foreground">
              Milestone completion across motor, language, and social domains.
            </p>
          </div>

          {/* Quick stats */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50/80 p-3 text-center dark:bg-emerald-950/15">
              <CheckCircle2 size={16} className="mx-auto text-emerald-600 dark:text-emerald-400" />
              <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {domains.reduce((s, d) => s + d.items.filter((i) => i.done).length, 0)}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80">Achieved</p>
            </div>
            <div className="rounded-xl bg-amber-50/80 p-3 text-center dark:bg-amber-950/15">
              <TrendingUp size={16} className="mx-auto text-amber-600 dark:text-amber-400" />
              <p className="mt-1 text-lg font-bold text-amber-700 dark:text-amber-300">
                {domains.reduce((s, d) => s + d.items.filter((i) => !i.done).length, 0)}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-600/80 dark:text-amber-400/80">Remaining</p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestone checklist — visual cards */}
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          <h3 className="text-xl font-bold text-foreground">Milestone Checklist</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Tap checkboxes to mark milestones as achieved.</p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {domains.map(({ key, items }, domainIndex) => {
            const config = domainConfig[key];
            const Icon = config.icon;
            const domainPct = getDomainProgress(items);

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: domainIndex * 0.08 }}
                className="rounded-[1.75rem] border border-border bg-background/60 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn('rounded-xl p-2', config.bgLight)}>
                      <Icon size={18} className={config.color} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{config.title}</p>
                      <p className="text-[10px] text-muted-foreground">{items.filter((i) => i.done).length} of {items.length} milestones</p>
                    </div>
                  </div>
                  <span className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-bold',
                    domainPct === 100
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : domainPct >= 50
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                  )}>
                    {domainPct}%
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all',
                        item.done
                          ? 'border-emerald-200/60 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/10'
                          : 'border-border bg-card hover:bg-accent/50'
                      )}
                    >
                      {item.done ? (
                        <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                      ) : (
                        <XCircle size={16} className="shrink-0 text-muted-foreground/30" />
                      )}
                      <span className={cn(
                        'text-sm',
                        item.done ? 'font-medium text-foreground' : 'text-muted-foreground'
                      )}>
                        {item.label}
                      </span>
                      {item.done && (
                        <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Done</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Class-wide comparison */}
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground">Class-Wide Development Overview</h3>
        <p className="mt-1 text-sm text-muted-foreground">Compare milestone completion across all children.</p>

        <div className="mt-5 space-y-2">
          {allChildrenSummary.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3 transition-all',
                child.id === selectedChildId
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-background/50 hover:bg-accent/30 cursor-pointer'
              )}
              onClick={() => setSelectedChildId(child.id)}
            >
              <div className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                child.tier.tone === 'emerald' && 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
                child.tier.tone === 'sky' && 'bg-sky-200 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200',
                child.tier.tone === 'amber' && 'bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
                child.tier.tone === 'red' && 'bg-red-200 text-red-800 dark:bg-red-900/60 dark:text-red-200',
              )}>
                {child.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-semibold text-foreground">{child.name}</p>
                  <span className="shrink-0 text-xs font-bold text-muted-foreground">{child.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted/40">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${child.progress}%` }}
                    transition={{ duration: 0.6, delay: index * 0.06 }}
                    className={cn(
                      'h-full rounded-full',
                      child.tier.tone === 'emerald' && 'bg-emerald-500',
                      child.tier.tone === 'sky' && 'bg-sky-500',
                      child.tier.tone === 'amber' && 'bg-amber-500',
                      child.tier.tone === 'red' && 'bg-red-500',
                    )}
                  />
                </div>
              </div>
              <Badge variant="outline" className={cn(
                'hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline-flex',
                child.tier.tone === 'emerald' && 'border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300',
                child.tier.tone === 'sky' && 'border-sky-200 text-sky-700 dark:border-sky-800 dark:text-sky-300',
                child.tier.tone === 'amber' && 'border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300',
                child.tier.tone === 'red' && 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-300',
              )}>
                {child.tier.label}
              </Badge>
              <ChevronRight size={14} className="shrink-0 text-muted-foreground/50" />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
