// src/hooks/useAnalytics.js
import { useState, useEffect, useCallback } from "react";
import * as dashboardService from "../services/dashboardService";
import * as productService from "../services/productService";
import * as analyticsService from "../services/analyticsService";

export const useAnalytics = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [summary, setSummary] = useState({
        totalProducts: 0,
        totalSales: 0
    });
    const [topProducts, setTopProducts] = useState([]);
    const [timeRange, setTimeRange] = useState("month"); // month, quarter, year
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    const fetchAnalyticsData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Lấy dữ liệu doanh thu theo tháng từ API
            try {
                const salesResponse = await dashboardService.getMonthlyRevenue();
                if (salesResponse.status === 200) {
                    setSalesData(salesResponse.data.data.monthlyData || []);
                }
            } catch (err) {
                console.warn("Không thể tải dữ liệu doanh thu theo tháng:", err);
            }

            // Lấy dữ liệu doanh thu theo danh mục
            try {
                const categoryResponse = await dashboardService.getRevenueDistribution();
                if (categoryResponse.status === 200) {
                    setCategoryData(categoryResponse.data.data || {});
                }
            } catch (err) {
                console.warn("Không thể tải dữ liệu phân bổ doanh thu:", err);
            }

            // Lấy dữ liệu sản phẩm và tính toán tổng số, tổng doanh thu
            try {
                const productsResponse = await productService.getAllProducts();
                if (productsResponse.status === 200) {
                    const products = productsResponse.data.data || [];

                    // Tính tổng số sản phẩm
                    const totalProducts = products.length;

                    // Tính tổng doanh thu
                    let totalSales = 0;

                    // Tạo mảng dữ liệu cho top products với total sales = price * quantitySold
                    const topSellingProducts = products.map(product => {
                        const price = product.discountedPrice || product.price || 0;
                        const quantitySold = product.quantitySold || 0;
                        const totalSalesProduct = price * quantitySold;

                        // Cộng vào tổng doanh thu
                        totalSales += totalSalesProduct;

                        return {
                            id: product.id,
                            name: product.title,
                            price: price,
                            quantitySold: quantitySold,
                            totalSales: totalSalesProduct,
                            category: product.category?.name || "Chưa phân loại"
                        };
                    });

                    // Sắp xếp theo doanh thu giảm dần
                    topSellingProducts.sort((a, b) => b.totalSales - a.totalSales);

                    // Cập nhật state
                    setSummary({
                        totalProducts,
                        totalSales
                    });

                    setTopProducts(topSellingProducts);
                }
            } catch (err) {
                console.warn("Không thể tải dữ liệu sản phẩm:", err);
            }

        } catch (err) {
            console.error("Lỗi khi tải dữ liệu phân tích:", err);
            setError("Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalyticsData();
    }, [fetchAnalyticsData]);

    // Xử lý thay đổi khoảng thời gian
    const handleTimeRangeChange = useCallback((range) => {
        setTimeRange(range);
    }, []);

    // Xử lý thay đổi khoảng ngày tùy chỉnh
    const handleDateRangeChange = useCallback((startDate, endDate) => {
        setDateRange({ start: startDate, end: endDate });
    }, []);

    return {
        isLoading,
        error,
        salesData,
        categoryData,
        summary,
        topProducts,
        timeRange,
        dateRange,
        handleTimeRangeChange,
        handleDateRangeChange,
        refreshData: fetchAnalyticsData
    };
};