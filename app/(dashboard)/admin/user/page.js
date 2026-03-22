"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, User } from "lucide-react"; // Thêm icon User dự phòng
import UserService from "../../../../services/UserService";
import Link from "next/link";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [pageNumber, setPageNumber] = useState([]);

  // URL gốc của Backend để hiển thị ảnh
  const BACKEND_URL = "http://localhost:8000"; 

  useEffect(() => {
    (async () => {
      try {
        const result = await UserService.getList({
          limit,
          page,
          search,
        });

        if (result.status === true) {
          setUsers(result.data);
          const totalPages = Math.ceil(result.total / limit);
          setPageNumber(Array.from({ length: totalPages }, (_, i) => i + 1));
        }
      } catch (error) {
        console.log("API lỗi:", error);
      }
    })();
  }, [limit, page, search]);

  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const res = await UserService.delete(id);
      if (res.status) {
        alert("Xóa người dùng thành công!");
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi xóa người dùng!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Thành Viên</h1>
          <p className="text-sm text-gray-500">Danh sách người dùng hệ thống</p>
        </div>
        <Link
          href="/admin/user/add"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="w-5 h-5" /> Thêm Thành viên
        </Link>
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px]">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border border-gray-300 px-4 py-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="5">Hiển thị 5 dòng</option>
          <option value="10">Hiển thị 10 dòng</option>
          <option value="20">Hiển thị 20 dòng</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 text-gray-600 text-xs font-semibold uppercase tracking-wider">#</th>
              <th className="py-4 px-6 text-gray-600 text-xs font-semibold uppercase tracking-wider">Thành viên</th>
              <th className="py-4 px-6 text-gray-600 text-xs font-semibold uppercase tracking-wider">Email</th>
              <th className="py-4 px-6 text-gray-600 text-xs font-semibold uppercase tracking-wider">Vai Trò</th>
              <th className="py-4 px-6 text-gray-600 text-xs font-semibold uppercase tracking-wider">Trạng Thái</th>
              <th className="py-4 px-6 text-gray-600 text-xs font-semibold uppercase tracking-wider text-right">Thao Tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-blue-50/30 transition">
                <td className="py-4 px-6 text-sm text-gray-500">{u.id}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {/* HIỆN AVATAR Ở ĐÂY */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-100 shadow-sm">
                      {u.avatar ? (
                        <img 
                          src={`${BACKEND_URL}/${u.avatar}`} 
                          alt={u.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + u.name }} // Ảnh dự phòng nếu link lỗi
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{u.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">{u.email}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    u.roles === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {u.roles}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${u.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-sm">{u.status === 1 ? "Hoạt Động" : "Khóa"}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/user/${u.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteItem(u.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500 italic">
                  Không tìm thấy dữ liệu thành viên...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PHÂN TRANG */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-500">
          Trang {page} / {pageNumber.length || 1}
        </span>
        <div className="flex gap-1">
          {pageNumber.map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                page === num 
                ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}