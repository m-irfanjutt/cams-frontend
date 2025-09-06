// src/pages/InstructorDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import styles from '../styles/Dashboard.module.css'; // Reusing the same dashboard styles

import Header from '../components/Header';
import StatCard from '../components/StatCard';
import ActivityItem from '../components/ActivityItem'; // Reusing the activity item

import { FiActivity, FiCheckSquare, FiClipboard } from 'react-icons/fi';

// A helper to format the activity breakdown data
const formatActivityName = (apiName) => {
    if (!apiName) return '';
    return apiName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const InstructorDashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/dashboard/instructor/');
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

    // Find the most frequent activity from the breakdown
    const topActivity = stats.activity_breakdown.length > 0
        ? formatActivityName(stats.activity_breakdown[0].activity_type)
        : 'N/A';

    return (
        <div>
            <Header
                title="Instructor Dashboard"
                subtitle={`Welcome back, ${user.first_name}! Here's a summary of your recent activity.`}
            />
            <div className={styles.statsGrid}>
                <StatCard
                    icon={<FiActivity />}
                    title="Total Activities Logged"
                    value={stats.total_activities}
                    iconBgColor="#2980b9"
                />
                <StatCard
                    icon={<FiCheckSquare />}
                    title="Most Frequent Activity"
                    value={topActivity}
                    iconBgColor="#27ae60"
                />
                <StatCard
                    icon={<FiClipboard />}
                    title="Courses Assigned"
                    value={stats.courses_assigned_count}
                    iconBgColor="#f39c12"
                />
            </div>

            <div className={styles.dashboardSection}>
                <h2>Recent Activities</h2>
                <div>
                    {stats.recent_activities && stats.recent_activities.length > 0 ? (
                        stats.recent_activities.map(event => (
                            <ActivityItem key={event.id} event={{
                                ...event,
                                actor: event.instructor,
                                timestamp: event.log_date,
                                event_type: event.activity_type, // Pass the real type
                            }} />
                        ))
                    ) : (
                        <p>You have no recent activities.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboardPage;