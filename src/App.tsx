import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// Dashboard components
import { InsightsDashboard } from './pages/dashboard/InsightsDashboard';
import { ExecutiveDashboard } from './pages/dashboard/ExecutiveDashboard';
import { AWCDashboard } from './pages/dashboard/AWCDashboard';
import { ChildProfile } from './pages/dashboard/ChildProfile';
import { Monitor } from './pages/dashboard/Monitor';

// Insights & Map components
import { AIInsights } from './pages/insights/AIInsights';
import { MapView } from './pages/insights/MapView';

// Arunima Booklet
import { ArunimaBooklet } from './pages/arunima/ArunimaBooklet';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Main Dashboard - Insights Rich */}
        <Route index element={<InsightsDashboard />} />
        
        {/* Central AWC Monitor - Hub for tracking all progress */}
        <Route path="monitor" element={<Monitor />} />
        
        {/* Executive Overview (legacy) */}
        <Route path="executive" element={<ExecutiveDashboard />} />
        
        {/* Child specific  */}
        <Route path="children" element={<ChildProfile />} />
        <Route path="children/:id" element={<ChildProfile />} />
        
        {/* Daily Ops */}
        <Route path="attendance" element={<AWCDashboard />} />
        
        {/* Insights & Map */}
        <Route path="insights" element={<AIInsights />} />
        <Route path="map" element={<MapView />} />
        
        {/* Arunima Booklet */}
        <Route path="arunima" element={<ArunimaBooklet />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
