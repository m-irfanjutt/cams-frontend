// src/pages/MyPerformancePage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import Header from '../components/Header';
import ActivityLineChart from '../components/charts/ActivityLineChart';
import ActivityDoughnutChart from '../components/charts/ActivityDoughnutChart';
import ActivityBarChart from '../components/charts/ActivityBarChart'; // Import the new chart
import styles from '../styles/Analytics.module.css'; // Reusing the same analytics styles

const MyPerformancePage = () => {
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/performance/instructor/');
                setPerformanceData(response.data.data);
            } catch (err) {
                setError('Failed to load performance data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformanceData();
    }, []);

    if (loading) return <div>Loading performance data...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    
    // Check if there's any data to display
    const noData = !performanceData || 
                   (performanceData.activity_over_time.length === 0 &&
                    performanceData.activity_by_type.length === 0 &&
                    performanceData.activity_by_course.length === 0);

    if (noData) {
        return (
            <div>
                <Header title="My Performance" subtitle="Visualize your activity and productivity trends" />
                <div className={styles.noDataPlaceholder}>
                    <h3>No Activity Data Available</h3>
                    <p>Log some activities to see your performance metrics here.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Header title="My Performance" subtitle="Visualize your activity and productivity trends" />

            <div className={styles.chartGrid}>
                <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
                    <h3>Your Activity Over Last 30 Days</h3>
                    <ActivityLineChart data={performanceData.activity_over_time} />
                </div>
                <div className={styles.chartCard}>
                    <h3>Your Activity Breakdown</h3>
                    <div className={styles.doughnutContainer}>
                        <ActivityDoughnutChart data={performanceData.activity_by_type} />
                    </div>
                </div>
                <div className={styles.chartCard}>
                    <h3>Activity by Course</h3>
                    <ActivityBarChart data={performanceData.activity_by_course} />
                </div>
            </div>
        </div>
    );
};

export default MyPerformancePage;