import React from "react";

const SalesByCategory = ({data = []}) => {
    // Đảm bảo dữ liệu là mảng
    let safeData = [];

    // Xử lý các định dạng dữ liệu khác nhau có thể trả về từ API
    if (Array.isArray(data)) {
        safeData = data;
    } else if (typeof data === 'object' && data !== null) {
        // Chuyển đổi object sang mảng nếu data là object
        safeData = Object.entries(data).map(([name, value]) => ({
            name,
            revenue: typeof value === 'number' ? value : 0
        }));
    }

    // Hàm định dạng số tiền thành VND
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

    // Sắp xếp danh mục theo doanh thu giảm dần
    const sortedData = [...safeData].sort((a, b) => {
        const revenueA = typeof a.revenue === 'object' ? parseFloat(a.revenue.toString()) : a.revenue || 0;
        const revenueB = typeof b.revenue === 'object' ? parseFloat(b.revenue.toString()) : b.revenue || 0;
        return revenueB - revenueA;
    });

    // Tính tổng doanh thu để tính phần trăm
    const totalRevenue = safeData.reduce((sum, item) => {
        const revenue = typeof item.revenue === 'object' ?
            parseFloat(item.revenue.toString()) : (item.revenue || 0);
        return sum + revenue;
    }, 0);

    // Màu sắc cho biểu đồ
    const colors = ["#4A6CF7", "#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#10B981", "#3B82F6"];

    // Xử lý dữ liệu hiển thị: top 5 danh mục + Others
    let displayData = sortedData;
    if (sortedData.length > 5) {
        const top5 = sortedData.slice(0, 5);
        const others = sortedData.slice(5);

        // Tính tổng revenue cho Others
        const othersRevenue = others.reduce((sum, item) => {
            const revenue = typeof item.revenue === 'object' ?
                parseFloat(item.revenue.toString()) : (item.revenue || 0);
            return sum + revenue;
        }, 0);

        // Thêm mục Others vào dữ liệu hiển thị
        displayData = [
            ...top5,
            {
                name: "Khác",
                revenue: othersRevenue
            }
        ];
    }

    return (
        <div className="analytics-card sales-by-category">
            <h2 className="analytics-card-title">Doanh thu theo danh mục</h2>

            {safeData.length > 0 ? (
                <div className="category-revenue-container">
                    <div className="pie-chart-container">
                        <svg viewBox="0 0 100 100" className="pie-chart">
                            {createPieChartSegments(displayData, totalRevenue, colors)}
                            <circle cx="50" cy="50" r="25" fill="white"/>
                            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="total-revenue">
                                {formatCurrency(totalRevenue)}
                            </text>
                        </svg>
                    </div>

                    <div className="category-list">
                        {displayData.map((category, index) => {
                            const revenue = typeof category.revenue === 'object' ?
                                parseFloat(category.revenue.toString()) : (category.revenue || 0);

                            const percentage = totalRevenue > 0 ?
                                (revenue / totalRevenue) * 100 : 0;

                            return (
                                <div className="category-item" key={index}>
                                    <div
                                        className="category-color"
                                        style={{backgroundColor: colors[index % colors.length]}}
                                    ></div>
                                    <div className="category-name">{category.name}</div>
                                    <div className="category-percentage">
                                        {percentage.toFixed(1)}%
                                    </div>
                                    <div className="category-revenue">{formatCurrency(revenue)}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="no-data">Không có dữ liệu doanh thu theo danh mục</div>
            )}
        </div>
    );
};

// Hàm tạo các phần của biểu đồ tròn
const createPieChartSegments = (data, total, colors) => {
    let startAngle = 0;
    return data.map((item, index) => {
        const revenue = typeof item.revenue === 'object' ?
            parseFloat(item.revenue.toString()) : (item.revenue || 0);

        const percentage = total > 0 ? revenue / total : 0;
        const angle = percentage * Math.PI * 2;
        const largeArcFlag = angle > Math.PI ? 1 : 0;

        const endAngle = startAngle + angle;
        const x1 = 50 + 40 * Math.cos(startAngle);
        const y1 = 50 + 40 * Math.sin(startAngle);
        const x2 = 50 + 40 * Math.cos(endAngle);
        const y2 = 50 + 40 * Math.sin(endAngle);

        const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        const segment = (
            <path
                key={index}
                d={path}
                fill={colors[index % colors.length]}
            />
        );

        startAngle = endAngle;
        return segment;
    });
};

export default SalesByCategory;