import React from 'react';
import { Link } from 'react-router-dom';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
};

// Dữ liệu mẫu
const sampleProducts = [
    {
        id: 1,
        name: 'iPhone 14 Pro Max',
        image: 'https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png',
        price: 27990000,
        discountedPrice: 25990000,
        rating: 4.8,
        sold: 120
    },
    {
        id: 2,
        name: 'Samsung Galaxy S23 Ultra',
        image: 'https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png',
        price: 25990000,
        discountedPrice: null,
        rating: 4.6,
        sold: 98
    },
    {
        id: 3,
        name: 'MacBook Pro 14" M2 Pro',
        image: 'https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png',
        price: 49990000,
        discountedPrice: 47990000,
        rating: 4.9,
        sold: 45
    },
    {
        id: 4,
        name: 'iPad Air 5',
        image: 'https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png',
        price: 16990000,
        discountedPrice: 15990000,
        rating: 4.7,
        sold: 67
    },
    {
        id: 5,
        name: 'Apple Watch Series 8',
        image: 'https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png',
        price: 10990000,
        discountedPrice: null,
        rating: 4.5,
        sold: 82
    }
];

const TopSellingProducts = ({ products = [] }) => {
    // Sử dụng dữ liệu từ prop hoặc dữ liệu mẫu nếu không có
    const displayProducts = products.length > 0 ? products : sampleProducts;

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
                                <span className="rating-value">{product.rating.toFixed(1)}</span>
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