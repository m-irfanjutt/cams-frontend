// src/pages/UserManagementPage.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import Header from '../components/Header';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';
import styles from '../styles/UserManagement.module.css';
import { FiPlus, FiDownload, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns'; // For better date formatting

/**
 * Formats a date string into a more readable format.
 * @param {string | null} lastLogin - The ISO date string from the API.
 * @returns {string} - The formatted date or 'Never'.
 */
const formatLastLogin = (lastLogin) => {
    if (!lastLogin) {
        return 'Never';
    }
    // 'PPpp' format: e.g., "Sep 6, 2025 at 10:32:00 AM"
    return format(new Date(lastLogin), 'PPpp'); 
};

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/auth/users/');
            setUsers(response.data.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch users. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleFormSubmit = () => {
        fetchUsers(); // Refetch users after a successful add/edit
    };

    const handleAddUser = () => {
        setEditingUser(null); // Ensure form is in 'add' mode
        setIsModalOpen(true);
    };
    
    const handleEditUser = (user) => {
        setEditingUser(user); // Set the user to be edited
        setIsModalOpen(true);
    };
    
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                await apiClient.delete(`/auth/users/${userId}/`);
                fetchUsers(); // Refresh list on success
            } catch (err) {
                alert('Failed to delete user.');
                console.error(err);
            }
        }
    };

    // Memoized filtering to prevent re-calculation on every render
    const filteredUsers = useMemo(() =>
        users.filter(user =>
            (user.first_name + " " + user.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [users, searchTerm]
    );

    return (
        <div>
            <Header title="User Management" subtitle="Manage instructor and administrator accounts" />
      
            <div className={styles.controls}>
                <div className={styles.searchBar}>
                    <FiSearch className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or username..." 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
                <div className={styles.actions}>
                    <a href={`${apiClient.defaults.baseURL}/auth/users/export/`} className={styles.actionButton} download>
                        <FiDownload /> Export Users
                    </a>
                    <button className={`${styles.actionButton} ${styles.primary}`} onClick={handleAddUser}>
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
                            {filteredUsers.map(user => (
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
                                    <td>{formatLastLogin(user.last_login)}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.editBtn} onClick={() => handleEditUser(user)}>Edit</button>
                                            <button className={styles.deleteBtn} onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && filteredUsers.length === 0 && <p className={styles.noData}>No users found.</p>}
            </div>

            <Modal title={editingUser ? `Edit User: ${editingUser.username}` : 'Add New User'} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <UserForm 
                    onFormSubmit={handleFormSubmit} 
                    closeForm={() => setIsModalOpen(false)} 
                    editingUser={editingUser} 
                />
            </Modal>
        </div>
    );
};

export default UserManagementPage;