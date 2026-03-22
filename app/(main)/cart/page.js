"use client";
import { useState, useEffect } from "react";
import { Trash2, ShoppingBag, XCircle, ChevronLeft, ArrowRight, ShieldCheck } from "lucide-react";
import cartService from "../../../services/CartService";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Helper định dạng tiền
const formatPrice = (value) => new Intl.NumberFormat("vi-VN").format(value);

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCartItems(data?.items || []);
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      const updatedCart = await cartService.updateCart(productId, newQty);
      setCartItems(updatedCart?.items || []);
    } catch (error) {
      alert("Lỗi cập nhật số lượng (có thể kho không đủ hàng).");
    }
  };

  const removeItem = async (productId) => {
    if (!confirm("Xóa sản phẩm này khỏi giỏ hàng?")) return;
    try {
      const updatedCart = await cartService.removeItem(productId);
      setCartItems(updatedCart?.items || []);
    } catch (error) {
      alert("Không thể xóa sản phẩm.");
    }
  };

  const clearAllCart = async () => {
    if (!confirm("Xóa toàn bộ giỏ hàng?")) return;
    try {
      const updatedCart = await cartService.clearCart();
      setCartItems(updatedCart?.items || []);
    } catch (error) {
      alert("Lỗi thao tác.");
    }
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token"); // Hoặc lấy từ Context/Cookie
    if (!token) {
      router.push("/auth/login?redirect=/cart");
      return;
    }
    router.push("/Checkout"); // Sửa thành chữ thường cho đúng chuẩn URL
  };

  // --- 1. TÍNH TOÁN GIÁ TRỊ GIỎ HÀNG (QUAN TRỌNG) ---
  const subtotal = cartItems.reduce((sum, item) => {
    // Logic lấy giá ưu tiên: Sale > Gốc
    const originalPrice = Number(item.product?.price_buy || 0);
    const salePrice = Number(item.product?.sale_price || 0);
    const hasSale = salePrice > 0 && salePrice < originalPrice;
    
    // Giá thực tế để tính tiền
    const effectivePrice = hasSale ? salePrice : originalPrice;
    
    return sum + (effectivePrice * item.quantity);
  }, 0);

  const shippingFee = subtotal > 2000000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shippingFee;
  // ----------------------------------------------------

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="flex items-center text-zinc-500 hover:text-zinc-900 transition-colors mb-4 text-sm group w-fit">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Tiếp tục mua sắm
          </Link>
          <div className="flex justify-between items-end">
            <h1 className="text-3xl font-bold text-zinc-900">
              Giỏ hàng <span className="text-zinc-400 font-light text-2xl ml-2">({cartItems.length})</span>
            </h1>
            {cartItems.length > 0 && (
              <button onClick={clearAllCart} className="text-red-500 hover:text-red-700 flex items-center gap-2 text-sm font-medium transition-colors">
                <Trash2 size={16} /> Xóa tất cả
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-zinc-100 shadow-sm">
            <div className="relative inline-block mb-6">
              <ShoppingBag size={80} className="text-zinc-100" />
              <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                <XCircle size={32} />
              </div>
            </div>
            <h2 className="text-xl font-medium text-zinc-800 mb-2">Giỏ hàng đang trống</h2>
            <Link href="/" className="inline-block mt-6 bg-zinc-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Item List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="hidden md:grid grid-cols-12 px-6 py-4 text-xs uppercase tracking-wider text-zinc-400 font-bold">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Tổng</div>
                <div className="col-span-2"></div>
              </div>

              {cartItems.map((item) => {
                 // Tính giá riêng cho từng row để hiển thị
                 const priceOriginal = Number(item.product?.price_buy || 0);
                 const priceSale = Number(item.product?.sale_price || 0);
                 const hasSale = priceSale > 0 && priceSale < priceOriginal;
                 const priceCurrent = hasSale ? priceSale : priceOriginal;

                 return (
                    <div key={item.product_id} className="bg-white p-4 md:p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                        {/* Image & Info */}
                        <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                          <div className="w-20 h-24 bg-zinc-50 rounded-xl overflow-hidden shrink-0 border border-zinc-200">
                            <img
                              src={item.product?.thumbnail_url || item.product?.thumbnail || "https://placehold.co/100"}
                              alt={item.product?.name}
                              className="w-full h-full object-cover mix-blend-multiply"
                            />
                          </div>
                          <div>
                            <Link href={`/product/${item.product_id}/detail`} className="text-base font-semibold text-zinc-900 line-clamp-2 hover:text-blue-600 transition-colors">
                              {item.product?.name}
                            </Link>
                            <div className="mt-1 flex gap-2 items-baseline">
                                <span className="text-zinc-500 text-sm font-medium">{formatPrice(priceCurrent)}₫</span>
                                {hasSale && (
                                    <span className="text-zinc-300 text-xs line-through">{formatPrice(priceOriginal)}₫</span>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-1 md:col-span-2 flex md:justify-center">
                          <div className="flex items-center border border-zinc-200 rounded-lg">
                            <button onClick={() => updateQty(item.product_id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 font-bold">-</button>
                            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQty(item.product_id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 font-bold">+</button>
                          </div>
                        </div>

                        {/* Total Row */}
                        <div className="col-span-1 md:col-span-2 text-right hidden md:block">
                          <p className="text-base font-bold text-zinc-900">
                            {formatPrice(priceCurrent * item.quantity)}₫
                          </p>
                        </div>

                        {/* Remove */}
                        <div className="col-span-1 md:col-span-2 flex justify-end">
                          <button
                            onClick={() => removeItem(item.product_id)}
                            className="p-2 text-zinc-300 hover:text-red-500 transition-colors bg-zinc-50 hover:bg-red-50 rounded-full"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                 );
              })}
            </div>

            {/* Checkout Box */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-zinc-900 mb-6 uppercase tracking-wider">Tóm tắt đơn hàng</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>Tạm tính</span>
                    <span className="text-zinc-900 font-medium">{formatPrice(subtotal)}₫</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>Vận chuyển</span>
                    <span className="text-green-600 font-medium">
                      {shippingFee === 0 ? "Miễn phí" : `${formatPrice(shippingFee)}₫`}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-zinc-100 flex justify-between items-end">
                    <span className="text-zinc-900 font-bold">Tổng cộng</span>
                    <span className="text-2xl font-black text-indigo-600">{formatPrice(total)}₫</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 active:scale-95"
                >
                  THANH TOÁN <ArrowRight size={18} />
                </button>

                <div className="mt-6 flex items-center gap-3 text-[11px] text-zinc-500 bg-zinc-50 p-3 rounded-lg justify-center">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span>Thông tin thanh toán được bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}