"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import cartService from "../../../services/CartService"; // Đảm bảo đường dẫn đúng

// Cấu hình URL ảnh (Thay bằng domain backend thực tế của bạn)
const IMAGE_BASE_URL = "http://localhost:8000/storage/";

export default function Product({ product }) {
  // 1. Kiểm tra dữ liệu đầu vào để tránh lỗi crash trang
  if (!product) return null;

  // 2. Xử lý logic Thêm vào giỏ
  const handleAddToCart = async () => {
    try {
      // Lưu ý: Gửi đúng ID và số lượng
      await cartService.addToCart(product, 1);
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  // 3. ===== LOGIC GIÁ (QUAN TRỌNG) =====
  // Lấy giá gốc (price_buy từ backend)
  const originalPrice = Number(product.price_buy || 0);
  
  // Lấy giá sale (sale_price từ backend). 
  // Nếu hết hạn khuyến mãi, Backend trả về null -> convert thành 0
  const salePrice = Number(product.sale_price || 0);

  // Điều kiện để hiển thị sale: 
  // 1. Có giá sale (>0)
  // 2. Giá sale phải nhỏ hơn giá gốc
  const hasSale = salePrice > 0 && salePrice < originalPrice;

  // Giá hiển thị cuối cùng
  const finalPrice = hasSale ? salePrice : originalPrice;

  // Tính phần trăm giảm giá
  const discount = hasSale
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  // 4. Xử lý đường dẫn ảnh
  // Nếu thumbnail đã là link full (http...) thì giữ nguyên, nếu không thì nối với base url
  const imageUrl = product.thumbnail
    ? product.thumbnail.startsWith("http")
      ? product.thumbnail
      : `${IMAGE_BASE_URL}${product.thumbnail}`
    : "https://placehold.co/400x400?text=No+Image"; // Ảnh mặc định nếu thiếu

  return (
    <div className="group relative bg-white rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col h-full">
      
      {/* --- PHẦN ẢNH + BADGE --- */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
        {/* Chỉ hiện Badge khi có Sale */}
        {hasSale && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2.5 py-1 text-xs font-bold rounded-lg shadow-lg animate-pulse">
            -{discount}%
          </div>
        )}

        <Link href={`/product/${product.id}/detail/`} className="w-full h-full">
            <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
            />
        </Link>
      </div>

      {/* --- THÔNG TIN SẢN PHẨM --- */}
      <div className="flex flex-col flex-grow text-center">
        {/* Tên sản phẩm */}
        <Link href={`/product/${product.id}/detail/`} title={product.name}>
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 min-h-[40px] hover:text-blue-600 transition-colors">
            {product.name}
            </h3>
        </Link>

        {/* Khu vực giá */}
        <div className="mb-4">
          <p className={`text-xl font-bold ${hasSale ? 'text-red-600' : 'text-slate-800'}`}>
            {finalPrice.toLocaleString("vi-VN")} ₫
          </p>

          {/* Chỉ hiện giá gạch ngang nếu đang Sale */}
          {hasSale && (
            <p className="text-xs text-slate-400 line-through mt-1">
              {originalPrice.toLocaleString("vi-VN")} ₫
            </p>
          )}
        </div>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200"
        >
          <ShoppingCart size={14} /> Thêm vào giỏ
        </button>

        <Link
          href={`/product/${product.id}/detail/`}
          className="p-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          title="Xem chi tiết"
        >
          <Eye size={18} />
        </Link>
      </div>
    </div>
  );
}