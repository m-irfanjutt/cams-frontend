// src/components/ActivityForm.js
import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import styles from '../styles/UserForm.module.css'; // Reusing styles for consistency

// This matches the ActivityTypeEnum in the backend
const ACTIVITY_TYPES = [
    { name: 'MDB_REPLY', label: 'MDB Replies' },
    { name: 'TICKET_RESPONSE', label: 'Ticket Responses' },
    { name: 'ASSIGNMENT_UPLOAD', label: 'Assignment Upload' },
    { name: 'ASSIGNMENT_MARKING', label: 'Assignment Marking' },
    { name: 'GDB_MARKING', label: 'GDB Marking' },
    { name: 'SESSION_TRACKING', label: 'Session Tracking' },
    { name: 'EMAIL_RESPONSE', label: 'Email Responses' },
];

const ActivityForm = ({ onFormSubmit, closeForm }) => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        activity_type: 'MDB_REPLY',
        course_id: '',
        details: {
            count: '', // Example detail field
        },
    });

    useEffect(() => {
        // Fetch courses assigned to the logged-in instructor
        const fetchCourses = async () => {
            try {
                // NOTE: We need a backend endpoint to fetch courses for a specific instructor.
                // For now, we'll fetch all courses and filter on the frontend.
                // In a real app, the backend should provide a `/api/my-courses/` endpoint.
                const response = await apiClient.get('/courses/');
                const myCourses = response.data.data.filter(c => c.instructor?.id === user.id);
                setCourses(myCourses);
                if (myCourses.length > 0) {
                    setFormData(prev => ({ ...prev, course_id: myCourses[0].id }));
                }
            } catch (err) {
                console.error("Failed to load courses");
                setError("Could not load your assigned courses.");
            }
        };
        fetchCourses();
    }, [user.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            details: { ...prev.details, [name]: value },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await apiClient.post('/activities/', formData);
            onFormSubmit(); // Tell parent to refetch logs
            closeForm(); // Close the modal
        } catch (err) {
            setError(err.response?.data?.message || "Failed to log activity.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <p className={styles.error}>{error}</p>}
            
            <label>Activity Type</label>
            <select name="activity_type" value={formData.activity_type} onChange={handleChange} required>
                {ACTIVITY_TYPES.map(type => (
                    <option key={type.name} value={type.name}>{type.label}</option>
                ))}
            </select>

            <label>Course</label>
            <select name="course_id" value={formData.course_id} onChange={handleChange} required>
                <option value="">Select a Course</option>
                {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.course_code} - {course.course_title}</option>
                ))}
            </select>

            {/* Dynamic fields based on activity type can be added here */}
            <label>Details (Count)</label>
            <input
                name="count"
                type="number"
                placeholder="Number of items (e.g., 15)"
                value={formData.details.count}
                onChange={handleDetailChange}
                required
            />
            
            <div className={styles.formActions}>
                <button type="button" onClick={closeForm} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Log Activity</button>
            </div>
        </form>
    );
};

export default ActivityForm;