// src/components/features/analytics/CustomerAnalytics.jsx
import React from "react";

const CustomerAnalytics = ({data = {}}) => {
    const {
        totalCustomers = 0,
        totalSpending = 0,
        vipCustomers = 0,
        averageOrders = 0,
    } = data;

    // Hàm định dạng số tiền thành VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    };

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
                    <div className="metric-value">{vipCustomers}</div>
                    <div className="metric-label">Khách hàng VIP</div>
                </div>
            </div>

            <div className="customer-metrics">
                <div className="spending-per-customer">
                    <h3>Chi tiêu trung bình</h3>
                    <div className="big-metric">
                        {formatCurrency(totalCustomers ? Math.round(totalSpending / totalCustomers) : 0)}
                    </div>
                    <div className="metric-description">Trung bình mỗi khách hàng</div>
                </div>

                <div className="vip-percentage">
                    <h3>Tỷ lệ khách hàng VIP</h3>
                    <div className="vip-chart">
                        <svg viewBox="0 0 100 100" className="pie-percentage">
                            <circle cx="50" cy="50" r="40" fill="#e6e6e6"/>
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="#4A6CF7"
                                strokeWidth="10"
                                strokeDasharray={`${(vipCustomers / totalCustomers) * 251.2} 251.2`}
                                transform="rotate(-90 50 50)"
                            />
                            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
                                  className="percentage-text">
                                {totalCustomers ? Math.round((vipCustomers / totalCustomers) * 100) : 0}%
                            </text>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerAnalytics;