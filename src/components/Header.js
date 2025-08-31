// src/components/Header.js
import React from 'react';
import styles from '../styles/Header.module.css';

const Header = ({ title, subtitle }) => {
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default Header;