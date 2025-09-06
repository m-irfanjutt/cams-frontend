// src/components/CourseForm.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import styles from '../styles/UserForm.module.css'; // Reusing form styles

const CourseForm = ({ onFormSubmit, closeForm, editingCourse }) => {
    const [instructors, setInstructors] = useState([]);
    const [formData, setFormData] = useState({
        course_code: '',
        course_title: '',
        description: '',
        instructor_id: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Pre-fill form if editing
        if (editingCourse) {
            setFormData({
                course_code: editingCourse.course_code,
                course_title: editingCourse.course_title,
                description: editingCourse.description || '',
                instructor_id: editingCourse.instructor?.id || '',
            });
        }

        // Fetch all users and filter for instructors to populate the dropdown
        const fetchInstructors = async () => {
            try {
                const response = await apiClient.get('/auth/users/');
                const instructorUsers = response.data.data.filter(user => user.profile.role === 'INSTRUCTOR');
                setInstructors(instructorUsers);
            } catch (err) {
                console.error("Failed to fetch instructors", err);
            }
        };
        fetchInstructors();
    }, [editingCourse]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (editingCourse) {
                await apiClient.put(`/courses/${editingCourse.id}/`, formData);
            } else {
                await apiClient.post('/courses/', formData);
            }
            onFormSubmit();
            closeForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save course.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <p className={styles.error}>{error}</p>}
            <input name="course_code" placeholder="Course Code (e.g., CS101)" value={formData.course_code} onChange={handleChange} required />
            <input name="course_title" placeholder="Course Title" value={formData.course_title} onChange={handleChange} required />
            <textarea name="description" placeholder="Course Description (Optional)" value={formData.description} onChange={handleChange} />
            <select name="instructor_id" value={formData.instructor_id} onChange={handleChange}>
                <option value="">Assign an Instructor (Optional)</option>
                {instructors.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.first_name} {inst.last_name}</option>
                ))}
            </select>
            <div className={styles.formActions}>
                <button type="button" onClick={closeForm} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>{editingCourse ? 'Update Course' : 'Create Course'}</button>
            </div>
        </form>
    );
};

export default CourseForm;