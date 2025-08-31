// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import MainLayout from './MainLayout'; // Import the layout

const ProtectedRoute = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Wrap the protected page content (<Outlet />) with the MainLayout
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};

export default ProtectedRoute;