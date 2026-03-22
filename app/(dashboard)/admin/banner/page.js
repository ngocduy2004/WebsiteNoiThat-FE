"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
    Plus, Edit, Trash2, Search, Filter,
    Image as ImageIcon, Eye, ExternalLink, Loader2,
    ChevronLeft, ChevronRight, MoreHorizontal
} from "lucide-react";
import BannerService from "../../../../services/BannerService";

export default function BannerList() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Helper xử lý ảnh
    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/600x300?text=No+Image";
        if (path.startsWith("http")) return path;
        const backendUrl = "http://localhost:8000";
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${backendUrl}${cleanPath}`;
    };

    const fetchBanners = useCallback(async () => {
        setLoading(true);
        try {
            const res = await BannerService.getList({
                page: page,
                limit: limit,
                search: debouncedSearch
            });

            let data = [];
            if (res && res.data) {
                data = Array.isArray(res.data) ? res.data : (res.data.data || []);
                if (res.total || res.data.total) {
                    setTotal(res.total || res.data.total);
                }
            } else if (Array.isArray(res)) {
                data = res;
            }
            setBanners(data);
        } catch (err) {
            console.error("Lỗi lấy banner:", err);
        } finally {
            setLoading(false);
        }
    }, [page, limit, debouncedSearch]);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa banner này?")) return;
        try {
            await BannerService.delete(id);
            fetchBanners();
        } catch (e) {
            alert("Lỗi khi xóa!");
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        <ImageIcon className="text-indigo-600 w-7 h-7" /> Quản lý Banner
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Cấu hình hình ảnh quảng cáo và sự kiện trên website.</p>
                </div>

                <Link
                    href="/admin/banner/add"
                    className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all active:scale-95 gap-2"
                >
                    <Plus className="w-5 h-5" /> THÊM BANNER
                </Link>
            </div>

            {/* TOOLBAR */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên banner..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 border-l pl-4 border-slate-200">
                    <span className="text-sm text-slate-500 font-medium">Số dòng:</span>
                    <select
                        className="bg-slate-50 border border-slate-200 text-sm font-semibold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                        <option value="5">05 dòng</option>
                        <option value="10">10 dòng</option>
                        <option value="20">20 dòng</option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shadow-indigo-100/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Preview</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thông tin</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Vị trí</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                                            <span className="text-slate-500 font-medium italic">Đang tải dữ liệu banner...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : banners.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">
                                        Không tìm thấy banner nào phù hợp.
                                    </td>
                                </tr>
                            ) : banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="relative w-32 h-16 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group-hover:shadow-md transition-all duration-300">
                                            <img
                                                src={getImageUrl(banner.image || banner.image_url)}
                                                alt={banner.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://placehold.co/100x50?text=Error";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <a href={getImageUrl(banner.image || banner.image_url)} target="_blank" rel="noreferrer">
                                                    <Eye className="w-6 h-6 text-white" />
                                                </a>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 text-base">{banner.name}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-mono">ID: #{banner.id}</span>
                                                {banner.link && (
                                                    <a href={banner.link} target="_blank" className="text-xs text-indigo-500 hover:underline flex items-center gap-1">
                                                        <ExternalLink className="w-3 h-3" /> Xem đích đến
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] font-bold border border-indigo-100">
                                            {banner.position || "HOME_TOP"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {banner.status === 1 ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Hiển thị
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200 uppercase">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Tạm ẩn
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-1">
                                            <Link href={`/admin/banner/${banner.id}/edit`}>
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Chỉnh sửa">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(banner.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Xóa banner"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span className="text-xs text-slate-500 font-medium">
                            Hiển thị trang <b className="text-slate-900">{page}</b> / {totalPages} (Tổng {total} banners)
                        </span>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex gap-1 mx-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                                    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                                          ${p === page
                                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                                        : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                                                    }
                                      `}
                                            >
                                                {p}
                                            </button>
                                        );
                                    } else if (p === page - 2 || p === page + 2) {
                                        return <span key={p} className="flex items-end px-1 text-slate-400 font-bold">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}