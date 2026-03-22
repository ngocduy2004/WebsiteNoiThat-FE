"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import cartService from "../../../services/CartService";
const IMAGE_BASE_URL = "http://localhost:8000/storage/";


// Helper định dạng tiền
const formatPrice = (value) => new Intl.NumberFormat("vi-VN").format(value);

export default function ProductNew({ product }) {
  // --- 1. LOGIC GIÁ ---
  const originalPrice = Number(product.price_buy || 0);
  const salePrice = Number(product.sale_price || 0);

  // Kiểm tra có sale không (Giá sale phải > 0 và nhỏ hơn giá gốc)
  const hasSale = salePrice > 0 && salePrice < originalPrice;
  const finalPrice = hasSale ? salePrice : originalPrice;

  // Tính % giảm
  const discountPercent = hasSale
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;
  // --------------------

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart(product, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra");
    }
  };

  const imageUrl = product.thumbnail
    ? product.thumbnail.startsWith("http")
      ? product.thumbnail
      : `${IMAGE_BASE_URL}${product.thumbnail}`
    : "/no-image.png";

  return (
    <div className="group w-full bg-white cursor-pointer text-center relative rounded-xl p-4 transition-all duration-300 hover:shadow-2xl border border-transparent hover:border-slate-100 h-full flex flex-col">

      {/* ẢNH + BADGE */}
      <div className="relative w-full aspect-[4/5] flex justify-center items-center overflow-hidden rounded-lg bg-slate-50 mb-4">
        {/* Badge Container */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <span className="bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded shadow-sm">
            New
          </span>
          {hasSale && (
            <span className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded shadow-sm animate-pulse">
              -{discountPercent}%
            </span>
          )}
        </div>

        <Link href={`/product/${product.id}/detail/`} className="w-full h-full">
          <img
            src={imageUrl}
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
          <p className={`font-bold text-lg ${hasSale ? 'text-red-600' : 'text-slate-900'}`}>
            {formatPrice(finalPrice)} ₫
          </p>

          {/* Giá cũ gạch ngang (Chỉ hiện khi có sale) */}
          {hasSale ? (
            <p className="text-slate-400 line-through text-xs font-medium h-4">
              {formatPrice(originalPrice)} ₫
            </p>
          ) : (
            // Giữ khoảng trống để layout không bị nhảy
            <div className="h-4"></div>
          )}
        </div>
      </div>

      {/* HOVER ACTIONS */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 mt-4">
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