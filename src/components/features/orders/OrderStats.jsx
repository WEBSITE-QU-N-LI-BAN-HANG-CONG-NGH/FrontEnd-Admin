import React from "react";

const OrderStats = ({ stats }) => {
    // Hàm định dạng số tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    };

    // Tạo dữ liệu hiển thị mặc định nếu không có dữ liệu
    const defaultStats = {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        growthRate: 5 // Giá trị mặc định để demo
    };

    // Sử dụng dữ liệu từ prop hoặc dữ liệu mặc định
    const displayStats = { ...defaultStats, ...stats };

    // Tính tỷ lệ hoàn thành
    const completionRate = displayStats.totalOrders > 0
        ? Math.round((displayStats.completedOrders / displayStats.totalOrders) * 100)
        : 0;

    return (
        <div className="order-stats">
            <div className="stat-card">
                <div className="stat-title">Tổng đơn hàng</div>
                <div className="stat-value">{displayStats.totalOrders}</div>
                <div className={`stat-change ${displayStats.growthRate >= 0 ? 'positive' : 'negative'}`}>
                    {displayStats.growthRate >= 0 ? '+' : ''}{displayStats.growthRate}% so với kỳ trước
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Đơn chờ xác nhận</div>
                <div className="stat-value">{displayStats.pendingOrders}</div>
                <div className="stat-subtitle">Cần xử lý</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Đơn đã hoàn thành</div>
                <div className="stat-value">{displayStats.completedOrders}</div>
                <div className="stat-subtitle">{completionRate}% tỷ lệ hoàn thành</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Tổng doanh thu</div>
                <div className="stat-value">{formatCurrency(displayStats.totalRevenue)}</div>
                <div className="stat-subtitle">Giá trị trung bình: {formatCurrency(displayStats.averageOrderValue)}</div>
            </div>
        </div>
    );
};

export default OrderStats;