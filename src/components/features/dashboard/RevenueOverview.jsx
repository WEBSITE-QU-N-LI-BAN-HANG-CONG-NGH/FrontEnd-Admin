// src/components/features/dashboard/RevenueOverview.jsx
import React from 'react';
import '../../../styles/admin/dashboard/overview.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0đ';
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

const RevenueOverview = ({ data = {} }) => {
    // Nhận dữ liệu từ props hoặc sử dụng giá trị mặc định nếu không có
    const {
        currentMonthIncome = 0,
        comparePercent = 0,
        compareDifference = 0
    } = data;

    // Tính toán giá trị tháng trước dựa trên dữ liệu hiện tại
    const previousMonthIncome = currentMonthIncome - compareDifference;

    // Kiểm tra xem tỷ lệ tăng trưởng là dương hay âm
    const isPositiveGrowth = comparePercent >= 0;

    return (
        <div className="card revenue-overview">
            <div className="revenue-header">
                <div className="revenue-title">Tổng quan doanh thu</div>
                <div className="revenue-subtitle">Tổng doanh thu tháng này</div>
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
                {/*<div className="revenue-chart">*/}
                {/*    <ResponsiveContainer width="100%" height="100%">*/}
                {/*        <LineChart data={data || []}>*/}
                {/*            <XAxis dataKey="month" />*/}
                {/*            <YAxis />*/}
                {/*            <Tooltip />*/}
                {/*            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />*/}
                {/*        </LineChart>*/}
                {/*    </ResponsiveContainer>*/}
                {/*</div>*/}
            </div>

            <div className="store-highlights">
                <div className="highlight-card">
                    <div className="highlight-title">Mục tiêu tháng</div>
                    <div className="highlight-store">
                        {formatCurrency(currentMonthIncome * 1.2)}
                    </div>
                    <div className="highlight-value">
                        ({((currentMonthIncome / (currentMonthIncome * 1.2)) * 100).toFixed(1)}% đạt được)
                    </div>
                </div>
                <div className="highlight-card">
                    <div className="highlight-title">Dự báo tháng sau</div>
                    <div className="highlight-store">
                        {formatCurrency(currentMonthIncome * (1 + comparePercent / 100))}
                    </div>
                    <div className="highlight-value">
                        (Dựa trên tỷ lệ tăng trưởng hiện tại)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueOverview;