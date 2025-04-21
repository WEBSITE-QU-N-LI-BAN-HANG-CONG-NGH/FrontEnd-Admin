import React, { useState } from 'react';

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="tab-buttons">
      <button 
        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => setActiveTab('overview')}
      >
        Tổng quan
      </button>
      <button 
        className={`tab-button ${activeTab === 'revenue' ? 'active' : ''}`}
        onClick={() => setActiveTab('revenue')}
      >
        Doanh thu
      </button>
      <button 
        className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
        onClick={() => setActiveTab('products')}
      >
        Sản phẩm
      </button>
      <button 
        className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
        onClick={() => setActiveTab('orders')}
      >
        Đơn hàng
      </button>
      <button 
        className={`tab-button ${activeTab === 'customers' ? 'active' : ''}`}
        onClick={() => setActiveTab('customers')}
      >
        Khách hàng
      </button>
    </div>
  );
};

export default DashboardTabs;