import { useEffect, useState, useCallback } from "react";
import { debounce } from 'lodash';

const OrderFilters = ({ currentFilter, onFilterChange, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Tạo hàm debounce để tối ưu hóa hiệu suất khi tìm kiếm
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((term, start, end) => {
            if (onSearch) {
                onSearch(term, start, end);
            }
        }, 500),
        [onSearch]
    );

    // Xử lý khi người dùng nhập vào ô tìm kiếm
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        debouncedSearch(term, startDate, endDate);
    };

    // Xử lý khi người dùng submit form tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm, startDate, endDate);
        }
    };

    // Xử lý khi thay đổi date filters
    const handleDateChange = (field, value) => {
        if (field === 'start') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }

        // Chỉ áp dụng filter khi cả hai ngày đã được chọn
        if ((field === 'start' && endDate) || (field === 'end' && startDate)) {
            const start = field === 'start' ? value : startDate;
            const end = field === 'end' ? value : endDate;

            const startDateObj = new Date(start);
            const endDateObj = new Date(end);

            // Kiểm tra ngày bắt đầu <= ngày kết thúc
            if (startDateObj <= endDateObj) {
                debouncedSearch(searchTerm, start, end);
            }
        }
    };

    const handleDateFilter = () => {
        if (startDate && endDate && onSearch) {
            onSearch(searchTerm, startDate, endDate);
        }
    };

    // Khi thay đổi tab, áp dụng lại filter với searchTerm và date hiện tại
    useEffect(() => {
        debouncedSearch(searchTerm, startDate, endDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Hủy debounce khi component unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

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
                            onChange={handleSearchChange}
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
                        onChange={(e) => handleDateChange('start', e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Đến ngày"
                        className="date-input"
                        value={endDate}
                        onChange={(e) => handleDateChange('end', e.target.value)}
                    />
                    <button className="export-btn" onClick={handleDateFilter}>Lọc</button>
                </div>

                <button className="export-btn" onClick={handleClearFilters}>
                    Xóa bộ lọc
                </button>

                <button className="export-btn">
                    Xuất Excel
                </button>
            </div>
        </div>
    );
};

export default OrderFilters;