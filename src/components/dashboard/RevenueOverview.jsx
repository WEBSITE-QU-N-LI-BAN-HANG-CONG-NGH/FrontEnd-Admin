import React from 'react';
import '../../styles/dashboard/overview.css';

const RevenueOverview = () => {
  return (
    <div className="card revenue-overview">
      <div className="revenue-header">
        <div className="revenue-title">Tổng quan doanh thu</div>
        <div className="revenue-subtitle">Tổng doanh thu và tăng trưởng</div>
      </div>
      
      <div className="revenue-amount">3.980.000.000đ</div>
      <div className="revenue-change positive">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        +12.5% so với kỳ trước
      </div>
      <div className="revenue-previous">Tăng 442.000.000đ so với kỳ trước (3.538.000.000đ)</div>
      
      <div className="revenue-chart">
        {/* Chart component sẽ được thêm vào sau khi cài đặt thư viện chart */}
        <svg width="100%" height="100%" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,180 L50,150 L100,160 L150,120 L200,140 L250,80 L300,60 L350,40 L400,20 L450,30 L500,10" 
                fill="none" 
                stroke="#4A6CF7" 
                strokeWidth="3"/>
          <path d="M0,180 L50,150 L100,160 L150,120 L200,140 L250,80 L300,60 L350,40 L400,20 L450,30 L500,10 L500,200 L0,200 Z" 
                fill="rgba(74, 108, 247, 0.1)" 
                stroke="none"/>
        </svg>
      </div>
      
      <div className="store-highlights">
        <div className="highlight-card">
          <div className="highlight-title">Doanh thu cao nhất</div>
          <div className="highlight-store">TechZone Hà Nội</div>
        </div>
        <div className="highlight-card">
          <div className="highlight-title">Tăng trưởng nhanh nhất</div>
          <div className="highlight-store">SmartStore Đà Nẵng</div>
          <div className="highlight-value">(+10.8%)</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;