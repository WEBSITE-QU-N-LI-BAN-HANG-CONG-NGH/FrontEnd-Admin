import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth.js";
import {userService} from "../../services/index.js";
import UserList from "../../components/features/users/UserList";
import UserFilters from "../../components/features/users/UserFilters";
import UserStats from "../../components/features/users/UserStats";
import "../../styles/admin/user/users.css";

const UserManagement = () => {
    const {user, loading, isAdmin} = useAuth();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Gọi API lấy danh sách người dùng với phân trang và lọc
            const response = await userService.getAllUsers(
                currentPage,
                pageSize,
                searchTerm,
                selectedRole
            );

            if (response.status === 200) {
                const userData = response.data.data;
                setUsers(userData.content);
                setTotalPages(userData.totalPages);
            } else {
                throw new Error("Không thể lấy dữ liệu người dùng");
            }

            // Gọi API lấy thống kê về khách hàng
            const statsResponse = await userService.getCustomerStats();
            if (statsResponse.status === 200) {
                setStats(statsResponse.data.data || {});
            }
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu người dùng:", err);
            setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && user) {
            fetchUsers();
        }
    }, [loading, user, currentPage, pageSize, searchTerm, selectedRole]);

    // Xử lý khi người dùng thay đổi trang
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // // Xử lý khi người dùng thay đổi kích thước trang
    // const handlePageSizeChange = (newSize) => {
    //     setPageSize(newSize);
    //     setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi kích thước trang
    // };

    // Xử lý khi người dùng tìm kiếm
    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(0); // Reset về trang đầu tiên khi tìm kiếm
    };

    // Xử lý khi người dùng lọc theo vai trò
    const handleRoleFilter = (role) => {
        setSelectedRole(role);
        setCurrentPage(0); // Reset về trang đầu tiên khi lọc
    };

    // // Xử lý thay đổi vai trò của người dùng
    // const handleChangeRole = async (userId, newRole) => {
    //     try {
    //         const response = await userService.changeUserRole(userId, newRole);
    //         if (response.status === 200 && response.data.status) {
    //             // Cập nhật lại danh sách người dùng
    //             fetchUsers();
    //         } else {
    //             throw new Error("Không thể thay đổi vai trò người dùng");
    //         }
    //     } catch (err) {
    //         console.error("Lỗi khi thay đổi vai trò người dùng:", err);
    //         setError("Không thể thay đổi vai trò người dùng. Vui lòng thử lại sau.");
    //     }
    // };

    // Xử lý thay đổi trạng thái hoạt động của người dùng
    const handleToggleStatus = async (userId, isActive) => {
        try {
            const response = await userService.updateUserStatus(userId, !isActive);
            if (response.status === 200) {
                // Cập nhật lại danh sách người dùng
                fetchUsers();
            } else {
                throw new Error("Không thể thay đổi trạng thái người dùng");
            }
        } catch (err) {
            console.error("Lỗi khi thay đổi trạng thái người dùng:", err);
            setError("Không thể thay đổi trạng thái người dùng. Vui lòng thử lại sau.");
        }
    };

    // Xử lý xóa người dùng
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            return;
        }

        try {
            const response = await userService.deleteUser(userId);
            if (response.status === 200) {
                // Cập nhật lại danh sách người dùng
                fetchUsers();
            }
        } catch (err) {
            console.error("Lỗi khi xóa người dùng:", err);
            setError("Không thể xóa người dùng. Vui lòng thử lại sau.");
        }
    };

    // Nếu đang tải thông tin người dùng
    if (loading) {
        return <div>Đang tải...</div>;
    }

    // Nếu người dùng không đăng nhập hoặc không phải admin
    if (!user || !isAdmin()) {
        return <Navigate to="/login" replace/>;
    }

    return (
        <Layout>
            <div className="users-container">
                {/* Hiển thị thống kê */}
                <UserStats stats={stats}/>

                {/* Bộ lọc và tìm kiếm */}
                <UserFilters
                    onSearch={handleSearch}
                    onRoleFilter={handleRoleFilter}
                    selectedRole={selectedRole}
                />

                {error && <div className="error-message">{error}</div>}

                {/* Danh sách người dùng */}
                <UserList
                    users={users}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    // onChangeRole={handleChangeRole}
                    onToggleStatus={handleToggleStatus}
                    onDeleteUser={handleDeleteUser}
                />
            </div>
        </Layout>
    );
};

export default UserManagement;