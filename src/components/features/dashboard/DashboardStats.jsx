import React from 'react';

const DashboardStats = ({ stats = {} }) => {
    const {
        totalProducts = 0,
        inStock = 0,
        soldItems = 0
    } = stats; // Thêm destructuring với giá trị mặc định

    return (
        <div className="dashboard-stats">
            <div className="stat-card">
                <div className="stat-icon products-icon">📦</div>
                <div className="stat-content">
                    <div className="stat-value">{totalProducts}</div>
                    <div className="stat-title">Mẫu sản phẩm</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon stock-icon">📊</div>
                <div className="stat-content">
                    <div className="stat-value">{inStock}</div>
                    <div className="stat-title">Trong kho</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon orders-icon">🛒</div>
                <div className="stat-content">
                    <div className="stat-value">{soldItems}</div>
                    <div className="stat-title">Đã bán</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;