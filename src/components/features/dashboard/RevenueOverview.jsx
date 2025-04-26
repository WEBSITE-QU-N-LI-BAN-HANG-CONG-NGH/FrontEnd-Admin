import React from 'react';
import '../../../styles/admin/dashboard/overview.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';

// Dữ liệu mẫu cho biểu đồ
const generateData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
        const hour = i;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const label = `${hour12}${ampm}`;

        // Tạo một số ngẫu nhiên từ 1 đến 10 và nhân với 500000
        const fluctuation = (Math.random() * 9 + 1) * 500000;
        const baseValue = 2000000; // 2 triệu đồng

        data.push({
            hour: label,
            revenue: Math.round(baseValue + fluctuation),
            orders: Math.round(fluctuation / 100000)
        });
    }
    return data;
};

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0đ';
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

// Hàm định dạng dữ liệu cho tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="chart-tooltip">
                <p className="tooltip-label">{`${label}`}</p>
                <p className="tooltip-revenue">{`Doanh thu: ${formatCurrency(payload[0].value)}`}</p>
                <p className="tooltip-orders">{`Đơn hàng: ${payload[0].payload.orders}`}</p>
            </div>
        );
    }
    return null;
};

const RevenueOverview = ({ data = {} }) => {
    // Nhận dữ liệu từ props hoặc sử dụng giá trị mẫu nếu không có
    const {
        currentMonthIncome = 0,
        comparePercent = 0,
        compareDifference = 0
    } = data;

    // Dữ liệu cho biểu đồ
    const chartData = generateData();

    // Tính toán giá trị tháng trước dựa trên dữ liệu hiện tại
    const previousMonthIncome = currentMonthIncome - compareDifference;

    // Kiểm tra xem tỷ lệ tăng trưởng là dương hay âm
    const isPositiveGrowth = comparePercent >= 0;

    return (
        <div className="card revenue-overview">
            <div className="revenue-header">
                <div className="revenue-title">Tổng quan doanh thu</div>
                <div className="revenue-subtitle">Doanh thu theo giờ trong ngày</div>
            </div>

            <div className="revenue-amount">{formatCurrency(currentMonthIncome)}</div>

            <div className={`revenue-change ${isPositiveGrowth ? 'positive' : 'negative'}`}>
                {isPositiveGrowth ? '+' : ''}{comparePercent.toFixed(2)}% so với tháng trước
            </div>

            <div className="revenue-previous">
                {isPositiveGrowth ? 'Tăng' : 'Giảm'} {formatCurrency(Math.abs(compareDifference))} so với tháng trước
                ({formatCurrency(previousMonthIncome)})
            </div>

            <div className="revenue-chart">
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#4A6CF7" stopOpacity={0.8} />
                                <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="hour" tickLine={false} axisLine={false} />
                        <YAxis hide={true} />
                        <Tooltip content={<CustomTooltip />} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="url(#colorRevenue)"
                            fill="url(#colorRevenue)"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="store-highlights">
                <div className="highlight-card">
                    <div className="highlight-title">Mục tiêu tháng</div>
                    <div className="highlight-value">
                        {formatCurrency(currentMonthIncome * 1.2)}
                    </div>
                    <div className="highlight-subtitle">
                        ({((currentMonthIncome / (currentMonthIncome * 1.2)) * 100).toFixed(1)}% đạt được)
                    </div>
                </div>
                <div className="highlight-card">
                    <div className="highlight-title">Dự báo tháng sau</div>
                    <div className="highlight-value">
                        {formatCurrency(currentMonthIncome * (1 + comparePercent / 100))}
                    </div>
                    <div className="highlight-subtitle">
                        (Dựa trên tỷ lệ tăng trưởng hiện tại)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueOverview;