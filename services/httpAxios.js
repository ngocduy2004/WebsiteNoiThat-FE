import axios from "axios";

const api = axios.create({
  // Ưu tiên lấy từ biến môi trường, nếu không có thì dùng link Railway trực tiếp
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://websitenoithat-be-production.up.railway.app/api"
});

// THÊM ĐOẠN NÀY: Interceptor cho Request (Gửi Token đi)
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (đảm bảo lúc đăng nhập bạn đã lưu với key 'access_token')
    const token = localStorage.getItem("access_token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Nếu bị lỗi 401 (hết hạn token), bạn có thể xử lý logout ở đây
    if (error.response && error.response.status === 401) {
      console.error("Phiên đăng nhập hết hạn!");
    }
    return Promise.reject(error);
  }
);

export default api;