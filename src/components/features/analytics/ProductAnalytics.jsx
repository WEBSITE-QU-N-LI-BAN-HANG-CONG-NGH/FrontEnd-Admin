// src/components/features/analytics/ProductAnalytics.jsx
import React from "react";

const ProductAnalytics = ({data = {}}) => {
    const {
        totalProducts = 0,
        productsByCategory = {},
        highRatedProducts = 0,
        outOfStockProducts = 0,
    } = data;

    return (
        <div className="analytics-card">
            <h2 className="analytics-card-title">Phân tích sản phẩm</h2>

            <div className="analytics-metrics">
                <div className="metric">
                    <div className="metric-value">{totalProducts}</div>
                    <div className="metric-label">Tổng số sản phẩm</div>
                </div>

                <div className="metric">
                    <div className="metric-value">{highRatedProducts}</div>
                    <div className="metric-label">Sản phẩm đánh giá cao</div>
                </div>

                <div className="metric">
                    <div className="metric-value">{outOfStockProducts}</div>
                    <div className="metric-label">Sản phẩm hết hàng</div>
                </div>

                <div className="metric">
                    <div className="metric-value">{Object.keys(productsByCategory).length}</div>
                    <div className="metric-label">Số danh mục</div>
                </div>
            </div>

            <div className="analytics-category-distribution">
                <h3>Phân bố theo danh mục</h3>
                {Object.entries(productsByCategory).length > 0 ? (
                    <div className="category-bars">
                        {Object.entries(productsByCategory).map(([category, count], index) => (
                            <div className="category-bar-item" key={index}>
                                <div className="category-name">{category}</div>
                                <div className="bar-container">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${(count / totalProducts) * 100}%`,
                                            backgroundColor: `hsl(${index * 30}, 70%, 50%)`,
                                        }}
                                    ></div>
                                    <div className="bar-value">{count}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-data">Không có dữ liệu phân loại</div>
                )}
            </div>
        </div>
    );
};

export default ProductAnalytics;