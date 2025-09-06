// src/pages/ActivityLogsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import Header from '../components/Header';
import Modal from '../components/Modal';
import ActivityForm from '../components/ActivityForm';
import styles from '../styles/ActivityLogs.module.css';
import { FiPlus, FiFilter } from 'react-icons/fi';

// Activity type mappings for FR-004
const ACTIVITY_TYPES = {
    MDB_REPLIES: 'MDB Replies',
    TICKET_RESPONSES: 'Ticket Responses', 
    ASSIGNMENT_UPLOAD: 'Assignment/Material Upload',
    ASSIGNMENT_MARKING: 'Assignment Marking',
    GDB_MARKING: 'GDB Marking',
    WEEKLY_SESSION: 'Weekly Session',
    EMAIL_RESPONSES: 'Email Responses'
};

const formatActivityName = (apiName) => {
    if (!apiName) return '';
    return ACTIVITY_TYPES[apiName] || apiName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Enhanced detail formatting based on activity type
const formatLogDetails = (log) => {
    if (!log.details || typeof log.details !== 'object') {
        return 'No details provided.';
    }

    const { activity_type, details } = log;
    
    switch (activity_type) {
        case 'MDB_REPLIES':
            return `Topic: ${details.mdb_topic || 'N/A'}, Replies: ${details.number_of_replies || 0}`;
            
        case 'TICKET_RESPONSES':
            return `Ticket ID: ${details.ticket_id || 'N/A'}, Summary: ${details.response_summary || 'N/A'}`;
            
        case 'ASSIGNMENT_UPLOAD':
            return `Assignment: ${details.assignment_name || 'N/A'}, Type: ${details.material_type || 'Assignment'}`;
            
        case 'ASSIGNMENT_MARKING':
            return `Assignment: ${details.assignment_name || 'N/A'}, Marked: ${details.number_marked || 0}`;
            
        case 'GDB_MARKING':
            return `Topic: ${details.gdb_topic || 'N/A'}, Marked: ${details.number_marked || 0}`;
            
        case 'WEEKLY_SESSION':
            return `Session Date: ${details.session_date || 'N/A'}${details.attendance_notes ? `, Notes: ${details.attendance_notes}` : ''}`;
            
        case 'EMAIL_RESPONSES':
            return `Subject: ${details.email_subject || 'N/A'}, Purpose: ${details.email_purpose || 'N/A'}`;
            
        default:
            // Fallback for any other activity types
            const detailEntries = Object.entries(details)
                .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
                .join('; ');
            return detailEntries || 'No details provided.';
    }
};

const ActivityLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    
    // Filter states
    const [selectedActivityType, setSelectedActivityType] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [courses, setCourses] = useState([]);

    // Fetch courses for filtering
    const fetchCourses = useCallback(async () => {
        try {
            const response = await apiClient.get('/instructor/courses/');
            setCourses(response.data.data || []);
        } catch (err) {
            console.error("Failed to load courses for filtering");
        }
    }, []);

    // Fetch activity logs
    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/activities/');
            const logsData = response.data.data || [];
            setLogs(logsData);
            setFilteredLogs(logsData);
            setError('');
        } catch (err) {
            setError('Failed to fetch activity logs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Apply filters to logs
    const applyFilters = useCallback(() => {
        let filtered = [...logs];

        // Filter by activity type
        if (selectedActivityType) {
            filtered = filtered.filter(log => log.activity_type === selectedActivityType);
        }

        // Filter by course
        if (selectedCourse) {
            filtered = filtered.filter(log => log.course?.id === parseInt(selectedCourse));
        }

        // Filter by date range
        if (dateRange.start) {
            filtered = filtered.filter(log => new Date(log.log_date) >= new Date(dateRange.start));
        }
        if (dateRange.end) {
            filtered = filtered.filter(log => new Date(log.log_date) <= new Date(dateRange.end));
        }

        setFilteredLogs(filtered);
    }, [logs, selectedActivityType, selectedCourse, dateRange]);

    // Clear all filters
    const clearFilters = () => {
        setSelectedActivityType('');
        setSelectedCourse('');
        setDateRange({ start: '', end: '' });
    };

    useEffect(() => {
        fetchLogs();
        fetchCourses();
    }, [fetchLogs, fetchCourses]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleFormSubmit = () => {
        fetchLogs();
    };

    const handleAddActivity = () => {
        setEditingLog(null);
        setIsModalOpen(true);
    };

    const handleEditActivity = (log) => {
        setEditingLog(log);
        setIsModalOpen(true);
    };

    const handleDeleteActivity = async (logId) => {
        if (window.confirm('Are you sure you want to delete this log entry?')) {
            try {
                await apiClient.delete(`/activities/${logId}/`);
                fetchLogs();
            } catch (err) {
                alert('Failed to delete the activity log.');
                console.error(err);
            }
        }
    };

    // Get unique activity types for filter dropdown
    const uniqueActivityTypes = [...new Set(logs.map(log => log.activity_type))];

    return (
        <div>
            <Header 
                title="Activity Logs" 
                subtitle="Review and manage your logged course activities" 
            />
            
            {/* Controls and Filters */}
            <div className={styles.controls}>
                <div className={styles.filterSection}>
                    <div className={styles.filterGroup}>
                        <select 
                            value={selectedActivityType} 
                            onChange={(e) => setSelectedActivityType(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">All Activity Types</option>
                            {uniqueActivityTypes.map(type => (
                                <option key={type} value={type}>
                                    {formatActivityName(type)}
                                </option>
                            ))}
                        </select>

                        <select 
                            value={selectedCourse} 
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">All Courses</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.course_code} - {course.course_name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className={styles.filterInput}
                            placeholder="Start date"
                        />

                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className={styles.filterInput}
                            placeholder="End date"
                        />

                        <button 
                            onClick={clearFilters}
                            className={styles.clearFiltersBtn}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                <button className={styles.addButton} onClick={handleAddActivity}>
                    <FiPlus /> Log New Activity
                </button>
            </div>

            {/* Results Summary */}
            {!loading && (
                <div className={styles.summarySection}>
                    <p className={styles.resultsSummary}>
                        Showing {filteredLogs.length} of {logs.length} activity logs
                        {selectedActivityType && ` • ${formatActivityName(selectedActivityType)}`}
                        {selectedCourse && ` • ${courses.find(c => c.id === parseInt(selectedCourse))?.course_code}`}
                    </p>
                </div>
            )}

            {/* Activity Logs Table */}
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
                            {filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        <span className={`${styles.activityType} ${styles[log.activity_type?.toLowerCase()]}`}>
                                            {formatActivityName(log.activity_type)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.courseInfo}>
                                            <span className={styles.courseCode}>
                                                {log.course?.course_code || 'N/A'}
                                            </span>
                                            {log.course?.course_name && (
                                                <span className={styles.courseName}>
                                                    {log.course.course_name}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.details}>
                                            {formatLogDetails(log)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.dateInfo}>
                                            <span className={styles.date}>
                                                {new Date(log.log_date).toLocaleDateString()}
                                            </span>
                                            <span className={styles.time}>
                                                {new Date(log.log_date).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button 
                                                className={styles.editBtn} 
                                                onClick={() => handleEditActivity(log)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className={styles.deleteBtn} 
                                                onClick={() => handleDeleteActivity(log.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {!loading && !error && filteredLogs.length === 0 && logs.length > 0 && (
                    <p className={styles.noData}>No activity logs match the current filters.</p>
                )}
                
                {!loading && !error && logs.length === 0 && (
                    <p className={styles.noData}>No activity logs found. Start by logging your first activity!</p>
                )}
            </div>

            {/* Activity Form Modal */}
            <Modal 
                title={editingLog ? 'Edit Activity Log' : 'Log New Activity'} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
            >
                <ActivityForm
                    onFormSubmit={handleFormSubmit}
                    closeForm={() => setIsModalOpen(false)}
                    editingLog={editingLog}
                />
            </Modal>
        </div>
    );
};

export default ActivityLogsPage;