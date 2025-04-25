import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {useAuth} from "./contexts/AuthContext.jsx";

// Import các pages
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import Login from "./pages/auth/Login.jsx";
import NotFound from "./pages/auth/NotFound.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import OrdersManagement from "./pages/admin/OrdersManagement.jsx";
import Revenue from "./pages/admin/Revenue";


// Protected Route component
const ProtectedRoute = ({element, requiredRole}) => {
    const {user, loading, hasRole} = useAuth();

    if (loading) {
        return <div>Đang tải...</div>;
    }

    // Nếu chưa đăng nhập, chuyển hướng về login
    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    // Nếu có yêu cầu vai trò và người dùng không có vai trò đó
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" replace/>;
    }

    // Nếu thỏa mãn điều kiện, render component
    return element;
};

const AppRouter = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login/>}/>

            {/* Protected admin routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute element={<Dashboard/>} requiredRole="ADMIN"/>
                }
            />
            <Route
                path="/admin/revenue"
                element={
                    <ProtectedRoute element={<Revenue />} requiredRole="ADMIN" />
                }
            />
            <Route
                path="/admin/products"
                element={
                    <ProtectedRoute element={<ProductManagement/>} requiredRole="ADMIN"/>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute element={<UserManagement/>} requiredRole="ADMIN"/>
                }
            />
            <Route
                path="/admin/analytics"
                element={
                    <ProtectedRoute element={<Analytics/>} requiredRole="ADMIN"/>
                }
            />
            <Route
                path="/admin/orders"
                element={
                    <ProtectedRoute element={<OrdersManagement/>} requiredRole="ADMIN"/>
                }
            />


            {/* Redirect root to admin dashboard if logged in */}
            <Route path="/" element={<Navigate to="/admin" replace/>}/>

            {/* 404 page */}
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
};

export default AppRouter;