import axios from "axios";

const api = axios.create({
  // BẮT BUỘC: Dùng https và KHÔNG có dấu / ở cuối api để tránh Redirect 301
  baseURL: "https://websitenoithat-be-production.up.railway.app/api"
});

api.interceptors.request.use(
  (config) => {
    // SỬA: Quét cả 2 key để chắc chắn lấy được Token JWT
    const token = localStorage.getItem("access_token") || localStorage.getItem("token"); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ép kiểu Content-Type để Backend Laravel nhận diện đúng JSON
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Phiên đăng nhập hết hạn hoặc Token không hợp lệ!");
    }
    return Promise.reject(error);
  }
);

export default api;