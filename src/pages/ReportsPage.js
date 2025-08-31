// src/pages/ReportsPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import Header from '../components/Header';
import styles from '../styles/Reports.module.css';
import { FiDownload, FiEye, FiTrash2, FiPlayCircle, FiClock, FiXCircle } from 'react-icons/fi';

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for the report generation form
    const [reportType, setReportType] = useState('ACTIVITY_SUMMARY');
    const [timePeriod, setTimePeriod] = useState('THIS_WEEK');

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/reports/');
            setReports(response.data.data);
        } catch (err) {
            setError('Failed to fetch reports.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        // This is a simplified handler. A real implementation would use the form state.
        alert('Report generation has been queued!');
        // Here you would POST to /api/reports/ and then call fetchReports()
    };
    
    const getStatusIcon = (status) => {
        switch(status) {
            case 'Completed': return <FiPlayCircle className={`${styles.statusIcon} ${styles.completed}`} />;
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
                            <select>
                                <option>All Instructors</option>
                                {/* Add logic to fetch and list instructors if needed */}
                            </select>
                        </div>
                        {/* More form fields like Activity Types can be added here */}
                        <button type="submit" className={styles.generateButton}>Generate Report</button>
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
                                        <p className={styles.reportName}>{report.report_type} Report</p>
                                        <p className={styles.reportMeta}>
                                            Period: {report.start_date} to {report.end_date}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.reportStatus}>
                                    <span>{report.status}</span>
                                </div>
                                <div className={styles.reportActions}>
                                    <button disabled={report.status !== 'Completed'} title="Download">
                                        <a 
                                            href={`${apiClient.defaults.baseURL}/reports/${report.id}/download/`}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <FiDownload />
                                        </a>
                                    </button>
                                    <button title="View"><FiEye /></button>
                                    <button title="Delete"><FiTrash2 /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;