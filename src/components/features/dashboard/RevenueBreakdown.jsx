// src/components/features/dashboard/RevenueBreakdown.jsx
import React from 'react';
import '../../../styles/admin/dashboard/breakdown.css';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0đ';
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

const handleItemClick = (name, percentage) => {
    console.log(`Clicked on: ${name} (${percentage.toFixed(1)}%)`);
    // Có thể mở modal chi tiết hoặc navigate đến trang phân tích cụ thể
    // window.location.href = `/admin/revenue?category=${name}`;
};

const RevenueBreakdown = ({ data = {} }) => {
    // Chuyển đổi dữ liệu từ nhiều định dạng có thể có
    let storeData = [];

    if (Array.isArray(data)) {
        // Nếu data là mảng các đối tượng
        storeData = data.map(item => ({
            name: item.name || 'Không xác định',
            percentage: item.percentage || (item.revenue / data.reduce((sum, i) => sum + (i.revenue || 0), 1) * 100) || 0,
            revenue: item.revenue || 0
        }));
    } else if (typeof data === 'object' && data !== null) {
        // Nếu data là đối tượng với các cặp key-value
        storeData = Object.entries(data).map(([name, value]) => ({
            name,
            percentage: typeof value === 'number' ? value : 0,
            revenue: value || 0
        }));
    }

    // Nếu không có dữ liệu, hiển thị một mục mặc định
    if (storeData.length === 0) {
        storeData = [{ name: "Chưa có dữ liệu", percentage: 100, revenue: 0 }];
    }

    // Sắp xếp dữ liệu theo phần trăm giảm dần
    storeData.sort((a, b) => b.percentage - a.percentage);

    // Lấy top 2 và gộp còn lại thành "Others" nếu có nhiều hơn 2 mục
    let displayData = storeData;
    if (storeData.length > 2) {
        const top2 = storeData.slice(0, 2);
        const others = storeData.slice(2);

        const othersPercentage = others.reduce((sum, item) => sum + item.percentage, 0);
        const othersRevenue = others.reduce((sum, item) => sum + item.revenue, 0);

        displayData = [
            ...top2,
            {
                name: "Khác",
                percentage: othersPercentage,
                revenue: othersRevenue
            }
        ];
    }

    // Màu sắc cho biểu đồ tròn
    const colors = ["#4A6CF7", "#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#10B981", "#3B82F6"];

    // Tính toán các phần của biểu đồ tròn
    const createPieChartSegments = () => {
        let total = displayData.reduce((sum, item) => sum + item.percentage, 0);
        if (total === 0) total = 100; // Tránh chia cho 0

        let startAngle = 0;
        return displayData.map((item, index) => {
            const percentage = item.percentage / total;
            const angle = percentage * Math.PI * 2;
            const endAngle = startAngle + angle;

            const x1 = 50 + 45 * Math.cos(startAngle);
            const y1 = 50 + 45 * Math.sin(startAngle);
            const x2 = 50 + 45 * Math.cos(endAngle);
            const y2 = 50 + 45 * Math.sin(endAngle);

            const largeArcFlag = angle > Math.PI ? 1 : 0;
            const path = `M50,50 L${x1},${y1} A45,45 0 ${largeArcFlag},1 ${x2},${y2} Z`;
            const segment = (
                <path key={index} d={path} fill={colors[index % colors.length]}/>
            );

            startAngle = endAngle;
            return segment;
        });
    };

    return (
        <div className="card revenue-breakdown">
            <div className="breakdown-title">Revenue By Category</div>
            <div className="pie-chart-container">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                    {createPieChartSegments()}
                </svg>
            </div>

            <ul className="breakdown-list">
                {displayData.map((store, index) => (
                    <li key={index}
                        className="breakdown-item"
                        onClick={() => handleItemClick(store.name, store.percentage)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="store-name" style={{display: "flex", alignItems: "center"}}>
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    backgroundColor: colors[index % colors.length],
                                    marginRight: "8px",
                                }}
                            ></span>
                            {store.name}
                        </span>
                        <span className="store-percentage">{store.percentage.toFixed(1)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RevenueBreakdown;