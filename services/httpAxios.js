import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://websitenoithat-be-production.up.railway.app/api/","http://localhost/CDTT_Backend/public/api/",
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;