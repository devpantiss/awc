import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAWCs } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '../../utils';
import { Search, Building2, ChevronRight, AlertTriangle, Users, BookOpen, Activity, LayoutDashboard } from 'lucide-react';

export function SupervisorDirectory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAWCs = mockAWCs.filter(awc => 
    awc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    awc.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    awc.block.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Centres Directory</h2>
          <p className="mt-2 text-sm text-muted-foreground">Manage and track individual Anganwadi Center dashboards across your assigned block.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search by centre, worker, or block..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Grid of AWC Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAWCs.map((awc, i) => (
          <div 
            key={awc.id} 
            className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
          >
            {/* Card Header */}
            <div className="p-5 border-b border-border/50 bg-muted/20 relative">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-2.5 h-2.5 rounded-full shadow-sm',
                    awc.status === 'Good' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                    awc.status === 'Warning' ? 'bg-amber-500 shadow-amber-500/50' : 
                    'bg-red-500 shadow-red-500/50'
                  )} />
                  <h3 className="text-lg font-bold text-foreground">{awc.name}</h3>
                </div>
                <span className={cn(
                  'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                  awc.status === 'Good' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' :
                  awc.status === 'Warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' :
                  'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                )}>
                  {awc.status}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <span className="font-medium text-foreground/80">{awc.workerName}</span>
                <span>•</span>
                <span>{awc.block}</span>
              </div>
            </div>

            {/* Card Body (Metrics) */}
            <div className="p-5 grid grid-cols-2 gap-4 flex-1">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Users size={14} />
                  <span className="text-xs font-medium uppercase tracking-wider">Attendance</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">{awc.presentToday}/{awc.totalChildren}</span>
                  <span className={cn(
                    "text-xs font-bold",
                    awc.attendanceRate >= 80 ? "text-emerald-500" : awc.attendanceRate >= 60 ? "text-amber-500" : "text-red-500"
                  )}>{awc.attendanceRate}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <BookOpen size={14} />
                  <span className="text-xs font-medium uppercase tracking-wider">Learning</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">{awc.avgLearningScore}%</span>
                  <span className="text-xs text-muted-foreground font-medium">Avg Score</span>
                </div>
              </div>

              <div className="space-y-1 col-span-2 mt-2">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Activity size={14} />
                  <span className="text-xs font-medium uppercase tracking-wider">Health & Nutrition</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted/30 rounded-lg p-2 text-center border border-border/50">
                    <span className="block text-[10px] uppercase text-muted-foreground font-bold mb-0.5">Critical</span>
                    <span className={cn("text-sm font-bold", awc.criticalCases > 0 ? "text-red-500" : "text-emerald-500")}>
                      {awc.criticalCases}
                    </span>
                  </div>
                  <div className="flex-1 bg-muted/30 rounded-lg p-2 text-center border border-border/50">
                    <span className="block text-[10px] uppercase text-muted-foreground font-bold mb-0.5">SAM</span>
                    <span className={cn("text-sm font-bold", awc.nutritionBreakdown.sam > 0 ? "text-amber-500" : "text-emerald-500")}>
                      {awc.nutritionBreakdown.sam}
                    </span>
                  </div>
                  <div className="flex-1 bg-muted/30 rounded-lg p-2 text-center border border-border/50">
                    <span className="block text-[10px] uppercase text-muted-foreground font-bold mb-0.5">MAM</span>
                    <span className="text-sm font-bold text-foreground">{awc.nutritionBreakdown.mam}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 bg-muted/10 border-t border-border flex items-center justify-between mt-auto">
              {awc.alerts.length > 0 ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <AlertTriangle size={14} />
                  {awc.alerts.length} Active Alert{awc.alerts.length !== 1 && 's'}
                </div>
              ) : (
                <div className="text-xs font-medium text-muted-foreground">All systems nominal</div>
              )}
              
              <button 
                onClick={() => navigate(`/supervisor/awc/${awc.id}`)}
                className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                <LayoutDashboard size={16} />
                Dashboard
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAWCs.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <Building2 size={48} className="text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground">No centres found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}
