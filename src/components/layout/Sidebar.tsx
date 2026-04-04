import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { LayoutDashboard, Users, Activity, Map, BrainCircuit, ChevronLeft, ChevronRight, BookOpen, Radar } from 'lucide-react';
import { cn } from '../../utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'AWC Monitor', icon: Radar, path: '/monitor' },
  { name: 'Child Directory', icon: Users, path: '/children' },
  { name: 'Attendance', icon: Activity, path: '/attendance' },
  { name: 'AI Insights', icon: BrainCircuit, path: '/insights' },
  { name: 'Arunima Booklet', icon: BookOpen, path: '/arunima' },
  { name: 'Map View', icon: Map, path: '/map' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside className={cn("bg-indigo-900 text-white transition-all duration-300 relative rounded-tr-xl flex flex-col", sidebarOpen ? "w-64" : "w-20")}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-indigo-800">
        {sidebarOpen && <span className="font-bold text-xl tracking-tight text-white/90">AWC Monitor</span>}
        <button onClick={toggleSidebar} className="p-2 hover:bg-indigo-800 rounded-md transition-colors ml-auto">
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors whitespace-nowrap overflow-hidden",
              isActive ? "bg-indigo-700 text-white font-medium" : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
            )}
            title={!sidebarOpen ? item.name : undefined}
          >
            <item.icon size={22} className="shrink-0" />
            <span className={cn("transition-opacity duration-300", sidebarOpen ? "opacity-100" : "opacity-0 w-0")}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-indigo-800">
        <div className={cn("text-xs text-indigo-400 pb-2", !sidebarOpen && "text-center")}>
          {sidebarOpen ? "Gov. Monitoring System" : "Gov."}
        </div>
      </div>
    </aside>
  );
}
