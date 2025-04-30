import React from 'react';
import { Link } from 'react-router-dom';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    if (typeof amount === 'object' && amount !== null) {
        try {
            amount = parseFloat(amount.toString());
        } catch (error) {
            amount = 0;
        }
    }
    return new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
};

const TopSellingProducts = ({ products = [] }) => {
    // Đảm bảo products là mảng
    const safeProducts = Array.isArray(products) ? products : [];

    // Tạo stars từ rating (nếu có)
    const renderStars = (rating) => {
        if (rating === undefined || rating === null) return '';

        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push('★');
        }

        if (hasHalfStar) {
            stars.push('✭');
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push('☆');
        }

        return stars.join('');
    };

    return (
        <div className="top-selling-card">
            <h3 className="card-title">Sản phẩm bán chạy</h3>

            {safeProducts.length > 0 ? (
                <div className="top-products-list">
                    {safeProducts.map((product) => (
                        <div key={product.id} className="top-product-item">
                            <div className="top-product-img">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.title || product.name} />
                                ) : (
                                    <div className="placeholder-img">No image</div>
                                )}
                            </div>
                            <div className="top-product-info">
                                <div className="top-product-name">{product.title || product.name}</div>
                                <div className="top-product-price">
                                    {product.discounted_price !== undefined && product.discounted_price < product.price ? (
                                        <>
                                            <span className="discounted-price">{formatCurrency(product.discounted_price)}</span>
                                            <span className="original-price">{formatCurrency(product.price)}</span>
                                        </>
                                    ) : (
                                        formatCurrency(product.price)
                                    )}
                                </div>
                                <div className="top-product-rating">
                                    {product.rating && (
                                        <span className="stars">{renderStars(product.rating)}</span>
                                    )}
                                    <span className="sold-count">| Đã bán: {product.quantity_sold || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-data" style={{ textAlign: 'center', padding: '20px', color: 'var(--secondary-color)' }}>
                    Không có dữ liệu sản phẩm bán chạy
                </div>
            )}

            <Link to="/admin/products" className="view-all">
                Xem tất cả sản phẩm
            </Link>
        </div>
    );
};

export default TopSellingProducts;