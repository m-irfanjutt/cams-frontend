// src/pages/SignUpPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import styles from '../styles/Auth.module.css'; // We will reuse the same CSS module

const SignUpPage = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'INSTRUCTOR', // Default role
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch departments for the dropdown when the component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get('/auth/departments/');
        setDepartments(response.data.data);
        // Set a default department if list is not empty
        if (response.data.data.length > 0) {
          setFormData(prev => ({ ...prev, department: response.data.data[0].id }));
        }
      } catch (err) {
        setError('Failed to load department data.');
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // The payload keys must match what the Django backend expects
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.email,
        // username: formData.username,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        department: formData.department,
        role: formData.role,
      };
      
      await apiClient.post('/auth/register/', payload);
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-background">
      <div className={`${styles.authContainer} ${styles.signupContainer}`}>
        {/* Left Panel (Identical to Login) */}
        <div className={styles.leftPanel}>
          <div className={styles.branding}>
            <img src="/cams-logo.png" alt="CAMS Logo" className={styles.logo} />
            <h2>CAMS</h2>
            <p>Course Activity Management & Monitoring System</p>
          </div>
          <div className={styles.features}>
            <div className={styles.featureItem}>Activity Tracking</div>
            <div className={styles.featureItem}>Performance Analytics</div>
            <div className={styles.featureItem}>Comprehensive Reports</div>
            <div className={styles.featureItem}>Real-time Dashboard</div>
          </div>
        </div>

        {/* Right Panel - Sign Up Form */}
        <div className={`${styles.rightPanel} ${styles.signupPanel}`}>
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <h2>Create Account</h2>
            <p>Join CAMS to get started</p>

            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}

            <div className={styles.formRow}>
              <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
            </div>
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
            {/* <input type="text" name="username" placeholder="Choose a username" onChange={handleChange} required /> */}
            <div className={styles.formRow}>
              <input type="password" name="password" placeholder="Create password" onChange={handleChange} required />
              <input type="password" name="confirmPassword" placeholder="Confirm password" onChange={handleChange} required />
            </div>
            <select name="department" value={formData.department} onChange={handleChange}>
              <option value="" disabled>Select Department</option>
              {departments.map(dep => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </select>

            <div className={styles.roleSelector}>
              <button
                type="button"
                className={formData.role === 'INSTRUCTOR' ? styles.activeRole : ''}
                onClick={() => handleRoleChange('INSTRUCTOR')}
              >
                Instructor
              </button>
              <button
                type="button"
                className={formData.role === 'ADMIN' ? styles.activeRole : ''}
                onClick={() => handleRoleChange('ADMIN')}
              >
                Administrator
              </button>
            </div>

            <button type="submit" className={styles.submitButton}>Create Account</button>
            <p className={styles.switchForm}>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;