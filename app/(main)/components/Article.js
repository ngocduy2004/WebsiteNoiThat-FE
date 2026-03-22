"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PostService from "../../../services/PostService";

const Article = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const PUBLIC_URL = "http://localhost:8000/storage/";

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await PostService.getList({ limit: 2 });
                if (res && res.status) {
                    setArticles(res.posts || res.data || []);
                }
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const getImageUrl = (path) => {
        if (!path) return "/images/placeholder.jpg";
        if (path.startsWith("http")) return path;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${PUBLIC_URL}${cleanPath}`.replace(/\/+/g, '/').replace(':/', '://');
    };

    // Giao diện Skeleton khi đang tải
    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-14">
                <div className="h-10 w-48 bg-gray-200 animate-pulse mx-auto mb-12 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[1, 2].map((n) => (
                        <div key={n} className="animate-pulse">
                            <div className="aspect-[16/10] bg-gray-200 rounded-2xl mb-6"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
            <div className="flex flex-col items-center mb-16">
                <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
                    Góc Cảm Hứng
                </h2>
                <div className="h-1 w-20 bg-orange-500 mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {articles.map((item) => (
                    <article key={item.id} className="group cursor-pointer">
                        <Link href={`/post/${item.slug || item.id}`}>
                            <div className="relative overflow-hidden rounded-3xl shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                                <div className="relative w-full aspect-[16/9]">
                                    <Image
                                        src={getImageUrl(item.image || item.thumbnail)}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        unoptimized={true}
                                    />
                                    {/* Overlay nhẹ khi hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4 text-center">
                                <h3 className="text-2xl font-bold text-zinc-800 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2 leading-tight">
                                    {item.title}
                                </h3>
                                
                                <p className="text-zinc-600 leading-relaxed line-clamp-3 px-2">
                                    {item.detail || item.description || "Khám phá những câu chuyện thú vị và kiến thức bổ ích ngay tại đây..."}
                                </p>

                                <div className="inline-flex items-center text-orange-500 font-semibold group-hover:gap-3 transition-all">
                                    Đọc thêm
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Article;