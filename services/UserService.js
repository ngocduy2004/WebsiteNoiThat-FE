import httpAxios from "./httpAxios";

// Hàm bổ trợ để lấy Header có chứa Token
const getAuthHeaders = (isFormData = false) => {
    const token = localStorage.getItem("token"); // Đảm bảo bạn lưu token vào localStorage khi login
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    if (isFormData) {
        headers["Content-Type"] = "multipart/form-data";
    }
    return { headers };
};

const UserService = {
    // Lấy danh sách: thêm header xác thực để tránh lỗi 401
    getList: async (data) => {
        return await httpAxios.get('users', { 
            params: data,
            ...getAuthHeaders() 
        });
    },

    create: async (data) => {
        return await httpAxios.post("users", data, getAuthHeaders(true));
    },

    /**
     * Cập nhật người dùng
     * Lưu ý: Sử dụng .post thay vì .put khi gửi FormData (chứa ảnh) 
     * để Laravel xử lý tốt hơn thông qua biến _method="PUT"
     */
    update: async (id, data) => {
        // Nếu data là FormData, ta dùng POST + _method: PUT
        if (data instanceof FormData) {
            return await httpAxios.post(`users/${id}`, data, getAuthHeaders(true));
        }
        // Nếu là JSON bình thường
        return await httpAxios.put(`users/${id}`, data, getAuthHeaders());
    },

    getById: (id) => {
        return httpAxios.get(`users/${id}`, getAuthHeaders());
    },

    delete: async (id) => {
        return await httpAxios.delete(`users/${id}`, getAuthHeaders());
    }
}

export default UserService;