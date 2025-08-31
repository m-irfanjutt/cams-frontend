// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagementPage from './pages/UserManagementPage';
import ReportsPage from './pages/ReportsPage';
import SystemConfigPage from './pages/SystemConfigPage';
import SignUpPage from './pages/SignUpPage'; // Import the new page
import AnalyticsPage from './pages/AnalyticsPage';
import ActivityLogsPage from './pages/ActivityLogsPage';
import MyPerformancePage from './pages/MyPerformancePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} /> {/* Add this route */}
          
          <Route element={<ProtectedRoute />}>
            {/* ... (all protected routes remain the same) ... */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<SystemConfigPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} /> {/* Add this line */}
            <Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
            <Route path="/instructor/logs" element={<ActivityLogsPage />} />
            <Route path="/instructor/performance" element={<MyPerformancePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;