// ============================================================
// SUPERVISOR GROWTH MONITORING
// Block-level overview of SAM/MAM children and growth trends
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAWCs } from '../../data/mockData';
import { cn, formatIndianNumber } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from 'recharts';
import { Activity, AlertTriangle, Scale, Target, TrendingUp, Download } from 'lucide-react';

export function SupervisorGrowth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedAWC, setSelectedAWC] = useState<string>('all');

  const filteredAWCs = selectedAWC === 'all' ? mockAWCs : mockAWCs.filter(a => a.id === selectedAWC);

  const totalRegistered = filteredAWCs.reduce((acc, awc) => acc + awc.totalChildren, 0);
  const totalSAM = filteredAWCs.reduce((acc, awc) => acc + awc.nutritionBreakdown.sam, 0);
  const totalMAM = filteredAWCs.reduce((acc, awc) => acc + awc.nutritionBreakdown.mam, 0);
  const totalNormal = filteredAWCs.reduce((acc, awc) => acc + awc.nutritionBreakdown.normal, 0);

  const samPercentage = Math.round((totalSAM / totalRegistered) * 100) || 0;
  const mamPercentage = Math.round((totalMAM / totalRegistered) * 100) || 0;

  const awcWithCriticalSAM = filteredAWCs.filter(awc => awc.nutritionBreakdown.sam >= 2);

  const chartData = filteredAWCs.map(awc => ({
    name: awc.name.split(' ')[1] || awc.name,
    Normal: awc.nutritionBreakdown.normal,
    MAM: awc.nutritionBreakdown.mam,
    SAM: awc.nutritionBreakdown.sam,
  }));

  const handleDownloadReport = () => {
    const headers = [
      'AWC Name', 'Worker', 'Total Enrolled', 'Present Today', 'Attendance Rate (%)',
      'SAM Cases', 'MAM Cases', 'Normal Weight', 
      'Avg Learning Score', 
      'THR Coverage (%)', 'MDD Score',
      'Immunization Coverage (%)'
    ];
    
    const rows = filteredAWCs.map(awc => {
      const seed = awc.name.charCodeAt(0) + awc.name.charCodeAt(awc.name.length-1);
      const thrCoverage = Math.floor((seed % 30) + 70);
      const mddScore = ((seed % 20) / 10 + 3).toFixed(1);
      const immCoverage = Math.floor((seed % 25) + 75);

      return [
        awc.name, awc.workerName, awc.totalChildren, awc.presentToday, awc.attendanceRate,
        awc.nutritionBreakdown.sam, awc.nutritionBreakdown.mam, awc.nutritionBreakdown.normal,
        awc.avgLearningScore,
        thrCoverage, mddScore,
        immCoverage
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `AWC_Comprehensive_Report_${selectedAWC === 'all' ? 'All_Centres' : selectedAWC}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Growth Aggregates</h2>
          <p className="mt-2 text-sm text-muted-foreground">Monitor severe and moderate acute malnutrition (SAM/MAM) numbers across AWCs.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="min-w-[200px] border border-border bg-card rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            value={selectedAWC}
            onChange={(e) => setSelectedAWC(e.target.value)}
          >
            <option value="all">All Centres</option>
            {mockAWCs.map(awc => (
              <option key={awc.id} value={awc.id}>{awc.name}</option>
            ))}
          </select>
          <button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium shadow-sm shadow-emerald-500/20 transition-colors whitespace-nowrap"
          >
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between">
              <div>
               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Normal Weight</p>
               <p className="mt-3 text-4xl font-bold text-emerald-500">{formatIndianNumber(totalNormal)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
               <Scale size={20} />
              </div>
           </div>
           <div className="mt-4 w-full bg-emerald-100 dark:bg-emerald-900/30 h-1.5 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full" style={{ width: `${Math.round((totalNormal/totalRegistered)*100)}%` }}></div>
           </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between">
              <div>
               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">MAM Cases</p>
               <p className="mt-3 text-4xl font-bold text-amber-500">{formatIndianNumber(totalMAM)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
               <TrendingUp size={20} />
              </div>
           </div>
           <div className="mt-4 w-full bg-amber-100 dark:bg-amber-900/30 h-1.5 rounded-full overflow-hidden">
               <div className="bg-amber-500 h-full" style={{ width: `${mamPercentage}%` }}></div>
           </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between">
              <div>
               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">SAM Cases</p>
               <p className="mt-3 text-4xl font-bold text-red-500">{formatIndianNumber(totalSAM)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
               <AlertTriangle size={20} />
              </div>
           </div>
           <div className="mt-4 w-full bg-red-100 dark:bg-red-900/30 h-1.5 rounded-full overflow-hidden">
               <div className="bg-red-500 h-full" style={{ width: `${samPercentage}%` }}></div>
           </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between">
              <div>
               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Critical AWCs (SAM &ge; 2)</p>
               <p className={cn("mt-3 text-4xl font-bold", awcWithCriticalSAM.length > 0 ? "text-red-500" : "text-emerald-500")}>{awcWithCriticalSAM.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
               <Target size={20} />
              </div>
           </div>
           <p className="mt-3 text-xs text-muted-foreground">Centres requiring immediate nutritional interventions.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Nutrition Breakdown by AWC</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Normal" fill="#10b981" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="MAM" fill="#f59e0b" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="SAM" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                 <AlertTriangle className="text-red-500" size={20} />
                 Elevated SAM Alerts
              </h3>
            </div>
            
            {awcWithCriticalSAM.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                 <Scale className="h-12 w-12 text-emerald-500/20 mb-3" />
                 <p className="text-sm">No centres have a critical concentration of SAM cases.</p>
               </div>
            ) : (
               <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                 {awcWithCriticalSAM.map(awc => (
                   <div key={awc.id} className="rounded-2xl border border-red-100 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/10 flex flex-col gap-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" onClick={() => navigate(`/supervisor/awc/${awc.id}`)}>
                     <div className="flex justify-between items-start">
                       <div>
                         <p className="font-semibold text-foreground text-sm">{awc.name}</p>
                         <p className="text-xs text-muted-foreground mt-0.5">{awc.location}</p>
                       </div>
                       <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-lg text-xs font-bold">
                         {awc.nutritionBreakdown.sam} SAM Cases
                       </span>
                     </div>
                     <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">Requires immediate medical follow-up.</p>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
