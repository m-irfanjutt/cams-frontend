// src/components/MainLayout.js
import React from 'react';
import Sidebar from './Sidebar';
import styles from '../styles/MainLayout.module.css';

const MainLayout = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        {/* The actual page component will be rendered here */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;