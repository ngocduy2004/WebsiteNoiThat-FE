"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft, Tag, Share2 } from "lucide-react";
import PostService from "@/services/PostService";

// Cấu hình URL ảnh
const IMAGE_BASE_URL = "http://localhost:8000/storage/";

export default function PostDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await PostService.getDetail(slug);
        // Xử lý dữ liệu trả về linh hoạt (Axios wrapper hoặc raw)
        const apiData = (res.status === 200 && res.data) ? res.data : res;
        
        if (apiData.status || apiData.data) {
             setPost(apiData.data || apiData);
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchDetail();
  }, [slug]);

  // Helper xử lý ảnh
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${IMAGE_BASE_URL}${imagePath}`;
  };

  // --- SKELETON LOADING UI ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-10 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="w-24 h-8 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
          <div className="w-3/4 h-10 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
          <div className="w-1/2 h-10 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
          <div className="flex gap-4 mb-8">
             <div className="w-32 h-6 bg-gray-200 rounded-full animate-pulse"></div>
             <div className="w-32 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="w-full h-96 bg-gray-200 rounded-2xl mb-10 animate-pulse"></div>
          <div className="space-y-4">
             <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
             <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
             <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- NOT FOUND UI ---
  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h2>
        <p className="text-gray-500 mb-6">Bài viết này có thể đã bị xóa hoặc đường dẫn không đúng.</p>
        <Link 
            href="/post" 
            className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
        >
            Quay lại Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* HEADER IMAGE BACKGROUND (Optional aesthetics) */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-white -z-10 opacity-50"></div>

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        
        {/* 1. NAVIGATION */}
        <div className="mb-8">
            <Link 
                href="/post" 
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group"
            >
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Quay lại danh sách
            </Link>
        </div>

        {/* 2. META INFO (Topic) */}
        <div className="flex items-center justify-between mb-6">
            {post.topic && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                    <Tag size={12} /> {post.topic.name}
                </span>
            )}
            <button className="text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100" title="Chia sẻ">
                <Share2 size={18} />
            </button>
        </div>

        {/* 3. MAIN TITLE */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {post.title}
        </h1>

        {/* 4. AUTHOR & DATE */}
        <div className="flex items-center gap-6 border-b border-gray-100 pb-8 mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                    <User size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">Quản trị viên</p>
                    <p className="text-xs text-gray-500">Tác giả</p>
                </div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={16} className="text-gray-400" />
                <span>{new Date(post.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>

        {/* 5. FEATURED IMAGE */}
        {post.image && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-10 bg-gray-100">
                <img 
                    src={getImageUrl(post.image)} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
            </div>
        )}

        {/* 6. CONTENT BODY */}
        {/* 'prose' class comes from @tailwindcss/typography plugin. 
            If not installed, standard styling will still apply broadly. */}
        <article className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
            {/* Description (Intro) */}
            {post.description && (
                <div className="text-xl font-medium text-gray-500 mb-8 not-prose border-l-4 border-blue-500 pl-4 italic">
                    {post.description}
                </div>
            )}

            {/* Main HTML Content */}
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </article>

        {/* 7. FOOTER SECTION */}
        <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-center text-gray-400 text-sm italic">
                Cảm ơn bạn đã đọc bài viết này!
            </p>
        </div>

      </div>
    </div>
  );
}