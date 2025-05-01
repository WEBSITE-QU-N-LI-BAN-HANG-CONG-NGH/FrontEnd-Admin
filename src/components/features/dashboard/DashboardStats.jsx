import React from 'react';

const DashboardStats = ({ stats = {} }) => {
    const {
        totalProducts = 0,
        inStock = 0,
        soldItems = 0
    } = stats; // Thêm destructuring với giá trị mặc định

    return (
        <div className="dashboard-stats">
            <div className="stat-card">
                <div className="stat-icon products-icon">
                    <img
                        src="https://res.cloudinary.com/dgwfnyn86/image/upload/v1746095542/Heart_vn3d8d.png"
                        alt="Products Icon"
                        style={{width: '50px', height: '50px'}}
                    />
                </div>
                <div className="stat-content">
                    <div className="stat-value">{totalProducts}+</div>
                    <div className="stat-title">Save Products</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon stock-icon">
                    <img
                        src="https://res.cloudinary.com/dgwfnyn86/image/upload/v1746095542/Game_ta9txl.png"
                        alt="Products Icon"
                        style={{width: '50px', height: '50px'}}
                    />
                </div>
                <div className="stat-content">
                    <div className="stat-value">{inStock}+</div>
                    <div className="stat-title">Stock Products</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon orders-icon">
                    <img
                        src="https://res.cloudinary.com/dgwfnyn86/image/upload/v1746095541/Bag_nuchmh.png"
                        alt="Products Icon"
                        style={{width: '50px', height: '50px'}}
                    />
                </div>
                <div className="stat-content">
                    <div className="stat-value">{soldItems}+</div>
                    <div className="stat-title">Sold Products</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;