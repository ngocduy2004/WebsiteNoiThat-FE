"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit, Trash2, Search, TicketPercent, 
  CalendarRange, ChevronLeft, ChevronRight, Loader2, Tag 
} from "lucide-react";
import ProductSaleService from "../../../../services/ProductSaleService";
import Link from "next/link";

export default function PromotionPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await ProductSaleService.getList({ limit, page, search });
        if (isMounted && result.status) {
          setPromos(result.data);
          const total = Math.ceil(result.total / limit);
          setTotalPages(total);
          setPageNumber(Array.from({ length: total }, (_, i) => i + 1));
        }
      } catch (err) {
        console.log("API lỗi:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false };
  }, [limit, page, search]);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa chương trình khuyến mãi này?")) return;
    try {
      const res = await ProductSaleService.delete(id);
      if (res.status) {
        setPromos(promos.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  // Helper: Xử lý hiển thị trạng thái đẹp hơn
  const getStatusBadge = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
          Sắp diễn ra
        </span>
      );
    }
    if (now > endDate) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
          Đã kết thúc
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
        Đang chạy
      </span>
    );
  };

  // Helper: Format ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TicketPercent className="text-blue-600" /> Quản Lý Khuyến Mãi
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tạo và quản lý các chương trình giảm giá, flash sale.
          </p>
        </div>

        <Link
          href="/admin/promotion/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg font-medium"
        >
          <Plus size={18} />
          Tạo Khuyến Mãi
        </Link>
      </div>

      {/* TOOLBAR (SEARCH & FILTER) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên chương trình..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Hiển thị:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          >
            <option value={5}>5 dòng</option>
            <option value={10}>10 dòng</option>
            <option value={20}>20 dòng</option>
          </select>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-xs border-b border-slate-200">
              <tr>
                <th className="p-4 w-20">ID</th>
                <th className="p-4">Tên Chương Trình</th>
                <th className="p-4 text-center">Sản phẩm</th>
                <th className="p-4 text-center">Thời Gian</th>
                <th className="p-4 text-center">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // SKELETON LOADING
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 rounded w-48 mb-2"></div><div className="h-3 bg-slate-100 rounded w-24"></div></td>
                    <td className="p-4 text-center"><div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div></td>
                    <td className="p-4"><div className="h-6 bg-slate-200 rounded-full w-24 mx-auto"></div></td>
                    <td className="p-4"><div className="h-8 bg-slate-200 rounded w-20 float-right"></div></td>
                  </tr>
                ))
              ) : promos.length === 0 ? (
                // EMPTY STATE
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Tag className="w-16 h-16 mb-4 text-slate-300" />
                      <p className="text-lg font-medium">Chưa có khuyến mãi nào</p>
                      <p className="text-sm">Hãy tạo chương trình khuyến mãi đầu tiên của bạn.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // DATA ROWS
                promos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="p-4 font-mono text-slate-500">#{p.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800 text-base">{p.name}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        {p.items_count || 0} sản phẩm
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1 text-slate-600 text-xs">
                        <div className="flex items-center gap-1">
                            <span className="text-slate-400">Bắt đầu:</span> {formatDate(p.date_begin)}
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-slate-400">Kết thúc:</span> {formatDate(p.date_end)}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {getStatusBadge(p.date_begin, p.date_end)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                            href={`/admin/promotion/${p.id}/edit`} 
                            className="p-2 bg-white border border-slate-200 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition text-slate-500"
                            title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                            onClick={() => handleDelete(p.id)} 
                            className="p-2 bg-white border border-slate-200 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition text-slate-500"
                            title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && promos.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
             <span className="text-sm text-slate-500">
                Trang <span className="font-semibold text-slate-700">{page}</span> / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded border border-slate-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNumber.map((num) => {
                 // Logic hiển thị rút gọn nếu quá nhiều trang (Optional)
                 if (totalPages > 10 && Math.abs(num - page) > 2 && num !== 1 && num !== totalPages) return null;
                 return (
                    <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`px-3 py-1 text-sm rounded border transition ${
                        page === num
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                        }`}
                    >
                        {num}
                    </button>
                 )
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded border border-slate-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
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