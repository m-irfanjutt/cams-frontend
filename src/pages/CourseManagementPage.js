// src/pages/CourseManagementPage.js
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import Header from '../components/Header';
import Modal from '../components/Modal';
import CourseForm from '../components/CourseForm'; // We will create this next
import styles from '../styles/CourseManagement.module.css'; // New stylesheet
import { FiPlus } from 'react-icons/fi';

const CourseManagementPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/courses/');
            setCourses(response.data.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch courses.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleFormSubmit = () => {
        fetchCourses(); // Refetch after add/edit
    };

    const handleAddCourse = () => {
        setEditingCourse(null);
        setIsModalOpen(true);
    };

    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course? This may affect existing activity logs.')) {
            try {
                await apiClient.delete(`/courses/${courseId}/`);
                fetchCourses();
            } catch (err) {
                alert('Failed to delete course.');
            }
        }
    };

    return (
        <div>
            <Header title="Course Management" subtitle="Add, edit, and assign courses to instructors" />
            <div className={styles.controls}>
                <div/> {/* Placeholder for search or filters if needed later */}
                <button className={styles.addButton} onClick={handleAddCourse}>
                    <FiPlus /> Add New Course
                </button>
            </div>

            <div className={styles.tableContainer}>
                {loading && <p>Loading courses...</p>}
                {error && <p className={styles.error}>{error}</p>}
                {!loading && !error && (
                    <table className={styles.courseTable}>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Title</th>
                                <th>Assigned Instructor</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td><span className={styles.code}>{course.course_code}</span></td>
                                    <td>{course.course_title}</td>
                                    <td>{course.instructor ? `${course.instructor.first_name} ${course.instructor.last_name}` : <span className={styles.unassigned}>Unassigned</span>}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.editBtn} onClick={() => handleEditCourse(course)}>Edit</button>
                                            <button className={styles.deleteBtn} onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && courses.length === 0 && <p className={styles.noData}>No courses found. Click "Add New Course" to create one.</p>}
            </div>

            <Modal title={editingCourse ? 'Edit Course' : 'Add New Course'} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CourseForm
                    onFormSubmit={handleFormSubmit}
                    closeForm={() => setIsModalOpen(false)}
                    editingCourse={editingCourse}
                />
            </Modal>
        </div>
    );
};

export default CourseManagementPage;