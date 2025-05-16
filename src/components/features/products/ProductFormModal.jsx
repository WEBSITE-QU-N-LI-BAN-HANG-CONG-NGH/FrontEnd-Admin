// src/components/features/products/ProductFormModal.jsx
import React, { useState, useEffect } from "react";
import "../../../styles/admin/product/product-form.css";

const ProductFormModal = ({ product, categories, onClose, onSave }) => {
    const isEditing = !!product;
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        price: 0,
        discountedPrice: 0,
        quantity: 0,
        category: "",
        sizes: [],
        imageUrls: []
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [availableSizes, setAvailableSizes] = useState(["S", "M", "L", "XL", "XXL"]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Khi component mount hoặc product thay đổi
    useEffect(() => {
        if (product) {
            setFormData({
                id: product.id || "",
                title: product.title || "",
                description: product.description || "",
                price: product.price || 0,
                discountedPrice: product.discountedPrice || 0,
                quantity: product.quantity || 0,
                category: product.category?.id || "",
                sizes: product.sizes || [],
                imageUrls: product.imageUrls || []
            });
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "discountedPrice" || name === "quantity"
                ? Number(value)
                : value
        }));
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => {
            if (prev.sizes.includes(size)) {
                return { ...prev, sizes: prev.sizes.filter(s => s !== size) };
            } else {
                return { ...prev, sizes: [...prev.sizes, size] };
            }
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(prev => [...prev, ...files]);
    };

    const removeImageFile = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Tên sản phẩm không được để trống";
        if (formData.price <= 0) newErrors.price = "Giá sản phẩm phải lớn hơn 0";
        if (formData.quantity < 0) newErrors.quantity = "Số lượng không được âm";
        if (formData.discountedPrice > formData.price) {
            newErrors.discountedPrice = "Giá khuyến mãi không được lớn hơn giá gốc";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        // Trong thực tế, bạn sẽ cần upload ảnh lên server và lấy URL trước
        // Ở đây chúng ta giả định đã upload thành công và nhận được URL

        const productData = {
            ...formData,
            images: imageFiles // Thêm files ảnh
        };

        onSave(productData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="product-form-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="modal-body">
                        <div className="form-grid">
                            <div className="form-left">
                                <div className="form-group">
                                    <label htmlFor="title">Tên sản phẩm <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.title && <div className="error-message">{errors.title}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Mô tả sản phẩm</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="5"
                                    ></textarea>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="price">Giá bán <span className="required">*</span></label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                        {errors.price && <div className="error-message">{errors.price}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="discountedPrice">Giá khuyến mãi</label>
                                        <input
                                            type="number"
                                            id="discountedPrice"
                                            name="discountedPrice"
                                            value={formData.discountedPrice}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                        {errors.discountedPrice && <div className="error-message">{errors.discountedPrice}</div>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="quantity">Số lượng <span className="required">*</span></label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                        {errors.quantity && <div className="error-message">{errors.quantity}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category">Danh mục</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((cat, index) => (
                                                <option key={index} value={cat.id || cat}>{cat.name || cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-right">
                                <div className="form-group">
                                    <label>Kích thước sản phẩm</label>
                                    <div className="size-options">
                                        {availableSizes.map((size) => (
                                            <div
                                                key={size}
                                                className={`size-option ${formData.sizes.includes(size) ? 'selected' : ''}`}
                                                onClick={() => handleSizeToggle(size)}
                                            >
                                                {size}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Hình ảnh sản phẩm</label>
                                    <div className="image-upload-container">
                                        <input
                                            type="file"
                                            id="productImages"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="image-upload-input"
                                        />
                                        <label htmlFor="productImages" className="image-upload-label">
                                            <div className="upload-icon">+</div>
                                            <div>Chọn ảnh</div>
                                        </label>
                                    </div>

                                    <div className="image-preview-container">
                                        {/* Hiển thị ảnh đã chọn từ máy tính */}
                                        {imageFiles.map((file, index) => (
                                            <div key={`new-${index}`} className="image-preview-item">
                                                <img src={URL.createObjectURL(file)} alt={`New upload ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => removeImageFile(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}

                                        {/* Hiển thị ảnh đã có (trong trường hợp edit) */}
                                        {formData.imageUrls && formData.imageUrls.map((image, index) => (
                                            <div key={`existing-${index}`} className="image-preview-item">
                                                <img src={image.downloadUrl} alt={`Existing ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => removeExistingImage(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm sản phẩm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;