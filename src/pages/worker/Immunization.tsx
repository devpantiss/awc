import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Save, Syringe, TriangleAlert } from 'lucide-react';
import { managedChildren, immunizationByChild, getVaccineCompletionCount } from '../../data/childMonitoringData';
import { Alert } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { cn } from '../../utils';

const vaccineLabels = [
  { key: 'BCG', label: 'BCG' },
  { key: 'OPV', label: 'OPV' },
  { key: 'DPT', label: 'DPT' },
  { key: 'Measles', label: 'Measles' },
  { key: 'vitaminA', label: 'Vitamin A' },
] as const;

type VaccineKey = (typeof vaccineLabels)[number]['key'];

type SavedImmunizationState = {
  tracker: Record<VaccineKey, boolean>;
  vaccineDates: Partial<Record<VaccineKey, string>>;
};

function getDefaultDates(tracker: Record<VaccineKey, boolean>) {
  return Object.fromEntries(
    vaccineLabels
      .filter((vaccine) => tracker[vaccine.key])
      .map((vaccine) => [vaccine.key, '2026-04-24'])
  ) as Partial<Record<VaccineKey, string>>;
}

function formatVaccineDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function Immunization() {
  const [selectedChildId, setSelectedChildId] = useState(managedChildren[0].id);
  const [savedRecordsByChild, setSavedRecordsByChild] = useState<Record<string, SavedImmunizationState>>(() =>
    Object.fromEntries(
      managedChildren.map((child) => {
        const tracker = immunizationByChild[child.id] as Record<VaccineKey, boolean>;
        return [
          child.id,
          {
            tracker,
            vaccineDates: getDefaultDates(tracker),
          },
        ];
      })
    )
  );
  const [tracker, setTracker] = useState<Record<VaccineKey, boolean>>(
    savedRecordsByChild[selectedChildId]?.tracker ?? (immunizationByChild[selectedChildId] as Record<VaccineKey, boolean>)
  );
  const [vaccineDates, setVaccineDates] = useState<Partial<Record<VaccineKey, string>>>(
    savedRecordsByChild[selectedChildId]?.vaccineDates ?? {}
  );
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedState = savedRecordsByChild[selectedChildId];
    setTracker(savedState?.tracker ?? (immunizationByChild[selectedChildId] as Record<VaccineKey, boolean>));
    setVaccineDates(savedState?.vaccineDates ?? {});
    setSaveMessage('');
  }, [selectedChildId, savedRecordsByChild]);

  const dueVaccines = vaccineLabels.filter((vaccine) => !tracker[vaccine.key]);
  const completionCount = getVaccineCompletionCount(tracker);

  const savedVaccineEntries = useMemo(
    () =>
      vaccineLabels
        .filter((vaccine) => tracker[vaccine.key])
        .map((vaccine) => ({
          key: vaccine.key,
          label: vaccine.label,
          date: vaccineDates[vaccine.key] || '',
        })),
    [tracker, vaccineDates]
  );

  const handleSave = () => {
    const nextDates: Partial<Record<VaccineKey, string>> = {};
    vaccineLabels.forEach((vaccine) => {
      if (tracker[vaccine.key]) {
        nextDates[vaccine.key] = vaccineDates[vaccine.key] || '2026-04-24';
      }
    });

    setSavedRecordsByChild((current) => ({
      ...current,
      [selectedChildId]: {
        tracker: { ...tracker },
        vaccineDates: nextDates,
      },
    }));

    setVaccineDates(nextDates);
    setSaveMessage('Immunization record saved.');
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Immunization</h2>
            <p className="mt-2 text-sm text-muted-foreground">Mark vaccines as done, add the administered date, and save to show the vaccine name with its date.</p>
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

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground">Vaccine Tracker</h3>
            <Button onClick={handleSave} className="rounded-xl gap-2">
              <Save size={16} />
              Save
            </Button>
          </div>

          <div className="mt-6 grid gap-4">
            {vaccineLabels.map((vaccine) => (
              <div key={vaccine.key} className="flex flex-col gap-3 rounded-[1.25rem] border border-border bg-background/70 px-4 py-4 transition-all">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{vaccine.label}</span>
                  <input
                    type="checkbox"
                    checked={tracker[vaccine.key]}
                    onChange={(event) => {
                      const checked = event.target.checked;

                      setTracker((current) => ({ ...current, [vaccine.key]: checked }));

                      if (!checked) {
                        setVaccineDates((current) => {
                          const next = { ...current };
                          delete next[vaccine.key];
                          return next;
                        });
                        return;
                      }

                      setVaccineDates((current) => ({
                        ...current,
                        [vaccine.key]: current[vaccine.key] || '2026-04-24',
                      }));
                    }}
                    className="h-5 w-5 cursor-pointer rounded border-border text-primary accent-sky-500 focus:ring-primary"
                  />
                </label>

                {tracker[vaccine.key] && (
                  <div className="flex flex-col gap-1.5 border-t border-border/50 pt-3 animate-fade-in">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date Administered</label>
                    <Input
                      type="date"
                      value={vaccineDates[vaccine.key] || ''}
                      onChange={(event) =>
                        setVaccineDates((current) => ({ ...current, [vaccine.key]: event.target.value }))
                      }
                      className="h-10 bg-background text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-[1.1rem] bg-sky-100 p-3 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                <Syringe size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Completed Vaccine Counter</p>
                <p className="text-3xl font-bold text-foreground">{completionCount}/5</p>
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
            <h3 className="text-lg font-semibold text-foreground">Saved Vaccine Dates</h3>
            <div className="mt-4 space-y-3">
              {savedVaccineEntries.length > 0 ? (
                savedVaccineEntries.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className={cn('text-sm font-medium', item.date ? 'text-sky-700 dark:text-sky-300' : 'text-muted-foreground')}>
                      {item.date ? formatVaccineDate(item.date) : 'Date not set'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                  No vaccines saved yet for this child.
                </p>
              )}
            </div>
          </div>

          {dueVaccines.length > 0 ? (
            <Alert
              tone="warning"
              title="Due Vaccine Alert"
              description={`${dueVaccines.map((item) => item.label).join(', ')} still need to be completed for this child.`}
              action={
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  <TriangleAlert size={14} />
                  Schedule next session
                </div>
              }
            />
          ) : (
            <Alert tone="success" title="All vaccines complete" description="This child has completed the tracked immunization schedule." />
          )}
        </div>
      </section>
    </div>
  );
}
