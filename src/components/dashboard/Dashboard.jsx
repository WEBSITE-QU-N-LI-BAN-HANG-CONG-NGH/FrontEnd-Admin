import React from 'react';
import DashboardTabs from './DashboardTabs';
import RevenueOverview from './RevenueOverview';
import RevenueBreakdown from './RevenueBreakdown';
import StoreRevenue from './StoreRevenue';

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