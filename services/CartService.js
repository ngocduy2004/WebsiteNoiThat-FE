import httpAxios from "./httpAxios";


const GUEST_CART_KEY = "guest_cart";

function getAuthHeader() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token"); // Đảm bảo key này khớp với bên Login
    return token ? { 'Authorization': `Bearer ${token}` } : null;
  }
  return null;
}
const cartService = {
  getLocalCart: () => {
    if (typeof window === "undefined") return { items: [] };
    try {
      const cart = localStorage.getItem(GUEST_CART_KEY);
      const parsed = cart ? JSON.parse(cart) : { items: [] };
      // Đảm bảo luôn trả về mảng items
      return Array.isArray(parsed.items) ? parsed : { items: [] };
    } catch (e) {
      return { items: [] };
    }
  },

  getCart: async () => {
    const headers = getAuthHeader();
    if (headers) {
      try {
        const res = await httpAxios.get("get-cart", { headers });
        return res.cart || { items: [] };
      } catch (err) {
        console.error("Server Cart Error:", err);
        // Nếu lỗi server (401, 500), fallback về Local Cart để không bị treo UI
        return cartService.getLocalCart();
      }
    }
    return cartService.getLocalCart();
  },

addToCart: async (product, quantity) => {
    const headers = getAuthHeader();
    if (headers) {
        try {
            const res = await httpAxios.post("add-to-cart", {
                product_id: product.id,
                quantity
            }, { headers });

            // Trả về res nếu backend trả về thẳng object cart, 
            // hoặc res.cart nếu backend bọc trong key 'cart'
            return res.cart || res; 
        } catch (err) {
            console.error("Add to cart error details:", err.response?.data);
            throw err;
        }
    }
    // Guest cart
    let cart = cartService.getLocalCart();
    const existingItem = cart.items.find(item => item.product_id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product_id: product.id,
        quantity,
        price: product.price_buy || product.price,
        product: product
      });
    }

    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    return cart;
  },

  updateCart: async (product_id, quantity) => {
    const headers = getAuthHeader();
    if (headers) {
      // Đảm bảo lấy .cart từ response của API
      const res = await httpAxios.post("update-cart", { product_id, quantity }, { headers });
      return res.cart;
    }
    // Logic cho Guest (giữ nguyên)
    let cart = cartService.getLocalCart();
    const item = cart.items.find(i => i.product_id === product_id);
    if (item) item.quantity = quantity;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    return cart;
  },

  removeItem: async (product_id) => {
    const headers = getAuthHeader();
    if (headers) {
      // Đảm bảo lấy .cart từ response của API
      const res = await httpAxios.delete(`remove-item/${product_id}`, { headers });
      return res.cart;
    }
    // Logic cho Guest (giữ nguyên)
    let cart = cartService.getLocalCart();
    cart.items = cart.items.filter(i => i.product_id !== product_id);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    return cart;

  },
  //  removeItem: async (product_id) => {
  //   const headers = getAuthHeader();
  //   if (headers) {
  //     // Đảm bảo lấy .cart từ response của API
  //     const res = await httpAxios.delete(`remove-item/${product_id}`, { headers });
  //     return res.cart;
  //   }
  //   // Logic cho Guest (giữ nguyên)
  //   let cart = cartService.getLocalCart();
  //   cart.items = cart.items.filter(i => i.product_id !== product_id);
  //   localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  //   return cart;
  // },

  clearCart: async () => {
    const headers = getAuthHeader();
    if (headers) {
      try {
        const res = await httpAxios.delete("clear-cart", { headers });
        return res.cart; // Trả về { items: [] } từ Server
      } catch (err) {
        console.error("clearCart error:", err);
        throw err;
      }
    }

    // Đối với khách (Guest)
    localStorage.removeItem(GUEST_CART_KEY);
    return { items: [] };
  },

  mergeCart: async () => {
    const token = localStorage.getItem("token");
    const localCart = cartService.getLocalCart();

    // Nếu không có token hoặc giỏ hàng local trống thì bỏ qua
    if (!token || !localCart.items || localCart.items.length === 0) {
      return;
    }

    try {
      const res = await httpAxios.post(
        "merge-cart",
        { items: localCart.items }, // Gửi danh sách item local lên
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Sau khi đồng bộ thành công, xóa giỏ hàng ở LocalStorage
      localStorage.removeItem(GUEST_CART_KEY);
      return res.cart;
    } catch (err) {
      console.error("Lỗi đồng bộ giỏ hàng:", err);
    }
  },
};

export default cartService;