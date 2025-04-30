import React from 'react';
import '../../../styles/admin/dashboard/overview.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';

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
                <p className="tooltip-orders">{`Đơn hàng: ${payload[0].payload.orders || 0}`}</p>
            </div>
        );
    }
    return null;
};

const RevenueOverview = ({ data = {} }) => {
    // Nhận dữ liệu từ props hoặc sử dụng object rỗng nếu không có
    const {
        currentMonthIncome = 0,
        comparePercent = 0,
        compareDifference = 0
    } = data;

    // Chuẩn bị dữ liệu cho biểu đồ - sử dụng dữ liệu thực từ API nếu có
    const chartData = data?.revenueByHour || [];

    return (
        <div className="card revenue-overview">
            <div className="revenue-header">
                <div className="revenue-title">Doanh thu theo giờ</div>
                <div className="revenue-amount">{formatCurrency(currentMonthIncome)}</div>
                <div className={`revenue-change ${comparePercent >= 0 ? 'positive' : 'negative'}`}>
                    {comparePercent >= 0 ? '+' : ''}{comparePercent}% so với tháng trước
                </div>
                <div className="revenue-previous">
                    Chênh lệch: {formatCurrency(compareDifference)}
                </div>
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
        </div>
    );
};

export default RevenueOverview;