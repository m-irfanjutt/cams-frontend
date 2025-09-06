// src/components/UserForm.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import styles from '../styles/UserForm.module.css';

const UserForm = ({ onFormSubmit, closeForm, editingUser }) => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    department_id: '',
    role: 'INSTRUCTOR',
    is_active: true,
    password: '', // Add password field to state
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingUser) {
      setFormData({
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
        username: editingUser.username,
        department_id: editingUser.profile.department?.id || '',
        role: editingUser.profile.role,
        is_active: editingUser.is_active,
        password: '', // Clear password field when editing
      });
    } else {
        // Reset form for new user
        setFormData({
            first_name: '', lastName: '', email: '', username: '',
            department_id: '', role: 'INSTRUCTOR', is_active: true, password: '',
        });
    }
    
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get('/auth/departments/');
        setDepartments(response.data.data);
      } catch (err) {
        console.error("Failed to load departments", err);
      }
    };
    fetchDepartments();
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      try {
        if (editingUser) {
          // UPDATE (PUT) request - no password sent
          const updatePayload = { ...formData };
          delete updatePayload.password; // Ensure password isn't sent on update
          await apiClient.put(`/auth/users/${editingUser.id}/`, updatePayload);
        } else {
          // CREATE (POST) request - password is required and sent
          if (!formData.password) {
              setError("Password is required for new users.");
              return;
          }
          await apiClient.post('/auth/users/', formData);
        }
        onFormSubmit(); // Tell parent to refetch
        closeForm();
      } catch (err) {
        const errorMessage = err.response?.data?.message || `Failed to ${editingUser ? 'update' : 'create'} user.`;
        setError(errorMessage);
      }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.row}>
            <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
            <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        </div>
        <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required disabled={!!editingUser} />
        
        {/* --- Conditional Password Field --- */}
        {!editingUser && (
            <div className={styles.formGroup}>
                <label htmlFor="password">Set Initial Password</label>
                <input 
                    id="password"
                    name="password" 
                    type="password" 
                    placeholder="Enter password for new user" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />
            </div>
        )}
        
        <select name="department_id" value={formData.department_id} onChange={handleChange} required>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <div className={styles.row}>
            <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Administrator</option>
            </select>
            <div className={styles.checkboxGroup}>
                <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active} onChange={handleChange} />
                <label htmlFor="is_active">User is Active</label>
            </div>
        </div>
        <div className={styles.formActions}>
            <button type="button" onClick={closeForm} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>{editingUser ? 'Update User' : 'Create User'}</button>
        </div>
    </form>
  );
};

export default UserForm;