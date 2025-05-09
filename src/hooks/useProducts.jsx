// src/hooks/useProducts.jsx - Updated
import { useState, useEffect, useCallback } from "react";
import * as productService from "../services/productService";

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalRevenue: 0,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("createdAt"); // Mặc định sắp xếp theo ngày thêm mới nhất
    const [sortOrder, setSortOrder] = useState("desc"); // Mặc định theo thứ tự giảm dần
    const [categories, setCategories] = useState([]);

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Lấy danh sách sản phẩm
            const response = await productService.getAllProducts({
                search: searchTerm,
                category: selectedCategory,
                sort: sortBy,
                order: sortOrder
            });

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

            // Lấy danh sách danh mục
            try {
                const categoryResponse = await productService.getProductCategories();
                if (categoryResponse.status === 200) {
                    const categoryData = categoryResponse.data?.data || [];
                    // Lấy chỉ tên danh mục
                    const categoryNames = categoryData.map(cat => cat.name);
                    setCategories(categoryNames);
                }
            } catch (catError) {
                console.warn("Không thể tải danh mục sản phẩm:", catError);
                // Từ danh sách sản phẩm, tạo danh sách danh mục (backup nếu API không trả về)
                const uniqueCategories = [...new Set(productsData
                    .map(product => product.category?.name)
                    .filter(Boolean))];
                setCategories(uniqueCategories);
            }
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
            setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, selectedCategory, sortBy, sortOrder]);

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
                return { success: true, data: response.data?.data };
            }
            return { success: false, error: "Không thể thêm sản phẩm" };
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err);
            setError("Không thể thêm sản phẩm. Vui lòng thử lại sau.");
            return { success: false, error: err.message || "Lỗi không xác định" };
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
                return { success: true, data: response.data?.data };
            }
            return { success: false, error: "Không thể cập nhật sản phẩm" };
        } catch (err) {
            console.error("Lỗi khi cập nhật sản phẩm:", err);
            setError("Không thể cập nhật sản phẩm. Vui lòng thử lại sau.");
            return { success: false, error: err.message || "Lỗi không xác định" };
        }
    }, [fetchProducts]);

    // Xử lý xóa sản phẩm
    const handleDeleteProduct = useCallback(async (productId) => {
        try {
            setError(null);
            const response = await productService.deleteProduct(productId);
            if (response.status === 200) {
                // Cập nhật lại danh sách sản phẩm
                await fetchProducts();
                return { success: true };
            }
            return { success: false, error: "Không thể xóa sản phẩm" };
        } catch (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
            setError("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
            return { success: false, error: err.message || "Lỗi không xác định" };
        }
    }, [fetchProducts]);

    // Xử lý xóa nhiều sản phẩm
    const handleDeleteMultipleProducts = useCallback(async (productIds) => {
        try {
            setError(null);
            const response = await productService.deleteMultipleProducts(productIds);
            if (response.status === 200) {
                // Cập nhật lại danh sách sản phẩm
                await fetchProducts();
                return { success: true, count: productIds.length };
            }
            return { success: false, error: "Không thể xóa sản phẩm" };
        } catch (err) {
            console.error("Lỗi khi xóa nhiều sản phẩm:", err);
            setError("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
            return { success: false, error: err.message || "Lỗi không xác định" };
        }
    }, [fetchProducts]);

    // Lấy chi tiết sản phẩm (có thể sử dụng khi cần load lại thông tin chi tiết)
    const getProductDetail = useCallback(async (productId) => {
        try {
            setError(null);
            const response = await productService.getProductById(productId);
            if (response.status === 200) {
                return { success: true, data: response.data?.data };
            }
            return { success: false, error: "Không thể lấy thông tin sản phẩm" };
        } catch (err) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", err);
            setError("Không thể lấy thông tin sản phẩm. Vui lòng thử lại sau.");
            return { success: false, error: err.message || "Lỗi không xác định" };
        }
    }, []);

    return {
        products,
        categories,
        stats,
        isLoading,
        error,
        searchTerm,
        selectedCategory,
        sortBy,
        sortOrder,
        handleSearch,
        handleCategoryFilter,
        handleSort,
        handleAddProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        handleDeleteMultipleProducts,
        getProductDetail,
        refreshProducts: fetchProducts
    };
};