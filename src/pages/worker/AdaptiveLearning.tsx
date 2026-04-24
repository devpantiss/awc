import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Clapperboard,
  Eye,
  GanttChart,
  GraduationCap,
  Hexagon,
  ListChecks,
  MessageSquare,
  Palette,
  Play,
  Save,
  Shapes,
  Star,
  Target,
  Users,
} from 'lucide-react';
import { cn } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import {
  monthlyThemes,
  learningJourneyByTheme,
  teachingModulesByTheme,
  shapeStudioByTheme,
  storyVideosByTheme,
  quickAssessments,
} from '../../data/mockData';
import type { MonthlyTheme, DailyActivity } from '../../types';
import type { TeachingModule, ShapeStudioItem, StoryVideo } from '../../data/mockData';
import { SideDrawer } from '../../components/ui/side-drawer';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { managedChildren } from '../../data/childMonitoringData';

/* ── domain → colour mapping ── */
const domainColor: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'domain.cognitive': { bg: 'bg-violet-50 dark:bg-violet-950/20', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800/50', dot: 'bg-violet-500' },
  'domain.language': { bg: 'bg-sky-50 dark:bg-sky-950/20', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800/50', dot: 'bg-sky-500' },
  'domain.physical': { bg: 'bg-orange-50 dark:bg-orange-950/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800/50', dot: 'bg-orange-500' },
  'domain.creativity': { bg: 'bg-pink-50 dark:bg-pink-950/20', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800/50', dot: 'bg-pink-500' },
  'domain.nutrition': { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800/50', dot: 'bg-emerald-500' },
  'domain.social': { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/50', dot: 'bg-amber-500' },
};
const fallback = { bg: 'bg-slate-50 dark:bg-slate-900/20', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700', dot: 'bg-slate-500' };
const dc = (key: string) => domainColor[key] ?? fallback;

const responseKeys = [
  { key: 'common.yes' },
  { key: 'common.no' },
  { key: 'common.needs_help' },
];

type Tab = 'activities' | 'modules' | 'shapes' | 'videos' | 'students' | 'timeline';
type StudentActivityMap = Record<string, Record<string, 'done' | 'partial' | 'not_started'>>;

function buildInitialProgress(): StudentActivityMap {
  const map: StudentActivityMap = {};
  for (const child of managedChildren) {
    map[child.id] = {};
    for (const act of Object.values(learningJourneyByTheme).flat()) {
      const r = Math.random();
      map[child.id][act.id] = act.completed ? (r > 0.2 ? 'done' : 'partial') : (r > 0.7 ? 'done' : r > 0.4 ? 'partial' : 'not_started');
    }
  }
  return map;
}

/* ── Tab config ── */
const tabs: { id: Tab; icon: typeof BookOpen; label: string; color: string }[] = [
  { id: 'timeline', icon: GanttChart, label: 'Timeline', color: 'text-indigo-600' },
  { id: 'activities', icon: Target, label: 'Daily Activities', color: 'text-emerald-600' },
  { id: 'modules', icon: GraduationCap, label: 'Teaching Modules', color: 'text-violet-600' },
  { id: 'shapes', icon: Shapes, label: '3D Shapes', color: 'text-orange-600' },
  { id: 'videos', icon: Clapperboard, label: 'Story Videos', color: 'text-sky-600' },
  { id: 'students', icon: Users, label: 'Student Tracker', color: 'text-primary' },
];

export function AdaptiveLearning() {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<MonthlyTheme>('data.theme.family');
  const [activeTab, setActiveTab] = useState<Tab>('timeline');
  const [drawerMode, setDrawerMode] = useState<'activity' | 'assess' | 'observe' | 'module' | 'shape' | 'video' | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<DailyActivity | null>(null);
  const [selectedModule, setSelectedModule] = useState<TeachingModule | null>(null);
  const [selectedShape, setSelectedShape] = useState<ShapeStudioItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<StoryVideo | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [progress, setProgress] = useState<StudentActivityMap>(buildInitialProgress);
  const [observationNote, setObservationNote] = useState('');
  const [assessmentResponses, setAssessmentResponses] = useState<Record<string, string>>({});
  const [studentRatings, setStudentRatings] = useState<Record<string, number>>({});

  const activities = learningJourneyByTheme[selectedTheme] ?? [];
  const modules = teachingModulesByTheme[selectedTheme] ?? [];
  const shapes = shapeStudioByTheme[selectedTheme] ?? [];
  const videos = storyVideosByTheme[selectedTheme] ?? [];

  const studentStats = useMemo(() => {
    return managedChildren.map(child => {
      let done = 0, partial = 0, notStarted = 0;
      for (const act of activities) {
        const s = progress[child.id]?.[act.id] ?? 'not_started';
        if (s === 'done') done++; else if (s === 'partial') partial++; else notStarted++;
      }
      const total = activities.length;
      const pct = total > 0 ? Math.round(((done + partial * 0.5) / total) * 100) : 0;
      return { ...child, done, partial, notStarted, total, pct };
    });
  }, [activities, progress]);

  const classPct = useMemo(() => studentStats.length === 0 ? 0 : Math.round(studentStats.reduce((s, c) => s + c.pct, 0) / studentStats.length), [studentStats]);
  const markComplete = (cid: string, aid: string) => setProgress(p => ({ ...p, [cid]: { ...p[cid], [aid]: 'done' } }));

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ━━━ Header ━━━ */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{t('learning.hero.badge')}</h2>
            <p className="mt-1 text-xs text-muted-foreground max-w-md">{t('learning.theme.desc')}</p>
          </div>
          <div className="flex gap-2">
            {[
              { label: 'Activities', value: activities.length, color: '' },
              { label: 'Class %', value: `${classPct}%`, color: classPct >= 70 ? 'text-emerald-600' : classPct >= 40 ? 'text-amber-600' : 'text-red-600' },
              { label: 'Students', value: managedChildren.length, color: '' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border bg-background px-3 py-2 text-center min-w-[70px]">
                <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className={cn('text-lg font-bold text-foreground', s.color)}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Theme pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(monthlyThemes) as MonthlyTheme[]).map(theme => (
            <button
              key={theme}
              onClick={() => { setSelectedTheme(theme); setSelectedActivity(null); }}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-bold transition-all',
                selectedTheme === theme ? 'bg-primary text-primary-foreground shadow-md' : 'border border-border text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >{t(theme)}</button>
          ))}
        </div>
      </section>

      {/* ━━━ Tab Bar ━━━ */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1 shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all',
              activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
            )}
          >
            <tab.icon size={14} />
            {tab.label}
            {/* Badge count */}
            <span className={cn(
              'ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-bold',
              activeTab === tab.id ? 'bg-white/20 text-primary-foreground' : 'bg-muted text-muted-foreground',
            )}>
              {tab.id === 'timeline' ? (activities.length + modules.length + shapes.length + videos.length) : tab.id === 'activities' ? activities.length : tab.id === 'modules' ? modules.length : tab.id === 'shapes' ? shapes.length : tab.id === 'videos' ? videos.length : managedChildren.length}
            </span>
          </button>
        ))}
      </div>

      {/* ━━━ Tab Content ━━━ */}

      {/* ── Daily Activities ── */}
      {activeTab === 'activities' && (
        <section className="space-y-3">
          {activities.length === 0 ? (
            <EmptyState icon={Target} text="No daily activities for this theme yet." />
          ) : activities.map((act, i) => {
            const d = dc(act.category);
            const doneCount = managedChildren.filter(c => progress[c.id]?.[act.id] === 'done').length;
            return (
              <motion.div key={act.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={cn('flex overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md', d.border)}
              >
                <div className={cn('w-1.5 shrink-0', d.dot)} />
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase', d.bg, d.text)}>{t(act.category)}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock size={10} />{act.durationMin}m</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground"><span className="text-emerald-600">{doneCount}</span>/{managedChildren.length}</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-foreground">{t(act.title)}</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {act.outcomeTags.slice(0, 3).map(tag => (
                        <span key={tag} className="rounded-md bg-muted/50 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">{t(tag)}</span>
                      ))}
                    </div>
                    <button onClick={() => { setSelectedActivity(act); setDrawerMode('activity'); }}
                      className={cn('flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all', d.bg, d.text, 'hover:shadow-sm')}
                    ><Eye size={12} /> View</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* ── Teaching Modules ── */}
      {activeTab === 'modules' && (
        <section className="space-y-3">
          {modules.length === 0 ? (
            <EmptyState icon={GraduationCap} text="No teaching modules for this theme yet." />
          ) : modules.map((mod, i) => {
            const d = dc(mod.domain);
            return (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={cn('flex overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow', d.border)}
              >
                <div className={cn('w-1.5 shrink-0', d.dot)} />
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase', d.bg, d.text)}>{t(mod.domain)}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock size={10} />{mod.duration}m</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-foreground">{mod.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{mod.objective}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><ListChecks size={11} />{mod.steps.length} steps</span>
                      <span>·</span>
                      <span>{mod.materials.length} materials</span>
                    </div>
                    <button onClick={() => { setSelectedModule(mod); setDrawerMode('module'); }}
                      className={cn('flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-bold', d.bg, d.text, 'hover:shadow-sm')}
                    ><BookOpen size={12} /> Open</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* ── Shape Studio ── */}
      {activeTab === 'shapes' && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shapes.length === 0 ? (
            <div className="sm:col-span-3">
              <EmptyState icon={Shapes} text="No shapes for this theme yet." />
            </div>
          ) : shapes.map((shape, i) => {
            const d = dc(shape.domain);
            return (
              <motion.div key={shape.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                className={cn('group cursor-pointer rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all', d.border)}
                onClick={() => { setSelectedShape(shape); setDrawerMode('shape'); }}
              >
                <div className="text-4xl mb-3">{shape.icon}</div>
                <h4 className="text-base font-bold text-foreground">{shape.shape}</h4>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{shape.concept}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-bold uppercase', d.bg, d.text)}>{t(shape.domain)}</span>
                  <Eye size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* ── Story Videos ── */}
      {activeTab === 'videos' && (
        <section className="space-y-3">
          {videos.length === 0 ? (
            <EmptyState icon={Clapperboard} text="No story videos for this theme yet." />
          ) : videos.map((vid, i) => {
            const d = dc(vid.domain);
            return (
              <motion.div key={vid.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={cn('flex overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow', d.border)}
              >
                <div className={cn('flex w-20 shrink-0 items-center justify-center text-3xl', d.bg)}>{vid.thumbnail}</div>
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase', d.bg, d.text)}>{t(vid.domain)}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock size={10} />{vid.durationMin}m</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-foreground">{vid.title}</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1">
                      {vid.languageSupport.map(lang => (
                        <span key={lang} className="rounded bg-muted/50 px-1.5 py-0.5 text-[8px] font-bold text-muted-foreground">{lang}</span>
                      ))}
                    </div>
                    <button onClick={() => { setSelectedVideo(vid); setDrawerMode('video'); }}
                      className={cn('flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-bold', d.bg, d.text, 'hover:shadow-sm')}
                    ><Play size={12} /> Watch</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* ── Student Tracker ── */}
      {activeTab === 'students' && (
        <section className="space-y-3">
          <div className="flex gap-4 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Done</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Partial</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" /> Pending</span>
          </div>
          {studentStats.map((student, i) => {
            const tone = student.pct >= 70 ? 'emerald' : student.pct >= 40 ? 'amber' : 'red';
            return (
              <motion.div key={student.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white', `bg-${tone}-500`)}>{student.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{student.name}</p>
                      <p className="text-[10px] text-muted-foreground">{student.ageLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 mr-2 mt-0.5" title="Performance Rating">
                      <Star size={12} className={cn('fill-current', studentRatings[student.id] ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700')} />
                      <span className="text-xs font-bold text-muted-foreground">{studentRatings[student.id] || '-'}</span>
                    </div>
                    <span className={cn('text-sm font-bold', `text-${tone}-600`)}>{student.pct}%</span>
                    <button onClick={() => { setSelectedStudentId(student.id); setObservationNote(''); setDrawerMode('observe'); }}
                      className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" title="Observe"
                    ><MessageSquare size={14} /></button>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${student.pct}%` }} transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={cn('h-full rounded-full', `bg-${tone}-500`)} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activities.map(act => {
                    const s = progress[student.id]?.[act.id] ?? 'not_started';
                    return (
                      <button key={act.id} title={`${t(act.title)}: ${s.replace('_', ' ')}`}
                        onClick={() => { setSelectedActivity(act); setSelectedStudentId(student.id); setAssessmentResponses({}); setDrawerMode('assess'); }}
                        className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-bold transition-all hover:scale-[1.03]',
                          s === 'done' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
                          s === 'partial' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
                          s === 'not_started' && 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                        )}
                      >
                        {s === 'done' ? <CheckCircle2 size={10} /> : s === 'partial' ? <Target size={10} /> : <Circle size={10} />}
                        <span className="hidden sm:inline">{t(act.title)}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* ── Timeline ── */}
      {activeTab === 'timeline' && (
        <section className="space-y-0">
          {/* Overall progress summary */}
          <div className="mb-5 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Theme Progress — {t(selectedTheme)}</h3>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Across all modules for this theme</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> Complete</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" /> In Progress</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" /> Upcoming</span>
              </div>
            </div>
            {/* Overall progress bar */}
            {(() => {
              const totalItems = activities.length + modules.length + shapes.length + videos.length;
              const completedActivities = activities.filter(a => a.completed).length;
              // Simulate module/shape/video progress
              const completedModules = modules.filter((_, i) => i === 0).length;
              const completedShapes = shapes.filter((_, i) => i < 2).length;
              const completedVideos = videos.filter((_, i) => i === 0).length;
              const totalComplete = completedActivities + completedModules + completedShapes + completedVideos;
              const overallPct = totalItems > 0 ? Math.round((totalComplete / totalItems) * 100) : 0;
              return (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{totalComplete}/{totalItems} items</span>
                    <span className={cn('font-bold', overallPct >= 60 ? 'text-emerald-600' : overallPct >= 30 ? 'text-amber-600' : 'text-red-500')}>{overallPct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted/40">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${overallPct}%` }} transition={{ duration: 0.8 }}
                      className={cn('h-full rounded-full', overallPct >= 60 ? 'bg-emerald-500' : overallPct >= 30 ? 'bg-amber-500' : 'bg-red-500')} />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Timeline segments */}
          {[
            { segment: 'Daily Activities' as const, icon: Target, items: activities.map((a, i) => ({ id: a.id, title: t(a.title), domain: a.category, duration: a.durationMin, status: (a.completed ? 'complete' : i < 2 ? 'in_progress' : 'upcoming') as 'complete' | 'in_progress' | 'upcoming', detail: t(a.instructions), type: 'activity' as const })), color: 'emerald' },
            { segment: 'Teaching Modules' as const, icon: GraduationCap, items: modules.map((m, i) => ({ id: m.id, title: m.title, domain: m.domain, duration: m.duration, status: (i === 0 ? 'complete' : 'in_progress') as 'complete' | 'in_progress' | 'upcoming', detail: m.objective, type: 'module' as const })), color: 'violet' },
            { segment: '3D Shape Studio' as const, icon: Shapes, items: shapes.map((s, i) => ({ id: s.id, title: `${s.icon} ${s.shape}`, domain: s.domain, duration: 10, status: (i < 2 ? 'complete' : 'upcoming') as 'complete' | 'in_progress' | 'upcoming', detail: s.concept, type: 'shape' as const })), color: 'orange' },
            { segment: 'Story Videos' as const, icon: Clapperboard, items: videos.map((v, i) => ({ id: v.id, title: v.title, domain: v.domain, duration: v.durationMin, status: (i === 0 ? 'complete' : 'upcoming') as 'complete' | 'in_progress' | 'upcoming', detail: v.goals.join(', '), type: 'video' as const })), color: 'sky' },
          ].map(({ segment, icon: SegIcon, items, color }) => (
            <div key={segment} className="mb-6">
              {/* Segment header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-xl', `bg-${color}-100 dark:bg-${color}-950/30`)}>
                  <SegIcon size={16} className={`text-${color}-600`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{segment}</h4>
                  <p className="text-[10px] text-muted-foreground">{items.length} items · {items.filter(i => i.status === 'complete').length} completed</p>
                </div>
              </div>

              {/* Vertical timeline */}
              <div className="relative ml-4 border-l-2 border-border pl-6 space-y-0">
                {items.map((item, idx) => {
                  const isLast = idx === items.length - 1;
                  const d = dc(item.domain);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className={cn('relative pb-5', isLast && 'pb-0')}
                    >
                      {/* Timeline dot */}
                      <div className={cn(
                        'absolute -left-[35px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card',
                        item.status === 'complete' && 'bg-emerald-500',
                        item.status === 'in_progress' && 'bg-amber-500',
                        item.status === 'upcoming' && 'bg-slate-300 dark:bg-slate-600',
                      )}>
                        {item.status === 'complete' ? <CheckCircle2 size={10} className="text-white" /> : item.status === 'in_progress' ? <Clock size={9} className="text-white" /> : <Circle size={8} className="text-white" />}
                      </div>

                      {/* Card */}
                      <div className={cn(
                        'rounded-xl border p-3 transition-all',
                        item.status === 'complete' && 'border-emerald-200/60 bg-emerald-50/30 dark:border-emerald-800/40 dark:bg-emerald-950/10',
                        item.status === 'in_progress' && 'border-amber-200/60 bg-amber-50/30 dark:border-amber-800/40 dark:bg-amber-950/10',
                        item.status === 'upcoming' && 'border-border bg-card/50 opacity-70',
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-bold uppercase', d.bg, d.text)}>{t(item.domain)}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock size={9} />{item.duration}m</span>
                          </div>
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase',
                            item.status === 'complete' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
                            item.status === 'in_progress' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
                            item.status === 'upcoming' && 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                          )}>{item.status === 'in_progress' ? 'in progress' : item.status === 'upcoming' ? 'upcoming' : 'complete'}</span>
                        </div>
                        <h5 className="mt-1.5 text-sm font-semibold text-foreground">{item.title}</h5>
                        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{item.detail}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ═══ DRAWERS ═══ */}

      {/* Activity Detail */}
      <SideDrawer open={drawerMode === 'activity'} onOpenChange={o => !o && setDrawerMode(null)}
        title={selectedActivity ? t(selectedActivity.title) : ''} description={selectedActivity ? t(selectedActivity.category) : ''}
      >
        {selectedActivity && (() => {
          const d = dc(selectedActivity.category);
          return (
            <div className="space-y-5">
              <div className={cn('rounded-2xl border p-4', d.border, d.bg)}>
                <div className="flex items-center justify-between">
                  <Badge className={cn('rounded-full', d.bg, d.text)}>{t(selectedActivity.category)}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{selectedActivity.durationMin} min</span>
                </div>
                <h4 className="mt-2 text-base font-bold text-foreground">{t(selectedActivity.title)}</h4>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t(selectedActivity.instructions)}</p>
              </div>
              <div className="rounded-2xl border border-sky-200/60 bg-sky-50/40 p-4 dark:border-sky-900/40 dark:bg-sky-950/10">
                <div className="flex items-center gap-2"><Palette size={14} className="text-sky-600" /><span className="text-sm font-bold text-sky-800 dark:text-sky-300">Interactive Child Mode</span></div>
                <p className="mt-1 text-sm text-sky-700 dark:text-sky-400">{selectedActivity.childMode}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Outcomes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedActivity.outcomeTags.map(tag => <span key={tag} className="rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-foreground">{t(tag)}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground"><Star size={14} className="text-amber-500" /><span className="font-semibold">{selectedActivity.stars} stars</span></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Students</p>
                <div className="mt-2 space-y-1.5">
                  {managedChildren.map(child => {
                    const s = progress[child.id]?.[selectedActivity.id] ?? 'not_started';
                    return (
                      <div key={child.id} className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white', s === 'done' ? 'bg-emerald-500' : s === 'partial' ? 'bg-amber-500' : 'bg-slate-400')}>{child.name.charAt(0)}</div>
                          <span className="text-sm text-foreground">{child.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn('rounded-md px-2 py-0.5 text-[9px] font-bold uppercase', s === 'done' ? 'bg-emerald-100 text-emerald-700' : s === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500')}>{s === 'not_started' ? 'pending' : s}</span>
                          {s !== 'done' && <button onClick={() => markComplete(child.id, selectedActivity.id)} className="rounded-md bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white hover:bg-emerald-600">✓ Done</button>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </SideDrawer>

      {/* Teaching Module Detail */}
      <SideDrawer open={drawerMode === 'module'} onOpenChange={o => !o && setDrawerMode(null)}
        title={selectedModule?.title ?? ''} description={selectedModule ? t(selectedModule.domain) : ''}
      >
        {selectedModule && (() => {
          const d = dc(selectedModule.domain);
          return (
            <div className="space-y-5">
              <div className={cn('rounded-2xl border p-4', d.border, d.bg)}>
                <Badge className={cn('rounded-full', d.bg, d.text)}>{t(selectedModule.domain)}</Badge>
                <h4 className="mt-2 text-base font-bold text-foreground">{selectedModule.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{selectedModule.objective}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{selectedModule.duration} minutes</div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('learning.modules.tasks')}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedModule.materials.map(m => <span key={m} className="rounded-full border border-border px-3 py-1 text-xs text-foreground">{m}</span>)}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('learning.modules.flow')}</p>
                <ol className="mt-2 space-y-2">
                  {selectedModule.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 rounded-xl border border-border bg-background/50 p-3">
                      <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white', d.dot)}>{i + 1}</span>
                      <span className="text-sm text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Child Tasks</p>
                <ul className="mt-2 space-y-1.5">
                  {selectedModule.childTasks.map((task, i) => (
                    <li key={i} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground">
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-500" /> {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })()}
      </SideDrawer>

      {/* Shape Studio Detail */}
      <SideDrawer open={drawerMode === 'shape'} onOpenChange={o => !o && setDrawerMode(null)}
        title={selectedShape?.shape ?? ''} description={selectedShape ? t(selectedShape.domain) : ''}
      >
        {selectedShape && (
          <div className="space-y-5">
            <div className="text-center">
              <span className="text-6xl">{selectedShape.icon}</span>
              <h3 className="mt-3 text-xl font-bold text-foreground">{selectedShape.shape}</h3>
            </div>
            <div className="rounded-2xl border border-border bg-background/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Concept</p>
              <p className="mt-1 text-sm text-foreground">{selectedShape.concept}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Real-world Examples</p>
              <p className="mt-1 text-sm text-foreground">{selectedShape.realWorldExample}</p>
            </div>
            <div className="rounded-2xl border border-amber-200/50 bg-amber-50/50 p-4 dark:border-amber-800/30 dark:bg-amber-950/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">Mini Task</p>
              <p className="mt-1 text-sm font-medium text-amber-800 dark:text-amber-200">{selectedShape.miniTask}</p>
            </div>
          </div>
        )}
      </SideDrawer>

      {/* Story Video Detail */}
      <SideDrawer open={drawerMode === 'video'} onOpenChange={o => !o && setDrawerMode(null)}
        title={selectedVideo?.title ?? ''} description={selectedVideo ? t(selectedVideo.domain) : ''}
      >
        {selectedVideo && (
          <div className="space-y-5">
            <div className={cn('flex items-center justify-center rounded-2xl border p-8 text-5xl', dc(selectedVideo.domain).bg, dc(selectedVideo.domain).border)}>
              {selectedVideo.thumbnail}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{selectedVideo.durationMin} min</span>
              <div className="flex gap-1">
                {selectedVideo.languageSupport.map(l => <span key={l} className="rounded bg-muted/60 px-2 py-0.5 text-[9px] font-bold text-muted-foreground">{l}</span>)}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('learning.videos.goals')}</p>
              <ul className="mt-2 space-y-1.5">
                {selectedVideo.goals.map((g, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground"><Star size={13} className="shrink-0 text-amber-500" />{g}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('learning.videos.prompts')}</p>
              <ul className="mt-2 space-y-1.5">
                {selectedVideo.prompts.map((p, i) => (
                  <li key={i} className="rounded-xl border border-border bg-background/50 px-3 py-2.5 text-sm text-foreground italic">&ldquo;{p}&rdquo;</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </SideDrawer>

      {/* Assessment Drawer */}
      <SideDrawer open={drawerMode === 'assess'} onOpenChange={o => !o && setDrawerMode(null)} title="Quick Assessment"
        description={`${managedChildren.find(c => c.id === selectedStudentId)?.name ?? ''} — ${selectedActivity ? t(selectedActivity.title) : ''}`}
        footer={<div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Auto-save</p><Button onClick={() => { if (selectedStudentId && selectedActivity) { markComplete(selectedStudentId, selectedActivity.id); setDrawerMode(null); } }} className="rounded-xl"><Save size={14} className="mr-2" />Save & Done</Button></div>}
      >
        {selectedActivity && selectedStudentId && (
          <div className="space-y-4">
            <div className={cn('rounded-2xl border p-3', dc(selectedActivity.category).border, dc(selectedActivity.category).bg)}>
              <p className="text-sm font-bold text-foreground">{t(selectedActivity.title)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t(selectedActivity.instructions)}</p>
            </div>
            {(['domain.cognitive', 'domain.language', 'domain.physical', 'domain.social', 'domain.creativity'] as const).map(dk => (
              <div key={dk} className={cn('rounded-xl border p-3', dc(dk).border)}>
                <p className={cn('text-xs font-bold', dc(dk).text)}>{t(dk)}</p>
                <div className="mt-2 flex gap-2">
                  {responseKeys.map(r => (
                    <button key={r.key} onClick={() => setAssessmentResponses(p => ({ ...p, [dk]: r.key }))}
                      className={cn('rounded-full px-3 py-1 text-[10px] font-bold transition-all',
                        assessmentResponses[dk] === r.key ? (r.key === 'common.yes' ? 'bg-emerald-500 text-white' : r.key === 'common.needs_help' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white') : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      )}>{t(r.key)}</button>
                  ))}
                </div>
              </div>
            ))}
            <textarea className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" rows={2} placeholder="Notes..." value={observationNote} onChange={e => setObservationNote(e.target.value)} />
          </div>
        )}
      </SideDrawer>

      {/* Observation Drawer */}
      <SideDrawer open={drawerMode === 'observe'} onOpenChange={o => !o && setDrawerMode(null)}
        title="Record Observation" description={managedChildren.find(c => c.id === selectedStudentId)?.name ?? ''}
        footer={<div className="flex justify-end"><Button onClick={() => setDrawerMode(null)} className="rounded-xl"><Save size={14} className="mr-2" />Save</Button></div>}
      >
        {selectedStudentId && (() => {
          const student = managedChildren.find(c => c.id === selectedStudentId);
          const sp = studentStats.find(s => s.id === selectedStudentId);
          if (!student) return null;
          return (
            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{student.name.charAt(0)}</div>
                  <div><p className="text-sm font-bold text-foreground">{student.name}</p><p className="text-[10px] text-muted-foreground">{student.ageLabel} · {student.gender}</p></div>
                </div>
                {sp && <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-emerald-50 p-2 text-center dark:bg-emerald-950/15"><p className="text-base font-bold text-emerald-600">{sp.done}</p><p className="text-[8px] font-bold uppercase text-emerald-600/70">Done</p></div>
                  <div className="rounded-lg bg-amber-50 p-2 text-center dark:bg-amber-950/15"><p className="text-base font-bold text-amber-600">{sp.partial}</p><p className="text-[8px] font-bold uppercase text-amber-600/70">Partial</p></div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/30"><p className="text-base font-bold text-slate-600">{sp.notStarted}</p><p className="text-[8px] font-bold uppercase text-slate-500">Pending</p></div>
                </div>}
              </div>
              <div className="rounded-2xl border border-amber-200/50 bg-amber-50/50 p-4 dark:border-amber-800/30 dark:bg-amber-950/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">Performance Rating</p>
                <div className="mt-2 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const currentRating = studentRatings[student.id] || 0;
                    return (
                      <button
                        key={star}
                        onClick={() => setStudentRatings(prev => ({ ...prev, [student.id]: star }))}
                        className={cn('transition-all hover:scale-110', star <= currentRating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700')}
                      >
                        <Star className={cn("fill-current h-6 w-6")} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today&apos;s Observation</p>
                <textarea className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" rows={4} placeholder="Write your observation..." value={observationNote} onChange={e => setObservationNote(e.target.value)} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quick Tags</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Active Learner', 'Needs Support', 'Good Communication', 'Excellent Focus', 'Peer Helper'].map(tag => (
                    <button key={tag} className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors">{tag}</button>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </SideDrawer>
    </div>
  );
}

/* ── Empty state component ── */
function EmptyState({ icon: Icon, text }: { icon: typeof BookOpen; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-12 text-center">
      <Icon size={28} className="mx-auto text-muted-foreground/40" />
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
