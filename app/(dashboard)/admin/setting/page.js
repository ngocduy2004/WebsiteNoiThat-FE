"use client";


import React, { useEffect, useState } from "react";
import SettingService from "../../../../services/SettingService";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SettingPage() {
  const [settings, setSettings] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [pageNumber, setPageNumber] = useState([]);

  // ==========================
  // CALL API
  // ==========================
  useEffect(() => {
    (async () => {
      try {
        const result = await SettingService.getList({
          limit,
          page,
          search,
        });

        console.log("API trả về:", result);

        if (result.status === true) {
          setSettings(result.data);

          const totalPages = Math.ceil(result.total / limit);
          setPageNumber(Array.from({ length: totalPages }, (_, i) => i + 1));
        }
      } catch (error) {
        console.log("API lỗi:", error);
      }
    })();
  }, [limit, page, search]);

  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa cấu hình này?")) return;

    try {
      const res = await SettingService.delete(id);

      if (res.status) {
        alert("Xóa Cấu hình thành công!");

        // 🔥 Cập nhật danh sách KHÔNG reload
        setSettings(settings.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi xóa cấu hình!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Cấu hình website</h1>
        <Link
          href="/admin/setting/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm Cấu hình
        </Link>
      </div>


      {/* SEARCH */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên website..."
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
              {[
                "#",
                "Tên Website",
                "Email",
                "Điện Thoại",
                "Hotline",
                "Địa Chỉ",
                "Trạng Thái",
                "Thao Tác",
              ].map((c) => (
                <th key={c} className="py-3 px-4 border-b text-sm">
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {settings.map((s, idx) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{idx + 1}</td>
                <td className="py-3 px-4">{s.site_name}</td>
                <td className="py-3 px-4">{s.email}</td>
                <td className="py-3 px-4">{s.phone}</td>
                <td className="py-3 px-4">{s.hotline}</td>
                <td className="py-3 px-4">{s.address}</td>
                <td className="py-3 px-4">
                  {s.status === 1 ? "Đang dùng" : "Không dùng"}
                </td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <Link
                    href={`/admin/setting/${s.id}/edit`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteItem(s.id)}
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
