import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Apple,
  BarChart3,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  HeartPulse,
  Plus,
  Save,
  ShieldCheck,
} from 'lucide-react';
import {
  managedChildren,
  monthlyIntakeByChild,
  nutritionTrackingByChild,
  type ChildNutritionBand,
  type MonthlyIntake,
} from '../../data/childMonitoringData';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { SideDrawer } from '../../components/ui/side-drawer';
import { ToggleSwitch } from '../../components/ui/toggle-switch';
import { cn } from '../../utils';

type NutritionRecord = {
  breastfeedingStatus: string;
  mealsPerDay: number;
  diversityScore: number;
  thrReceived: boolean;
  thrConsumed: boolean;
};

type NutritionEntryForm = NutritionRecord & {
  entryDate: string;
  assignedWorker: string;
  followUpAction: string;
  notes: string;
};

const defaultNutritionRecord: NutritionRecord = {
  breastfeedingStatus: 'Not recorded',
  mealsPerDay: 0,
  diversityScore: 0,
  thrReceived: false,
  thrConsumed: false,
};

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function getNutritionBand(record: NutritionRecord): ChildNutritionBand {
  if (record.diversityScore >= 75 && record.mealsPerDay >= 4 && record.thrReceived && record.thrConsumed) {
    return 'Normal';
  }

  if (record.diversityScore >= 50 && record.mealsPerDay >= 3) {
    return 'Moderate';
  }

  return 'Severe';
}

function createEntryDraft(record: NutritionRecord): NutritionEntryForm {
  return {
    ...record,
    entryDate: getTodayIso(),
    assignedWorker: 'AWC Worker',
    followUpAction: 'Routine monitoring',
    notes: '',
  };
}

