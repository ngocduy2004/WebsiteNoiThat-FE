import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost/CDTT_Backend/public/api/",
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;