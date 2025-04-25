// src/components/features/dashboard/StoreRevenue.jsx
import React from 'react';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0đ';
    try {
        if (typeof amount === 'object' && amount !== null) {
            // Trong trường hợp amount là đối tượng BigDecimal từ Java
            amount = Number(amount.toString());
        }
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    } catch (error) {
        console.error("Lỗi khi định dạng số tiền:", error);
        return '0đ';
    }
};

const StoreRevenue = ({ data = [] }) => {
    // Đảm bảo data là mảng và có dữ liệu
    const storeData = Array.isArray(data) && data.length > 0
        ? data.map(store => ({
            id: store.id || store.sellerId || 0,
            name: store.name || store.sellerName || store.lastName || 'Chưa có tên',
            totalRevenue: store.totalRevenue || store.revenue || 0,
            orders: store.orders || store.totalOrders || 0,
            // Không sử dụng growth từ dữ liệu mẫu
            growth: 0,
            isPositive: true
        }))
        : [];

    return (
        <div className="card">
            <div className="card-header">Doanh thu theo người bán</div>
            <div style={{fontSize: '14px', color: 'var(--secondary-color)', marginBottom: '20px'}}>
                Xếp hạng từ cao đến thấp
            </div>

            {storeData.length > 0 ? (
                <div style={{overflowX: 'auto'}}>
                    <table className="store-revenue-table">
                        <thead>
                        <tr>
                            <th>Xếp hạng</th>
                            <th>Người bán</th>
                            <th>Doanh thu</th>
                            <th>Số đơn hàng</th>
                        </tr>
                        </thead>
                        <tbody>
                        {storeData.map((store, index) => (
                            <tr key={store.id || index}>
                                <td>{index + 1}</td>
                                <td>{store.name}</td>
                                <td>{formatCurrency(store.totalRevenue)}</td>
                                <td>{store.orders}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="no-data">Không có dữ liệu người bán</div>
            )}
        </div>
    );
};

export default StoreRevenue;