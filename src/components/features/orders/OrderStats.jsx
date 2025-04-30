import React from "react";

const OrderStats = ({ stats }) => {
    // Hàm định dạng số tiền
    const formatCurrency = (amount) => {
        if (typeof amount === 'object' && amount !== null) {
            try {
                amount = parseFloat(amount.toString());
            } catch (error) {
                amount = 0;
            }
        }
        return new Intl.NumberFormat("vi-VN").format(amount || 0) + "đ";
    };

    // Đảm bảo stats là object
    const safeStats = stats && typeof stats === 'object' ? stats : {};

    return (
        <div className="order-stats">
            <div className="stat-card">
                <div className="stat-title">Tổng đơn hàng</div>
                <div className="stat-value">{safeStats.totalOrders || 0}</div>
                <div className={`stat-change ${safeStats.growthRate >= 0 ? 'positive' : 'negative'}`}>
                    {safeStats.growthRate >= 0 ? '+' : ''}{safeStats.growthRate || 0}% so với kỳ trước
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Đơn chờ xác nhận</div>
                <div className="stat-value">{safeStats.pendingOrders || 0}</div>
                <div className="stat-subtitle">Cần xử lý</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Đơn đã hoàn thành</div>
                <div className="stat-value">{safeStats.completedOrders || 0}</div>
                <div className="stat-subtitle">
                    {safeStats.totalOrders > 0
                        ? Math.round((safeStats.completedOrders || 0) / safeStats.totalOrders * 100)
                        : 0}% tỷ lệ hoàn thành
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Tổng doanh thu</div>
                <div className="stat-value">{formatCurrency(safeStats.totalRevenue)}</div>
                <div className="stat-subtitle">
                    {safeStats.completedOrders > 0
                        ? `Giá trị trung bình: ${formatCurrency((safeStats.totalRevenue || 0) / (safeStats.completedOrders || 1))}`
                        : 'Giá trị trung bình: 0đ'}
                </div>
            </div>
        </div>
    );
};

export default OrderStats;