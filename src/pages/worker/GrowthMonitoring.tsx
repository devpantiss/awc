import { useMemo, useState } from 'react';
import { Activity, CalendarDays, Ruler, Scale, TrendingUp, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { managedChildren, growthHistoryByChild, calculateBMI, getGrowthStatusFromMuac, getNutritionTone } from '../../data/childMonitoringData';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { SideDrawer } from '../../components/ui/side-drawer';
import { cn } from '../../utils';

export function GrowthMonitoring() {
  const [selectedChildId, setSelectedChildId] = useState(managedChildren[0].id);
  const [entry, setEntry] = useState({ date: '2026-04-22', weight: '13.8', height: '94.5', muac: '13.4' });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const history = growthHistoryByChild[selectedChildId] ?? [];
  const bmi = calculateBMI(Number(entry.weight), Number(entry.height));
  const nutritionStatus = getGrowthStatusFromMuac(Number(entry.muac));
  const tone = getNutritionTone(nutritionStatus);

  const selectedChild = managedChildren.find((c) => c.id === selectedChildId);
  const latestEntry = history.at(-1);
  const earliestEntry = history[0];

  const isGrowthOnTrack = useMemo(() => {
    if (!latestEntry || !earliestEntry) return true;
    const weightGain = latestEntry.weight - earliestEntry.weight;
    const currentStatus = getGrowthStatusFromMuac(Number(latestEntry.muac));
    return weightGain >= 0 && currentStatus === 'Normal';
  }, [latestEntry, earliestEntry]);

  const chartData = useMemo(
    () => history.map((item) => ({ month: new Date(item.date).toLocaleDateString('en-IN', { month: 'short' }), weight: item.weight })),
    [history]
  );

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title="Add Growth Entry"
        description={`Record anthropometric details for ${selectedChild?.name ?? 'candidate'}.`}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date</label>
            <Input type="date" value={entry.date} onChange={(event) => setEntry((current) => ({ ...current, date: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Height (cm)</label>
            <Input type="number" step="0.1" value={entry.height} onChange={(event) => setEntry((current) => ({ ...current, height: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Weight (kg)</label>
            <Input type="number" step="0.1" value={entry.weight} onChange={(event) => setEntry((current) => ({ ...current, weight: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">MUAC (cm)</label>
            <Input type="number" step="0.1" value={entry.muac} onChange={(event) => setEntry((current) => ({ ...current, muac: event.target.value }))} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 mt-4">
            <div className="mb-4 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Scale size={18} className="text-sky-500" />
                 <span className="font-semibold text-foreground">Calculated Metrics</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-xs text-muted-foreground mb-1">BMI</p>
                  <p className="text-xl font-bold text-foreground">{bmi}</p>
               </div>
               <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline" className={cn(
                    tone === 'emerald' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                    tone === 'amber' && 'border-amber-200 bg-amber-50 text-amber-700',
                    tone === 'red' && 'border-red-200 bg-red-50 text-red-700'
                   )}>
                    {nutritionStatus}
                  </Badge>
               </div>
            </div>
          </div>
          
          <Button className="w-full h-12 rounded-2xl" onClick={() => setIsDrawerOpen(false)}>Save Growth Record</Button>
        </div>
      </SideDrawer>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Growth Monitoring</h2>
            <p className="mt-2 text-sm text-muted-foreground">Track weight, height, MUAC, and BMI using dummy growth entries.</p>
            {latestEntry && selectedChild && (
              <div className={cn(
                "mt-4 flex items-center gap-2 rounded-xl px-4 py-2 border w-fit shadow-sm",
                isGrowthOnTrack 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-300"
              )}>
                {isGrowthOnTrack ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span className="text-sm">
                  <span className="font-semibold">{selectedChild.name}'s</span> growth trajectory is <span className="font-semibold">{isGrowthOnTrack ? 'on track' : 'flagged for attention'}</span>.
                </span>
                <span className="text-xs opacity-75 ml-1 hidden sm:inline-block">
                  ({isGrowthOnTrack ? 'Healthy MUAC and positive weight trend' : 'Sub-optimal MUAC or weight loss detected'})
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

      <section className="space-y-6">
        <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Growth Trend & History</h3>
              <p className="mt-1 text-sm text-muted-foreground">Month-wise weight trend and detailed history for the selected child.</p>
            </div>
            <TrendingUp className="text-emerald-500" size={24} />
          </div>

          <div className="mt-8 flex flex-col gap-10">
            {/* Chart */}
            <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={4} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

            {/* History Table */}
            <div className="rounded-[1.5rem] border border-border bg-background/50 overflow-hidden flex flex-col">
              <div className="bg-muted/30 px-5 py-4 border-b border-border">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                   <CalendarDays size={18} className="text-sky-500" />
                   Recent Measurements
                </h4>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 backdrop-blur z-10">
                    <tr>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Height</th>
                      <th className="px-5 py-3 font-medium">MUAC</th>
                      <th className="px-5 py-3 font-medium text-right">Weight (Trend)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice().reverse().map((record: any, idx: number) => {
                      const previousRecord = history[history.length - idx - 2];
                      const gained = previousRecord ? (record.weight - previousRecord.weight) : 0;
                      return (
                        <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3 font-medium text-foreground whitespace-nowrap">
                            {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">{record.height} cm</td>
                          <td className="px-5 py-3 text-muted-foreground">{record.muac} cm</td>
                          <td className="px-5 py-3 text-right">
                            <span className="font-bold text-foreground">{record.weight} kg</span>
                            {gained > 0 ? (
                              <span className="text-[11px] font-medium text-emerald-500 block">+{gained.toFixed(1)} kg</span>
                            ) : gained < 0 ? (
                              <span className="text-[11px] font-medium text-red-500 block">{gained.toFixed(1)} kg</span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title="New Growth Entry"
        description="Add a new growth measurement for the selected child. BMI and status will be auto-calculated."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="rounded-xl px-6" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button className="rounded-xl px-6 bg-sky-500 hover:bg-sky-600 text-white" onClick={() => setIsDrawerOpen(false)}>Save Entry</Button>
          </div>
        }
      >
        <div className="space-y-8 pt-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date</label>
              <Input type="date" value={entry.date} onChange={(event) => setEntry((current) => ({ ...current, date: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Weight (kg)</label>
              <Input type="number" step="0.1" value={entry.weight} onChange={(event) => setEntry((current) => ({ ...current, weight: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Height (cm)</label>
              <Input type="number" step="0.1" value={entry.height} onChange={(event) => setEntry((current) => ({ ...current, height: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">MUAC (cm)</label>
              <Input type="number" step="0.1" value={entry.muac} onChange={(event) => setEntry((current) => ({ ...current, muac: event.target.value }))} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'BMI', value: bmi, icon: Activity },
              { label: 'Weight', value: `${entry.weight} kg`, icon: Scale },
              { label: 'Height', value: `${entry.height} cm`, icon: Ruler },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.25rem] border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                  <item.icon size={16} className="text-primary" />
                </div>
                <p className="mt-3 text-2xl font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-[1.25rem] border border-border bg-background/70 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Nutrition Status</p>
              <p className="mt-1 text-sm text-muted-foreground">Auto-calculated from MUAC entry.</p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'rounded-full px-3 py-1 text-sm',
                tone === 'emerald' && 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300',
                tone === 'amber' && 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300',
                tone === 'red' && 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300'
              )}
            >
              {nutritionStatus}
            </Badge>
          </div>
        </div>
      </SideDrawer>
    </div>
  );
}
