// src/components/StatCard.js
import React from 'react';
import styles from '../styles/StatCard.module.css';

const StatCard = ({ icon, title, value, growth, iconBgColor }) => {
  const isPositive = growth ? parseFloat(growth) >= 0 : null;
  const growthClass = isPositive ? styles.positive : styles.negative;

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper} style={{ backgroundColor: iconBgColor }}>
        {icon}
      </div>
      <div className={styles.cardContent}>
        <p className={styles.title}>{title}</p>
        <h2 className={styles.value}>{value}</h2>
        {growth && (
          <p className={`${styles.growth} ${growthClass}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(growth)}% from last month
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;