import React from "react";

const TopProductsList = ({ products, formatCurrency }) => {
    return (
        <div className="analytics-card">
            <h2 className="analytics-card-title">Top sản phẩm bán chạy nhất</h2>

            <table className="top-selling-table">
                <thead>
                <tr>
                    <th className="rank-column">Thứ hạng</th>
                    <th>Sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Giá bán</th>
                    <th>Số lượng bán</th>
                    <th>Doanh thu</th>
                </tr>
                </thead>
                <tbody>
                {products.slice(0, 10).map((product, index) => (
                    <tr key={product.id} className={`${index < 3 ? 'top-' + (index + 1) : ''}`}>
                        <td className="rank-column">
                            <span className="rank-number">{index + 1}</span>
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>{product.quantitySold}</td>
                        <td>{formatCurrency(product.totalSales)}</td>
                    </tr>
                ))}

                {products.length === 0 && (
                    <tr>
                        <td colSpan="6" style={{textAlign: "center", padding: "20px"}}>
                            Không có dữ liệu sản phẩm
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TopProductsList;