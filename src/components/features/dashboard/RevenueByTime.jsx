import React, { useState } from 'react';
import '../../../styles/admin/dashboard/overview.css';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const RevenueByTime = ({ weeklyRevenue = {}, monthlyRevenue = {} }) => {
    const [timePeriod, setTimePeriod] = useState('week'); // Mặc định hiển thị theo tuần

    // Lấy dữ liệu theo thời gian đã chọn
    const selectedData = timePeriod === 'week' ? weeklyRevenue : monthlyRevenue;

    // Lấy mảng dữ liệu cho biểu đồ
    const chartData = selectedData?.data || [];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${label}: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value)}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="revenue-chart-container">
            <div className="chart-header">
                <div className="chart-title-wrapper">
                    <h3 className="chart-title">Doanh thu</h3>
                </div>
                <div className="chart-period-selector">
                    <button
                        className={`period-button ${timePeriod === 'week' ? 'active' : ''}`}
                        onClick={() => setTimePeriod('week')}
                    >
                        Theo tuần
                    </button>
                    <button
                        className={`period-button ${timePeriod === 'month' ? 'active' : ''}`}
                        onClick={() => setTimePeriod('month')}
                    >
                        Theo tháng
                    </button>
                </div>
            </div>

            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={timePeriod === 'week' ? 'day' : 'week'}
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            tickFormatter={(value) =>
                                value >= 1000000 ? `${(value/1000000).toFixed(1)}M` :
                                    value >= 1000 ? `${(value/1000).toFixed(1)}K` : value
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
                <p className="no-data-message">Không có dữ liệu doanh thu {timePeriod === 'week' ? 'theo tuần' : 'theo tháng'}</p>
            )}
        </div>
    );
};

export default RevenueByTime;