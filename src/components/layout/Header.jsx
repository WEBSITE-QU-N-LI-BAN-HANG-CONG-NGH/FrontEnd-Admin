import React, { useState } from "react";
import "../../styles/layout/header.css";

const Header = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleDateFilter = () => {
        console.log("Filter by date range:", startDate, endDate);
        // Thực hiện lọc dữ liệu theo ngày
    };

    return (
        <div className="header">
            <div>
                <h1 className="header-title">Dashboard</h1>
                <div className="header-subtitle">Tổng quan về cửa hàng công nghệ</div>
            </div>
            <div className="date-filter">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="date-input"
                />
                <span className="date-separator">đến</span>
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
        </div>
    );
};

export default Header;