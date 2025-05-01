import React from 'react';
import '../../../styles/admin/dashboard/overview.css';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

const RevenueOverview = ({ data = [] }) => {
    // Nhận dữ liệu từ props hoặc sử dụng object rỗng nếu không có
    const {
        currentMonthIncome = 0,
        comparePercent = 0,
        compareDifference = 0,
        weeklyRevenue = []
    } = data;

    // Sử dụng dữ liệu từ API hoặc tạo mảng trống nếu không có dữ liệu
    const chartData = weeklyRevenue.length > 0 ? weeklyRevenue : [];

    return (
        <div className="card revenue-overview">
            <div className="revenue-header">
                <div className="revenue-title">Doanh thu trong tuần</div>
                <div className="revenue-amount">{formatCurrency(currentMonthIncome)}</div>
                <div className={`revenue-change ${comparePercent >= 0 ? 'positive' : 'negative'}`}>
                    {comparePercent >= 0 ? '+' : ''}{comparePercent}% so với tuần trước
                </div>
            </div>

            <div className="revenue-chart">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4A6CF7" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#4A6CF7" stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                tickFormatter={(value) => value >= 1000000 ? `${value/1000000}M` : value}
                                tick={{ fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#4A6CF7"
                                fill="url(#colorRevenue)"
                                fillOpacity={0.8}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-data-message">Không có dữ liệu doanh thu trong tuần</div>
                )}
            </div>
        </div>
    );
};

export default RevenueOverview;