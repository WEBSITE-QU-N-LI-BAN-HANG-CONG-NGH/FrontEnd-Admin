// src/hooks/useProducts.jsx
import { useState, useEffect, useCallback } from "react";
import {productService} from "../services/index.js";

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalRevenue: 0,
    });
    const [selectedTab, setSelectedTab] = useState("bestselling");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("quantitySold");
    const [sortOrder, setSortOrder] = useState("desc");

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Lấy danh sách sản phẩm
            const response = await productService.getAllProducts();
            if (response.status === 200) {
                const productsData = response.data?.data || [];
                setProducts(productsData);

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
            } else {
                throw new Error("Không thể tải dữ liệu sản phẩm");
            }
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
            setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Xử lý tìm kiếm sản phẩm
    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    // Xử lý lọc theo danh mục
    const handleCategoryFilter = useCallback((category) => {
        setSelectedCategory(category);
    }, []);

    // Xử lý sắp xếp
    const handleSort = useCallback((field) => {
        if (sortBy === field) {
            // Nếu đang sắp xếp theo field này, đổi thứ tự
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Nếu sắp xếp theo field mới, mặc định là desc
            setSortBy(field);
            setSortOrder('desc');
        }
    }, [sortBy, sortOrder]);

    // Xử lý thêm sản phẩm mới
    const handleAddProduct = useCallback(async (productData) => {
        try {
            setError(null);
            const response = await productService.createProduct(productData);
            if (response.status === 200) {
                // Cập nhật lại danh sách sản phẩm
                await fetchProducts();
                return true;
            }
            return false;
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err);
            setError("Không thể thêm sản phẩm. Vui lòng thử lại sau.");
            return false;
        }
    }, [fetchProducts]);

    // Xử lý cập nhật sản phẩm
    const handleUpdateProduct = useCallback(async (productId, productData) => {
        try {
            setError(null);
            const response = await productService.updateProduct(productId, productData);
            if (response.status === 200) {
                // Cập nhật lại danh sách sản phẩm
                await fetchProducts();
                return true;
            }
            return false;
        } catch (err) {
            console.error("Lỗi khi cập nhật sản phẩm:", err);
            setError("Không thể cập nhật sản phẩm. Vui lòng thử lại sau.");
            return false;
        }
    }, [fetchProducts]);

    // Xử lý xóa sản phẩm
    const handleDeleteProduct = useCallback(async (productId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            return false;
        }

        try {
            setError(null);
            const response = await productService.deleteProduct(productId);
            if (response.status === 200) {
                // Cập nhật lại danh sách sản phẩm
                await fetchProducts();
                return true;
            }
            return false;
        } catch (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
            setError("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
            return false;
        }
    }, [fetchProducts]);

    // Lấy danh sách sản phẩm đã lọc và sắp xếp
    const getFilteredProducts = useCallback(() => {
        // Lọc sản phẩm
        const filtered = products.filter(product => {
            // Lọc theo từ khóa tìm kiếm
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const productName = (product.title || '').toLowerCase();
                const productId = (product.id || '').toString();

                if (!productName.includes(searchLower) && !productId.includes(searchLower)) {
                    return false;
                }
            }

            // Lọc theo danh mục
            if (selectedCategory && product.category?.name !== selectedCategory) {
                return false;
            }

            return true;
        });

        // Sắp xếp sản phẩm
        return filtered.sort((a, b) => {
            let valueA, valueB;

            // Xác định giá trị để so sánh
            switch (sortBy) {
                case 'price':
                    valueA = a.price || 0;
                    valueB = b.price || 0;
                    break;
                case 'quantitySold':
                    valueA = a.quantitySold || 0;
                    valueB = b.quantitySold || 0;
                    break;
                case 'quantity':
                    valueA = a.quantity || 0;
                    valueB = b.quantity || 0;
                    break;
                case 'title':
                    valueA = a.title || '';
                    valueB = b.title || '';
                    return sortOrder === 'asc'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                default:
                    valueA = a[sortBy] || 0;
                    valueB = b[sortBy] || 0;
            }

            // So sánh và trả về kết quả
            return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        });
    }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

    return {
        products,
        filteredProducts: getFilteredProducts(),
        stats,
        isLoading,
        error,
        selectedTab,
        setSelectedTab,
        handleSearch,
        handleCategoryFilter,
        handleSort,
        handleAddProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        refreshProducts: fetchProducts,
        sortBy,
        sortOrder
    };
};