// ============================================================
// ANGANWADI WORKER - CHILD DEVELOPMENT MODULE
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  ChevronRight,
  Activity,
  TrendingUp,
  Utensils,
  Plus,
  ClipboardCheck,
  Filter,
} from 'lucide-react';
import { mockChildren } from '../../data/mockData';
import { cn, formatAge, simulateAPI } from '../../utils';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import type { Child } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

export function WorkerChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showRiskOnly, setShowRiskOnly] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Simulate API call to fetch children
  useEffect(() => {
    setLoading(true);
    simulateAPI(mockChildren, 800).then((data) => {
      setChildren(data);
      setLoading(false);
    });
  }, []);

  // Filter children
  const filteredChildren = children.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || c.nutritionStatus === filterStatus;
    const matchesRisk = !showRiskOnly || c.riskFlags.combinedRisk === 'High';
    return matchesSearch && matchesFilter && matchesRisk;
  });

  const malnutritionCount = children.filter(c => c.nutritionStatus !== 'status.normal').length;
  const avgAttendance = Math.round(children.reduce((acc, c) => acc + c.attendanceRate, 0) / (children.length || 1));

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* Header & Main Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">{t('children.title')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('children.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {}} // TODO: Register modal
            className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={18} />
            {t('children.actions.register')}
          </button>
          <button 
            onClick={() => navigate('/worker/learning')}
            className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground hover:bg-accent transition-all"
          >
            <ClipboardCheck size={18} className="text-primary" />
            {t('children.actions.quick_assessment')}
          </button>
        </div>
      </div>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t('children.stats.total'), value: children.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: t('children.stats.malnourished'), value: malnutritionCount, icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30' },
          { label: t('children.stats.attendance'), value: `${avgAttendance}%`, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm">
            <div className={cn('p-3 rounded-2xl', stat.bg)}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col gap-4 p-6 rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('children.search_placeholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-[1.25rem] border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {['all', 'status.normal', 'status.mam', 'status.sam'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold transition-all border',
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-background border-border text-muted-foreground hover:bg-accent'
                )}
              >
                {status === 'all' ? t('common.view_all') : t(status)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div 
              className={cn(
                'w-10 h-6 rounded-full transition-all relative border',
                showRiskOnly ? 'bg-red-500 border-red-600' : 'bg-muted border-border'
              )}
              onClick={() => setShowRiskOnly(!showRiskOnly)}
            >
              <div 
                className={cn(
                  'absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm',
                  showRiskOnly ? 'left-5' : 'left-1'
                )}
              />
            </div>
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {t('children.filter.risk_only')}
            </span>
          </label>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Filter size={14} />
            {t('children.filter.showing', { count: filteredChildren.length, total: children.length })}
          </div>
        </div>
      </div>

      {/* Children Batches */}
      <div className="space-y-10">
        {filteredChildren.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border border-dashed rounded-[2rem]">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-muted-foreground opacity-40" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{t('children.no_results')}</h3>
            <p className="text-sm text-muted-foreground mt-2">{t('children.no_results_desc')}</p>
          </div>
        ) : (
          [
            { id: 'beginners', name: t('children.batch_beginner'), children: filteredChildren.filter(c => c.ageMonths >= 36 && c.ageMonths < 48) },
            { id: 'intermediate', name: t('children.batch_intermediate'), children: filteredChildren.filter(c => c.ageMonths >= 48 && c.ageMonths < 60) },
            { id: 'advanced', name: t('children.batch_advanced'), children: filteredChildren.filter(c => c.ageMonths >= 60) }
          ]
          .filter(batch => batch.children.length > 0)
          .map((batch) => (
            <div key={batch.id} className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-primary/20 pb-2">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  {batch.name}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {batch.children.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batch.children.map((child, index) => {
                  const statusLabel = 
                    child.nutritionStatus === 'status.normal' ? 'Healthy' : 
                    child.nutritionStatus === 'status.mam' ? 'Monitor' : 'Critical';

                  return (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-5 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 pointer-events-auto"
                      onClick={() => navigate(`/worker/child/${child.id}`)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className={cn(
                          'w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-lg',
                          child.gender === 'M'
                            ? 'bg-gradient-to-br from-blue-400 to-blue-700'
                            : 'bg-gradient-to-br from-rose-400 to-rose-700'
                        )}>
                          {child.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">{child.name}</h4>
                              <p className="text-xs text-muted-foreground font-medium">
                                {formatAge(child.ageMonths, t)} · {child.gender === 'M' ? t('status.boy') : t('status.girl')}
                              </p>
                            </div>
                            <div className={cn(
                              'text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tight',
                              statusLabel === 'Healthy' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
                              statusLabel === 'Monitor' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
                              statusLabel === 'Critical' && 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
                            )}>
                              {statusLabel}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-background border border-border/50">
                              <TrendingUp size={14} className="text-blue-500" />
                              <div className="min-w-0">
                                <p className="text-[10px] text-muted-foreground leading-none">{t('children.card.learning')}</p>
                                <p className="text-xs font-bold text-foreground truncate">{child.learningScore}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-background border border-border/50">
                              <Activity size={14} className="text-amber-500" />
                              <div className="min-w-0">
                                <p className="text-[10px] text-muted-foreground leading-none">{t('children.card.attendance')}</p>
                                <p className="text-xs font-bold text-foreground truncate">{child.attendanceRate}%</p>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions Bar */}
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate(`/worker/child/${child.id}`); }}
                              className="flex-1 py-2 rounded-xl bg-accent text-[10px] font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1.5"
                            >
                              {t('children.card.view_metrics')} <ChevronRight size={12} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate(`/worker/learning`); }}
                              className="px-3 py-2 rounded-xl bg-primary/10 text-[10px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1.5"
                            >
                              <ClipboardCheck size={12} /> {t('children.card.assess')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
