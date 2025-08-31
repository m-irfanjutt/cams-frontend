// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken')); // Initialize from localStorage
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            console.log("User Token: ", token)
            if (token) {
                apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
                try {
                    const response = await apiClient.get('/auth/me/');
                    setUser(response.data.data);
                } catch (error) {
                    console.error("Invalid token, logging out.");
                    // logout(); // Call the logout function which clears state
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = async (username, password) => {
        const response = await apiClient.post('/auth/login/', { username, password });
        const { token, user: userData } = response.data.data;
        console.log("Token: ", token)
        localStorage.setItem('authToken', token);
        apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
        setToken(token);
        setUser(userData);
        // We will return the user object so the component can decide where to navigate
        return userData; 
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        delete apiClient.defaults.headers.common['Authorization'];
        // Navigation will happen in a component now
    };

    const contextData = {
        user,
        token,
        login,
        logout,
    };
    
    // Render children only after the initial loading check is complete
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;