// src/components/features/orders/OrderFilters.jsx - Thêm prop onSearch và dùng nó

import {useEffect, useState} from "react";

const OrderFilters = ({ currentFilter, onFilterChange, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm, startDate, endDate);
        }
    };

    const handleDateFilter = () => {
        if (onSearch) {
            onSearch(searchTerm, startDate, endDate);
        }
    };

    useEffect(() => {
        if (startDate && endDate && onSearch) {
            // Chỉ áp dụng khi cả hai đều đã được chọn
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            // Kiểm tra ngày bắt đầu <= ngày kết thúc
            if (startDateObj <= endDateObj) {
                onSearch(searchTerm, startDate, endDate);
            }
        }
    }, [startDate, endDate, searchTerm, onSearch]);

    // Khi thay đổi tab, reset lại search nếu có searchTerm
    useEffect(() => {
        if (searchTerm && onSearch) {
            onSearch(searchTerm, startDate, endDate);
        }
    }, [currentFilter]);

    // Xử lý xóa bộ lọc
    const handleClearFilters = () => {
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
        if (onSearch) {
            onSearch("", "", "");
        }
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
                    <input
                        type="date"
                        placeholder="Từ ngày"
                        className="date-input"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Đến ngày"
                        className="date-input"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button className="export-btn" onClick={handleDateFilter}>Lọc</button>
                </div>

                <button className="export-btn">
                    Xuất Excel
                </button>
            </div>
        </div>
    );
};

export default OrderFilters;