import React from 'react';
import '../../../styles/admin/dashboard/overview.css';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0đ';
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

const RevenueByTime = (weeklyRevenue = [],
                       monthlyRevenue = []) => {

    const chartData = weeklyRevenue.length > 0
        ? weeklyRevenue.map(item => ({
            name: item.day || '',
            revenue: item.revenue || 0,
            orders: item.orders || 0
        }))
        : [];

    return (
        <div className="revenue-chart-container">
            <h3 className="chart-title">Doanh thu trong tuần</h3>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            tickFormatter={(value) =>
                                value >= 1000000 ? `${value/1000000}M` : value
                            }
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <p className="no-data-message">Không có dữ liệu doanh thu trong tuần</p>
            )}
        </div>
    );
};

export default RevenueByTime;