import React from 'react';

const DashboardStats = ({ stats = {} }) => {
    return (
        <div className="dashboard-stats">
            <div className="stat-card">
                <div className="stat-icon products-icon">📦</div>
                <div className="stat-content">
                    <div className="stat-value">{stats.totalProducts || 0}</div>
                    <div className="stat-title">Mẫu sản phẩm</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon stock-icon">📊</div>
                <div className="stat-content">
                    <div className="stat-value">{stats.inStock || 0}</div>
                    <div className="stat-title">Trong kho</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon orders-icon">🛒</div>
                <div className="stat-content">
                    <div className="stat-value">{stats.soldItems || 0}</div>
                    <div className="stat-title">Đã bán</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;