function formatMonthLabel(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function Nutrition() {
  const [selectedChildId, setSelectedChildId] = useState(managedChildren[0].id);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [nutritionByChild, setNutritionByChild] = useState<Record<string, NutritionRecord>>(
    nutritionTrackingByChild as Record<string, NutritionRecord>
  );
  const [historyByChild, setHistoryByChild] = useState<Record<string, MonthlyIntake[]>>(monthlyIntakeByChild);
  const [entryForm, setEntryForm] = useState<NutritionEntryForm>(() =>
    createEntryDraft((nutritionTrackingByChild as Record<string, NutritionRecord>)[managedChildren[0].id] ?? defaultNutritionRecord)
  );

  const selectedChild = managedChildren.find((child) => child.id === selectedChildId);
  const currentRecord = nutritionByChild[selectedChildId] ?? defaultNutritionRecord;
  const intakeHistory = historyByChild[selectedChildId] ?? [];
  const latestIntake = intakeHistory.at(-1);

  useEffect(() => {
    setEntryForm(createEntryDraft(currentRecord));
  }, [selectedChildId, currentRecord]);

  const currentStatus = useMemo(() => getNutritionBand(currentRecord), [currentRecord]);
  const isNutritionOnTrack = currentStatus === 'Normal';

  const thrCoverageLabel = currentRecord.thrReceived
    ? currentRecord.thrConsumed
      ? 'Received and consumed'
      : 'Received, consumption pending'
    : 'Distribution pending';

  const saveNutritionEntry = () => {
    const normalizedRecord: NutritionRecord = {
      breastfeedingStatus: entryForm.breastfeedingStatus.trim() || 'Not recorded',
      mealsPerDay: Math.max(0, Number(entryForm.mealsPerDay) || 0),
      diversityScore: Math.min(100, Math.max(0, Number(entryForm.diversityScore) || 0)),
      thrReceived: entryForm.thrReceived,
      thrConsumed: entryForm.thrConsumed,
    };

    const nutritionStatus = getNutritionBand(normalizedRecord);
    const previousEntry = intakeHistory.at(-1);
    const noteParts = [entryForm.followUpAction.trim(), entryForm.notes.trim()].filter(Boolean);

    const nextHistoryEntry: MonthlyIntake = {
      month: formatMonthLabel(entryForm.entryDate),
      date: entryForm.entryDate,
      weight: previousEntry?.weight ?? 0,
      height: previousEntry?.height ?? 0,
      muac: previousEntry?.muac ?? 0,
      bmi: previousEntry?.bmi ?? 0,
      learningScore: previousEntry?.learningScore ?? 0,
      attendanceRate: previousEntry?.attendanceRate ?? 0,
      nutritionStatus,
      notes: noteParts.join(' • ') || 'Nutrition entry recorded.',
    };

    setNutritionByChild((current) => ({
      ...current,
      [selectedChildId]: normalizedRecord,
    }));

    setHistoryByChild((current) => ({
      ...current,
      [selectedChildId]: [...(current[selectedChildId] ?? []), nextHistoryEntry],
    }));

    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title="Nutrition Entry Form"
        description={`Capture a structured nutrition update for ${selectedChild?.name ?? 'the selected child'} in a project-style workflow.`}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
              Entry ID: NUT-{selectedChildId.toUpperCase()}-{entryForm.entryDate.replaceAll('-', '')}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button className="rounded-xl gap-2" onClick={saveNutritionEntry}>
                <Save size={16} />
                Save Entry
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-sky-200 bg-sky-50/80 p-5 dark:border-sky-900/50 dark:bg-sky-950/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
                  Zoho-style intake sheet
                </p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{selectedChild?.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedChild?.ageLabel} • {selectedChild?.parentName} • Nutrition owner {entryForm.assignedWorker}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-[18rem]">
                <div className="rounded-2xl border border-border bg-background/90 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Entry Date</p>
                  <p className="mt-2 font-semibold text-foreground">{entryForm.entryDate}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/90 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Current Status</p>
                  <p className={cn(
                    'mt-2 font-semibold',
                    currentStatus === 'Normal' && 'text-emerald-600 dark:text-emerald-400',
                    currentStatus === 'Moderate' && 'text-amber-600 dark:text-amber-400',
                    currentStatus === 'Severe' && 'text-red-600 dark:text-red-400'
                  )}>
                    {currentStatus}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-sky-500" />
                <div>
                  <h4 className="font-semibold text-foreground">Record Details</h4>
                  <p className="text-xs text-muted-foreground">Set ownership, verification date, and next follow-up.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Assigned Worker</label>
                <Input
                  value={entryForm.assignedWorker}
                  onChange={(event) => setEntryForm((current) => ({ ...current, assignedWorker: event.target.value }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Verification Date</label>
                <Input
                  type="date"
                  value={entryForm.entryDate}
                  onChange={(event) => setEntryForm((current) => ({ ...current, entryDate: event.target.value }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Follow-up Action</label>
                <Input
                  value={entryForm.followUpAction}
                  onChange={(event) => setEntryForm((current) => ({ ...current, followUpAction: event.target.value }))}
                  className="h-11 rounded-xl"
                  placeholder="Example: home visit, counselling, THR refill"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Apple size={18} className="text-emerald-500" />
                <div>
                  <h4 className="font-semibold text-foreground">Feeding Details</h4>
                  <p className="text-xs text-muted-foreground">Capture breastfeeding, meal frequency, and diversity score.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Breastfeeding Status</label>
                <Select
                  value={entryForm.breastfeedingStatus}
                  onValueChange={(value) => setEntryForm((current) => ({ ...current, breastfeedingStatus: value }))}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exclusive">Exclusive</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Not recorded">Not recorded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Meals per Day</label>
                <Input
                  type="number"
                  min="0"
                  value={entryForm.mealsPerDay}
                  onChange={(event) => setEntryForm((current) => ({ ...current, mealsPerDay: Number(event.target.value) }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-foreground">Dietary Diversity Score</label>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {entryForm.diversityScore}%
                  </span>
                </div>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={entryForm.diversityScore}
                  onChange={(event) => setEntryForm((current) => ({ ...current, diversityScore: Number(event.target.value) }))}
                  className="h-11 rounded-xl"
                />
                <Progress value={entryForm.diversityScore} className="h-3 bg-emerald-100 dark:bg-emerald-950/40" />
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-500" />
                <div>
                  <h4 className="font-semibold text-foreground">THR Compliance</h4>
                  <p className="text-xs text-muted-foreground">Track whether supplementary nutrition reached and was consumed by the child.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <ToggleSwitch
                  checked={entryForm.thrReceived}
                  onCheckedChange={(checked) => setEntryForm((current) => ({ ...current, thrReceived: checked }))}
                  label="THR Received"
                />
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <ToggleSwitch
                  checked={entryForm.thrConsumed}
                  onCheckedChange={(checked) => setEntryForm((current) => ({ ...current, thrConsumed: checked }))}
                  label="THR Consumed"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h4 className="font-semibold text-foreground">Notes</h4>
              <p className="text-xs text-muted-foreground">Document counselling, appetite issues, or home follow-up context.</p>
            </div>
            <div className="p-5">
              <textarea
                value={entryForm.notes}
                onChange={(event) => setEntryForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Add detailed notes for this nutrition check..."
                className="min-h-28 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />
            </div>
          </section>
        </div>
      </SideDrawer>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Nutrition</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Capture feeding practices, dietary diversity, and THR utilization in a structured entry workflow.
            </p>
            {latestIntake && selectedChild && (
              <div
                className={cn(
                  'mt-4 flex items-center gap-2 rounded-xl border px-4 py-2 shadow-sm',
                  isNutritionOnTrack
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300'
                    : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300'
                )}
              >
                {isNutritionOnTrack ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span className="text-sm">
                  <span className="font-semibold">{selectedChild.name}&apos;s</span> nutrition status is{' '}
                  <span className="font-semibold">{isNutritionOnTrack ? 'on track' : 'flagged for attention'}</span>.
                </span>
                <span className="ml-1 hidden text-xs opacity-75 sm:inline-block">
                  ({isNutritionOnTrack ? 'Diet diversity and THR adherence are stable' : 'Entry review and dietary follow-up recommended'})
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="w-full lg:w-64 max-w-xs">
              <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                <SelectTrigger className="h-12 rounded-2xl">
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
            <Button onClick={() => setIsDrawerOpen(true)} className="h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white gap-2 px-6">
              <Plus size={18} />
              Add Entry
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Entry summary</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">Dietary Diversity Score (MDD)</h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Tracks the variety of food groups consumed daily. This summary card now reflects the latest saved nutrition entry for the selected child.
                </p>
              </div>
              <BarChart3 className="shrink-0 text-emerald-500" size={24} />
            </div>
            <div className="mt-6">
              <Progress value={currentRecord.diversityScore} className="h-4 bg-emerald-100 dark:bg-emerald-950/40" />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentRecord.diversityScore}%</span> of optimal diversity target
                </p>
                <p className="text-xs text-muted-foreground">Target: 100% (All 7 Food Groups)</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/20">
              <div className="flex items-center gap-3">
                <Apple className="text-emerald-600 dark:text-emerald-300" size={24} />
                <div>
                  <p className="text-sm font-semibold text-foreground">Meals per Day</p>
                  <p className="text-2xl font-bold text-foreground">{currentRecord.mealsPerDay}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-5 shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
              <div className="flex items-center gap-3">
                <HeartPulse className="text-amber-600 dark:text-amber-300" size={24} />
                <div>
                  <p className="text-sm font-semibold text-foreground">THR Status</p>
                  <p className="text-sm font-medium text-foreground">{thrCoverageLabel}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-sky-200 bg-sky-50/80 p-5 shadow-sm dark:border-sky-900 dark:bg-sky-950/20">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-sky-600 dark:text-sky-300" size={24} />
                <div>
                  <p className="text-sm font-semibold text-foreground">Breastfeeding</p>
                  <p className="text-sm font-medium text-foreground">{currentRecord.breastfeedingStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Project tracker</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">Entry Workflow</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A compact progress view for the latest nutrition review.
              </p>
            </div>
            <CalendarDays size={20} className="text-sky-500" />
          </div>

          <div className="mt-5 space-y-3">
            {[
              { label: 'Child selected', value: selectedChild?.name ?? 'Not selected' },
              { label: 'Last verified', value: latestIntake ? latestIntake.date : 'No entry yet' },
              { label: 'Nutrition band', value: currentStatus },
              { label: 'Next action', value: latestIntake?.notes ?? 'Create a nutrition entry' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-background/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-background/50 overflow-hidden flex flex-col">
        <div className="border-b border-border bg-muted/30 px-5 py-4">
          <h4 className="flex items-center gap-2 font-semibold text-foreground">
            <CalendarDays size={18} className="text-sky-500" />
            Nutrition History
          </h4>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-muted/50 text-xs uppercase text-muted-foreground backdrop-blur">
              <tr>
                <th className="px-5 py-3 font-medium">Month</th>
                <th className="px-5 py-3 font-medium">Date Verified</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Notes & Actions</th>
              </tr>
            </thead>
            <tbody>
              {intakeHistory.slice().reverse().map((record, idx) => (
                <tr key={`${record.date}-${idx}`} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-foreground">{record.month}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                    {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        'rounded-md px-2 py-1 text-xs font-medium',
                        record.nutritionStatus === 'Normal' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
                        record.nutritionStatus === 'Moderate' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
                        record.nutritionStatus === 'Severe' && 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                      )}
                    >
                      {record.nutritionStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
