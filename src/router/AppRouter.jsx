import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Import các pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductManagement from "../pages/admin/ProductManagement";
import Login from "../pages/auth/Login";
import NotFound from "../pages/NotFound";
import AdminUserManagement from "../pages/admin/AdminUserManagement.jsx";

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
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute element={<AdminDashboard />} requiredRole="ADMIN" />
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute element={<ProductManagement />} requiredRole="ADMIN" />
        }
      />
    <Route
        path="/admin/users"
        element={
            <ProtectedRoute element={<AdminUserManagement />} requiredRole="ADMIN" />
        }
    />


        {/* Redirect root to admin dashboard if logged in */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;