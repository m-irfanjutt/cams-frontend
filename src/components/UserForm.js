// src/components/UserForm.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import styles from '../styles/UserForm.module.css';
const UserForm = ({ onFormSubmit, closeForm }) => {
const [departments, setDepartments] = useState([]);
// We can add logic to handle editing a user later
const [formData, setFormData] = useState({
firstName: '',
lastName: '',
email: '',
username: '',
department: '',
role: 'INSTRUCTOR',
});
const [error, setError] = useState('');
useEffect(() => {
// Fetch departments for the dropdown
const fetchDepartments = async () => {
try {
const response = await apiClient.get('/auth/departments/');
setDepartments(response.data.data);
} catch (err) {
console.error("Failed to load departments");
}
};
fetchDepartments();
}, []);
const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};
const handleSubmit = async (e) => {
e.preventDefault();
// This is a simplified "Add User" flow for now.
// A password would need to be handled, likely sent via email or set by admin.
// We will mimic the signup payload without passwords for simplicity.
const payload = {
first_name: formData.firstName,
last_name: formData.lastName,
email: formData.email,
username: formData.username,
department: formData.department,
role: formData.role,
password: "DefaultPassword123!", // Dummy password for now
confirm_password: "DefaultPassword123!",
};
try {
    await apiClient.post('/auth/register/', payload);
    onFormSubmit(); // Tell the parent to refetch users
    closeForm(); // Close the modal
  } catch (err) {
      setError(err.response?.data?.message || "Failed to create user.");
  }
  };
return (
<form onSubmit={handleSubmit} className={styles.form}>
{error && <p className={styles.error}>{error}</p>}
<div className={styles.row}>
<input name="firstName" placeholder="First Name" onChange={handleChange} required />
<input name="lastName" placeholder="Last Name" onChange={handleChange} required />
</div>
<input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
<input name="username" placeholder="Username" onChange={handleChange} required />
<select name="department" value={formData.department} onChange={handleChange} required>
<option value="">Select Department</option>
{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
</select>
<select name="role" value={formData.role} onChange={handleChange} required>
<option value="INSTRUCTOR">Instructor</option>
<option value="ADMIN">Administrator</option>
</select>
<div className={styles.formActions}>
<button type="button" onClick={closeForm} className={styles.cancelBtn}>Cancel</button>
<button type="submit" className={styles.submitBtn}>Create User Account</button>
</div>
</form>
);
};
export default UserForm;