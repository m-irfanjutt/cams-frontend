// src/pages/ReportsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import Header from '../components/Header';
import styles from '../styles/Reports.module.css';
import { FiDownload, FiEye, FiTrash2, FiPlayCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // State for the report generation form
    const [reportType, setReportType] = useState('ACTIVITY_SUMMARY');
    const [timePeriod, setTimePeriod] = useState('THIS_WEEK');
    const [selectedInstructor, setSelectedInstructor] = useState('ALL');

    const fetchReports = useCallback(async () => {
        try {
            const response = await apiClient.get('/reports/');
            setReports(response.data.data);
        } catch (err) {
            setError('Failed to fetch reports.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const usersResponse = await apiClient.get('/auth/users/');
                const instructorUsers = usersResponse.data.data.filter(u => u.profile.role === 'INSTRUCTOR');
                setInstructors(instructorUsers);
                await fetchReports();
            } catch (err) {
                setError('Failed to load initial page data.');
            }
        };

        fetchInitialData();
    }, [fetchReports]);

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        
        const now = new Date();
        let startDate, endDate;

        switch (timePeriod) {
            case 'THIS_WEEK':
                startDate = startOfWeek(now);
                endDate = endOfWeek(now);
                break;
            case 'LAST_WEEK':
                const lastWeekStart = startOfWeek(subDays(now, 7));
                startDate = lastWeekStart;
                endDate = endOfWeek(lastWeekStart);
                break;
            case 'THIS_MONTH':
                startDate = startOfMonth(now);
                endDate = endOfMonth(now);
                break;
            case 'LAST_MONTH':
                const lastMonthStart = startOfMonth(subMonths(now, 1));
                startDate = lastMonthStart;
                endDate = endOfMonth(lastMonthStart);
                break;
            default:
                setIsGenerating(false);
                return;
        }

        const payload = {
            report_type: reportType,
            start_date: format(startDate, 'yyyy-MM-dd'),
            end_date: format(endDate, 'yyyy-MM-dd'),
            instructor_id: selectedInstructor,
        };

        try {
            const response = await apiClient.post('/reports/', payload);
            setReports(prev => [response.data.data, ...prev]); // Instantly add new report to the list
            alert('Report generated successfully!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unknown error occurred.';
            alert(`Failed to generate report: ${errorMessage}`);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleDeleteReport = async (reportId) => {
        if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            try {
                await apiClient.delete('/reports/', { data: { id: reportId } });
                setReports(prev => prev.filter(r => r.id !== reportId)); // Instantly remove report from the list
            } catch (err) {
                alert('Failed to delete the report.');
                console.error(err);
            }
        }
    };
    
    const getStatusIcon = (status) => {
        switch(status) {
            case 'Completed': return <FiPlayCircle className={`${styles.statusIcon} ${styles.completed}`} />;
            case 'Processing': return <FiClock className={`${styles.statusIcon} ${styles.pending}`} />; // Assuming Pending style for Processing
            case 'Pending': return <FiClock className={`${styles.statusIcon} ${styles.pending}`} />;
            case 'Failed': return <FiXCircle className={`${styles.statusIcon} ${styles.failed}`} />;
            default: return null;
        }
    };

    return (
        <div>
            <Header title="Reports & Analytics" subtitle="Generate comprehensive activity reports and track performance metrics" />

            <div className={styles.reportsContainer}>
                {/* Left Panel: Generate Report */}
                <div className={styles.generatePanel}>
                    <h3>Generate Report</h3>
                    <form onSubmit={handleGenerateReport}>
                        <div className={styles.formGroup}>
                            <label>Report Type</label>
                            <select value={reportType} onChange={e => setReportType(e.target.value)}>
                                <option value="ACTIVITY_SUMMARY">Activity Summary</option>
                                <option value="PERFORMANCE_ANALYSIS">Performance Analysis</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Time Period</label>
                            <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)}>
                                <option value="THIS_WEEK">This Week</option>
                                <option value="LAST_WEEK">Last Week</option>
                                <option value="THIS_MONTH">This Month</option>
                                <option value="LAST_MONTH">Last Month</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Select Instructors</label>
                            <select value={selectedInstructor} onChange={e => setSelectedInstructor(e.target.value)}>
                                <option value="ALL">All Instructors</option>
                                {instructors.map(inst => (
                                    <option key={inst.id} value={inst.id}>
                                        {inst.first_name} {inst.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className={styles.generateButton} disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Generate Report'}
                        </button>
                    </form>
                </div>

                {/* Right Panel: Report Overview */}
                <div className={styles.overviewPanel}>
                    <h3>Report Overview</h3>
                    <div className={styles.reportList}>
                        {loading && <p>Loading reports...</p>}
                        {error && <p className={styles.error}>{error}</p>}
                        {!loading && !error && reports.map(report => (
                            <div key={report.id} className={styles.reportItem}>
                                <div className={styles.reportInfo}>
                                    <div className={styles.reportIcon}>{getStatusIcon(report.status)}</div>
                                    <div>
                                        <p className={styles.reportName}>{report.report_type.replace(/_/g, ' ')}</p>
                                        <p className={styles.reportMeta}>
                                            Period: {format(new Date(report.start_date), 'MMM d, yyyy')} to {format(new Date(report.end_date), 'MMM d, yyyy')}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.reportStatus}>
                                    <span>{report.status}</span>
                                </div>
                                <div className={styles.reportActions}>
                                    <a 
                                        href={report.status === 'Completed' ? `${apiClient.defaults.baseURL}/reports/${report.id}/download/` : undefined}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={(e) => report.status !== 'Completed' && e.preventDefault()}
                                    >
                                        <button disabled={report.status !== 'Completed'} title="Download">
                                            <FiDownload />
                                        </button>
                                    </a>
                                    <button title="View (coming soon)"><FiEye /></button>
                                    <button title="Delete" onClick={() => handleDeleteReport(report.id)}><FiTrash2 /></button>
                                </div>
                            </div>
                        ))}
                         {!loading && !error && reports.length === 0 && <p className={styles.noData}>No reports have been generated yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;