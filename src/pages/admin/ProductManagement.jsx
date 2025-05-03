import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth.jsx";
import { productService } from "../../services/index.js";
import ProductList from "../../components/features/products/ProductList";
import "../../styles/admin/product/products.css";

const ProductManagement = () => {
    const { user, loading, isAdmin } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho việc lọc và sắp xếp
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("dateAdded"); // Mặc định sắp xếp theo ngày thêm mới nhất
    const [sortOrder, setSortOrder] = useState("desc"); // Mặc định theo thứ tự giảm dần

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Lấy danh sách sản phẩm
                const response = await productService.getAllProducts();
                const productsData = response.data?.data || [];
                setProducts(productsData);
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

    // Xử lý tìm kiếm sản phẩm
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Xử lý lọc theo danh mục
    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
    };

    // Xử lý sắp xếp
    const handleSort = (field) => {
        if (sortBy === field) {
            // Nếu đang sắp xếp theo field này rồi, thì đổi thứ tự
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Nếu đổi sang field mới
            setSortBy(field);
            setSortOrder('desc'); // Mặc định là giảm dần
        }
    };

    // Lọc và sắp xếp sản phẩm
    const getFilteredProducts = () => {
        return products
            .filter(product => {
                // Lọc theo từ khóa
                if (searchTerm && !product.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return false;
                }

                // Lọc theo danh mục
                if (selectedCategory && product.category?.name !== selectedCategory) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                // Sắp xếp theo trường được chọn
                switch (sortBy) {
                    case 'price':
                        return sortOrder === 'asc'
                            ? (a.price || 0) - (b.price || 0)
                            : (b.price || 0) - (a.price || 0);

                    case 'quantity':
                        return sortOrder === 'asc'
                            ? (a.quantity || 0) - (b.quantity || 0)
                            : (b.quantity || 0) - (a.quantity || 0);

                    case 'id':
                        return sortOrder === 'asc'
                            ? Number(a.id) - Number(b.id)
                            : Number(b.id) - Number(a.id);

                    case 'dateAdded':
                    default:
                        // Sắp xếp theo ngày tạo mới nhất (giả định có trường createdAt)
                        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                }
            });
    };

    // Nếu đang tải thông tin người dùng
    if (loading) {
        return <div>Đang tải...</div>;
    }

    // Nếu người dùng không đăng nhập hoặc không phải admin
    if (!user || !isAdmin()) {
        return <Navigate to="/login" replace />;
    }

    // Lấy danh sách sản phẩm đã lọc và sắp xếp
    const filteredProducts = getFilteredProducts();

    // Lấy danh sách danh mục từ sản phẩm
    const categories = [...new Set(products
        .map(product => product.category?.name)
        .filter(Boolean))];

    return (
        <Layout>
            <div className="products-container">
                {/* Thanh tìm kiếm và nút thêm sản phẩm */}
                <div className="product-header">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button">🔍</button>
                    </div>
                    <button className="add-product-btn">+ Thêm sản phẩm</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <ProductList
                    products={filteredProducts}
                    isLoading={isLoading}
                    categories={categories}
                    onCategoryFilter={handleCategoryFilter}
                    selectedCategory={selectedCategory}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            </div>
        </Layout>
    );
};

export default ProductManagement;