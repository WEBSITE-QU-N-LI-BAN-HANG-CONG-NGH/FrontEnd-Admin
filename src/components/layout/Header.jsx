import React from 'react';
import '../../styles/layout/header.css';

const Header = () => {
  return (
    <div className="header">
      <div>
        <h1 className="header-title">Dashboard</h1>
        <div className="header-subtitle">Tổng quan về cửa hàng công nghệ </div>
      </div>
      
      <div className="header-actions">
        <div className="search-input">
          <span className="icon">
            {/* // add search icon */}
          </span>
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
        
        <div className="header-icon">
          <span className="notification-badge">3</span>
          {/* // add notificate image */}
        </div>
        
        <button className="button">Tải báo cáo</button>
      </div>
    </div>
  );
};

export default Header;