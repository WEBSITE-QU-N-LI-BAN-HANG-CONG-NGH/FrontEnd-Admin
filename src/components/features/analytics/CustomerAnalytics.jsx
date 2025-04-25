// src/components/features/analytics/CustomerAnalytics.jsx
import React from "react";

const CustomerAnalytics = ({data = {}}) => {
    const {
        totalCustomers = 0,
        totalSpending = 0,
        averageOrders = 0,
    } = data;

    // Hàm định dạng số tiền thành VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    };

    // Tính toán chi tiêu trung bình mỗi khách hàng
    const averageSpending = totalCustomers > 0 ? totalSpending / totalCustomers : 0;

    return (
        <div className="analytics-card">
            <h2 className="analytics-card-title">Phân tích khách hàng</h2>

            <div className="analytics-metrics">
                <div className="metric">
                    <div className="metric-value">{totalCustomers}</div>
                    <div className="metric-label">Tổng số khách hàng</div>
                </div>

                <div className="metric">
                    <div className="metric-value">{formatCurrency(totalSpending)}</div>
                    <div className="metric-label">Tổng chi tiêu</div>
                </div>

                <div className="metric">
                    <div className="metric-value">
                        {typeof averageOrders === 'number' ? averageOrders.toFixed(1) : '0'}
                    </div>
                    <div className="metric-label">Đơn hàng trung bình</div>
                </div>

                <div className="metric">
                    <div className="metric-value">{formatCurrency(averageSpending)}</div>
                    <div className="metric-label">Chi tiêu trung bình</div>
                </div>
            </div>

            <div className="customer-metrics">
                <div className="spending-per-customer">
                    <h3>Chi tiêu theo khách hàng</h3>
                    <div className="big-metric">
                        {formatCurrency(averageSpending)}
                    </div>
                    <div className="metric-description">Trung bình mỗi khách hàng</div>
                </div>

                <div className="customer-activity">
                    <h3>Hoạt động của khách hàng</h3>
                    <div className="activity-chart">
                        <div className="activity-metric">
                            <div className="activity-value">{averageOrders.toFixed(1)}</div>
                            <div className="activity-label">Đơn hàng trung bình</div>
                        </div>
                        <div className="activity-metric">
                            <div className="activity-value">{formatCurrency(totalSpending / (totalCustomers || 1))}</div>
                            <div className="activity-label">Chi tiêu/khách hàng</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerAnalytics;