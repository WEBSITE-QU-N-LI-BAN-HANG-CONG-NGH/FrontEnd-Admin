import React from 'react';
import '../../styles/layout/sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>TechShop</h1>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Tổng quan</div>
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item active">
            <span className="icon">
            </span>
            Dashboard
          </li>
          <li className="sidebar-menu-item">
            <span className="icon">
            </span>
            Phân tích
          </li>
          <li className="sidebar-menu-item">
            <span className="icon">

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

            </span>
            Sản phẩm
          </li>
          <li className="sidebar-menu-item">
            <span className="icon">

            </span>
            Đơn hàng
          </li>
          <li className="sidebar-menu-item">
            <span className="icon">

            </span>
            Khách hàng
          </li>
          <li className="sidebar-menu-item">
            <span className="icon">
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