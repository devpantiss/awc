// ============================================================
// SIDEBAR - Role-aware navigation
// Shows different nav items based on user role
// ============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import {
  LayoutDashboard, Users, Brain, BookOpen, Activity,
  BarChart3, Map, Settings, ChevronLeft, ChevronRight,
  LogOut, Sparkles, ClipboardList, PenTool, HeartPulse, MessagesSquare,
} from 'lucide-react';

const workerNav = [
  { name: 'nav.dashboard', icon: LayoutDashboard, path: '/worker' },
  { name: 'nav.children', icon: Users, path: '/worker/children' },
  { name: 'nav.learning', icon: BookOpen, path: '/worker/learning' },
  { name: 'nav.nutrition', icon: HeartPulse, path: '/worker/nutrition' },
  { name: 'nav.parents', icon: MessagesSquare, path: '/worker/parents' },
  { name: 'nav.board', icon: PenTool, path: '/worker/board' },
  { name: 'nav.insights', icon: Brain, path: '/worker/insights' },
];

const supervisorNav = [
  { name: 'nav.overview', icon: LayoutDashboard, path: '/supervisor' },
  { name: 'nav.awc_list', icon: ClipboardList, path: '/supervisor/awc-list' },
  { name: 'nav.analytics', icon: BarChart3, path: '/supervisor/analytics' },
];

const adminNav = [
  { name: 'nav.district', icon: LayoutDashboard, path: '/admin' },
  { name: 'nav.heatmap', icon: Map, path: '/admin/heatmap' },
  { name: 'nav.insights', icon: Brain, path: '/admin/insights' },
  { name: 'nav.reports', icon: Activity, path: '/admin/reports' },
];

export function Sidebar() {
  const { userRole, sidebarCollapsed, collapseSidebar, currentUser, logout } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Pick correct nav based on role
  const navItems = userRole === 'worker' ? workerNav
    : userRole === 'supervisor' ? supervisorNav
    : adminNav;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(180deg,#0b1220_0%,#111827_42%,#0f172a_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_42%,#020617_100%)] text-white transition-all duration-300 relative z-20 border-r border-white/5',
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Brand header */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-emerald-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">{t('common.app_name')}</h2>
            <p className="text-[10px] text-slate-400 truncate">{t('common.app_subtitle')}</p>
          </div>
        )}
        <button
          onClick={() => collapseSidebar(!sidebarCollapsed)}
          className="ml-auto p-1.5 rounded-md hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Role badge */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3">
          <div className="px-3 py-2 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{t('role.logged_in_as')}</p>
            <p className="text-xs text-slate-300 font-medium truncate mt-0.5">{currentUser?.name}</p>
            <span className={cn(
              'inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full',
              userRole === 'worker' ? 'bg-emerald-900/50 text-emerald-400' :
              userRole === 'supervisor' ? 'bg-blue-900/50 text-blue-400' :
              'bg-purple-900/50 text-purple-400'
            )}>
              {userRole === 'worker' ? t('role.worker') : userRole === 'supervisor' ? t('role.supervisor') : t('role.admin')}
            </span>
          </div>
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/worker' || item.path === '/supervisor' || item.path === '/admin'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group',
              isActive
                ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500 text-white shadow-lg shadow-emerald-900/25 font-medium'
                : 'text-slate-300/80 hover:bg-white/10 hover:text-white'
            )}
            title={sidebarCollapsed ? t(item.name) : undefined}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm truncate">{t(item.name)}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-slate-800 space-y-1">
        {!sidebarCollapsed && (
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm">
            <Settings size={20} />
            {t('nav.settings')}
          </button>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors text-sm"
          title={sidebarCollapsed ? t('nav.logout') : undefined}
        >
          <LogOut size={20} />
          {!sidebarCollapsed && t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
