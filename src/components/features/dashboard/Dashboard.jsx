import React from 'react';
import RevenueOverview from './RevenueOverview.jsx';
import RevenueBreakdown from './RevenueBreakdown.jsx';
import StoreRevenue from './StoreRevenue.jsx';

const Dashboard = () => {
    return (
        <div>
            <div className="dashboard-grid">
                <RevenueOverview/>
                <RevenueBreakdown/>
            </div>

            <StoreRevenue/>
        </div>
    );
};

export default Dashboard;