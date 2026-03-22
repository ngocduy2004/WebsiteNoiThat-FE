"use client";

import Link from "next/link";
import cartService from "@/services/CartService"; // Đảm bảo import đúng đường dẫn service giỏ hàng

// Hàm format tiền tệ
const formatPrice = (value) => new Intl.NumberFormat("vi-VN").format(value);

export default function ProductCard({ product }) {
  // 1. --- LOGIC TÍNH GIÁ SALE (QUAN TRỌNG) ---
  const originalPrice = Number(product.price_buy || 0);
  const salePrice = Number(product.sale_price || 0);
  
  // Điều kiện sale: Giá sale > 0 VÀ nhỏ hơn giá gốc
  const hasSale = salePrice > 0 && salePrice < originalPrice;
  
  // Giá hiển thị cuối cùng
  const finalPrice = hasSale ? salePrice : originalPrice;

  // Tính % giảm giá để hiện badge
  const discountPercent = hasSale 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) 
    : 0;
  // -------------------------------------------

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Chặn click nhảy vào trang chi tiết
    try {
      await cartService.addToCart(product, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error(error);
      alert("Lỗi thêm giỏ hàng");
    }
  };

  return (
    <div className="group w-full bg-white cursor-pointer text-center relative rounded-xl p-4 transition-all duration-300 hover:shadow-2xl border border-transparent hover:border-slate-100 h-full flex flex-col">
      
      {/* ẢNH + BADGE */}
      <div className="relative w-full aspect-[4/5] flex justify-center items-center overflow-hidden rounded-lg bg-slate-50 mb-4">
        {/* Badge Sale */}
        {hasSale && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded shadow-sm animate-pulse z-10">
            -{discountPercent}%
          </div>
        )}

        <Link href={`/product/${product.id}/detail/`} className="w-full h-full">
            <img
            src={product.thumbnail_url || product.thumbnail} // Hỗ trợ cả 2 trường hợp tên biến
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
            />
        </Link>
      </div>

      {/* THÔNG TIN */}
      <div className="flex flex-col flex-grow justify-between">
        <Link href={`/product/${product.id}/detail/`}>
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
            {product.name}
            </h3>
        </Link>

        <div className="mt-2 flex flex-col items-center">
          {/* Giá chính (Màu đỏ nếu sale, màu đen nếu không) */}
          <p className={`font-bold text-lg ${hasSale ? 'text-red-600' : 'text-slate-900'}`}>
            {formatPrice(finalPrice)} ₫
          </p>

          {/* Giá gốc gạch ngang (Chỉ hiện khi có sale) */}
          {hasSale ? (
            <p className="text-slate-400 line-through text-xs font-medium h-4">
              {formatPrice(originalPrice)} ₫
            </p>
          ) : (
             // Giữ khoảng trống để layout đồng đều
             <div className="h-4"></div>
          )}
        </div>
      </div>

      {/* ACTIONS HOVER */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 mt-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
        >
          Thêm vào giỏ
        </button>
        <Link
          href={`/product/${product.id}/detail/`}
          className="px-3 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold"
        >
          Chi tiết
        </Link>
      </div>
    </div>
  );
}