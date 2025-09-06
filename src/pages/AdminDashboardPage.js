// src/pages/AdminDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import styles from '../styles/Dashboard.module.css';

import Header from '../components/Header';
import StatCard from '../components/StatCard';
import QuickActions from '../components/QuickActions';
import RecentActivityFeed from '../components/RecentActivityFeed';

import { FiUsers, FiUserCheck, FiFileText, FiZap } from 'react-icons/fi';

const AdminDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/auth/dashboard/stats/');
        setStats(response.data.data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div>
      <Header
        title="Administrator Dashboard"
        subtitle={`Welcome back, ${user.first_name}! Here’s what’s happening in your system today.`}
      />
      <div className={styles.statsGrid}>
        <StatCard
          icon={<FiUsers />}
          title="Total Users"
          value={stats.total_users}
          growth={stats.total_users_growth}
          iconBgColor="#2980b9"
        />
        <StatCard
          icon={<FiUserCheck />}
          title="Active Instructors"
          value={stats.active_instructors}
          growth={stats.active_instructors_growth}
          iconBgColor="#27ae60"
        />
        <StatCard
          icon={<FiFileText />}
          title="Reports Generated"
          value={stats.reports_generated}
          growth={stats.reports_generated_growth}
          iconBgColor="#f39c12"
        />
        <StatCard
          icon={<FiZap />}
          title="System Performance"
          value={`${stats.system_performance.uptime_percentage}%`}
          growth="+2.1"
          iconBgColor="#c0392b"
        />
      </div>

      <div className={styles.dashboardSection}>
        <h2>Quick Actions</h2>
        <QuickActions />
      </div>
      <div className={styles.dashboardSection}>
        <h2>Recent System Activity</h2>
        <RecentActivityFeed />
      </div>
    </div>
  );
};

export default AdminDashboardPage;