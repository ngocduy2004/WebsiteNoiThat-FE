"use client";

import React, { useEffect, useState, Suspense } from "react"; // Thêm Suspense
import { useSearchParams } from "next/navigation";
import ProductService from "../../../services/ProductService";
import cartService from "../../../services/CartService";
import Link from "next/link";
import Banner from "../components/Banner";
import { ShoppingCart, Eye, SearchX } from "lucide-react";

// Tách logic tìm kiếm ra một component riêng
const SearchContent = () => {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("keyword");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const IMAGE_BASE_URL = "http://localhost:8000/storage/";

    useEffect(() => {
        if (keyword) {
            setLoading(true);
            ProductService.getList({
                search: keyword,
                limit: 20,
                filter_stock: true 
            })
            .then((res) => {
                if (res.status) {
                    setProducts(res.data || res.products || []);
                } else {
                    setProducts([]);
                }
            })
            .catch((err) => {
                console.error("Lỗi tìm kiếm:", err);
                setProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [keyword]);

    const handleAddToCart = async (product) => {
        try {
            await cartService.addToCart(product, 1);
            alert("Đã thêm sản phẩm vào giỏ hàng!");
        } catch (error) {
            console.error("Add to cart error:", error);
            alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Kết quả tìm kiếm
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Tìm thấy <span className="text-blue-600 font-bold">{products.length}</span> sản phẩm cho từ khóa <span className="italic text-slate-800">{keyword || "trống"}</span>
                    </p>
                </div>
                <div className="h-1 w-20 bg-blue-600 rounded-full hidden md:block mb-2"></div>
            </div>

            {loading ? (
                /* Skeleton Loading */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse border border-slate-100"></div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                /* Product Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => {
                        const originalPrice = Number(product.price_buy || 0);
                        const salePrice = Number(product.sale_price || 0);
                        const hasSale = salePrice > 0 && salePrice < originalPrice;
                        const finalPrice = hasSale ? salePrice : originalPrice;
                        const discount = hasSale ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;
                        
                        const imageUrl = product.thumbnail
                            ? product.thumbnail.startsWith("http")
                                ? product.thumbnail
                                : `${IMAGE_BASE_URL}${product.thumbnail}`
                            : "https://placehold.co/400x400?text=No+Image";

                        return (
                            <div key={product.id} className="group relative bg-white rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col h-full">
                                <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
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

                                <div className="flex flex-col flex-grow text-center">
                                    <Link href={`/product/${product.id}/detail/`}>
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

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200"
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
                    })}
                </div>
            ) : (
                /* Empty State */
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <SearchX className="text-slate-300" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy sản phẩm</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">
                        Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp cho từ khóa của bạn. Hãy thử một từ khóa khác nhé!
                    </p>
                    <Link href="/" className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                        Quay lại mua sắm
                    </Link>
                </div>
            )}
        </div>
    );
};

// Component chính export ra ngoài
const SearchPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Banner />
            {/* Bọc phần nội dung vào Suspense */}
            <Suspense fallback={<div className="text-center py-20">Đang tải trang tìm kiếm...</div>}>
                <SearchContent />
            </Suspense>
        </div>
    );
};

export default SearchPage;