// ============================================================
// ADMIN REPORTS - Summary reports page
// ============================================================

import { useState, useEffect } from 'react';
import { mockBlocks, districtKPIs } from '../../data/mockData';
import { cn, simulateAPI, formatIndianNumber } from '../../utils';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import { FileText, Download, Printer, Calendar } from 'lucide-react';

export function AdminReports() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    simulateAPI(null, 800).then(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText size={24} className="text-purple-600" />
            Reports
          </h2>
          <p className="text-sm text-muted-foreground mt-1">District-level performance reports</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
            <Download size={14} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* District Summary */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Report Period: January – June 2026</span>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-4">Ganjam District — ICDS Performance Summary</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Block Name</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">AWCs</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Children</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Avg Learning</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Nutrition Risk</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Performance</th>
              </tr>
            </thead>
            <tbody>
              {mockBlocks.map((block, i) => (
                <tr key={block.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors animate-fade-in opacity-0" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}>
                  <td className="py-3 px-4 font-medium text-foreground">{block.name}</td>
                  <td className="py-3 px-4 text-center text-foreground">{block.totalAWCs}</td>
                  <td className="py-3 px-4 text-center text-foreground">{formatIndianNumber(block.totalChildren)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn('font-semibold', block.avgLearningScore >= 65 ? 'text-emerald-600' : block.avgLearningScore >= 50 ? 'text-amber-600' : 'text-red-600')}>
                      {block.avgLearningScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn('font-semibold', block.nutritionRiskPercent <= 15 ? 'text-emerald-600' : block.nutritionRiskPercent <= 25 ? 'text-amber-600' : 'text-red-600')}>
                      {block.nutritionRiskPercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold',
                      block.performance === 'Good' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' :
                      block.performance === 'Average' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' :
                      'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
                    )}>{block.performance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-accent/30">
                <td className="py-3 px-4 font-bold text-foreground">District Total</td>
                <td className="py-3 px-4 text-center font-bold text-foreground">{districtKPIs.totalAWCs}</td>
                <td className="py-3 px-4 text-center font-bold text-foreground">{formatIndianNumber(districtKPIs.totalChildren)}</td>
                <td className="py-3 px-4 text-center font-bold text-blue-600">
                  {Math.round(mockBlocks.reduce((a, b) => a + b.avgLearningScore, 0) / mockBlocks.length)}%
                </td>
                <td className="py-3 px-4 text-center font-bold text-amber-600">
                  {Math.round(mockBlocks.reduce((a, b) => a + b.nutritionRiskPercent, 0) / mockBlocks.length)}%
                </td>
                <td className="py-3 px-4 text-center font-bold text-foreground">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
