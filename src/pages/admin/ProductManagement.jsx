import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { productService } from "../../services/api";
import "../../styles/admin/products.css";

const ProductManagement = () => {
  const { user, loading, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [selectedTab, setSelectedTab] = useState("bestselling");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Lấy danh sách sản phẩm
        const response = await productService.getAllProducts();
        const productsData = response.data?.data || [];
        setProducts(productsData);

        // Lấy thống kê sản phẩm bán chạy
        // const topSellingResponse = await productService.getTopSellingProducts(10);

        // Tính tổng doanh thu từ sản phẩm
        let totalRev = 0;
        if (Array.isArray(productsData)) {
          productsData.forEach((product) => {
            const sold = product.quantitySold || 0;
            const price = product.discountedPrice || product.price || 0;
            totalRev += sold * price;
          });
        }

        setStats({
          totalProducts: Array.isArray(productsData) ? productsData.length : 0,
          totalRevenue: totalRev,
        });
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading && user) {
      fetchProducts();
    }
  }, [loading, user]);

  // Nếu đang tải thông tin người dùng
  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Nếu người dùng không đăng nhập hoặc không phải admin
  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const formatPercentage = (value) => {
    return `+${value}%`;
  };

  return (
    <Layout>
      <div className="products-container">
        <div className="products-header">
          <h1>Quản lý sản phẩm</h1>
          <p>Phân tích và quản lý sản phẩm theo hiệu suất bán hàng</p>
        </div>

        <div className="stat-card">
          <div className="stat-title">Tổng sản phẩm đã bán</div>
          <div className="stat-value">
            {products.reduce((total, product) => total + (product.quantitySold || 0), 0)}
          </div>
          <div className="stat-change positive">
            {formatPercentage(10)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Tổng doanh thu</div>
          <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
          <div className="stat-change positive">
            {formatPercentage(12)}
          </div>
        </div>

        <div className="product-tabs">
          <button
            className={`tab-button ${
              selectedTab === "bestselling" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("bestselling")}
          >
            Sản phẩm bán chạy
          </button>
          <button
            className={`tab-button ${
              selectedTab === "inventory" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("inventory")}
          >
            Tồn kho
          </button>
          <button
            className={`tab-button ${
              selectedTab === "categories" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("categories")}
          >
            Danh mục
          </button>
          <button
            className={`tab-button ${
              selectedTab === "analysis" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("analysis")}
          >
            Phân tích
          </button>
        </div>

        <div className="product-filters">
          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm sản phẩm..." />
            <button>
              <i className="search-icon">🔍</i>
            </button>
          </div>

          <div className="filter-dropdown">
            <button>
              Danh mục <i className="dropdown-icon">▼</i>
            </button>
          </div>

          <div className="sort-dropdown">
            <button>
              Số lượng bán <i className="dropdown-icon">▼</i>
            </button>
          </div>
        </div>

        <div className="products-table-container">
          <h2>Top 10 sản phẩm bán chạy nhất</h2>
          <p>Sắp xếp theo số lượng bán từ cao đến thấp</p>

          <table className="products-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Đã bán</th>
                <th>Doanh thu</th>
                <th>Tồn kho</th>
                <th>Tăng trưởng</th>
              </tr>
            </thead>
            <tbody>
            {products.length > 0 ? (
                products.map((product) => (
                    <tr key={product.id}>
                      <td><input type="checkbox" /></td>
                      <td>
                        <div className="product-info">
                          <div className="product-image-placeholder"></div>
                          <div>
                            <div className="product-name">{product.title}</div>
                            <div className="product-id">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{product.category?.name || "Chưa phân loại"}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{product.quantitySold || 0}</td>
                      <td>{formatCurrency((product.quantitySold || 0) * product.price)}</td>
                      <td>{product.quantity || 0}</td>
                      <td className="growth positive">{formatPercentage(8)}</td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="8" style={{textAlign: "center", padding: "20px"}}>
                    {isLoading ? "Đang tải dữ liệu..." : "Không có sản phẩm nào"}
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">...</button>
          <button className="pagination-btn">10</button>
        </div>
      </div>
    </Layout>
  );
};

export default ProductManagement;
