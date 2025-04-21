import React from 'react';
import '../../styles/layout/sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4A6CF7" />
          <path d="M2 17L12 22L22 17" stroke="#4A6CF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="#4A6CF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1>TechShop</h1>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Tổng quan</div>
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item active">
            <span className="icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="9" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="5" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="12" width="7" height="9" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="16" width="7" height="5" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Dashboard
          </li>
          <li className="sidebar-menu-item">
            <span className="icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Phân tích
          </li>
          <li className="sidebar-menu-item">
            <span className="icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" />
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                <path d="M9 21V9" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Doanh thu
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Quản lý</div>
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <span className="icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" />
                <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Sản phẩm
          </li>
          <li className="sidebar-menu-item">
            <span className="icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="2" />
                <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
                <path d="M8.25 12V21.5" stroke="currentColor" strokeWidth="2" />
                <path d="M15.75 22V12" stroke="currentColor" strokeWidth="2" />
                <path d="M8.25 2V12" stroke="currentColor" strokeWidth="2" />
                <path d="M15.75 12V2" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Đơn hàng
          </li>
          <li className="sidebar-menu-item">
            <span className="icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" />
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" />
                <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13" stroke="currentColor" strokeWidth="2" />
                <path d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Khách hàng
          </li>
          <li className="sidebar-menu-item">
            <span className="icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" />
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" />
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" />
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" />
                <path d="M10 9H8" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Báo cáo sản phẩm
          </li>
        </ul>
      </div>

      <div className="admin-section">
        <div className="admin-avatar">AD</div>
        <div>
          <div style={{ fontWeight: '500' }}>Admin</div>
          <div style={{ fontSize: '12px', color: '#6A7C92' }}>admin@techshop.com</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;