import React from 'react';
import '../../../styles/admin/dashboard/overview.css';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

const RevenueOverview = ({data = {}}) => {
    const {
        currentMonthIncome = 0,
        comparePercent = 0,
        compareDifference = 0,
        previousMonthIncome = 0,
        topStore = {name: 'Chưa có dữ liệu'},
        fastestGrowingStore = {name: 'Chưa có dữ liệu', growth: 0}
    } = data;

    const isPositiveGrowth = comparePercent >= 0;

    return (
        <div className="card revenue-overview">
            <div className="revenue-header">
                <div className="revenue-title">Tổng quan doanh thu</div>
                <div className="revenue-subtitle">Tổng doanh thu và tăng trưởng</div>
            </div>

            <div className="revenue-amount">{formatCurrency(currentMonthIncome)}</div>
            <div className={`revenue-change ${isPositiveGrowth ? 'positive' : 'negative'}`}>

                {isPositiveGrowth ? '+' : ''}{comparePercent}% so với kỳ trước
            </div>
            <div className="revenue-previous">
                {isPositiveGrowth ? 'Tăng' : 'Giảm'} {formatCurrency(Math.abs(compareDifference))} so với kỳ trước
                ({formatCurrency(previousMonthIncome)})
            </div>

            <div className="revenue-chart">

            </div>

            <div className="store-highlights">
                <div className="highlight-card">
                    <div className="highlight-title">Doanh thu cao nhất</div>
                    <div className="highlight-store">{topStore.name}</div>
                </div>
                <div className="highlight-card">
                    <div className="highlight-title">Tăng trưởng nhanh nhất</div>
                    <div className="highlight-store">{fastestGrowingStore.name}</div>
                    <div className="highlight-value">
                        ({fastestGrowingStore.growth >= 0 ? '+' : ''}{fastestGrowingStore.growth}%)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueOverview;