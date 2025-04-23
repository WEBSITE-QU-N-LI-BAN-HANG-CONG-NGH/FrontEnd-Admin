import React, { useState } from "react";

const OrderFilters = ({ currentFilter, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Xử lý tìm kiếm ở đây (có thể thêm vào sau)
        console.log("Searching for:", searchTerm);
    };

    return (
        <div className="order-filters">
            <div className="filter-tabs">
                <button
                    className={`filter-tab ${currentFilter === "all" ? "active" : ""}`}
                    onClick={() => onFilterChange("all")}
                >
                    Tất cả
                </button>
                <button
                    className={`filter-tab ${currentFilter === "pending" ? "active" : ""}`}
                    onClick={() => onFilterChange("pending")}
                >
                    Chờ xác nhận
                </button>
                <button
                    className={`filter-tab ${currentFilter === "confirmed" ? "active" : ""}`}
                    onClick={() => onFilterChange("confirmed")}
                >
                    Đã xác nhận
                </button>
                <button
                    className={`filter-tab ${currentFilter === "shipped" ? "active" : ""}`}
                    onClick={() => onFilterChange("shipped")}
                >
                    Đang giao
                </button>
                <button
                    className={`filter-tab ${currentFilter === "delivered" ? "active" : ""}`}
                    onClick={() => onFilterChange("delivered")}
                >
                    Đã giao
                </button>
                <button
                    className={`filter-tab ${currentFilter === "cancelled" ? "active" : ""}`}
                    onClick={() => onFilterChange("cancelled")}
                >
                    Đã hủy
                </button>
            </div>

            <div className="filters-actions">
                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm kiếm đơn hàng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="search-btn">
                            🔍
                        </button>
                    </div>
                </form>

                <div className="date-filters">
                    <input type="date" placeholder="Từ ngày" className="date-input" />
                    <input type="date" placeholder="Đến ngày" className="date-input" />
                    <button className="filter-btn">Lọc</button>
                </div>

                <button className="export-btn">
                    Xuất Excel
                </button>
            </div>
        </div>
    );
};

export default OrderFilters;