import React from 'react';
import { Link } from 'react-router-dom';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
};

// Dữ liệu mẫu
const sampleOrders = [
    {
        id: 1,
        trackingNo: 'TN-789123',
        productName: 'iPhone 14 Pro Max',
        productImg: 'https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png',
        price: 27990000,
        quantity: 1,
        totalAmount: 27990000,
        date: '2025-04-25'
    },
    {
        id: 2,
        trackingNo: 'TN-789124',
        productName: 'Samsung Galaxy S23 Ultra',
        productImg: 'https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png',
        price: 25990000,
        quantity: 2,
        totalAmount: 51980000,
        date: '2025-04-24'
    },
    {
        id: 3,
        trackingNo: 'TN-789125',
        productName: 'MacBook Pro 14"',
        productImg: 'https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png',
        price: 49990000,
        quantity: 1,
        totalAmount: 49990000,
        date: '2025-04-24'
    },
    {
        id: 4,
        trackingNo: 'TN-789126',
        productName: 'iPad Air 5',
        productImg: 'https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png',
        price: 16990000,
        quantity: 3,
        totalAmount: 50970000,
        date: '2025-04-23'
    },
];

const RecentOrders = ({ orders = [] }) => {
    // Sử dụng dữ liệu từ prop hoặc dữ liệu mẫu nếu không có
    const displayOrders = orders.length > 0 ? orders : sampleOrders;

    return (
        <div className="recent-orders-card">
            <h3 className="card-title">Đơn hàng gần đây</h3>

            <table className="recent-orders-table">
                <thead>
                <tr>
                    <th>Tracking No</th>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                </tr>
                </thead>
                <tbody>
                {displayOrders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.trackingNo}</td>
                        <td>
                            <div className="product-info">
                                <div className="product-img">
                                    <img src={order.productImg} alt={order.productName} />
                                </div>
                                <div className="product-name">{order.productName}</div>
                            </div>
                        </td>
                        <td>{formatCurrency(order.price)}</td>
                        <td>{order.quantity}</td>
                        <td>{formatCurrency(order.totalAmount)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Link to="/admin/orders" className="view-all">
                Xem tất cả đơn hàng
            </Link>
        </div>
    );
};

export default RecentOrders;