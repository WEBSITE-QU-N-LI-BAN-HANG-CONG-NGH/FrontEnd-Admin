import React from "react";
import "../../../styles/admin/user/users.css";

const UserStats = ({stats}) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    };

    return (
        <div className="user-stats">
            <div className="stat-card">
                <div className="stat-title">Tổng số khách hàng</div>
                <div className="stat-value">{stats.totalCustomers || 0}</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Tổng chi tiêu</div>
                <div className="stat-value">
                    {formatCurrency(stats.totalSpending || 0)}
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Đơn hàng trung bình</div>
                <div className="stat-value">
                    {stats.averageOrders ? stats.averageOrders.toFixed(1) : "0"}
                </div>
            </div>
        </div>
    );
};

export default UserStats;