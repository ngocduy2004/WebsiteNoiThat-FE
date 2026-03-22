"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Filter, Package, ChevronRight, ChevronLeft } from "lucide-react";
import ProductService from "../../../../services/ProductService";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10); // Mặc định 10 cho chuyên nghiệp
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState([]);

  // Hàm gom nhóm thuộc tính (giữ nguyên logic của bạn)
  const groupAttributes = (productAttributes = []) => {
    return Object.values(
      productAttributes.reduce((acc, item) => {
        const name = item.attribute?.name;
        if (!name) return acc;
        if (!acc[name]) {
          acc[name] = { name, values: [] };
        }
        acc[name].values.push(item.value);
        return acc;
      }, {})
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await ProductService.getList({ limit, page, search });
        if (result?.status) {
          setProducts(result.data || []);
          const totalPages = Math.ceil((result.total || 0) / limit);
          setPageNumber(Array.from({ length: totalPages }, (_, i) => i + 1));
        }
      } catch (error) {
        console.error("API lỗi:", error);
      }
    };
    fetchProducts();
  }, [limit, page, search]);

  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      const res = await ProductService.delete(id);
      if (res?.status) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert("Lỗi xóa sản phẩm!");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="text-blue-600" /> Quản lý sản phẩm
          </h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý kho hàng và thông tin sản phẩm của bạn.</p>
        </div>

        <Link
          href="/admin/products/add"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm mới
        </Link>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 border-l pl-4 border-slate-200">
          <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Hiển thị:</span>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value={5}>5 mục</option>
            <option value={10}>10 mục</option>
            <option value={20}>20 mục</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Giá nhập</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thuộc tính</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">#{p.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-100 shrink-0">
                          {p.thumbnail_url ? (
                            <img src={p.thumbnail_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 uppercase">No Img</div>
                          )}
                        </div>
                        <span className="font-semibold text-slate-700 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">
                        {Number(p.price_buy || 0).toLocaleString()} <span className="text-[10px] font-normal">đ</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                        {p.category?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        {groupAttributes(p.product_attributes).map((attr, i) => (
                          <div key={i} className="text-slate-500">
                            <span className="font-semibold text-slate-600">{attr.name}:</span> {attr.values.join(", ")}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.status === 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${p.status === 1 ? "bg-emerald-500" : "bg-red-500"}`}></span>
                        {p.status === 1 ? "Hoạt động" : "Tạm ẩn"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4.5 h-4.5" />
                        </Link>
                        <button
                          onClick={() => deleteItem(p.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                    Không tìm thấy sản phẩm nào...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Hiển thị trang {page} / {pageNumber.length}
          </p>
          <div className="flex gap-1">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pageNumber.map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                  page === num
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {num}
              </button>
            ))}
            <button 
              disabled={page === pageNumber.length}
              onClick={() => setPage(p => Math.min(pageNumber.length, p + 1))}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}