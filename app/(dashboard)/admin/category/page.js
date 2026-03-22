"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Folder, FolderTree } from "lucide-react";
import CategoryService from "../../../../services/CategoryService";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState([]);

  // ==========================
  // CALL API
  useEffect(() => {
    (async () => {
      try {
        const result = await CategoryService.getList({ limit, page, search });
        if (result.status === true) {
          setCategories(result.data);
          const totalPages = Math.ceil(result.total / limit);
          setPageNumber(Array.from({ length: totalPages }, (_, i) => i + 1));
        }
      } catch (error) {
        console.error("API lỗi:", error);
      }
    })();
  }, [limit, page, search]);

  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      const res = await CategoryService.delete(id);
      if (res.status) {
        alert("Xóa danh mục thành công!");
        setCategories(categories.filter((cat) => cat.id !== id));
      }
    } catch (err) {
      alert("Lỗi xóa danh mục!");
    }
  };

  // ==========================
  // LOGIC XỬ LÝ CÂY DANH MỤC
  // Sử dụng useMemo để tối ưu hiệu năng khi re-render
  const categoryTree = useMemo(() => {
    const buildTree = (list, parentId = null) => {
      return list
        .filter((item) => item.parent_id === parentId)
        .map((item) => ({
          ...item,
          children: buildTree(list, item.id),
        }));
    };
    return buildTree(categories);
  }, [categories]);

  // ==========================
  // RENDER DÒNG CỦA BẢNG (ĐỆ QUY)
  const renderCategoryRow = (cat, level = 0) => (
    <React.Fragment key={cat.id}>
      <tr className="hover:bg-blue-50 transition-colors border-b border-gray-100">
        <td className="py-4 px-4 text-sm text-gray-500 font-mono">#{cat.id}</td>
        <td className="py-4 px-4">
          <div className="flex items-center" style={{ marginLeft: `${level * 24}px` }}>
            {level > 0 && (
              <span className="text-gray-400 mr-2 font-mono">└─</span>
            )}
            {cat.children && cat.children.length > 0 ? (
              <FolderTree className="w-4 h-4 mr-2 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-gray-400" />
            )}
            <span className={`${level === 0 ? "font-semibold text-gray-800" : "text-gray-600"}`}>
              {cat.name}
            </span>
          </div>
        </td>
        <td className="py-4 px-4 text-sm text-gray-500 italic">{cat.slug}</td>
        <td className="py-4 px-4 text-sm text-gray-600 truncate max-w-xs">
            {cat.description || "---"}
        </td>
        <td className="py-4 px-4 flex gap-3">
          <Link
            href={`/admin/category/${cat.id}/edit`}
            className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition shadow-sm"
            title="Sửa"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => deleteItem(cat.id)}
            className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition shadow-sm"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      </tr>
      {cat.children && cat.children.map((child) => renderCategoryRow(child, level + 1))}
    </React.Fragment>
  );

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản Lý Danh Mục</h1>
          <p className="text-slate-500 text-sm">Sắp xếp và tổ chức danh mục sản phẩm của bạn.</p>
        </div>

        <Link
          href="/admin/category/add"
          className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5 mr-2" /> 
          <span className="font-medium">Thêm Danh Mục</span>
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative flex-1 min-w-[300px]">
            <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
        </div>

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="bg-slate-50 border border-slate-200 text-slate-600 py-2 px-4 rounded-lg focus:outline-none"
        >
          <option value="5">5 dòng</option>
          <option value="10">10 dòng</option>
          <option value="20">20 dòng</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">ID</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên Danh Mục</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {categoryTree.length > 0 ? (
              categoryTree.map((cat) => renderCategoryRow(cat))
            ) : (
              <tr>
                <td colSpan="5" className="py-20 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <Folder className="w-12 h-12 mb-2 opacity-20" />
                    <p>Không tìm thấy danh mục nào</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pageNumber.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
            {pageNumber.map((num) => (
            <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                page === num 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
            >
                {num}
            </button>
            ))}
        </div>
      )}
    </div>
  );
}