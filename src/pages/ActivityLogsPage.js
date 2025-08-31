// src/pages/ActivityLogsPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import Header from '../components/Header';
import styles from '../styles/ActivityLogs.module.css'; // New stylesheet
import Modal from '../components/Modal'; // Import Modal
import ActivityForm from '../components/ActivityForm'; // Import ActivityForm
import { FiPlus } from 'react-icons/fi';

// Helper to format names consistently
const formatActivityName = (apiName) => {
    if (!apiName) return '';
    return apiName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const ActivityLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/activities/');
            setLogs(response.data.data);
        } catch (err) {
            setError('Failed to fetch activity logs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleFormSubmit = () => {
        fetchLogs(); // Refetch the logs after a new one is submitted
    };

    return (
        <div>
            <Header title="Activity Logs" subtitle="Review and manage your logged course activities" />
            
            <div className={styles.controls}>
                {/* We can add search/filter controls here later */}
                <div/>
                <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                    <FiPlus /> Log New Activity
                </button>
            </div>

            <div className={styles.tableContainer}>
                {loading && <p>Loading logs...</p>}
                {error && <p className={styles.error}>{error}</p>}
                {!loading && !error && (
                    <table className={styles.logsTable}>
                        <thead>
                            <tr>
                                <th>Activity Type</th>
                                <th>Course</th>
                                <th>Details</th>
                                <th>Date Logged</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        <span className={styles.activityType}>
                                            {formatActivityName(log.activity_type)}
                                        </span>
                                    </td>
                                    <td>{log.course?.course_code || 'N/A'}</td>
                                    <td>
                                        {/* Display details from the JSON field */}
                                        <span className={styles.details}>
                                            {Object.entries(log.details).map(([key, value]) => `${key}: ${value}`).join(', ')}
                                        </span>
                                    </td>
                                    <td>{new Date(log.log_date).toLocaleString()}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.editBtn}>Edit</button>
                                            <button className={styles.deleteBtn}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
<Modal title="Log New Activity" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
    <ActivityForm onFormSubmit={handleFormSubmit} closeForm={() => setIsModalOpen(false)} />
</Modal>
                 {!loading && logs.length === 0 && <p className={styles.noData}>No activity logs found. Click "Log New Activity" to get started.</p>}
            </div>
        </div>
    );
};

export default ActivityLogsPage;