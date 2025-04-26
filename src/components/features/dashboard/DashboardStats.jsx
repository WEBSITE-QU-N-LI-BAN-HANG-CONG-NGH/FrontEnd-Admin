import React from 'react';

const DashboardStats = ({ stats = {} }) => {
    // Định dạng tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
    };

    return (
        <div className="dashboard-stats">
            <div className="stat-card">
                <div className="stat-icon products-icon">📦</div>
                <div className="stat-content">
                    <div className="stat-title">Mẫu sản phẩm</div>
                    <div className="stat-value">{stats.totalProducts || 178}</div>
                    <div className={`stat-change ${(stats.productGrowth || 0) >= 0 ? 'positive' : 'negative'}`}>
                        {(stats.productGrowth || 12) >= 0 ? '+' : ''}{stats.productGrowth || 12}%
                        <span className="change-period">tuần này</span>
                    </div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon stock-icon">📊</div>
                <div className="stat-content">
                    <div className="stat-title">Trong kho</div>
                    <div className="stat-value">{stats.inStock || 24}</div>
                    <div className="stat-subtitle">
                        {stats.lowStockItems || 5} sản phẩm sắp hết
                    </div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon orders-icon">🛒</div>
                <div className="stat-content">
                    <div className="stat-title">Đã bán</div>
                    <div className="stat-value">{stats.soldItems || 190}</div>
                    <div className={`stat-change ${(stats.salesGrowth || 0) >= 0 ? 'positive' : 'negative'}`}>
                        {(stats.salesGrowth || 8) >= 0 ? '+' : ''}{stats.salesGrowth || 8}%
                        <span className="change-period">tuần này</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;