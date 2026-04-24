import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Save, Stethoscope, TriangleAlert } from 'lucide-react';
import { managedChildren, healthLogsSeed } from '../../data/childMonitoringData';
import { Alert } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ToggleSwitch } from '../../components/ui/toggle-switch';
import { cn } from '../../utils';

const healthFieldLabels = [
  { key: 'fever', label: 'Fever' },
  { key: 'diarrhea', label: 'Diarrhea' },
  { key: 'cough', label: 'Cough' },
  { key: 'hospitalVisit', label: 'Hospital Visit' },
] as const;

type HealthFieldKey = (typeof healthFieldLabels)[number]['key'];

type HealthRecord = Record<HealthFieldKey, boolean>;

type SavedHealthState = {
  tracker: HealthRecord;
  healthDates: Partial<Record<HealthFieldKey, string>>;
};

type HealthHistoryEntry = {
  id: string;
  item: string;
  date: string;
  status: 'Recorded';
  notes: string;
};

function getDefaultHealthDates(tracker: HealthRecord) {
  return Object.fromEntries(
    healthFieldLabels
      .filter((item) => tracker[item.key])
      .map((item) => [item.key, '2026-04-24'])
  ) as Partial<Record<HealthFieldKey, string>>;
}

function formatHealthDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function Health() {
  const [selectedChildId, setSelectedChildId] = useState(managedChildren[0].id);
  const [savedRecordsByChild, setSavedRecordsByChild] = useState<Record<string, SavedHealthState>>(() =>
    Object.fromEntries(
      healthLogsSeed.map((log) => {
        const tracker: HealthRecord = {
          fever: log.fever,
          diarrhea: log.diarrhea,
          cough: log.cough,
          hospitalVisit: log.hospitalVisit,
        };

        return [
          log.childId,
          {
            tracker,
            healthDates: getDefaultHealthDates(tracker),
          },
        ];
      })
    )
  );
  const [tracker, setTracker] = useState<HealthRecord>(
    savedRecordsByChild[selectedChildId]?.tracker ?? {
      fever: false,
      diarrhea: false,
      cough: false,
      hospitalVisit: false,
    }
  );
  const [healthDates, setHealthDates] = useState<Partial<Record<HealthFieldKey, string>>>(
    savedRecordsByChild[selectedChildId]?.healthDates ?? {}
  );
  const [healthHistoryByChild, setHealthHistoryByChild] = useState<Record<string, HealthHistoryEntry[]>>(() =>
    Object.fromEntries(
      healthLogsSeed.map((log) => {
        const tracker: HealthRecord = {
          fever: log.fever,
          diarrhea: log.diarrhea,
          cough: log.cough,
          hospitalVisit: log.hospitalVisit,
        };
        const dates = getDefaultHealthDates(tracker);
        const entries = healthFieldLabels
          .filter((item) => tracker[item.key])
          .map((item) => ({
            id: `${log.childId}-${item.key}-${dates[item.key]}`,
            item: item.label,
            date: dates[item.key] || '2026-04-24',
            status: 'Recorded' as const,
            notes: `${item.label} logged in health register.`,
          }));

        return [log.childId, entries];
      })
    )
  );
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedState = savedRecordsByChild[selectedChildId];
    setTracker(
      savedState?.tracker ?? {
        fever: false,
        diarrhea: false,
        cough: false,
        hospitalVisit: false,
      }
    );
    setHealthDates(savedState?.healthDates ?? {});
    setSaveMessage('');
  }, [selectedChildId, savedRecordsByChild]);

  const activeAlerts = useMemo(
    () => healthFieldLabels.filter((item) => tracker[item.key]).map((item) => item.label),
    [tracker]
  );

  const savedHealthEntries = useMemo(
    () =>
      healthFieldLabels
        .filter((item) => tracker[item.key])
        .map((item) => ({
          key: item.key,
          label: item.label,
          date: healthDates[item.key] || '',
        })),
    [tracker, healthDates]
  );
  const healthHistory = healthHistoryByChild[selectedChildId] ?? [];

  const handleToggle = (key: HealthFieldKey, checked: boolean) => {
    setTracker((current) => ({ ...current, [key]: checked }));

    if (!checked) {
      setHealthDates((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
      return;
    }

    setHealthDates((current) => ({
      ...current,
      [key]: current[key] || '2026-04-24',
    }));
  };

  const handleSave = () => {
    const nextDates: Partial<Record<HealthFieldKey, string>> = {};
    healthFieldLabels.forEach((item) => {
      if (tracker[item.key]) {
        nextDates[item.key] = healthDates[item.key] || '2026-04-24';
      }
    });

    setSavedRecordsByChild((current) => ({
      ...current,
      [selectedChildId]: {
        tracker: { ...tracker },
        healthDates: nextDates,
      },
    }));

    setHealthHistoryByChild((current) => {
      const nextEntries = healthFieldLabels
        .filter((item) => tracker[item.key])
        .map((item) => {
          const entryDate = nextDates[item.key] || '2026-04-24';
          return {
            id: `${selectedChildId}-${item.key}-${entryDate}-${Date.now()}`,
            item: item.label,
            date: entryDate,
            status: 'Recorded' as const,
            notes: `${item.label} observed and saved.`,
          };
        });

      return {
        ...current,
        [selectedChildId]: [...(current[selectedChildId] ?? []), ...nextEntries],
      };
    });

    setHealthDates(nextDates);
    setSaveMessage('Health record saved.');
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Health</h2>
            <p className="mt-2 text-sm text-muted-foreground">Mark health conditions, add the observed date, and save to show the condition name with its date.</p>
          </div>
          <div className="w-full max-w-xs">
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
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground">Health Log Form</h3>
            <Button onClick={handleSave} className="rounded-xl gap-2">
              <Save size={16} />
              Save
            </Button>
          </div>

          <div className="mt-5 grid gap-3">
            {healthFieldLabels.map((item) => (
              <div key={item.key} className="rounded-[1.25rem] border border-border bg-background/70 px-4 py-4">
                <ToggleSwitch
                  checked={tracker[item.key]}
                  onCheckedChange={(checked) => handleToggle(item.key, checked)}
                  label={item.label}
                />

                {tracker[item.key] ? (
                  <div className="mt-3 flex flex-col gap-1.5 border-t border-border/50 pt-3 animate-fade-in">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Observed Date</label>
                    <Input
                      type="date"
                      value={healthDates[item.key] || ''}
                      onChange={(event) =>
                        setHealthDates((current) => ({ ...current, [item.key]: event.target.value }))
                      }
                      className="h-10 bg-background text-sm"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-[1.1rem] bg-sky-100 p-3 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                <Stethoscope size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Saved Health Alerts</p>
                <p className="text-3xl font-bold text-foreground">{savedHealthEntries.length}</p>
              </div>
            </div>
            {saveMessage ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 size={14} />
                {saveMessage}
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">Saved Health Dates</h3>
            <div className="mt-4 flex flex-col gap-3">
              {savedHealthEntries.length > 0 ? (
                savedHealthEntries.map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className={cn('text-sm font-medium', item.date ? 'text-sky-700 dark:text-sky-300' : 'text-muted-foreground')}>
                      {item.date ? formatHealthDate(item.date) : 'Date not set'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                  No health items saved yet for this child.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">Health Alert Badges</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert) => (
                  <Badge
                    key={alert}
                    variant="outline"
                    className={cn(
                      'rounded-full px-3 py-1.5 text-sm',
                      alert === 'Hospital Visit' && 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300',
                      alert !== 'Hospital Visit' && 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300'
                    )}
                  >
                    {alert}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="rounded-full border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                  No active health alerts
                </Badge>
              )}
            </div>
          </div>

          {savedHealthEntries.length > 0 ? (
            <Alert
              tone="warning"
              title="Health Follow-up Needed"
              description={`${savedHealthEntries.map((item) => item.label).join(', ')} have been recorded for this child. Review the saved dates and follow up if needed.`}
              action={
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  <TriangleAlert size={14} />
                  Review case
                </div>
              }
            />
          ) : (
            <Alert tone="success" title="No health issues saved" description="This child currently has no saved health alerts." />
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-border bg-background/50">
        <div className="border-b border-border bg-muted/30 px-5 py-4">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <CalendarDays size={18} className="text-sky-500" />
            Health History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Health Item</th>
                <th className="px-5 py-3 font-medium">Observed Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Notes</th>
              </tr>
            </thead>
            <tbody>
              {healthHistory.length > 0 ? (
                healthHistory
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <tr key={entry.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">{entry.item}</td>
                      <td className="px-5 py-3 text-muted-foreground">{formatHealthDate(entry.date)}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{entry.notes}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No health history saved yet for this child.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
