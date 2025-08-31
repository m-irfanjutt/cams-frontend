// src/components/QuickActions.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/QuickActions.module.css';
import { FiUserPlus, FiFileText, FiSettings, FiBarChart2 } from 'react-icons/fi';

const QuickActions = () => {
  const actions = [
    { icon: <FiUserPlus />, text: 'Add New User', subtext: 'Create instructor or admin', path: '/admin/users' },
    { icon: <FiFileText />, text: 'Generate Report', subtext: 'Create system-wide reports', path: '/admin/reports' },
    { icon: <FiSettings />, text: 'System Settings', subtext: 'Configure system parameters', path: '/admin/settings' },
    { icon: <FiBarChart2 />, text: 'View Analytics', subtext: 'Detailed performance insights', path: '/admin/analytics' },
  ];

  return (
    <div className={styles.grid}>
      {actions.map(action => (
        <Link to={action.path} key={action.text} className={styles.actionCard}>
          <div className={styles.icon}>{action.icon}</div>
          <h3>{action.text}</h3>
          <p>{action.subtext}</p>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;