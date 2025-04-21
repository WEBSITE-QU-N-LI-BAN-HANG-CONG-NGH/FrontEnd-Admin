import React from 'react';

const StoreRevenue = () => {
  const storeData = [
    { 
      id: 1, 
      name: 'TechZone Hà Nội', 
      currentRevenue: '1.250.000.000đ',
      previousRevenue: '1.120.000.000đ',
      growth: '+11.6%',
      isPositive: true
    },
    { 
      id: 2, 
      name: 'DigiWorld Sài Gòn', 
      currentRevenue: '980.000.000đ',
      previousRevenue: '920.000.000đ',
      growth: '+6.5%',
      isPositive: true
    },
    { 
      id: 3, 
      name: 'SmartStore Đà Nẵng', 
      currentRevenue: '720.000.000đ',
      previousRevenue: '650.000.000đ',
      growth: '+10.8%',
      isPositive: true
    },
    { 
      id: 4, 
      name: 'FutureGadget Cần Thơ', 
      currentRevenue: '550.000.000đ',
      previousRevenue: '520.000.000đ',
      growth: '+5.8%',
      isPositive: true
    },
    { 
      id: 5, 
      name: 'TechHub Hải Phòng', 
      currentRevenue: '480.000.000đ',
      previousRevenue: '510.000.000đ',
      growth: '-5.9%',
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
              <th>Cửa hàng</th>
              <th>Doanh thu hiện tại</th>
              <th>Doanh thu kỳ trước</th>
              <th>Tăng trưởng</th>
            </tr>
          </thead>
          <tbody>
            {storeData.map((store) => (
              <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.name}</td>
                <td>{store.currentRevenue}</td>
                <td>{store.previousRevenue}</td>
                <td>
                  <div className={`growth-indicator ${store.isPositive ? 'positive' : 'negative'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d={store.isPositive 
                          ? "M12 19V5 M5 12L12 5L19 12" 
                          : "M12 5V19 M5 12L12 19L19 12"}
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    {store.growth}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreRevenue;