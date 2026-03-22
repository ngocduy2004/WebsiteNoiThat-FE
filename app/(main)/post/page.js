"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, User, ArrowRight, Search, Clock, Sparkles, 
  LayoutGrid, Sofa, Bed, Utensils, Briefcase 
} from "lucide-react";
import PostService from "@/services/PostService";

const IMAGE_BASE_URL = "http://localhost:8000/storage/";

// Cập nhật danh sách Category với các ID tương ứng trong Database/Slug của bạn
const CATEGORIES = [
  { id: "all", name: "Tất cả", icon: <LayoutGrid size={16} /> },
  { id: "phong-khach", name: "Phòng khách", icon: <Sofa size={16} /> },
  { id: "phong-ngu", name: "Phòng ngủ", icon: <Bed size={16} /> },
  { id: "phong-an", name: "Phòng ăn", icon: <Utensils size={16} /> },
  { id: "van-phong", name: "Văn phòng", icon: <Briefcase size={16} /> },
];

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchPosts = async (keyword = "", topicId = "all") => {
    try {
      setLoading(true);
      // Giả sử API của bạn nhận tham số 'topic' hoặc 'slug'
      const params = { status: 1, limit: 15 };
      if (keyword) params.search = keyword;

      const res = await PostService.getList(params);
      let data = res.data?.data || res.data || [];

      // Logic lọc phía Client (Nếu backend chưa hỗ trợ filter topic trực tiếp)
      if (topicId !== "all") {
        data = data.filter(post => {
          const postTopicSlug = post.topic?.slug || "";
          const postTopicName = post.topic?.name?.toLowerCase() || "";
          
          // Kiểm tra khớp slug hoặc chứa từ khóa tên phòng
          return postTopicSlug === topicId || 
                 postTopicName.includes(topicId.replace('-', ' '));
        });
      }

      setPosts(data);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(search, activeTab);
  }, [activeTab]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(search, activeTab);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/800x600?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${IMAGE_BASE_URL}${imagePath}`;
  };

  const featuredPost = posts.length > 0 && activeTab === "all" && !search ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-12 md:py-20 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 uppercase tracking-wider">
            <Sparkles size={14} /> Tạp chí nội thất
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-8">
            Khám phá không gian <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">đáng sống</span>
          </h1>
          
          {/* Thanh Tìm Kiếm */}
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-12 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, ý tưởng..."
              className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 transition-all shadow-sm outline-none text-slate-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* 2. BỘ LỌC DANH MỤC (Responsive) */}
          <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-4 px-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                  activeTab === cat.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100 translate-y-[-2px]"
                    : "bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-blue-50/30"
                }`}
              >
                <span className={activeTab === cat.id ? "text-white" : "text-blue-500"}>
                  {cat.icon}
                </span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {/* 3. BÀI VIẾT NỔI BẬT */}
            {featuredPost && (
              <section className="mb-16">
                <Link href={`/post/${featuredPost.slug || featuredPost.id}`} className="group relative block rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-100">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-72 md:h-[500px] overflow-hidden">
                      <img
                        src={getImageUrl(featuredPost.image)}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full tracking-widest">
                           Tin nổi bật
                        </span>
                      </div>
                    </div>
                    <div className="p-8 md:p-14 flex flex-col justify-center bg-white">
                      <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase mb-4">
                         <span className="w-8 h-[2px] bg-blue-600"></span>
                         {featuredPost.topic?.name || "Cảm hứng"}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-500 text-lg mb-10 line-clamp-3 leading-relaxed">
                        {featuredPost.description}
                      </p>
                      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white font-bold shadow-lg">A</div>
                           <div>
                              <p className="text-sm font-black text-slate-900">Ban biên tập</p>
                              <p className="text-xs text-slate-400 font-medium">Đăng ngày {new Date(featuredPost.created_at).toLocaleDateString('vi-VN')}</p>
                           </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                           <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* 4. LƯỚI BÀI VIẾT (Giao diện Card mới) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {gridPosts.map((post) => (
                <article key={post.id} className="group flex flex-col h-full">
                  <Link href={`/post/${post.slug || post.id}`} className="relative h-64 mb-6 block overflow-hidden rounded-[2rem] shadow-lg">
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                  
                  <div className="flex flex-col flex-grow px-2">
                    <div className="flex items-center gap-3 mb-3">
                       <span className="text-[10px] font-black uppercase tracking-tighter text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {post.topic?.name || "Phòng đẹp"}
                       </span>
                       <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> {new Date(post.created_at).toLocaleDateString('vi-VN')}
                       </span>
                    </div>

                    <Link href={`/post/${post.slug || post.id}`}>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold italic">A</div>
                         <span className="text-[11px] font-bold text-slate-700">Admin</span>
                      </div>
                      <Link href={`/post/${post.slug || post.id}`} className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-3 transition-all">
                        Xem tiếp <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* TRẠNG THÁI RỖNG */}
            {posts.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6">
                  <Search className="text-slate-300" size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Chưa tìm thấy bài viết</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  Hiện tại chuyên mục này đang được cập nhật thêm nội dung. Bạn hãy quay lại sau nhé!
                </p>
                <button 
                   onClick={() => setActiveTab("all")}
                   className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors"
                >
                  Xem các bài viết khác
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}