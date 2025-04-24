import React from 'react';

const DashboardStats = ({ stats = {} }) => {
    // Định dạng tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
    };

    return (
        <div className="dashboard-stats">
            <div className="stat-card">
                <div className="stat-icon orders-icon">📊</div>
                <div className="stat-content">
                    <div className="stat-title">Tổng đơn hàng</div>
                    <div className="stat-value">{stats.totalOrders || 0}</div>
                    <div className={`stat-change ${(stats.orderGrowth || 0) >= 0 ? 'positive' : 'negative'}`}>
                        {(stats.orderGrowth || 0) >= 0 ? '+' : ''}{stats.orderGrowth || 0}%
                    </div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon revenue-icon">💰</div>
                <div className="stat-content">
                    <div className="stat-title">Doanh thu</div>
                    <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
                    <div className={`stat-change ${(stats.revenueGrowth || 0) >= 0 ? 'positive' : 'negative'}`}>
                        {(stats.revenueGrowth || 0) >= 0 ? '+' : ''}{stats.revenueGrowth || 0}%
                    </div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon products-icon">📦</div>
                <div className="stat-content">
                    <div className="stat-title">Sản phẩm</div>
                    <div className="stat-value">{stats.totalProducts || 0}</div>
                    <div className="stat-subtitle">{stats.outOfStockProducts || 0} hết hàng</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon users-icon">👥</div>
                <div className="stat-content">
                    <div className="stat-title">Khách hàng</div>
                    <div className="stat-value">{stats.totalCustomers || 0}</div>
                    <div className="stat-subtitle">{stats.newCustomers || 0} khách mới</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;