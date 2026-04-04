import { useAppStore, selectHasPendingSync } from '../../store/useAppStore';
import type { Role } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Bell, Wifi, WifiOff, RefreshCcw } from 'lucide-react';

export function Header() {
  const { language, setLanguage, role, setRole, isOnline, lastSyncTime, syncQueue } = useAppStore();
  const hasPendingSync = useAppStore(selectHasPendingSync);
  const pendingCount = syncQueue.filter(item => item.status === 'pending').length;

  const getRoleLabel = (r: Role) => {
    switch (r) {
      case 'executive': return 'Executive (Dist)';
      case 'block_officer': return 'Block Officer';
      case 'cdpo': return 'CDPO (GP)';
      case 'aww': return 'AWC Worker';
      default: return r;
    }
  };

  const formatLastSync = (time: string | null) => {
    if (!time) return 'Never';
    const date = new Date(time);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight hidden sm:block">
          {language === 'en' ? 'Anganwadi Monitoring System' : 
           language === 'hi' ? 'आंगनवाड़ी निगरानी प्रणाली' : 
           'ଅଙ୍ଗନୱାଡ଼ି ପର୍ଯ୍ୟବେକ୍ଷଣ ପ୍ରଣାଳୀ'}
        </h1>
        <Badge variant="outline" className="ml-2 text-indigo-600 border-indigo-200 bg-indigo-50">
          {getRoleLabel(role)}
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        {/* Online/Offline Indicator */}
        <div className="flex items-center gap-1 text-xs">
          {isOnline ? (
            <>
              <Wifi size={14} className="text-emerald-500" />
              <span className="text-emerald-600 hidden sm:inline">Online</span>
            </>
          ) : (
            <>
              <WifiOff size={14} className="text-red-500" />
              <span className="text-red-600 hidden sm:inline">Offline</span>
            </>
          )}
        </div>

        {/* Sync Status */}
        {hasPendingSync && (
          <div className="flex items-center gap-1 text-xs">
            <RefreshCcw size={14} className="text-amber-500 animate-spin" />
            <span className="text-amber-600 hidden sm:inline">{pendingCount} pending</span>
          </div>
        )}
        {lastSyncTime && !hasPendingSync && (
          <span className="text-xs text-slate-400 hidden sm:inline">
            {formatLastSync(lastSyncTime)}
          </span>
        )}

        {/* Language Selector */}
        <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
          <SelectTrigger className="w-28 h-9">
            <SelectValue placeholder="Lang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिंदी</SelectItem>
            <SelectItem value="od">ଓଡ଼ିଆ</SelectItem>
          </SelectContent>
        </Select>

        {/* Role Selector */}
        <Select value={role} onValueChange={(val: Role) => setRole(val)}>
          <SelectTrigger className="w-[150px] h-9 hidden md:flex">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="executive">Executive (Dist)</SelectItem>
            <SelectItem value="block_officer">Block Officer</SelectItem>
            <SelectItem value="cdpo">CDPO (GP)</SelectItem>
            <SelectItem value="aww">AWC Worker</SelectItem>
          </SelectContent>
        </Select>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <Avatar className="h-9 w-9 border border-slate-200">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AWC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
