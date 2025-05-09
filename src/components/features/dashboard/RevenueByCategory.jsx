import React from 'react';
import '../../../styles/admin/dashboard/breakdown.css';

const RevenueByCategory = ({ data = {} }) => {
    // Chuyển đổi dữ liệu từ định dạng API
    let categoryData = [];

    // Kiểm tra cấu trúc dữ liệu từ API
    if (data && data.categories && typeof data.categories === 'object') {
        // Chuyển đổi từ định dạng API
        categoryData = Object.entries(data.categories).map(([name, info]) => ({
            name,
            percentage: info.percentage || 0,
            value: info.value || 0
        }));
    } else {
        console.warn("Dữ liệu danh mục không đúng định dạng:", data);
    }

    // Nếu không có dữ liệu, hiển thị một mục mặc định
    if (categoryData.length === 0) {
        categoryData = [{ name: "Chưa có dữ liệu", percentage: 100, value: 0 }];
    }

    // Màu sắc cho biểu đồ tròn (4 màu cho 3 danh mục hàng đầu + Khác)
    const colors = ["#4A6CF7", "#6366F1", "#8B5CF6", "#F97316"];

    // Tính toán các phần của biểu đồ tròn
    const createPieChartSegments = () => {
        let startAngle = 0;
        return categoryData.map((item, index) => {
            const percentage = item.percentage / 100;
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
            <div className="breakdown-title">Categories Revenue</div>
            <div className="pie-chart-container">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                    {createPieChartSegments()}
                </svg>
            </div>

            <ul className="breakdown-list">
                {categoryData.map((item, index) => (
                    <li key={index} className="breakdown-item">
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
                            {item.name}
                        </span>
                        <span className="store-percentage">{item.percentage.toFixed(1)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RevenueByCategory;