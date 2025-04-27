import React from 'react';
import { Link } from 'react-router-dom';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
};

const RecentOrders = ({ orders = [] }) => {
    // Sử dụng dữ liệu từ prop hoặc dữ liệu mẫu nếu không có
    const displayOrders = orders.length > 0 ? orders : [];

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