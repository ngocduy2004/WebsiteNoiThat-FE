import httpAxios from "./httpAxios";
import cartService from "./CartService";
const api = httpAxios;

// LOGIN
export const login = async (username, password) => {
  try {
    const data = await api.post("login", { username, password });

    localStorage.setItem("access_token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", JSON.stringify(data.user));

    // 🔥 THÊM DÒNG NÀY
    await cartService.mergeCart();

    return data;
  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data || err.message);
    throw new Error("Đăng nhập thất bại");
  }
};
// LOGOUT
export const logout = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      await api.post(
        "logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log("Logout API error:", err.message);
    }
  }

  // Xóa localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};

// LẤY USER HIỆN TẠI
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const data = await api.get("user", {
      // 👈 me → user
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  } catch (err) {
    logout();
    return null;
  }
};
// Thêm vào file service chứa login/logout của bạn
export const register = async (userData) => {
  try {
    // userData bao gồm: name, email, username, password, password_confirmation
    const data = await api.post("register", userData);

    // Nếu muốn đăng ký xong tự đăng nhập luôn:
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Đăng ký thất bại";
    throw new Error(errorMsg);
  }
};
// LẤY TOKEN
export const getToken = () => {
  return localStorage.getItem("token");
};