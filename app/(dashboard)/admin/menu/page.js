"use client";
import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import MenuService from "../../../../services/MenuService";
import Link from 'next/link';

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState([]);

  // ==========================
  // CALL API
  // ==========================
  useEffect(() => {
    (async () => {
      try {
        const result = await MenuService.getList({
          limit,
          page,
          search,
        });

        console.log("API trả về:", result);

        if (result.status === true) {
          setMenus(result.data);

          const totalPages = Math.ceil(result.total / limit);
          setPageNumber(Array.from({ length: totalPages }, (_, i) => i + 1));
        }
      } catch (error) {
        console.log("API lỗi:", error);
      }
    })();
  }, [limit, page, search]);

  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa menu này?")) return;

    try {
      const res = await MenuService.delete(id);

      if (res.status) {
        alert("Xóa Menu thành công!");

        // 🔥 Cập nhật danh sách KHÔNG reload
        setMenus(menus.filter((menu) => menu.id !== id));;
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi xóa menu!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Menu</h1>

        <Link
          href="/admin/menu/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm Menu
        </Link>
      </div>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm Menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          <option value="5">5 dòng</option>
          <option value="10">10 dòng</option>
          <option value="20">20 dòng</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {["#", "Tên Menu", "Liên Kết", "Vị Trí", "Trạng Thái", "Thao Tác"].map((c) => (
                <th
                  key={c}
                  className="py-3 px-4 text-gray-500 text-sm font-medium uppercase border-b"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {menus.map((m, idx) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{m.id}</td>
                <td className="py-3 px-4">{m.name}</td>
                <td className="py-3 px-4">{m.link}</td>
                <td className="py-3 px-4">{m.position}</td>
                <td className="py-3 px-4">{m.status === 1 ? "Hiển thị" : "Ẩn"}</td>

                <td className="py-3 px-4 flex items-center gap-2">
                  <Link
                    href={`/admin/menu/${m.id}/edit`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteItem(m.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* PAGINATION */}
      <div className="flex gap-2 mt-4">
        {pageNumber.map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-3 py-1 rounded border ${page === num ? "bg-blue-500 text-white" : "bg-white"
              }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
