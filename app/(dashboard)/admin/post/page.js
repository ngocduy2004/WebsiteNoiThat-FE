"use client";
import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Search, Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import PostService from "@/services/PostService";
import Link from "next/link";

// URL ảnh backend
const IMAGE_BASE_URL = "http://localhost:8000/storage/";

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // ==========================
  // CALL API
  // ==========================
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await PostService.getList({
          limit,
          page,
          search,
        });

        // Xử lý dữ liệu trả về từ API (Axios wrapper hoặc raw)
        const apiData = (result.status === 200 && result.data) ? result.data : result;

        if (apiData.status) {
          setPosts(apiData.data);
          const total = apiData.total || apiData.meta?.total || 0;
          setTotalPages(Math.ceil(total / limit));
        }
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [limit, page, search]);

  // Xóa bài viết
  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.")) return;

    try {
      const res = await PostService.delete(id);
      if (res.data?.status || res.status) {
        alert("✅ Xóa bài viết thành công!");
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        alert("❌ Xóa thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi xóa bài viết!");
    }
  };

  // Helper hiển thị ảnh
  const getImageUrl = (url) => {
    if (!url) return "https://placehold.co/100x100?text=No+Image";
    if (url.startsWith("http")) return url;
    return IMAGE_BASE_URL + url;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Bài Viết</h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách tất cả bài viết và trang tin tức.</p>
        </div>
        <Link
          href="/admin/post/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
        >
          <Plus size={18} /> Thêm Bài Viết
        </Link>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm text-gray-500 whitespace-nowrap">Hiển thị:</span>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="5">5 dòng</option>
            <option value="10">10 dòng</option>
            <option value="20">20 dòng</option>
            <option value="50">50 dòng</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">#ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Hình ảnh</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thông tin bài viết</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Chủ đề</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : posts.length > 0 ? (
                posts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 text-sm text-gray-500">#{p.id}</td>
                    <td className="py-4 px-6">
                      <div className="w-16 h-12 rounded overflow-hidden border border-gray-200">
                        <img 
                          src={getImageUrl(p.image)} 
                          alt={p.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-1" title={p.title}>{p.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{p.description || "Chưa có mô tả"}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          {p.post_type === 'page' ? 'Trang đơn' : 'Bài viết'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(p.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {p.topic ? (
                        <span className="text-sm text-blue-600 font-medium">{p.topic.name}</span>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Không có</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${p.status === 1 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {p.status === 1 ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/post/${p.id}/edit`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition tooltip"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteItem(p.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition tooltip"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    Không tìm thấy bài viết nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER / PAGINATION */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Trang <span className="font-semibold text-gray-900">{page}</span> / {totalPages}
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>
            
            {/* Page Numbers */}
            <div className="hidden md:flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                 // Chỉ hiển thị các trang gần trang hiện tại để không bị dài quá
                 if (num === 1 || num === totalPages || (num >= page - 1 && num <= page + 1)) {
                    return (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition
                          ${page === num 
                            ? "bg-blue-600 text-white shadow-sm" 
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {num}
                      </button>
                    );
                 } else if (num === page - 2 || num === page + 2) {
                    return <span key={num} className="px-1 text-gray-400">...</span>
                 }
                 return null;
              })}
            </div>

            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}