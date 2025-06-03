

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
    });
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    // Fetch orders with backend filtering
    const fetchOrders = useCallback(async (page = 0) => {
        try {
            setIsLoading(true);
            setError(null);

            // Convert filter status for API
            const apiStatus = filter === "all" ? "" : filter;

            const response = await orderService.getAllOrders(
                page,
                pagination.pageSize,
                searchTerm,
                apiStatus,
                dateRange.start,
                dateRange.end
            );

            if (response.status === 200) {
                const responseData = response.data.data;
                setOrders(responseData.orders || []);
                setPagination(responseData.pagination || pagination);
            } else {
                throw new Error("Không thể tải dữ liệu đơn hàng");
            }
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu đơn hàng:", err);
            setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, [filter, searchTerm, dateRange, pagination.pageSize]);

    // Fetch statistics separately
    const fetchStats = useCallback(async () => {
        try {
            const response = await orderService.getOrderStats(dateRange.start, dateRange.end);
            if (response.status === 200) {
                setStats(response.data.data || stats);
            }
        } catch (err) {
            console.error("Lỗi khi tải thống kê:", err);
        }
    }, [dateRange]);

    // Fetch data when dependencies change
    useEffect(() => {
        fetchOrders(0); // Reset to first page when filters change
    }, [filter, searchTerm, dateRange]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Handle search with immediate API call
    const handleSearch = useCallback((term, startDate, endDate) => {
        setSearchTerm(term);
        if (startDate || endDate) {
            setDateRange({ start: startDate || "", end: endDate || "" });
        }
        // fetchOrders will be triggered by useEffect
    }, []);

    // Handle pagination
    const handlePageChange = useCallback((newPage) => {
        fetchOrders(newPage);
    }, [fetchOrders]);

    // Handle status change
    const handleStatusChange = useCallback(async (orderId, action) => {
        try {
            let response;

            switch (action) {
                case "confirm":
                    response = await orderService.confirmOrder(orderId);
                    break;
                case "ship":
                    response = await orderService.shipOrder(orderId);
                    break;
                case "deliver":
                    response = await orderService.deliverOrder(orderId);
                    break;
                case "cancel":
                    response = await orderService.cancelOrder(orderId);
                    break;
                default:
                    throw new Error("Hành động không hợp lệ");
            }

            if (response.status === 200) {
                // Refresh current page to get updated data
                fetchOrders(pagination.currentPage);
                return true;
            }
            return false;
        } catch (err) {
            console.error(`Lỗi khi thay đổi trạng thái đơn hàng ${orderId}:`, err);
            setError(`Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.`);
            return false;
        }
    }, [fetchOrders, pagination.currentPage]);

    // Handle delete order
    const handleDeleteOrder = useCallback(async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
            return false;
        }

        try {
            const response = await orderService.deleteOrder(orderId);
            if (response.status === 200) {
                // Refresh current page to get updated data
                fetchOrders(pagination.currentPage);
                return true;
            }
            return false;
        } catch (err) {
            console.error(`Lỗi khi xóa đơn hàng ${orderId}:`, err);
            setError(`Không thể xóa đơn hàng. Vui lòng thử lại sau.`);
            return false;
        }
    }, [fetchOrders, pagination.currentPage]);

    return {
        orders,
        pagination,
        stats,
        isLoading,
        error,
        filter,
        setFilter,
        handleSearch,
        handleStatusChange,
        handleDeleteOrder,
        handlePageChange,
        refreshOrders: () => fetchOrders(pagination.currentPage)
    };
};