"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import cartService from "../../../services/CartService"; 

// ✅ FIX 1: Dùng URL Production thay vì localhost để không bị ERR_CONNECTION_REFUSED
const IMAGE_BASE_URL = "https://websitenoithat-be-production.up.railway.app/storage/";

export default function Product({ product }) {
  if (!product) return null;

  const handleAddToCart = async () => {
    try {
      // ✅ FIX 2: cartService đã lo phần Header, chỉ cần truyền đúng object product
      const res = await cartService.addToCart(product, 1);
      if (res) {
        alert("Đã thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      // Hiển thị thông báo lỗi cụ thể từ server nếu có
      alert(error.response?.data?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const originalPrice = Number(product.price_buy || 0);
  const salePrice = Number(product.sale_price || 0);
  const hasSale = salePrice > 0 && salePrice < originalPrice;
  const finalPrice = hasSale ? salePrice : originalPrice;

  const discount = hasSale
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  // ✅ FIX 3: Ưu tiên lấy từ trường 'image' trong DB Duy vừa gửi ảnh
  const imageUrl = product.image
    ? `${IMAGE_BASE_URL}${product.image}`
    : (product.thumbnail?.startsWith("http") 
        ? product.thumbnail 
        : "https://placehold.co/400x400?text=No+Image");

  return (
    <div className="group relative bg-white rounded-2xl p-4 transition-all duration-500 hover:shadow-xl border border-slate-100 flex flex-col h-full">
      
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
        {hasSale && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2.5 py-1 text-xs font-bold rounded-lg shadow-lg">
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

      <div className="flex flex-col flex-grow text-center">
        <Link href={`/product/${product.id}/detail/`} title={product.name}>
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 min-h-[40px] hover:text-blue-600 transition-colors">
            {product.name}
            </h3>
        </Link>

        <div className="mb-4">
          <p className={`text-xl font-bold ${hasSale ? 'text-red-600' : 'text-slate-800'}`}>
            {finalPrice.toLocaleString("vi-VN")} ₫
          </p>
          {hasSale && (
            <p className="text-xs text-slate-400 line-through mt-1">
              {originalPrice.toLocaleString("vi-VN")} ₫
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-md"
        >
          <ShoppingCart size={14} /> Thêm vào giỏ
        </button>

        <Link
          href={`/product/${product.id}/detail/`}
          className="p-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <Eye size={18} />
        </Link>
      </div>
    </div>
  );
}