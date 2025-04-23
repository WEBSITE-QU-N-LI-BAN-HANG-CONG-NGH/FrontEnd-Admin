import React from 'react';
import DashboardTabs from './DashboardTabs.jsx';
import RevenueOverview from './RevenueOverview.jsx';
import RevenueBreakdown from './RevenueBreakdown.jsx';
import StoreRevenue from './StoreRevenue.jsx';

const Dashboard = () => {
  return (
    <div>
      <DashboardTabs />
      
      <div className="dashboard-grid">
        <RevenueOverview />
        <RevenueBreakdown />
      </div>
      
      <StoreRevenue />
    </div>
  );
};

export default Dashboard;