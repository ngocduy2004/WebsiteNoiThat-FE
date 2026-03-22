"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit } from "lucide-react";
import ContactService from "../../../../services/ContactService";
import Link from 'next/link';

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
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
        const result = await ContactService.getList({
          limit,
          page,
          search,
        });

        console.log("API trả về:", result);

        if (result.status === true) {
          setContacts(result.data);

          const totalPages = Math.ceil(result.total / limit);
          setPageNumber(Array.from({ length: totalPages }, (_, i) => i + 1));
        }
      } catch (error) {
        console.log("API lỗi:", error);
      }
    })();
  }, [limit, page, search]);

  // Xóa đơn hàng
  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    try {
      const res = await ContactService.delete(id);

      if (res.status) {
        alert("Xóa liên hệ thành công!");

        // 🔥 Cập nhật danh sách KHÔNG reload
        setContacts(contacts.filter((contact) => contact.id !== id));;
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi xóa liên hệ!");
    }
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Quản Lý Liên Hệ
        </h1>
        <Link
          href="/admin/contact/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm Liên hệ
        </Link>
      </div>

      {/* SEARCH */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
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
              {["#", "Tên", "Email", "Điện Thoại", "Nội Dung", "Trạng Thái", "Thao Tác"].map(
                (c) => (
                  <th key={c} className="py-3 px-4 border-b text-sm">{c}</th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {contacts.map((c, idx) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{c.id}</td>
                <td className="py-3 px-4">{c.name}</td>
                <td className="py-3 px-4">{c.email}</td>
                <td className="py-3 px-4">{c.phone}</td>
                <td className="py-3 px-4">{c.content}</td>
                <td className="py-3 px-4">
                  {c.status === 1 ? "Đã xử lý" : "Chưa xử lý"}
                </td>

                <td className="py-3 px-4 flex items-center gap-2">
                  <Link
                    href={`/admin/contact/${c.id}/edit`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteItem(c.id)}
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
