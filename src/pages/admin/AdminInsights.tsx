// ============================================================
// ADMIN AI INSIGHTS - Full insights panel
// ============================================================

import { useState, useEffect } from 'react';
import { mockInsights } from '../../data/mockData';
import { cn, simulateAPI, formatRelativeTime } from '../../utils';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import {
  Brain, AlertCircle, AlertTriangle, CheckCircle2, Info,
  ArrowRight, Filter,
} from 'lucide-react';

import { useTranslation } from '../../hooks/useTranslation';

type InsightFilter = 'all' | 'critical' | 'warning' | 'success' | 'info';

export function AdminInsights() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InsightFilter>('all');

  useEffect(() => {
    simulateAPI(null, 800).then(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const filtered = filter === 'all' ? mockInsights : mockInsights.filter(i => i.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle size={20} className="text-red-600 dark:text-red-400" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />;
      case 'success': return <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />;
      default: return <Info size={20} className="text-blue-600 dark:text-blue-400" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/10';
      case 'warning': return 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/10';
      case 'success': return 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/10';
      default: return 'border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/10';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain size={24} className="text-purple-600" />
            AI Insights
          </h2>
          <p className="text-sm text-muted-foreground mt-1">AI-generated analysis and recommendations</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All', count: mockInsights.length },
            { id: 'critical', label: 'Critical', count: mockInsights.filter(i => i.type === 'critical').length },
            { id: 'warning', label: 'Warning', count: mockInsights.filter(i => i.type === 'warning').length },
            { id: 'success', label: 'Success', count: mockInsights.filter(i => i.type === 'success').length },
            { id: 'info', label: 'Info', count: mockInsights.filter(i => i.type === 'info').length },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as InsightFilter)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-semibold border transition-all',
                filter === f.id
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-card border-border text-muted-foreground hover:bg-accent'
              )}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-center">
          <p className="text-2xl font-bold text-red-600">{mockInsights.filter(i => i.type === 'critical').length}</p>
          <p className="text-xs text-red-600/80">Critical</p>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 text-center">
          <p className="text-2xl font-bold text-amber-600">{mockInsights.filter(i => i.type === 'warning').length}</p>
          <p className="text-xs text-amber-600/80">Warnings</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 text-center">
          <p className="text-2xl font-bold text-emerald-600">{mockInsights.filter(i => i.type === 'success').length}</p>
          <p className="text-xs text-emerald-600/80">Successes</p>
        </div>
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 text-center">
          <p className="text-2xl font-bold text-blue-600">{mockInsights.filter(i => i.actionRequired).length}</p>
          <p className="text-xs text-blue-600/80">Action Needed</p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filtered.map((insight, i) => (
          <div
            key={insight.id}
            className={cn('p-5 rounded-xl border transition-all hover:shadow-md animate-fade-in-up opacity-0', getBg(insight.type ?? 'info'))}
            style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5">{getIcon(insight.type ?? 'info')}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-foreground">{insight.title}</h4>
                  {insight.blockName && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">{insight.blockName}</span>
                  )}
                  {insight.awcName && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-medium">{insight.awcName}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{insight.message ?? ''}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(insight.timestamp ?? '', t)}</span>
                  {insight.actionRequired && (
                    <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      Take Action <ArrowRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
