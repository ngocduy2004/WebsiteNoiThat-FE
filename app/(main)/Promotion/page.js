"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Flame, Zap, ArrowRight, Clock, ShoppingCart, Eye } from "lucide-react"; // Thêm icon ShoppingCart, Eye
import ProductService from "@/services/ProductService";
import cartService from "@/services/CartService"; // Import service giỏ hàng

// Cấu hình URL ảnh
const IMAGE_BASE_URL = "http://localhost:8000/storage/";

export default function SalePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

    // 1. Logic Đếm ngược
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            const diff = target - now;
            if (diff > 0) {
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. Fetch Data
    useEffect(() => {
        const fetchSaleProducts = async () => {
            try {
                setLoading(true);
                const res = await ProductService.getSaleProducts();
                const data = res.data?.data || res.data || [];
                setProducts(data);
            } catch (err) {
                console.error("Lỗi fetch:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSaleProducts();
    }, []);

    // 3. Hàm thêm vào giỏ hàng
    const handleAddToCart = async (product) => {
        try {
            await cartService.addToCart(product, 1);
            alert("Đã thêm sản phẩm vào giỏ hàng!");
        } catch (error) {
            console.error("Lỗi thêm giỏ hàng:", error);
            alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
        }
    };

    const getImageUrl = (url) => {
        if (!url) return "https://placehold.co/400x400?text=No+Image";
        if (url.startsWith("http")) return url;
        return `${IMAGE_BASE_URL}${url}`;
    };

    const mainSaleName = products.length > 0 ? (products[0].sale_name || "FLASH SALE") : "SĂN SALE";

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* HERO BANNER */}
            <div className="relative overflow-hidden bg-[#0F172A] py-16 lg:py-20 text-white">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/30 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-sm font-bold mb-6 animate-pulse">
                        <Flame size={18} className="text-orange-500 fill-orange-500" />
                        GIỜ VÀNG ĐÃ ĐIỂM
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight uppercase italic">
                        {mainSaleName} <span className="text-orange-500 text-outline">CỰC CHÁY</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
                        Cơ hội duy nhất trong ngày để sở hữu siêu phẩm với giá hủy diệt.
                    </p>
                    <div className="flex justify-center gap-4">
                        {[{ val: timeLeft.hours, label: 'Giờ' }, { val: timeLeft.minutes, label: 'Phút' }, { val: timeLeft.seconds, label: 'Giây' }].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="bg-white/10 border border-white/20 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-bold backdrop-blur-sm shadow-xl">
                                    {String(item.val).padStart(2, '0')}
                                </div>
                                <span className="text-[10px] md:text-xs mt-2 text-gray-400 font-bold uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                {/* Header Bar */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-100 p-3 rounded-xl">
                            <Zap className="text-orange-600 w-8 h-8" fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase italic">Flash Deals</h2>
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <Clock size={14} /> Kết thúc sau {timeLeft.hours}h {timeLeft.minutes}p
                            </p>
                        </div>
                    </div>
                    <div className="px-5 py-2 bg-gray-900 text-white rounded-full font-bold text-sm shadow-lg shadow-gray-200">
                        {products.length} SẢN PHẨM ĐANG SALE
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {loading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                                <div className="bg-gray-200 aspect-[4/5] rounded-xl mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))
                    ) : products.length > 0 ? (
                        products.map((p) => {
                            const priceOriginal = Number(p.price_buy || p.price || 0);
                            const priceSale = Number(p.sale_price || p.pricesale || 0);
                            const discount = (priceOriginal > 0 && priceSale > 0) ? Math.round(((priceOriginal - priceSale) / priceOriginal) * 100) : 0;
                            const soldPercent = Math.floor(Math.random() * (95 - 40) + 40);

                            return (
                                <div key={p.id} className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 flex flex-col h-full relative overflow-hidden">

                                    {/* Ảnh & Badge */}
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-50 mb-4 group">
                                        <Link href={`/product/${p.slug || p.id}`}>
                                            <img
                                                src={getImageUrl(p.thumbnail || p.thumbnail_url)}
                                                alt={p.name}
                                                className="w-full h-full object-contain mix-blend-multiply p-4 transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => e.target.src = "https://placehold.co/400x400?text=No+Image"}
                                            />
                                        </Link>

                                        {discount > 0 && (
                                            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-black px-2 py-1 rounded-bl-xl shadow-sm z-10">-{discount}%</div>
                                        )}

                                        <div className="absolute top-2 left-2 bg-orange-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300 z-10">
                                            <Zap size={14} fill="currentColor" />
                                        </div>

                                        {/* Action Buttons Overlay */}
                                        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-4 z-20">
                                            <button
                                                onClick={() => handleAddToCart(p)}
                                                className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-orange-600 transition-colors shadow-lg"
                                            >
                                                <ShoppingCart size={14} /> Thêm
                                            </button>
                                            <Link
                                                href={`/product/${p.id}/detail/`}
                                                className="p-2 bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Thông tin sản phẩm */}
                                    <div className="flex flex-col flex-grow">
                                        <div className="mb-2">
                                            <p className="text-[10px] font-bold text-orange-600 tracking-widest uppercase mb-1">{p.sale_name || "FLASHSALE"}</p>
                                            <Link href={`/product/${p.slug || p.id}`}>
                                                <h3 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2 hover:text-blue-600 transition-colors" title={p.name}>{p.name}</h3>
                                            </Link>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex flex-wrap items-baseline gap-2 mb-3">
                                                <span className="text-lg font-black text-red-600">{priceSale.toLocaleString('vi-VN')}₫</span>
                                                {priceOriginal > priceSale && (
                                                    <span className="text-gray-400 line-through text-xs font-medium">{priceOriginal.toLocaleString('vi-VN')}₫</span>
                                                )}
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="relative h-3 bg-gray-100 rounded-full mb-1 overflow-hidden border border-gray-100">
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${soldPercent}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-gray-500 font-medium mb-3">
                                                <span>Đã bán {soldPercent}%</span>
                                                <span className="text-orange-600 font-bold">Sắp cháy hàng</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-24 text-center bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Chương trình đã kết thúc</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">Vui lòng quay lại sau.</p>
                            <Link href="/" className="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-transform hover:scale-105">
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}