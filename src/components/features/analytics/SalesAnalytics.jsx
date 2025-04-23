// src/components/features/analytics/SalesAnalytics.jsx
import React from "react";

const SalesAnalytics = ({data = []}) => {
    // Hàm định dạng số tiền thành VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    };

    // Tìm giá trị lớn nhất để tính tỷ lệ cho chiều cao của các cột
    const maxRevenue = Math.max(...data.map(item => item.revenue || 0), 1);

    return (
        <div className="analytics-card sales-analytics">
            <h2 className="analytics-card-title">Doanh thu theo thời gian</h2>

            {data.length > 0 ? (
                <div className="sales-chart">
                    {data.map((monthData, index) => (
                        <div className="chart-column" key={index}>
                            <div className="column-label">Tháng {monthData.month}</div>
                            <div className="chart-bar-container">
                                <div
                                    className="chart-bar"
                                    style={{
                                        height: `${(monthData.revenue / maxRevenue) * 100}%`,
                                        backgroundColor: `hsl(${210 + index * 20}, 70%, 50%)`,
                                    }}
                                >
                                    <div className="bar-tooltip">
                                        {formatCurrency(monthData.revenue)}
                                        <br/>
                                        {monthData.orders} đơn hàng
                                    </div>
                                </div>
                            </div>
                            <div className="column-value">{formatCurrency(monthData.revenue)}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-data">Không có dữ liệu doanh thu</div>
            )}

            <div className="chart-summary">
                <div className="summary-item">
                    <div className="summary-label">Tổng doanh thu</div>
                    <div className="summary-value">
                        {formatCurrency(data.reduce((sum, item) => sum + (item.revenue || 0), 0))}
                    </div>
                </div>
                <div className="summary-item">
                    <div className="summary-label">Tổng đơn hàng</div>
                    <div className="summary-value">
                        {data.reduce((sum, item) => sum + (item.orders || 0), 0)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesAnalytics;