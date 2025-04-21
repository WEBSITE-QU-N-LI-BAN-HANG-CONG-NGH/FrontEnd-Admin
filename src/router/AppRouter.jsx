// src/router/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import các pages
import Login from '../pages/auth/Login';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminReports from '../pages/admin/AdminReports';
import NotFound from '../pages/NotFound';

// Protected Route component
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Nếu chưa đăng nhập, chuyển hướng về login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có yêu cầu vai trò và người dùng không có vai trò đó
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu thỏa mãn điều kiện, render component
  return element;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected admin routes */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute element={<AdminDashboard />} requiredRole="ADMIN" />} 
        />
        <Route 
          path="/admin/users" 
          element={<ProtectedRoute element={<AdminUsers />} requiredRole="ADMIN" />} 
        />
        <Route 
          path="/admin/products" 
          element={<ProtectedRoute element={<AdminProducts />} requiredRole="ADMIN" />} 
        />
        <Route 
          path="/admin/orders" 
          element={<ProtectedRoute element={<AdminOrders />} requiredRole="ADMIN" />} 
        />
        <Route 
          path="/admin/categories" 
          element={<ProtectedRoute element={<AdminCategories />} requiredRole="ADMIN" />} 
        />
        <Route 
          path="/admin/reports" 
          element={<ProtectedRoute element={<AdminReports />} requiredRole="ADMIN" />} 
        />
        
        {/* Redirect root to admin dashboard if logged in */}
        <Route 
          path="/" 
          element={<Navigate to="/admin" replace />} 
        />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;