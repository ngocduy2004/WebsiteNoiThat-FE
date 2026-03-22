"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryService from "../../../services/CategoryService";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const IMAGE_BASE_URL = "http://localhost/CDTT_Backend/public/uploads/category/";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await CategoryService.getTree();
        if (result.status) setCategories(result.data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Skeleton Loading (Hiệu ứng khi đang tải)
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-8 px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[400px] bg-gray-200 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h5 className="text-2xl font-bold text-gray-800 mb-5 text-center uppercase tracking-wide">
          Danh mục sản phẩm
        </h5>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories && categories.map((cat, index) => (
            <Link
              key={cat.id || index}
              href={`/category/${cat.slug}`}
              className="group relative h-[450px] w-full overflow-hidden rounded-2xl shadow-lg cursor-pointer"
            >
              {/* Hình ảnh nền */}
              <Image
                src={cat.image ? `${IMAGE_BASE_URL}${cat.image}` : "/images/placeholder.jpg"}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 25vw"
                unoptimized={true}
              />

              {/* Lớp phủ Gradient đen mờ từ dưới lên */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>

              {/* Nội dung chữ */}
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                <div className="flex items-center gap-2 text-sm font-medium text-white/80 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-yellow-400">
                  <span>Xem ngay</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;