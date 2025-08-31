// src/pages/SystemConfigPage.js
import React from 'react';
import Header from '../components/Header';
import styles from '../styles/SystemConfig.module.css';

const SystemConfigPage = () => {
    return (
        <div>
            <Header title="System Configuration" subtitle="Manage global system settings and parameters" />
            <div className={styles.disclaimer}>
                <strong>Note:</strong> This is a UI demonstration. The backend for saving these settings is a future enhancement.
            </div>
            <div className={styles.settingsContainer}>
                <div className={styles.settingCard}>
                    <h3>Reporting</h3>
                    <div className={styles.formGroup}>
                        <label>Default Report Period</label>
                        <select defaultValue="THIS_MONTH">
                            <option value="THIS_WEEK">This Week</option>
                            <option value="THIS_MONTH">This Month</option>
                            <option value="LAST_MONTH">Last Month</option>
                        </select>
                    </div>
                </div>
                <div className={styles.settingCard}>
                    <h3>Notifications</h3>
                    <div className={styles.toggleGroup}>
                        <label>Email on Report Completion</label>
                        <input type="checkbox" className={styles.toggle} defaultChecked />
                    </div>
                    <div className={styles.toggleGroup}>
                        <label>Alert for Failed Reports</label>
                        <input type="checkbox" className={styles.toggle} defaultChecked />
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <button>Save Changes</button>
            </div>
        </div>
    );
};

export default SystemConfigPage;