import React from 'react';
import { Link } from 'react-router-dom';
import { getRelativeTime } from "../../../utils/formatters.js";

const RecentOrders = ({ orders = [] }) => {
    // Đảm bảo orders là mảng
    const safeOrders = Array.isArray(orders) ? orders : [];

    return (
        <div className="recent-orders-card">
            <h3 className="card-title">Đơn hàng gần đây</h3>

            {safeOrders.length > 0 ? (
                <table className="recent-orders-table">
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Payment</th>
                        <th>Time</th>
                        <th>Last Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {safeOrders.map((order) => (
                        <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>
                                <div className="customer-info">
                                    <span className="customer-email">{order.customerEmail}</span>
                                </div>
                            </td>
                            <td>
                                <div className="payment-info">
                                    <span>{order.paymentMethod}</span>
                                </div>
                            </td>
                            <td>{getRelativeTime(order.orderDate)}</td>
                            <td>
                                <span>{order.orderStatus}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="no-data" style={{ textAlign: 'center', padding: '20px', color: 'var(--secondary-color)' }}>
                    Không có đơn hàng nào gần đây
                </div>
            )}

            <Link to="/admin/orders" className="view-all">
                Xem tất cả đơn hàng
            </Link>
        </div>
    );
};

export default RecentOrders;