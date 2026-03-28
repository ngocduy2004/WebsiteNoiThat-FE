import httpAxios from "./httpAxios";

const GUEST_CART_KEY = "guest_cart";

const cartService = {
  // --- LOCAL STORAGE HELPERS ---
  getLocalCart: () => {
    if (typeof window === "undefined") return { items: [] };
    try {
      const cart = localStorage.getItem(GUEST_CART_KEY);
      const parsed = cart ? JSON.parse(cart) : { items: [] };
      return Array.isArray(parsed.items) ? parsed : { items: [] };
    } catch (e) {
      return { items: [] };
    }
  },

  saveLocalCart: (cart) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    }
  },

  // --- MAIN ACTIONS ---
  getCart: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const res = await httpAxios.get("get-cart");
        return res.cart || { items: [] };
      } catch (err) {
        console.error("Auth Cart Error:", err);
        return cartService.getLocalCart();
      }
    }
    return cartService.getLocalCart();
  },

  addToCart: async (product, quantity) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (token) {
      try {
        const res = await httpAxios.post("add-to-cart", {
          product_id: product.id,
          quantity
        });
        return res.cart;
      } catch (err) {
        console.error("Add to cart server error:", err);
        throw err;
      }
    }

    // Logic cho khách vãng lai (Guest)
    let cart = cartService.getLocalCart();
    const existingItem = cart.items.find(item => item.product_id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product_id: product.id,
        quantity,
        price: product.price_sale > 0 ? product.price_sale : product.price_buy,
        product: product
      });
    }
    cartService.saveLocalCart(cart);
    return cart;
  },

  updateCart: async (product_id, quantity) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      const res = await httpAxios.post("update-cart", { product_id, quantity });
      return res.cart;
    }

    let cart = cartService.getLocalCart();
    const item = cart.items.find(i => i.product_id === product_id);
    if (item) item.quantity = quantity;
    cartService.saveLocalCart(cart);
    return cart;
  },

  removeItem: async (product_id) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      const res = await httpAxios.delete(`remove-item/${product_id}`);
      return res.cart;
    }

    let cart = cartService.getLocalCart();
    cart.items = cart.items.filter(i => i.product_id !== product_id);
    cartService.saveLocalCart(cart);
    return cart;
  },

  clearCart: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      const res = await httpAxios.delete("clear-cart");
      return res.cart;
    }
    localStorage.removeItem(GUEST_CART_KEY);
    return { items: [] };
  },

  mergeCart: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const localCart = cartService.getLocalCart();

    if (!token || localCart.items.length === 0) return;

    try {
      const res = await httpAxios.post("merge-cart", { items: localCart.items });
      localStorage.removeItem(GUEST_CART_KEY);
      return res.cart;
    } catch (err) {
      console.error("Merge error:", err);
    }
  },
};

export default cartService;