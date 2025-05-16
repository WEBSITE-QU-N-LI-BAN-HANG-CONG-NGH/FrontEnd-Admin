// src/services/productService.js - Updated
import api from './api';

export const getAllProducts = (params = {}) => {
    const { search = "", category = "", sort = "", order = "" } = params;
    return api.get(`/admin/products/all?search=${search}&category=${category}&sort=${sort}&order=${order}`);
};

export const getProductById = (productId) => api.get(`/admin/products/${productId}`);

export const createProduct = (productData) => {
    // Nếu có file ảnh, sử dụng FormData để gửi đa phương tiện
    if (productData.images && productData.images.length > 0) {
        const formData = new FormData();

        // Thêm dữ liệu sản phẩm
        Object.keys(productData).forEach(key => {
            if (key !== 'images') {
                if (typeof productData[key] === 'object') {
                    formData.append(key, JSON.stringify(productData[key]));
                } else {
                    formData.append(key, productData[key]);
                }
            }
        });

        // Thêm các file ảnh
        productData.images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        return api.post("/admin/products/create", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    return api.post("/admin/products/create", productData);
};

export const updateProduct = (productId, productData) => {
    // Tương tự như create, xử lý FormData nếu có ảnh
    if (productData.images && productData.images.length > 0) {
        const formData = new FormData();

        Object.keys(productData).forEach(key => {
            if (key !== 'images') {
                if (typeof productData[key] === 'object') {
                    formData.append(key, JSON.stringify(productData[key]));
                } else {
                    formData.append(key, productData[key]);
                }
            }
        });

        productData.images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        return api.put(`/admin/products/${productId}/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    return api.put(`/admin/products/${productId}/update`, productData);
};

export const deleteProduct = (productId) => api.delete(`/admin/products/${productId}/delete`);

export const deleteMultipleProducts = (productIds) => {
    return api.delete(`/admin/products/delete-multiple`, {
        data: { ids: productIds }
    });
};

export const getTopSellingProducts = (limit = 10) => api.get(`/admin/products/top-selling?limit=${limit}`);

export const getProductCategories = () => api.get(`/admin/categories/all`);

export const getRevenueByCateogry = () => api.get("/admin/products/revenue-by-category");