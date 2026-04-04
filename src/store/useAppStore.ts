import { create } from 'zustand';
import type { Language, Role, SyncQueueItem, LearningAssessment } from '../types';

interface AppState {
  // Basic state
  language: Language;
  sidebarOpen: boolean;
  role: Role;
  
  // Online/Offline status
  isOnline: boolean;
  lastSyncTime: string | null;
  
  // Sync queue for offline-first
  syncQueue: SyncQueueItem[];
  
  // Actions
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  setRole: (role: Role) => void;
  
  // Online/Offline actions
  setOnlineStatus: (status: boolean) => void;
  setLastSyncTime: (time: string | null) => void;
  
  // Sync queue actions
  addToSyncQueue: (item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'status' | 'retryCount'>) => void;
  processSyncQueue: () => Promise<void>;
  clearSyncQueue: () => void;
  removeFromSyncQueue: (id: string) => void;
  
  // Learning assessment tracking
  recentAssessments: LearningAssessment[];
  addAssessment: (assessment: LearningAssessment) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  language: 'en',
  sidebarOpen: true,
  role: 'executive',
  isOnline: navigator.onLine,
  lastSyncTime: new Date().toISOString(),
  syncQueue: [],
  recentAssessments: [],
  
  // Basic actions
  setLanguage: (lang) => set({ language: lang }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setRole: (role) => set({ role }),
  
  // Online/Offline actions
  setOnlineStatus: (status) => set({ isOnline: status }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
  
  // Add item to sync queue
  addToSyncQueue: (item) => {
    const newQueueItem: SyncQueueItem = {
      ...item,
      id: `sq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
    };
    set((state) => ({
      syncQueue: [...state.syncQueue, newQueueItem]
    }));
  },
  
  // Process sync queue (simulate sync)
  processSyncQueue: async () => {
    const { syncQueue } = get();
    const pendingItems = syncQueue.filter(item => item.status === 'pending');
    
    if (pendingItems.length === 0) return;
    
    // Mark all as syncing
    set((state) => ({
      syncQueue: state.syncQueue.map(item => 
        item.status === 'pending' ? { ...item, status: 'syncing' as const } : item
      )
    }));
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mark all as synced (in real app, this would be actual API calls)
    set((state) => ({
      syncQueue: state.syncQueue.map(item => 
        item.status === 'syncing' ? { ...item, status: 'synced' as const } : item
      ),
      lastSyncTime: new Date().toISOString()
    }));
    
    // Remove synced items after a delay
    setTimeout(() => {
      set((state) => ({
        syncQueue: state.syncQueue.filter(item => item.status !== 'synced')
      }));
    }, 2000);
  },
  
  // Clear sync queue
  clearSyncQueue: () => set({ syncQueue: [] }),
  
  // Remove specific item from sync queue
  removeFromSyncQueue: (id) => set((state) => ({
    syncQueue: state.syncQueue.filter(item => item.id !== id)
  })),
  
  // Add learning assessment
  addAssessment: (assessment) => set((state) => ({
    recentAssessments: [assessment, ...state.recentAssessments].slice(0, 50) // Keep last 50
  })),
}));

// Custom hook for online/offline detection
export function useOnlineStatus() {
  const setOnlineStatus = useAppStore(state => state.setOnlineStatus);
  
  // This would be used in a useEffect to listen to online/offline events
  const handleOnline = () => setOnlineStatus(true);
  const handleOffline = () => setOnlineStatus(false);
  
  return { handleOnline, handleOffline };
}

// Selector helpers for performance
export const selectPendingSyncCount = (state: AppState) => 
  state.syncQueue.filter(item => item.status === 'pending').length;

export const selectIsSyncing = (state: AppState) => 
  state.syncQueue.some(item => item.status === 'syncing');

export const selectHasPendingSync = (state: AppState) => 
  state.syncQueue.some(item => item.status === 'pending' || item.status === 'syncing');