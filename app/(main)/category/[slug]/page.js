"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home, ShoppingBag, Layers } from "lucide-react"; 
import CategoryService from "@/services/CategoryService"; // Đảm bảo đường dẫn đúng

// Import Component ProductCard (File mà chúng ta đã thêm logic hiển thị giá Sale)
// Hãy chắc chắn đường dẫn này trỏ đúng vào file ProductNew.js hoặc Product.js bạn đang dùng
import ProductCard from "../../components/ProductCard"; 

export default function CategoryPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    setCategory(null); // Reset category khi đổi slug để tránh hiện thông tin cũ
    setProducts([]);

    CategoryService.getProductsBySlug(slug)
      .then((res) => {
        // Kiểm tra kỹ cấu trúc response từ Backend
        if (res && res.status) {
            setCategory(res.category);
            setProducts(res.products || []);
        }
      })
      .catch((err) => {
        console.error("Lỗi tải danh mục:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // --- 1. Loading Skeleton ---
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Trường hợp không tìm thấy danh mục (nhưng không lỗi mạng)
  if (!category && !loading) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-zinc-500">
            <Layers size={48} className="mb-4 text-zinc-300"/>
            <p>Không tìm thấy danh mục này.</p>
            <Link href="/" className="mt-4 text-sm font-bold underline">Về trang chủ</Link>
        </div>
      );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- Breadcrumb --- */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 mb-8 overflow-hidden whitespace-nowrap">
          <Link href="/" className="hover:text-zinc-900 flex items-center gap-1 transition-colors">
            <Home size={12} /> Trang chủ
          </Link>
          <ChevronRight size={12} />
          <span className="font-bold text-zinc-900 truncate">
            {category?.name}
          </span>
        </nav>

        {/* --- Header Danh mục --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-zinc-100 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">
              {category?.name}
            </h1>
            <p className="text-zinc-500 text-sm">
              Bộ sưu tập hiện có <span className="font-bold text-zinc-900">{products.length}</span> sản phẩm
            </p>
          </div>
          
          {/* (Optional) Sort Dropdown */}
          <div className="mt-4 md:mt-0">
             {/* Bạn có thể thêm <select> sort ở đây nếu muốn */}
          </div>
        </div>

        {/* --- Danh sách sản phẩm --- */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200 text-center px-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <ShoppingBag size={24} className="text-zinc-300" />
            </div>
            <h3 className="text-zinc-900 font-medium mb-1">Chưa có sản phẩm</h3>
            <p className="text-zinc-500 text-sm mb-6">Danh mục này hiện đang được cập nhật thêm.</p>
            <Link href="/" className="px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold uppercase rounded-full hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
                Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <div key={product.id} className="h-full">
                 {/* Lưu ý: Truyền đúng props vào ProductCard. 
                    Nếu ProductCard nhận `product={product}` thì giữ nguyên.
                 */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}