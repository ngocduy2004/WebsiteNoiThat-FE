import axios from "axios";

const api = axios.create({
  // Đảm bảo không có dấu / ở cuối URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://websitenoithat-be-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
});

// Tự động đính kèm Token vào MỌI request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // SỬA TẠI ĐÂY: Dùng đúng key bạn đã lưu lúc Login (thường là "token")
      const token = localStorage.getItem("token"); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data, // Trả về data trực tiếp (giúp CartService lấy được .cart luôn)
  (error) => {
    if (error.response?.status === 401) {
      console.error("Phiên đăng nhập hết hạn hoặc chưa đăng nhập!");
      // localStorage.removeItem("token"); // Có thể xóa token cũ nếu muốn
    }
    return Promise.reject(error);
  }
);

export default api;