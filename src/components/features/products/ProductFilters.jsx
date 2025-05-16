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

            <button className="add-product-btn" onClick={onAddNewClick}>
                + Thêm sản phẩm mới
            </button>
        </div>
    );
};

export default ProductFilters;