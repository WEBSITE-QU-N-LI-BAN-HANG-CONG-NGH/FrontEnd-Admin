import React, {useEffect} from "react";
import "../../../styles/admin/dashboard/breakdown.css";

const RevenueBreakdown = ({data = {}}) => {
    useEffect(() => {
        console.log("Raw data:", data);
    }, [data]);

    // Kiểm tra xem data có phải là object hợp lệ không và có dữ liệu không
    const isValidData =
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        Object.keys(data).length > 0 &&
        !data.hasOwnProperty("headers");

    // Tạo mảng để hiển thị dữ liệu từ object
    const storeData = isValidData
        ? Object.entries(data).map(([name, percentage]) => ({
            name,
            percentage:
                typeof percentage === "number"
                    ? parseFloat(percentage.toFixed(1))
                    : 0,
        }))
        : [{name: "Chưa có dữ liệu", percentage: 100}];

    // Màu sắc cho biểu đồ tròn
    const colors = ["#4A6CF7", "#6366F1", "#8B5CF6", "#EC4899", "#F97316"];

    // Tính toán các phần của biểu đồ tròn
    const createPieChartSegments = () => {
        let total = storeData.reduce((sum, item) => sum + item.percentage, 0);
        let startAngle = 0;

        return storeData.map((item, index) => {
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
            <div className="breakdown-title">Phân bổ doanh thu</div>
            <div className="breakdown-subtitle">Tỷ lệ đóng góp theo cửa hàng</div>

            <div className="pie-chart-container">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                    {createPieChartSegments()}
                </svg>
            </div>

            <ul className="breakdown-list">
                {storeData.map((store, index) => (
                    <li key={index} className="breakdown-item">
            <span
                className="store-name"
                style={{display: "flex", alignItems: "center"}}
            >
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
                        <span className="store-percentage">{store.percentage}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RevenueBreakdown;
