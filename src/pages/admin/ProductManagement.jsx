// src/pages/admin/ProductManagement.jsx - Cập nhật và hoàn thiện
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth.jsx";
import ProductList from "../../components/features/products/ProductList";
import ProductFilters from "../../components/features/products/ProductFilters";
import ProductDetailModal from "../../components/features/products/ProductDetailModal";
import ProductFormModal from "../../components/features/products/ProductFormModal";
import { useProducts } from "../../hooks/useProducts";
import { ToastProvider, useToast } from "../../contexts/ToastContext";
import "../../styles/admin/product/products.css";

// Wrapper component để sử dụng toast trong component chính
const ProductManagementContent = () => {
    const { user, loading, isAdmin } = useAuth();
    const toast = useToast();

    // State để quản lý modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Hook quản lý sản phẩm
    const {
        products,
        categories,
        isLoading,
        error,
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
        refreshProducts
    } = useProducts();

    // Xử lý khi chọn xem chi tiết sản phẩm
    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setIsDetailModalOpen(true);
    };

    // Xử lý khi chọn sửa sản phẩm
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsEditMode(true);
        setIsFormModalOpen(true);
        // Đóng modal chi tiết nếu đang mở
        setIsDetailModalOpen(false);
    };

    // Xử lý khi chọn thêm sản phẩm mới
    const handleAddNewProduct = () => {
        setSelectedProduct(null);
        setIsEditMode(false);
        setIsFormModalOpen(true);
    };

    // Xử lý lưu sản phẩm (thêm mới hoặc cập nhật)
    const handleSaveProduct = async (productData) => {
        try {
            let result;

            if (isEditMode) {
                // Cập nhật sản phẩm
                result = await handleUpdateProduct(productData.id, productData);
                if (result.success) {
                    toast.success("Cập nhật sản phẩm thành công!");
                } else {
                    toast.error(`Lỗi cập nhật sản phẩm: ${result.error}`);
                }
            } else {
                // Thêm sản phẩm mới
                result = await handleAddProduct(productData);
                if (result.success) {
                    toast.success("Thêm sản phẩm mới thành công!");
                } else {
                    toast.error(`Lỗi thêm sản phẩm: ${result.error}`);
                }
            }

            // Đóng modal nếu thành công
            if (result.success) {
                setIsFormModalOpen(false);
            }

            return result.success;
        } catch (err) {
            toast.error(`Đã xảy ra lỗi: ${err.message}`);
            return false;
        }
    };

    // Xử lý xóa một sản phẩm
    const handleDelete = async (productId) => {
        try {
            const result = await handleDeleteProduct(productId);
            if (result.success) {
                toast.success("Xóa sản phẩm thành công!");
            } else {
                toast.error(`Lỗi xóa sản phẩm: ${result.error}`);
            }
        } catch (err) {
            toast.error(`Đã xảy ra lỗi: ${err.message}`);
        }
    };

    // Xử lý xóa nhiều sản phẩm
    const handleMultipleDelete = async (productIds) => {
        try {
            const result = await handleDeleteMultipleProducts(productIds);
            if (result.success) {
                toast.success(`Đã xóa ${result.count} sản phẩm thành công!`);
            } else {
                toast.error(`Lỗi xóa sản phẩm: ${result.error}`);
            }
        } catch (err) {
            toast.error(`Đã xảy ra lỗi: ${err.message}`);
        }
    };

    // Nếu đang tải thông tin người dùng
    if (loading) {
        return <div>Đang tải...</div>;
    }

    // Nếu người dùng không đăng nhập hoặc không phải admin
    if (!user || !isAdmin()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Layout>
            <div className="products-container">
                {/* Bộ lọc sản phẩm */}
                <ProductFilters
                    onSearch={handleSearch}
                    onCategoryFilter={handleCategoryFilter}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    categories={categories}
                    onAddNewClick={handleAddNewProduct}
                />

                {error && <div className="error-message">{error}</div>}

                {/* Danh sách sản phẩm */}
                <ProductList
                    products={products}
                    isLoading={isLoading}
                    categories={categories}
                    onCategoryFilter={handleCategoryFilter}
                    selectedCategory={selectedCategory}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onEdit={handleEditProduct}
                    onView={handleViewProduct}
                    onDelete={handleDelete}
                    onMultipleDelete={handleMultipleDelete}
                />

                {/* Modal chi tiết sản phẩm */}
                {isDetailModalOpen && selectedProduct && (
                    <ProductDetailModal
                        product={selectedProduct}
                        onClose={() => setIsDetailModalOpen(false)}
                        onEdit={handleEditProduct}
                    />
                )}

                {/* Modal thêm/sửa sản phẩm */}
                {isFormModalOpen && (
                    <ProductFormModal
                        product={isEditMode ? selectedProduct : null}
                        categories={categories}
                        onClose={() => setIsFormModalOpen(false)}
                        onSave={handleSaveProduct}
                    />
                )}
            </div>
        </Layout>
    );
};

// Wrapper với ToastProvider
const ProductManagement = () => {
    return (
        <ToastProvider>
            <ProductManagementContent />
        </ToastProvider>
    );
};

export default ProductManagement;