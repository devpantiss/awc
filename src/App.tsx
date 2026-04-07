// ============================================================
// APP - Root component with multi-role routing
// Routes: Login → Worker/Supervisor/Admin dashboards
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';

// Worker pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerChildren } from './pages/worker/WorkerChildren';
import { ChildProfile } from './pages/worker/ChildProfile';
import { AdaptiveLearning } from './pages/worker/AdaptiveLearning';
import { GreenBoardPage } from './pages/worker/GreenBoardPage';
import { WorkerInsights } from './pages/worker/WorkerInsights';
import { HealthNutrition } from './pages/worker/HealthNutrition';
import { ParentEngagement } from './pages/worker/ParentEngagement';

// Supervisor pages
import { SupervisorDashboard } from './pages/supervisor/SupervisorDashboard';
import { AWCDetail } from './pages/supervisor/AWCDetail';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHeatmap } from './pages/admin/AdminHeatmap';
import { AdminInsights } from './pages/admin/AdminInsights';
import { AdminReports } from './pages/admin/AdminReports';

export default function App() {
  return (
    <Routes>
      {/* Public: Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Worker Routes */}
      <Route path="/worker" element={<AppLayout />}>
        <Route index element={<WorkerDashboard />} />
        <Route path="child/:childId" element={<ChildProfile />} />
        <Route path="children" element={<WorkerChildren />} />
        <Route path="learning" element={<AdaptiveLearning />} />
        <Route path="nutrition" element={<HealthNutrition />} />
        <Route path="parents" element={<ParentEngagement />} />
        <Route path="board" element={<GreenBoardPage />} />
        <Route path="insights" element={<WorkerInsights />} />
      </Route>

      {/* Supervisor Routes */}
      <Route path="/supervisor" element={<AppLayout />}>
        <Route index element={<SupervisorDashboard />} />
        <Route path="awc-list" element={<SupervisorDashboard />} />
        <Route path="awc/:awcId" element={<AWCDetail />} />
        <Route path="analytics" element={<SupervisorDashboard />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AppLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="heatmap" element={<AdminHeatmap />} />
        <Route path="insights" element={<AdminInsights />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Default: redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
