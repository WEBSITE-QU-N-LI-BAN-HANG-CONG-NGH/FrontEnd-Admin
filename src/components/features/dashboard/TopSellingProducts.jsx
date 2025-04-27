import React from 'react';
import { Link } from 'react-router-dom';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
};

const TopSellingProducts = ({ products = [] }) => {
    // Sử dụng dữ liệu từ prop hoặc dữ liệu mẫu nếu không có
    const displayProducts = products.length > 0 ? products : [];

    // Tạo stars từ rating
    const renderStars = (rating) => {
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

            <div className="top-products-list">
                {displayProducts.map((product) => (
                    <div key={product.id} className="top-product-item">
                        <div className="top-product-img">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="top-product-info">
                            <div className="top-product-name">{product.name}</div>
                            <div className="top-product-price">
                                {product.discountedPrice
                                    ? (
                                        <>
                                            <span className="discounted-price">{formatCurrency(product.discountedPrice)}</span>
                                            <span className="original-price">{formatCurrency(product.price)}</span>
                                        </>
                                    )
                                    : formatCurrency(product.price)
                                }
                            </div>
                            <div className="top-product-rating">
                                <span className="stars">{renderStars(product.rating)}</span>
                                {/*<span className="rating-value">{product.rating.toFixed(1)}</span>*/}
                                <span className="sold-count">| Đã bán: {product.sold}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Link to="/admin/products" className="view-all">
                Xem tất cả sản phẩm
            </Link>
        </div>
    );
};

export default TopSellingProducts;