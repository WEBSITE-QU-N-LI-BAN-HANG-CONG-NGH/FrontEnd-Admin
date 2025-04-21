// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import DashboardTabs from '../../components/dashboard/DashboardTabs';
import RevenueOverview from '../../components/dashboard/RevenueOverview';
import RevenueBreakdown from '../../components/dashboard/RevenueBreakdown';
import StoreRevenue from '../../components/dashboard/StoreRevenue';
import { dashboardService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, loading, isAdmin } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    revenue: {},
    topSellers: [],
    distribution: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Lấy dữ liệu tổng quan cho dashboard
        const response = await dashboardService.getOverview();
        setDashboardData(response.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading && user) {
      fetchDashboardData();
    }
  }, [loading, user]);

  // Nếu đang tải thông tin người dùng
  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Nếu người dùng không đăng nhập hoặc không phải admin
  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      {isLoading ? (
        <div>Đang tải dữ liệu dashboard...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div>
          <DashboardTabs />
          
          <div className="dashboard-grid">
            <RevenueOverview data={dashboardData.revenue} />
            <RevenueBreakdown data={dashboardData.distribution} />
          </div>
          
          <StoreRevenue data={dashboardData.topSellers} />
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;