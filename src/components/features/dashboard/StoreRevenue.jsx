// src/components/dashboard/StoreRevenue.jsx - Cập nhật
import React from 'react';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

const StoreRevenue = ({ data = [] }) => {
  // Nếu không có dữ liệu, hiển thị dữ liệu mẫu
  const storeData = data.length > 0 ? data : [
    { 
      id: 1, 
      name: 'Chưa có dữ liệu', 
      totalRevenue: 0,
      orders: 0,
      growth: 0,
      isPositive: false
    }
  ];

  return (
    <div className="card">
      <div className="card-header">Doanh thu theo cửa hàng</div>
      <div style={{ fontSize: '14px', color: 'var(--secondary-color)', marginBottom: '20px' }}>
        Xếp hạng từ cao đến thấp
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="store-revenue-table">
          <thead>
            <tr>
              <th>Xếp hạng</th>
              <th>Cửa hàng/Người bán</th>
              <th>Doanh thu</th>
              <th>Số đơn hàng</th>
              <th>Tăng trưởng</th>
            </tr>
          </thead>
          <tbody>
            {storeData.map((store, index) => {
              const growth = store.growth || 0;
              const isPositive = growth >= 0;
              
              return (
                <tr key={store.id || index}>
                  <td>{index + 1}</td>
                  <td>{store.name}</td>
                  <td>{formatCurrency(store.totalRevenue)}</td>
                  <td>{store.orders}</td>
                  <td>
                    <div className={`growth-indicator ${isPositive ? 'positive' : 'negative'}`}>
                      {isPositive ? '+' : ''}{growth}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreRevenue;