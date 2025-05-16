import React, { useState } from 'react';
import '../../../styles/admin/dashboard/overview.css';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label}`}</p>
                <p className="info">{`Doanh thu: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const RevenueByTime = ({ weeklyRevenue = [], monthlyRevenue = [] }) => {
    const [timeFrame, setTimeFrame] = useState('week'); // 'week' hoặc 'month'

    const weeklyData = weeklyRevenue.length > 0
        ? weeklyRevenue.map(item => ({
            name: item.day || '',
            revenue: item.revenue || 0,
            orders: item.orders || 0
        }))
        : [];

    const monthlyData = monthlyRevenue.length > 0
        ? monthlyRevenue.map(item => ({
            name: item.date || '',
            revenue: item.revenue || 0,
            orders: item.orders || 0
        }))
        : [];

    const chartData = timeFrame === 'week' ? weeklyData : monthlyData;
    const title = timeFrame === 'week' ? 'Doanh thu theo tuần' : 'Doanh thu theo tháng';
    const noDataMessage = timeFrame === 'week'
        ? 'Không có dữ liệu doanh thu trong tuần'
        : 'Không có dữ liệu doanh thu trong tháng';

    return (
        <div className="revenue-chart-container">
            <div className="chart-header">
                <h3 className="chart-title">{title}</h3>
                <div className="time-frame-toggle">
                    <button
                        className={`toggle-btn ${timeFrame === 'week' ? 'active' : ''}`}
                        onClick={() => setTimeFrame('week')}
                    >
                        WEEK
                    </button>
                    <button
                        className={`toggle-btn ${timeFrame === 'month' ? 'active' : ''}`}
                        onClick={() => setTimeFrame('month')}
                    >
                        MONTH
                    </button>
                </div>
            </div>

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
                <p className="no-data-message">{noDataMessage}</p>
            )}
        </div>
    );
};

export default RevenueByTime;