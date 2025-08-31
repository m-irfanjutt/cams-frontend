// src/pages/AnalyticsPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import Header from '../components/Header';
import ActivityLineChart from '../components/charts/ActivityLineChart';
import ActivityDoughnutChart from '../components/charts/ActivityDoughnutChart';
import styles from '../styles/Analytics.module.css';

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/analytics/admin/');
                setAnalytics(response.data.data);
            } catch (err) {
                setError('Failed to load analytics data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading analytics...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div>
            <Header title="Analytics Dashboard" subtitle="Visualize system-wide activity and performance trends" />

            <div className={styles.chartGrid}>
                <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
                    <h3>Activity Over Last 30 Days</h3>
                    <ActivityLineChart data={analytics.activity_over_time} />
                </div>
                <div className={styles.chartCard}>
                    <h3>Activity Breakdown</h3>
                    <div className={styles.doughnutContainer}>
                        <ActivityDoughnutChart data={analytics.activity_by_type} />
                    </div>
                </div>
                <div className={styles.chartCard}>
                    <h3>Top 5 Active Instructors</h3>
                    <ul className={styles.instructorList}>
                        {analytics.top_instructors.map((instructor, index) => (
                            <li key={index}>
                                <span className={styles.instructorName}>{instructor.first_name} {instructor.last_name}</span>
                                <span className={styles.activityCount}>{instructor.activity_count} activities</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;