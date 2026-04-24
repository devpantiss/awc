// ============================================================
// SUPERVISOR LEARNING
// Block-level overview of educational progress and avg scores
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAWCs } from '../../data/mockData';
import { cn } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ReferenceLine } from 'recharts';
import { BookOpen, Target, BrainCircuit, AlertCircle, Download } from 'lucide-react';

export function SupervisorLearning() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedAWC, setSelectedAWC] = useState<string>('all');

  const filteredAWCs = selectedAWC === 'all' ? mockAWCs : mockAWCs.filter(a => a.id === selectedAWC);

  const activeAWCs = filteredAWCs.filter(awc => awc.avgLearningScore > 0);
  const blockAvgLearning = activeAWCs.length 
    ? Math.round(activeAWCs.reduce((acc, awc) => acc + awc.avgLearningScore, 0) / activeAWCs.length) 
    : 0;

  const strugglingAWCs = filteredAWCs.filter(awc => awc.avgLearningScore < 60 && awc.avgLearningScore > 0);

  const chartData = filteredAWCs.map(awc => ({
    name: awc.name.split(' ')[1] || awc.name,
    score: awc.avgLearningScore
  })).sort((a,b) => b.score - a.score);

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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Educational Progress</h2>
          <p className="mt-2 text-sm text-muted-foreground">Monitor cluster-wide cognitive progression and identify centres requiring additional pedagogical support.</p>
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
               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Block Avg Score</p>
               <p className={cn("mt-3 text-4xl font-bold", blockAvgLearning >= 70 ? "text-emerald-500" : "text-amber-500")}>
                 {blockAvgLearning}<span className="text-xl text-muted-foreground font-medium">/100</span>
               </p>
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", blockAvgLearning >= 70 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300")}>
               <Target size={20} />
              </div>
           </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between">
              <div>
               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Active Assessments</p>
               <p className="mt-3 text-4xl font-bold text-sky-500">
                 {activeAWCs.length}<span className="text-xl text-muted-foreground font-medium">/{filteredAWCs.length}</span>
               </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
               <BrainCircuit size={20} />
              </div>
           </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between">
              <div>
               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Struggling AWCs (&lt;60)</p>
               <p className={cn("mt-3 text-4xl font-bold", strugglingAWCs.length > 0 ? "text-amber-500" : "text-emerald-500")}>
                 {strugglingAWCs.length}
               </p>
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", strugglingAWCs.length > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300")}>
               <AlertCircle size={20} />
              </div>
           </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Learning Scores by Centre</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={100} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} cursor={{fill: 'hsl(var(--muted)/0.3)'}} />
                <ReferenceLine x={70} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Target Goal', fill: '#10b981', fontSize: 10 }} />
                <Bar dataKey="score" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.score < 60 ? '#f59e0b' : '#0ea5e9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                 <BookOpen className="text-sky-500" size={20} />
                 Action Plan
              </h3>
            </div>
            
            {strugglingAWCs.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                 <BrainCircuit className="h-12 w-12 text-emerald-500/20 mb-3" />
                 <p className="text-sm">All centres are keeping up with the block curricular goals.</p>
               </div>
            ) : (
               <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                 <p className="text-sm text-muted-foreground mb-4">The following centres are trailing in cognitive outcomes and may need Teaching Learning Material (TLM) replenishment or pedagogy workshops.</p>
                 {strugglingAWCs.map(awc => (
                   <div key={awc.id} className="rounded-2xl border border-border bg-muted/20 p-4 flex flex-col gap-2 cursor-pointer hover:bg-muted/40 transition-colors" onClick={() => navigate(`/supervisor/awc/${awc.id}`)}>
                     <div className="flex justify-between items-center">
                       <div>
                         <p className="font-semibold text-foreground text-sm">{awc.name}</p>
                         <p className="text-xs text-muted-foreground mt-0.5">{awc.workerName}</p>
                       </div>
                       <span className="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 rounded-lg text-xs font-bold">
                         Score: {awc.avgLearningScore}
                       </span>
                     </div>
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
