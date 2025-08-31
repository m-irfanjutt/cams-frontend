// src/pages/UserManagementPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import Header from '../components/Header';
import styles from '../styles/UserManagement.module.css';
import { FiPlus, FiDownload, FiSearch } from 'react-icons/fi';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/auth/users/');
      setUsers(response.data.data);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSubmit = () => {
      // This function is passed to the form, so it can trigger a refetch
      fetchUsers();
  }

  return (
    <div>
      <Header title="User Management" subtitle="Manage instructor and administrator accounts" />
      
      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search by name, email, or username..." />
        </div>
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <FiDownload /> Export Users
          </button>
          <button className={`${styles.actionButton} ${styles.primary}`} onClick={() => setIsModalOpen(true)}>
            <FiPlus /> Add New User
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading && <p>Loading users...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                      </div>
                      <div>
                        <div className={styles.userName}>{user.first_name} {user.last_name}</div>
                        <div className={styles.userEmail}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${user.profile.role === 'ADMIN' ? styles.tagAdmin : styles.tagInstructor}`}>
                      {user.profile.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{user.profile.department?.name || 'N/A'}</td>
                  <td>
                    <span className={`${styles.status} ${user.is_active ? styles.statusActive : styles.statusInactive}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>2 hours ago</td> {/* This is mock data for now */}
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.editBtn}>Edit</button>
                      <button className={styles.resetBtn}>Reset</button>
                      <button className={styles.deleteBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
              <Modal title="Add New User" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm onFormSubmit={handleFormSubmit} closeForm={() => setIsModalOpen(false)} />
      </Modal>
      </div>
    </div>
  );
};

export default UserManagementPage;