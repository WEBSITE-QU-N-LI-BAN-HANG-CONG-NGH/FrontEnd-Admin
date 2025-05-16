// src/components/features/products/ProductFilters.jsx - Updated
import React, { useState } from "react";
import "../../../styles/admin/product/products.css";

const ProductFilters = ({
                            onSearch,
                            onCategoryFilter,
                            onSort,
                            sortBy,
                            sortOrder,
                            categories = [],
                            onAddNewClick
                        }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleSortChange = (field) => {
        onSort(field);
    };

    return (
        <div className="product-filters">
            <form className="search-form" onSubmit={handleSearchSubmit}>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
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
                    onChange={(e) => onCategoryFilter(e.target.value)}
                    className="category-filter"
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="sort-controls">
                <select
                    onChange={(e) => handleSortChange(e.target.value)}
                    value={sortBy}
                    className="sort-select"
                >
                    <option value="createdAt">Ngày thêm</option>
                    <option value="quantitySold">Số lượng bán</option>
                    <option value="price">Giá bán</option>
                    <option value="quantity">Tồn kho</option>
                </select>
                <button
                    className="sort-direction-btn"
                    onClick={() => onSort(sortBy)}
                    title={sortOrder === 'asc' ? "Sắp xếp tăng dần" : "Sắp xếp giảm dần"}
                >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
            </div>

            <button className="add-product-btn" onClick={onAddNewClick}>
                + Thêm sản phẩm mới
            </button>
        </div>
    );
};

export default ProductFilters;