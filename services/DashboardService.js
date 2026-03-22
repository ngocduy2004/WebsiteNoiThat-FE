import httpAxios from "./httpAxios";

const DashboardService = {
    // 1. Lấy thống kê tổng quan (Doanh thu, đơn hàng, khách hàng...)
    getStats: () => {
        return httpAxios.get("dashboard/stats");
    },

    // 2. Lấy danh sách đơn hàng mới nhất
    getRecentOrders: () => {
        return httpAxios.get("order?limit=5&sort_by=created_at&sort_dir=desc");
    }
};

export default DashboardService;