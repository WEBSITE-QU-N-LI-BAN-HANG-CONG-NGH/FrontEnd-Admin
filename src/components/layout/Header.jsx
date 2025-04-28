import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/layout/header.css";

const Header = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const location = useLocation();

    const handleDateFilter = () => {
        console.log("Filter by date range:", startDate, endDate);
        // Thực hiện lọc dữ liệu theo ngày
    };

    // Xác định tiêu đề và nút hành động dựa trên pathname
    const getHeaderContent = () => {
        const path = location.pathname;

        // Cấu trúc mặc định
        let title = "Dashboard";
        let subtitle = "Tổng quan về cửa hàng công nghệ";
        let actionButton = (
            <div className="date-filter">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="date-input"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="date-input"
                />
                <button className="filter-date-btn" onClick={handleDateFilter}>
                    Lọc
                </button>
            </div>
        );

        // Xác định nội dung riêng cho từng trang
        if (path.includes("/admin/products")) {
            title = "Quản lý sản phẩm";
            subtitle = "Phân tích và quản lý sản phẩm theo hiệu suất bán hàng";
            actionButton = (
                <button className="action-button">
                    + Add Product
                </button>
            );
        } else if (path.includes("/admin/users")) {
            title = "Quản lý người dùng";
            subtitle = "Quản lý tài khoản và phân quyền người dùng trong hệ thống";
            actionButton = (
                <button className="action-button">
                    + Add User
                </button>
            );
        } else if (path.includes("/admin/orders")) {
            title = "Quản lý đơn hàng";
            subtitle = "Theo dõi và xử lý các đơn hàng trong hệ thống";
            actionButton = (
                <div></div>
            );
        } else if (path.includes("/admin/analytics")) {
            title = "Phân tích dữ liệu";
            subtitle = "Các chỉ số thống kê, phân tích và báo cáo chi tiết";
            actionButton = (
                <div>
                </div>
            );
        } else if (path.includes("/admin/revenue")) {
            title = "Doanh thu";
            subtitle = "Chi tiết doanh thu theo thời gian và phân loại";
            actionButton = (
                <div className="date-filter">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="date-input"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="date-input"
                    />
                    <button className="filter-date-btn" onClick={handleDateFilter}>
                        Lọc
                    </button>
                </div>
            );
        }

        return { title, subtitle, actionButton };
    };

    const { title, subtitle, actionButton } = getHeaderContent();

    return (
        <div className="header">
            <div>
                <h1 className="header-title">{title}</h1>
                <div className="header-subtitle">{subtitle}</div>
            </div>
            {actionButton}
        </div>
    );
};

export default Header;