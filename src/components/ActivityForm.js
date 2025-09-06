// src/components/ActivityForm.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import styles from '../styles/ActivityForm.module.css';

// Activity type definitions matching FR-004
const ACTIVITY_TYPES = {
    MDB_REPLIES: 'MDB Replies',
    TICKET_RESPONSES: 'Ticket Responses',
    ASSIGNMENT_UPLOAD: 'Assignment/Material Upload',
    ASSIGNMENT_MARKING: 'Assignment Marking',
    GDB_MARKING: 'GDB Marking',
    WEEKLY_SESSION: 'Weekly Session',
    EMAIL_RESPONSES: 'Email Responses'
};

const ActivityForm = ({ onFormSubmit, closeForm, editingLog = null }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Main form data
    const [formData, setFormData] = useState({
        activity_type: '',
        course_id: '',
        log_date: new Date().toISOString().split('T')[0], // Today's date
        details: {}
    });

    // Activity-specific form fields
    const [activityDetails, setActivityDetails] = useState({
        // MDB Replies (FR-004.1)
        mdb_topic: '',
        number_of_replies: '',
        
        // Ticket Responses (FR-004.2)
        ticket_id: '',
        response_summary: '',
        
        // Assignment/Material Upload (FR-004.3)
        assignment_name: '',
        material_type: 'Assignment', // Assignment, Lecture Notes, Resources, etc.
        
        // Assignment Marking (FR-004.4)
        // assignment_name: '', // Reused from upload
        number_marked: '',
        
        // GDB Marking (FR-004.5)
        gdb_topic: '',
        // number_marked: '', // Reused from assignment marking
        
        // Weekly Session (FR-004.6)
        session_date: '',
        attendance_notes: '',
        
        // Email Responses (FR-004.7)
        email_subject: '',
        email_purpose: ''
    });

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Populate form when editing
    useEffect(() => {
        if (editingLog) {
            setFormData({
                activity_type: editingLog.activity_type || '',
                course_id: editingLog.course?.id || '',
                log_date: editingLog.log_date ? editingLog.log_date.split('T')[0] : new Date().toISOString().split('T')[0],
                details: editingLog.details || {}
            });
            
            // Populate activity-specific details
            if (editingLog.details) {
                setActivityDetails(prev => ({
                    ...prev,
                    ...editingLog.details
                }));
            }
        }
    }, [editingLog]);

    const fetchCourses = async () => {
        try {
            const response = await apiClient.get('/instructor/courses/');
            const myCourses = response.data.data || [];
            setCourses(myCourses);
            
            // Set default course if none selected and courses available
            if (myCourses.length > 0 && !formData.course_id) {
                setFormData(prev => ({ ...prev, course_id: myCourses[0].id }));
            }
        } catch (err) {
            console.error("Failed to load courses");
            setError("Could not load your assigned courses.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setActivityDetails(prev => ({ ...prev, [name]: value }));
    };

    // Get relevant fields for selected activity type
    const getRelevantDetails = () => {
        const details = {};
        const activityType = formData.activity_type;

        switch (activityType) {
            case 'MDB_REPLIES':
                if (activityDetails.mdb_topic) details.mdb_topic = activityDetails.mdb_topic;
                if (activityDetails.number_of_replies) details.number_of_replies = parseInt(activityDetails.number_of_replies);
                break;
                
            case 'TICKET_RESPONSES':
                if (activityDetails.ticket_id) details.ticket_id = activityDetails.ticket_id;
                if (activityDetails.response_summary) details.response_summary = activityDetails.response_summary;
                break;
                
            case 'ASSIGNMENT_UPLOAD':
                if (activityDetails.assignment_name) details.assignment_name = activityDetails.assignment_name;
                if (activityDetails.material_type) details.material_type = activityDetails.material_type;
                break;
                
            case 'ASSIGNMENT_MARKING':
                if (activityDetails.assignment_name) details.assignment_name = activityDetails.assignment_name;
                if (activityDetails.number_marked) details.number_marked = parseInt(activityDetails.number_marked);
                break;
                
            case 'GDB_MARKING':
                if (activityDetails.gdb_topic) details.gdb_topic = activityDetails.gdb_topic;
                if (activityDetails.number_marked) details.number_marked = parseInt(activityDetails.number_marked);
                break;
                
            case 'WEEKLY_SESSION':
                if (activityDetails.session_date) details.session_date = activityDetails.session_date;
                if (activityDetails.attendance_notes) details.attendance_notes = activityDetails.attendance_notes;
                break;
                
            case 'EMAIL_RESPONSES':
                if (activityDetails.email_subject) details.email_subject = activityDetails.email_subject;
                if (activityDetails.email_purpose) details.email_purpose = activityDetails.email_purpose;
                break;
        }

        return details;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const submitData = {
                activity_type: formData.activity_type,
                course_id: formData.course_id,
                // log_date: formData.log_date, // Send custom log date
                details: getRelevantDetails()
            };

            if (editingLog) {
                await apiClient.put(`/activities/${editingLog.id}/`, submitData);
            } else {
                await apiClient.post('/activities/', submitData);
            }

            onFormSubmit();
            closeForm();
        } catch (err) {
            console.error('Submit error:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               'Failed to save activity log.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Render activity-specific fields based on selected activity type
    const renderActivitySpecificFields = () => {
        switch (formData.activity_type) {
            case 'MDB_REPLIES':
                return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="mdb_topic">MDB Topic *</label>
                            <input
                                type="text"
                                id="mdb_topic"
                                name="mdb_topic"
                                value={activityDetails.mdb_topic}
                                onChange={handleDetailChange}
                                required
                                placeholder="Enter MDB topic"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="number_of_replies">Number of Replies *</label>
                            <input
                                type="number"
                                id="number_of_replies"
                                name="number_of_replies"
                                value={activityDetails.number_of_replies}
                                onChange={handleDetailChange}
                                min="0"
                                required
                                placeholder="0"
                            />
                        </div>
                    </>
                );

            case 'TICKET_RESPONSES':
                return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="ticket_id">Ticket ID *</label>
                            <input
                                type="text"
                                id="ticket_id"
                                name="ticket_id"
                                value={activityDetails.ticket_id}
                                onChange={handleDetailChange}
                                required
                                placeholder="e.g., TKT-001234"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="response_summary">Response Summary *</label>
                            <textarea
                                id="response_summary"
                                name="response_summary"
                                value={activityDetails.response_summary}
                                onChange={handleDetailChange}
                                required
                                rows="3"
                                placeholder="Brief summary of response provided"
                            />
                        </div>
                    </>
                );

            case 'ASSIGNMENT_UPLOAD':
                return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="assignment_name">Assignment/Material Name *</label>
                            <input
                                type="text"
                                id="assignment_name"
                                name="assignment_name"
                                value={activityDetails.assignment_name}
                                onChange={handleDetailChange}
                                required
                                placeholder="e.g., Assignment 1, Lecture Notes Week 3"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="material_type">Material Type</label>
                            <select
                                id="material_type"
                                name="material_type"
                                value={activityDetails.material_type}
                                onChange={handleDetailChange}
                            >
                                <option value="Assignment">Assignment</option>
                                <option value="Lecture Notes">Lecture Notes</option>
                                <option value="Resources">Resources</option>
                                <option value="Handouts">Handouts</option>
                                <option value="Reference Material">Reference Material</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </>
                );

            case 'ASSIGNMENT_MARKING':
                return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="assignment_name">Assignment Name *</label>
                            <input
                                type="text"
                                id="assignment_name"
                                name="assignment_name"
                                value={activityDetails.assignment_name}
                                onChange={handleDetailChange}
                                required
                                placeholder="e.g., Assignment 1, Quiz 2"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="number_marked">Number Marked *</label>
                            <input
                                type="number"
                                id="number_marked"
                                name="number_marked"
                                value={activityDetails.number_marked}
                                onChange={handleDetailChange}
                                min="0"
                                required
                                placeholder="0"
                            />
                        </div>
                    </>
                );

            case 'GDB_MARKING':
                return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="gdb_topic">GDB Topic *</label>
                            <input
                                type="text"
                                id="gdb_topic"
                                name="gdb_topic"
                                value={activityDetails.gdb_topic}
                                onChange={handleDetailChange}
                                required
                                placeholder="Enter GDB topic"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="number_marked">Number Marked *</label>
                            <input
                                type="number"
                                id="number_marked"
                                name="number_marked"
                                value={activityDetails.number_marked}
                                onChange={handleDetailChange}
                                min="0"
                                required
                                placeholder="0"
                            />
                        </div>
                    </>
                );

            case 'WEEKLY_SESSION':
                return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="session_date">Session Date *</label>
                            <input
                                type="date"
                                id="session_date"
                                name="session_date"
                                value={activityDetails.session_date}
                                onChange={handleDetailChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="attendance_notes">Attendance/Participation Notes</label>
                            <textarea
                                id="attendance_notes"
                                name="attendance_notes"
                                value={activityDetails.attendance_notes}
                                onChange={handleDetailChange}
                                rows="3"
                                placeholder="Brief notes on attendance, participation, or session highlights"
                            />
                        </div>
                    </>
                );

            case 'EMAIL_RESPONSES':
                return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="email_subject">Email Subject/Topic *</label>
                            <input
                                type="text"
                                id="email_subject"
                                name="email_subject"
                                value={activityDetails.email_subject}
                                onChange={handleDetailChange}
                                required
                                placeholder="Brief subject or topic of email"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email_purpose">Purpose/Response Summary *</label>
                            <textarea
                                id="email_purpose"
                                name="email_purpose"
                                value={activityDetails.email_purpose}
                                onChange={handleDetailChange}
                                required
                                rows="3"
                                placeholder="Brief description of the purpose or response provided"
                            />
                        </div>
                    </>
                );

            default:
                return (
                    <div className={styles.selectActivityPrompt}>
                        <p>Please select an activity type to continue.</p>
                    </div>
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.activityForm}>
            {error && <div className={styles.error}>{error}</div>}
            
            {/* Core Fields */}
            <div className={styles.formGroup}>
                <label htmlFor="activity_type">Activity Type *</label>
                <select
                    id="activity_type"
                    name="activity_type"
                    value={formData.activity_type}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Activity Type</option>
                    {Object.entries(ACTIVITY_TYPES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="course_id">Course *</label>
                <select
                    id="course_id"
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.course_code} - {course.course_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* <div className={styles.formGroup}>
                <label htmlFor="log_date">Date *</label>
                <input
                    type="date"
                    id="log_date"
                    name="log_date"
                    value={formData.log_date}
                    onChange={handleInputChange}
                    required
                />
            </div> */}

            {/* Activity-Specific Fields */}
            {formData.activity_type && (
                <div className={styles.activitySpecificSection}>
                    <h4>Activity Details</h4>
                    {renderActivitySpecificFields()}
                </div>
            )}

            {/* Form Actions */}
            <div className={styles.formActions}>
                <button type="button" onClick={closeForm} className={styles.cancelBtn}>
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={loading || !formData.activity_type} 
                    className={styles.submitBtn}
                >
                    {loading ? 'Saving...' : editingLog ? 'Update Activity' : 'Log Activity'}
                </button>
            </div>
        </form>
    );
};

export default ActivityForm;