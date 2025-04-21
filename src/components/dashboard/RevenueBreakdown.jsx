import React from 'react';
import '../../styles/dashboard/breakdown.css';

const RevenueBreakdown = () => {
  const storeData = [
    { name: 'TechZone Hà Nội', percentage: 31.4 },
    { name: 'DigiWorld Sài Gòn', percentage: 24.6 },
    { name: 'SmartStore Đà Nẵng', percentage: 18.1 },
    { name: 'FutureGadget Cần Thơ', percentage: 13.8 },
    { name: 'TechHub Hải Phòng', percentage: 12.1 },
  ];

  return (
    <div className="card revenue-breakdown">
      <div className="breakdown-title">Phân bổ doanh thu</div>
      <div className="breakdown-subtitle">Tỷ lệ đóng góp theo cửa hàng</div>
      
      <div className="pie-chart-container">
        {/* Biểu đồ tròn đơn giản */}
        <svg width="180" height="180" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#f2f2f2" />
          
          {/* Simulate pie chart segments */}
          <path d="M50,50 L95,50 A45,45 0 0,1 72,90 Z" fill="#4A6CF7" />
          <path d="M50,50 L72,90 A45,45 0 0,1 28,90 Z" fill="#6366F1" />
          <path d="M50,50 L28,90 A45,45 0 0,1 5,50 Z" fill="#8B5CF6" />
          <path d="M50,50 L5,50 A45,45 0 0,1 28,10 Z" fill="#EC4899" />
          <path d="M50,50 L28,10 A45,45 0 0,1 95,50 Z" fill="#F97316" />
          
          {/* Center circle for donut effect */}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
      </div>
      
      <ul className="breakdown-list">
        {storeData.map((store, index) => (
          <li key={index} className="breakdown-item">
            <span className="store-name">{store.name}</span>
            <span className="store-percentage">{store.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RevenueBreakdown;