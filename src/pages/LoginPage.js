// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate here
import AuthContext from '../context/AuthContext';
import styles from '../styles/Auth.module.css';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate(); // Initialize useNavigate here

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const userData = await login(username, password);
            // Now we handle navigation based on the returned user data
            if (userData.profile.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/instructor/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };
    
    // ... rest of the component's JSX remains exactly the same
    return (
      <div className="auth-background">
      <div className={styles.authContainer}>
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
          <div className={styles.rightPanel}>
            <form onSubmit={handleSubmit} className={styles.authForm}>
              <h2>Welcome Back</h2>
              <p>Please sign in to your account</p>
              {error && <p className={styles.errorMessage}>{error}</p>}
              <div className={styles.inputGroup}>
                <FaUser className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.options}>
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot Password?</a>
              </div>
              <button type="submit" className={styles.submitButton}>Sign In</button>
                <p className={styles.switchForm}>
                Don't have an account? <Link to="/signup">Sign Up</Link> {/* Change this line */}
                </p>
            </form>
          </div>
        </div>
      </div>
    );
};

export default LoginPage;