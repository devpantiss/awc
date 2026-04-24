// ============================================================
// SUPERVISOR IMMUNIZATION
// Block-level overview of Immunization coverage
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAWCs } from '../../data/mockData';
import { cn } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Syringe, ShieldCheck, AlertTriangle, Download } from 'lucide-react';

export function SupervisorImmunization() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedAWC, setSelectedAWC] = useState<string>('all');

  const filteredAWCs = selectedAWC === 'all' ? mockAWCs : mockAWCs.filter(a => a.id === selectedAWC);

  // Mapped mock data for Immunization
  const awcImmuneData = filteredAWCs.map(awc => ({
    ...awc,
    coverage: Math.floor(Math.random() * 25 + 75), // Random coverage 75%-100%
    dueCount: Math.floor(Math.random() * 15)
  }));

  const totalRegistered = filteredAWCs.reduce((acc, awc) => acc + awc.totalChildren, 0);
  const totalCovered = awcImmuneData.reduce((acc, awc) => acc + Math.floor((awc.coverage / 100) * awc.totalChildren), 0);
  const totalOverdue = awcImmuneData.reduce((acc, awc) => acc + awc.dueCount, 0);
  const avgCoverage = Math.round((totalCovered / totalRegistered) * 100) || 0;

  const lowCoverageAWCs = awcImmuneData.filter(awc => awc.coverage < 85);

  const chartData = awcImmuneData.map(awc => ({
    name: awc.name.split(' ')[1] || awc.name,
    coverage: awc.coverage
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Immunization Coverage</h2>
          <p className="mt-2 text-sm text-muted-foreground">Monitor vaccination rates against UIP schedule and identify children who are overdue for their shots.</p>
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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between">
              <div>
               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Block Coverage</p>
               <p className={cn("mt-3 text-4xl font-bold", avgCoverage >= 90 ? "text-emerald-500" : "text-amber-500")}>
                 {avgCoverage}%
               </p>
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", avgCoverage >= 90 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300")}>
               <ShieldCheck size={20} />
              </div>
           </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between">
              <div>
               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Total Overdue</p>
               <p className={cn("mt-3 text-4xl font-bold", totalOverdue > 0 ? "text-red-500" : "text-emerald-500")}>
                 {totalOverdue}
               </p>
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", totalOverdue > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300")}>
               <Syringe size={20} />
              </div>
           </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between">
              <div>
               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Low Coverage Centres</p>
               <p className={cn("mt-3 text-4xl font-bold", lowCoverageAWCs.length > 0 ? "text-red-500" : "text-emerald-500")}>
                 {lowCoverageAWCs.length}
               </p>
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", lowCoverageAWCs.length > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300")}>
               <AlertTriangle size={20} />
              </div>
           </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Immunization Coverage By AWC</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorImmune" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis domain={['auto', 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="coverage" stroke="#3b82f6" fillOpacity={1} fill="url(#colorImmune)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                 <AlertTriangle className="text-red-500" size={20} />
                 Action Needed
              </h3>
            </div>
            
            {lowCoverageAWCs.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                 <ShieldCheck className="h-12 w-12 text-emerald-500/20 mb-3" />
                 <p className="text-sm">All centres have high immunization rates above 85%.</p>
               </div>
            ) : (
               <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                 {lowCoverageAWCs.map(awc => (
                   <div key={awc.id} className="rounded-2xl border border-red-100 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/10 flex flex-col gap-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" onClick={() => navigate(`/supervisor/awc/${awc.id}`)}>
                     <div className="flex justify-between items-start">
                       <div>
                         <p className="font-semibold text-foreground text-sm">{awc.name}</p>
                         <p className="text-xs text-muted-foreground mt-0.5">{awc.workerName}</p>
                       </div>
                       <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-lg text-xs font-bold">
                         Coverage: {awc.coverage}%
                       </span>
                     </div>
                     <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">{awc.dueCount} children overdue</p>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Immunization Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl border-b border-border">AWC Name</th>
                <th className="px-6 py-4 border-b border-border">Eligible Children</th>
                <th className="px-6 py-4 border-b border-border text-center">Coverage Rate</th>
                <th className="px-6 py-4 border-b border-border text-center">Overdue Vaccines</th>
              </tr>
            </thead>
            <tbody>
              {awcImmuneData.map((awc, idx) => (
                <tr key={awc.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground cursor-pointer hover:text-sky-500 transition-colors" onClick={() => navigate(`/supervisor/awc/${awc.id}`)}>
                    {awc.name}
                  </td>
                  <td className="px-6 py-4">{awc.totalChildren}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", 
                       awc.coverage >= 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
                       awc.coverage >= 80 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                       'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                    )}>
                      {awc.coverage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("font-medium", awc.dueCount > 0 ? "text-red-500" : "text-emerald-500")}>
                      {awc.dueCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
