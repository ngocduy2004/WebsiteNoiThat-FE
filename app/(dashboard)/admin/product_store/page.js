"use client";
import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Package, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Product_StoreService from "../../../../services/Product_StoreService";

export default function Product_storePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState([]);

  // ==========================
  // CALL API
  // ==========================
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await Product_StoreService.getList({
          limit,
          page,
          search,
        });

        if (isMounted && result.status === true) {
          setItems(result.data);
          const total = Math.ceil(result.total / limit);
          setTotalPages(total);
          setPageNumber(Array.from({ length: total }, (_, i) => i + 1));
        }
      } catch (error) {
        console.log("API lỗi:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [limit, page, search]);

  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa phiếu nhập kho này?")) return;

    try {
      const res = await Product_StoreService.delete(id);
      if (res.status) {
        alert("Xóa thành công!");
        setItems(items.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi xóa sản phẩm!");
    }
  };

  // Helper format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-blue-600" /> Quản Lý Nhập Kho
          </h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý danh sách sản phẩm nhập vào kho hàng.</p>
        </div>

        <Link
          href="/admin/product_store/add"
          className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Tạo Phiếu Nhập
        </Link>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            <option value="5">5 dòng</option>
            <option value="10">10 dòng</option>
            <option value="20">20 dòng</option>
            <option value="50">50 dòng</option>
          </select>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-slate-600 text-xs font-bold uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 text-slate-600 text-xs font-bold uppercase tracking-wider">Sản Phẩm</th>
                <th className="py-4 px-6 text-slate-600 text-xs font-bold uppercase tracking-wider">Số Lượng</th>
                <th className="py-4 px-6 text-slate-600 text-xs font-bold uppercase tracking-wider">Ngày Nhập</th>
                <th className="py-4 px-6 text-slate-600 text-xs font-bold uppercase tracking-wider text-right">Hành Động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // SKELETON LOADING
                [...Array(limit)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                    <td className="py-4 px-6"><div className="h-8 bg-slate-200 rounded w-20 float-right"></div></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                // EMPTY STATE
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Package className="w-16 h-16 mb-4 stroke-1" />
                      <p className="text-lg font-medium">Không tìm thấy dữ liệu</p>
                      <p className="text-sm">Hãy thử thay đổi từ khóa tìm kiếm hoặc thêm mới.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // DATA ROWS
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150 group">
                    <td className="py-4 px-6 text-slate-500 font-mono text-sm">#{item.id}</td>
                    
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">{item.product_name}</div>
                      {/* Nếu có giá nhập có thể thêm vào đây */}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        +{item.qty}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-500 text-sm">
                      {formatDate(item.created_at)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/product_store/${item.id}/edit`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
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
        {!loading && items.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <span className="text-sm text-slate-500">
              Trang <span className="font-semibold text-slate-700">{page}</span> / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded border border-slate-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {pageNumber.map((num) => {
                // Logic hiển thị thu gọn nếu quá nhiều trang (Optional: hiện tại hiển thị hết)
                if (totalPages > 10 && Math.abs(num - page) > 2 && num !== 1 && num !== totalPages) return null;
                
                return (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 text-sm rounded border transition ${
                      page === num
                        ? "bg-blue-600 text-white border-blue-600"
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
                className="p-2 rounded border border-slate-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
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