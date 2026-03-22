"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductService from "@/services/ProductService";
import cartService from "../../../../../services/CartService"; // Chỉnh lại đường dẫn import cho đúng dự án của bạn
import {
  ShieldCheck, Truck, Plus, Minus, ChevronRight, Heart, Share2, CheckCircle2
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    ProductService.getById(id)
      .then((res) => {
        const data = res.data;
        setProduct(data);
        // Ưu tiên thumbnail_url, nếu không có lấy thumbnail
        setMainImage(data.thumbnail_url || data.thumbnail);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết sản phẩm", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000);
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-10 h-10 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mb-4"></div>
    </div>
  );

  if (!product) return <div className="text-center pt-20">Sản phẩm không tồn tại</div>;

  // --- LOGIC GIÁ ---
  const originalPrice = Number(product.price_buy || 0);
  const salePrice = Number(product.sale_price || 0);
  const hasSale = salePrice > 0 && salePrice < originalPrice;
  const finalPrice = hasSale ? salePrice : originalPrice;
  // ----------------

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-10 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link href="/products" className="hover:text-black transition-colors">Sản phẩm</Link>
          <ChevronRight size={10} />
          <span className="text-zinc-900 font-bold truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-20">
          
          {/* LEFT: GALLERY */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/3] bg-zinc-50 overflow-hidden group rounded-2xl border border-zinc-100">
                {/* Badge Sale trên ảnh lớn */}
                {hasSale && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                        SALE
                    </div>
                )}
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-contain p-4 transition-transform duration-1000 group-hover:scale-105" 
              />
            </div>

            <div className="grid grid-cols-5 gap-3">
               {/* Nút ảnh Thumbnail chính */}
                <button 
                  onClick={() => setMainImage(product.thumbnail_url || product.thumbnail)} 
                  className={`aspect-square border rounded-lg p-1 transition-all overflow-hidden ${mainImage === (product.thumbnail_url || product.thumbnail) ? 'border-zinc-900 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-400'}`}
                >
                  <img src={product.thumbnail_url || product.thumbnail} className="w-full h-full object-contain" alt="thumbnail" />
                </button>
                
                {/* List ảnh gallery (kiểm tra tồn tại mảng images) */}
                {product.images?.slice(0, 4).map((img, idx) => (
                  <button 
                    key={img.id || idx} 
                    onClick={() => setMainImage(img.image_url || img.image)} 
                    className={`aspect-square border rounded-lg p-1 transition-all overflow-hidden ${mainImage === (img.image_url || img.image) ? 'border-zinc-900 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-400'}`}
                  >
                    <img src={img.image_url || img.image} className="w-full h-full object-contain" alt="gallery" />
                  </button>
                ))}
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="lg:col-span-5 flex flex-col justify-start pt-4">
            <div className="mb-8">
              <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-3 flex-wrap">
                <span className={`text-3xl font-bold ${hasSale ? 'text-red-600' : 'text-zinc-900'}`}>
                  {finalPrice.toLocaleString("vi-VN")}₫
                </span>
                
                {hasSale && (
                    <div className="flex flex-col mb-1">
                        <span className="text-lg text-zinc-400 line-through decoration-zinc-400">
                            {originalPrice.toLocaleString("vi-VN")}₫
                        </span>
                    </div>
                )}
              </div>
               {hasSale && (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded mt-2 inline-block font-semibold">
                        Tiết kiệm: {(originalPrice - finalPrice).toLocaleString("vi-VN")}₫
                    </span>
                )}
            </div>

            <div className="w-full h-[1px] bg-zinc-100 mb-8"></div>

            {/* Attributes */}
            <div className="space-y-6 mb-10">
              {product.product_attributes?.map((attr, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                      {attr.attribute?.name || "Thuộc tính"}
                    </span>
                  </div>
                   {/* Giả sử value là string đơn, nếu là mảng thì map tiếp */}
                   <div className="inline-block px-4 py-2 text-sm border border-zinc-900 bg-zinc-900 text-white min-w-[60px] text-center rounded-md">
                        {attr.value}
                    </div>
                </div>
              ))}
              {/* Fallback cho formatted_attributes nếu dùng cấu trúc cũ */}
              {product.formatted_attributes?.map((attr, index) => (
                 <div key={index + 'old'} className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">{attr.name}</span>
                    <div className="flex gap-2">
                        {attr.values?.map((val, i) => (
                             <div key={i} className="px-4 py-2 border text-sm rounded">{val}</div>
                        ))}
                    </div>
                 </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-zinc-300 rounded-xl h-12 w-32 shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center hover:bg-zinc-100 rounded-l-xl"><Minus size={16}/></button>
                  <span className="flex-1 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-zinc-100 rounded-r-xl"><Plus size={16}/></button>
                </div>
                
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden shadow-lg ${
                    isAdded ? 'bg-green-600 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                  }`}
                >
                   <span className="flex items-center justify-center gap-2">
                      {isAdded ? <><CheckCircle2 size={18} /> Đã thêm</> : "Thêm vào giỏ hàng"}
                   </span>
                </button>
              </div>

              <div className="flex gap-4">
                 <button className="flex-1 flex items-center justify-center gap-2 h-10 border border-zinc-200 rounded-lg text-xs uppercase font-bold hover:bg-zinc-50">
                   <Share2 size={14} /> Chia sẻ
                 </button>
                 <button className="flex-1 flex items-center justify-center gap-2 h-10 border border-zinc-200 rounded-lg text-xs uppercase font-bold hover:bg-zinc-50 text-zinc-500 hover:text-red-500">
                   <Heart size={14} /> Yêu thích
                 </button>
              </div>
            </div>

            {/* Policy */}
            <div className="mt-10 grid grid-cols-1 gap-4 bg-zinc-50 p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <Truck size={24} className="text-zinc-800"/>
                <div><h4 className="text-xs font-bold uppercase">Miễn phí vận chuyển</h4><p className="text-xs text-zinc-500">Đơn hàng trên 2.000.000₫</p></div>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck size={24} className="text-zinc-800"/>
                <div><h4 className="text-xs font-bold uppercase">Bảo hành chính hãng</h4><p className="text-xs text-zinc-500">Hỗ trợ đổi trả trong 30 ngày</p></div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-10 pt-10 border-t border-zinc-100">
                 <h3 className="text-sm font-bold uppercase mb-4">Mô tả sản phẩm</h3>
                 <div className="prose prose-sm text-zinc-600 max-w-none" dangerouslySetInnerHTML={{ __html: product.description || "Đang cập nhật..." }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}