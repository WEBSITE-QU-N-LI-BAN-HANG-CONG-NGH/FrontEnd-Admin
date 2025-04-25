import React, {useState} from "react";
import "../../../styles/admin/user/users.css";

const UserFilters = ({onSearch, onRoleFilter, selectedRole}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="user-filters">
            <form className="search-form" onSubmit={handleSearchSubmit}>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo email hoặc tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <span role="img" aria-label="search">🔍</span>
                    </button>
                </div>
            </form>

            <div className="filter-dropdown">
                <select
                    value={selectedRole}
                    onChange={(e) => onRoleFilter(e.target.value)}
                    className="role-filter"
                >
                    <option value="">Tất cả vai trò</option>
                    <option value="CUSTOMER">Khách hàng</option>
                    <option value="SELLER">Người bán</option>
                </select>
            </div>

            <button className="export-btn">
                Xuất báo cáo
            </button>
        </div>
    );
};

export default UserFilters;