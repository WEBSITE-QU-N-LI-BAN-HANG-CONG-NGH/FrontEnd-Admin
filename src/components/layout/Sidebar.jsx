import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/layout/sidebar.css";

const Sidebar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await logout();
      // Không cần chuyển hướng vì useEffect trong AuthContext đã xử lý điều này
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  // Lấy chữ cái đầu của tên và họ để hiển thị trong avatar
  const getInitials = () => {
    if (!user) return "U";

    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>TechShop</h1>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Tổng quan</div>
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <Link to="/admin" className="sidebar-link">
              <span className="icon"></span>
              Dashboard
            </Link>
          </li>
          <li className="sidebar-menu-item">
            <span className="icon"></span>
            Phân tích
          </li>
          <li className="sidebar-menu-item">
            <span className="icon"></span>
            Doanh thu
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Quản lý</div>
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <Link to="/admin/products" className="sidebar-link">
              <span className="icon"></span>
              Sản phẩm
            </Link>
          </li>
          <li className="sidebar-menu-item">
            <span className="icon"></span>
            Đơn hàng
          </li>
          <li className="sidebar-menu-item">
            <span className="icon"></span>
            Khách hàng
          </li>
          <li className="sidebar-menu-item">
            <span className="icon"></span>
            Báo cáo sản phẩm
          </li>
        </ul>
      </div>

      <div className="admin-section" onClick={toggleLogout}>
        <div className="admin-avatar">{getInitials()}</div>
        <div className="admin-info">
          <div style={{ fontWeight: "500" }}>
            {user?.firstName || "Admin"} {user?.lastName || ""}
          </div>
          <div style={{ fontSize: "12px", color: "#6A7C92" }}>
            {user?.email || "admin@techshop.com"}
          </div>
        </div>
        {showLogout && (
          <div className="logout-dropdown">
            <button className="logout-button" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
