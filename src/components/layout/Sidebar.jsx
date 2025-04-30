// src/components/layout/Sidebar.jsx
import React, {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import "../../styles/layout/sidebar.css";

const Sidebar = () => {
    const [showLogout, setShowLogout] = useState(false);
    const {user, logout} = useAuth();
    const location = useLocation();

    const handleLogout = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await logout();
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };

    const toggleLogout = () => {
        setShowLogout(!showLogout);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Thêm các icon sử dụng UTF-8 characters
    const icons = {
        dashboard: "📊",
        analytics: "📈",
        products: "📦",
        users: "👥",
        orders: "🛒",
        revenue: "💰",
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src="https://placehold.co/200" alt="Logo" className="logo" />
                <h1>TechShop</h1>
            </div>

            <div className="sidebar-section">
                <ul className="sidebar-menu">
                    <li className={`sidebar-menu-item ${isActive("/admin") ? "active" : ""}`}>
                        <Link to="/admin" className="sidebar-link">
                            <span className="icon">{icons.dashboard}</span>
                            Dashboard
                        </Link>
                    </li>
                    <li className={`sidebar-menu-item ${isActive("/admin/analytics") ? "active" : ""}`}>
                        <Link to="/admin/analytics" className="sidebar-link">
                            <span className="icon">{icons.analytics}</span>
                            Phân tích
                        </Link>
                    </li>
                    <li className={`sidebar-menu-item ${isActive("/admin/revenue") ? "active" : ""}`}>
                        <Link to="/admin/revenue" className="sidebar-link">
                            <span className="icon">{icons.revenue}</span>
                            Doanh thu
                        </Link>
                    </li>
                    <li className={`sidebar-menu-item ${isActive("/admin/products") ? "active" : ""}`}>
                        <Link to="/admin/products" className="sidebar-link">
                            <span className="icon">{icons.products}</span>
                            Sản phẩm
                        </Link>
                    </li>
                    <li className={`sidebar-menu-item ${isActive("/admin/orders") ? "active" : ""}`}>
                        <Link to="/admin/orders" className="sidebar-link">
                            <span className="icon">{icons.orders}</span>
                            Đơn hàng
                        </Link>
                    </li>
                    <li className={`sidebar-menu-item ${isActive("/admin/users") ? "active" : ""}`}>
                        <Link to="/admin/users" className="sidebar-link">
                            <span className="icon">{icons.users}</span>
                            Người dùng
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="admin-section" onClick={toggleLogout}>
                <div className="admin-avatar">
                    {user?.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt="Avatar"
                            className="avatar-img"
                        />
                    ) : (
                        <span>{user?.firstName?.[0] || 'A'}</span>
                    )}
                </div>
                <div className="admin-info">
                    <div className="name">
                        {user?.firstName || 'Admin'}
                    </div>
                    <div className="email">{user?.email || 'admin@example.com'}</div>
                </div>
                {showLogout && (
                    <div className="logout-dropdown">
                        <button className="logout-button" onClick={handleLogout}>
                            ⬅️ Đăng xuất
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;