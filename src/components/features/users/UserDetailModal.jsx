// UserDetailModal.jsx
import React from "react";

const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="user-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Chi tiết người dùng</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="user-info-section">
                        <h3>Thông tin cơ bản</h3>
                        <div className="info-group">
                            <div className="info-label">ID:</div>
                            <div className="info-value">{user.id}</div>
                        </div>
                        <div className="info-group">
                            <div className="info-label">Họ tên:</div>
                            <div className="info-value">{user.firstName} {user.lastName}</div>
                        </div>
                        <div className="info-group">
                            <div className="info-label">Email:</div>
                            <div className="info-value">{user.email}</div>
                        </div>
                        <div className="info-group">
                            <div className="info-label">Vai trò:</div>
                            <div className="info-value">{user.role}</div>
                        </div>
                        <div className="info-group">
                            <div className="info-label">Trạng thái:</div>
                            <div className="info-value">
                                <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                                    {user.active ? 'Hoạt động' : 'Bị khóa'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Thêm các phần thông tin khác như địa chỉ, đơn hàng, v.v. */}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;