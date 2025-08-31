// src/components/Sidebar.js
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from '../styles/Sidebar.module.css';
import { 
  FiGrid, 
  FiUsers, 
  FiFileText, 
  FiSettings, 
  FiBarChart2, 
  FiLogOut 
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // This clears the context and localStorage
    navigate('/login'); // This navigates the user
  };

  // Define navigation links for each role
  const adminLinks = [
    { icon: <FiGrid />, text: 'Dashboard', path: '/admin/dashboard' },
    { icon: <FiUsers />, text: 'User Management', path: '/admin/users' },
    { icon: <FiFileText />, text: 'Reports', path: '/admin/reports' },
    { icon: <FiSettings />, text: 'System Config', path: '/admin/settings' },
  ];

  const instructorLinks = [
    { icon: <FiGrid />, text: 'Dashboard', path: '/instructor/dashboard' },
    { icon: <FiBarChart2 />, text: 'My Performance', path: '/instructor/performance' },
    { icon: <FiFileText />, text: 'Activity Logs', path: '/instructor/logs' },
  ];

  const navLinks = user?.profile?.role === 'ADMIN' ? adminLinks : instructorLinks;

  if (!user) {
    return null; // Don't render sidebar if no user
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.branding}>
        {/* You can use your logo image here if you prefer */}
        <h2>CAMS</h2>
      </div>

      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
        </div>
        <span className={styles.userName}>{user.first_name} {user.last_name}</span>
        <span className={styles.userRole}>{user.profile.role.replace('_', ' ')}</span>
      </div>

      <nav className={styles.navigation}>
        <p className={styles.navHeader}>Navigation</p>
        {navLinks.map((link) => (
          <NavLink
            key={link.text}
            to={link.path}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            {link.icon}
            <span>{link.text}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.logoutSection}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;