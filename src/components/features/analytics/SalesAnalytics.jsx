import React from "react";

const SalesAnalytics = ({data = []}) => {
    // Đảm bảo dữ liệu là mảng
    const salesData = Array.isArray(data) ? data : [];

    // Hàm định dạng số tiền thành VND
    const formatCurrency = (amount) => {
        // Xử lý chuyển đổi nếu amount là object (như BigDecimal từ Java)
        if (typeof amount === 'object' && amount !== null) {
            try {
                amount = parseFloat(amount.toString());
            } catch (error) {
                console.error("Lỗi khi chuyển đổi dữ liệu số:", error);
                amount = 0;
            }
        }
        return new Intl.NumberFormat("vi-VN").format(amount || 0) + "đ";
    };

    // Tìm giá trị lớn nhất để tính tỷ lệ cho chiều cao của các cột
    const maxRevenue = Math.max(...salesData.map(item => {
        let revenue = item.revenue;
        if (typeof revenue === 'object' && revenue !== null) {
            try {
                revenue = parseFloat(revenue.toString());
            } catch (error) {
                revenue = 0;
            }
        }
        return revenue || 0;
    }), 1); // Nếu không có dữ liệu, sử dụng 1 làm giá trị mặc định

    // Tính tổng doanh thu và đơn hàng
    const totalRevenue = salesData.reduce((sum, item) => {
        let revenue = item.revenue;
        if (typeof revenue === 'object' && revenue !== null) {
            try {
                revenue = parseFloat(revenue.toString());
            } catch (error) {
                revenue = 0;
            }
        }
        return sum + (revenue || 0);
    }, 0);

    const totalOrders = salesData.reduce((sum, item) => {
        return sum + (item.orders || 0);
    }, 0);

    return (
        <div className="analytics-card sales-analytics">
            <h2 className="analytics-card-title">Doanh thu theo tháng</h2>

            {salesData.length > 0 ? (
                <div className="sales-chart">
                    {salesData.map((monthData, index) => {
                        // Chuyển đổi dữ liệu nếu cần
                        let revenue = monthData.revenue;
                        if (typeof revenue === 'object' && revenue !== null) {
                            try {
                                revenue = parseFloat(revenue.toString());
                            } catch (error) {
                                revenue = 0;
                            }
                        }

                        // Tạo tên tháng
                        const monthName = `Tháng ${monthData.month}/${monthData.year || new Date().getFullYear()}`;

                        // Tính chiều cao cho cột
                        const heightPercentage = (revenue / maxRevenue) * 100;

                        return (
                            <div className="chart-column" key={index}>
                                <div className="column-label">{monthName}</div>
                                <div className="chart-bar-container">
                                    <div
                                        className="chart-bar"
                                        style={{
                                            height: `${heightPercentage}%`,
                                            backgroundColor: `hsl(${210 + index * 20}, 70%, 50%)`,
                                        }}
                                    >
                                        <div className="bar-tooltip">
                                            {formatCurrency(revenue)}
                                            <br/>
                                            {monthData.orders || 0} đơn hàng
                                        </div>
                                    </div>
                                </div>
                                <div className="column-value">{formatCurrency(revenue)}</div>

                                {/* Hiển thị tỷ lệ tăng trưởng nếu có */}
                                {monthData.growth !== undefined && (
                                    <div className={`growth-indicator ${parseFloat(monthData.growth) >= 0 ? 'positive' : 'negative'}`}>
                                        {parseFloat(monthData.growth) >= 0 ? '+' : ''}{parseFloat(monthData.growth).toFixed(1)}%
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="no-data">Không có dữ liệu doanh thu</div>
            )}

            <div className="chart-summary">
                <div className="summary-item">
                    <div className="summary-label">Tổng doanh thu</div>
                    <div className="summary-value">{formatCurrency(totalRevenue)}</div>
                </div>
                <div className="summary-item">
                    <div className="summary-label">Tổng đơn hàng</div>
                    <div className="summary-value">{totalOrders}</div>
                </div>
            </div>
        </div>
    );
};

export default SalesAnalytics;