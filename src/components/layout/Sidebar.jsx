// src/components/layout/Sidebar.jsx
import React, {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
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
    };

    return (
        <div className="sidebar">
                <div className="sidebar-header">
                    <img src="https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png?fbclid=IwY2xjawJ4KxJleHRuA2FlbQIxMABicmlkETFnbUszR1o2RlZrQXJ2VFRXAR7SKjjUPYQHQovx3wZg3p14ksqpKnPTakahujkwPCwl21n8F7-sQJX0fXLfRg_aem_ghKIYi2m6VITMUEzqoiUOg" alt="Logo" className="logo" />
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
                    <li className="sidebar-menu-item">
                        <Link to="/admin/analytics" className="sidebar-link">
                            <span className="icon">{icons.analytics}</span>
                            Phân tích
                        </Link>
                    </li>
                    <li className={`sidebar-menu-item ${isActive("/admin/products") ? "active" : ""}`}>
                        <Link to="/admin/products" className="sidebar-link">
                            <span className="icon">{icons.products}</span>
                            Sản phẩm
                        </Link>
                    </li>
                    <li className={`sidebar-menu-item ${isActive("/admin/users") ? "active" : ""}`}>
                        <Link to="/admin/users" className="sidebar-link">
                            <span className="icon">{icons.users}</span>
                            Người dùng
                        </Link>
                    </li>
                    <li className="sidebar-menu-item">
                        <Link to="/admin/orders" className="sidebar-link">
                            <span className="icon">{icons.orders}</span>
                            Đơn hàng
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="admin-section" onClick={toggleLogout}>
                <div className="admin-avatar">
                    <img
                        src="https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png"
                        alt="Avatar"
                        className="avatar-img"
                    />
                </div>
                <div className="admin-info">
                    <div className="name">
                        ADMIN
                    </div>
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