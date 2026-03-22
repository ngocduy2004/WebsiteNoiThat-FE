"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, CheckCircle, XCircle, Truck, RefreshCw, Filter } from "lucide-react";
import OrderService from "../../../../services/OrderService";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  // Mặc định chọn 'all' hoặc '1' nếu muốn vào là thấy đơn mới ngay
  const [statusFilter, setStatusFilter] = useState("all"); 
  
  const [pageNumber, setPageNumber] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0); // Dùng để reload API sau khi thao tác

  // Cấu hình hiển thị trạng thái
  const statusMap = {
    0: { label: "Đã hủy", color: "text-red-600 bg-red-50 border-red-200", icon: <XCircle size={16}/> },
    1: { label: "Chờ xác nhận", color: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: <RefreshCw size={16}/> },
    2: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-50 border-blue-200", icon: <CheckCircle size={16}/> },
    3: { label: "Đang giao", color: "text-indigo-600 bg-indigo-50 border-indigo-200", icon: <Truck size={16}/> },
    4: { label: "Hoàn thành", color: "text-green-600 bg-green-50 border-green-200", icon: <CheckCircle size={16}/> },
  };

  // Danh sách Tab lọc
  const filterTabs = [
    { key: "all", label: "Tất cả" },
    { key: "1", label: "Mới đặt hàng" }, // QUAN TRỌNG: Admin cần check cái này
    { key: "2", label: "Đang xử lý" },
    { key: "3", label: "Đang giao" },
    { key: "4", label: "Hoàn thành" },
    { key: "0", label: "Đã hủy" },
  ];

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  // Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  // ==========================
  // CALL API
  // ==========================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const params = {
          limit,
          page,
          search,
        };

        // Nếu không phải 'all' thì gửi status lên để Backend lọc
        if (statusFilter !== "all") {
          params.status = statusFilter;
        }

        // Gọi API (Không truyền user_id để lấy tất cả)
        const result = await OrderService.getList(params);

        if (result.status === true) {
          setOrders(result.data);
          const totalRecords = result.total || result.data.length; 
          const totalPages = Math.ceil(totalRecords / limit);
          setPageNumber(Array.from({ length: totalPages || 1 }, (_, i) => i + 1));
        }
      } catch (error) {
        console.log("API lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [limit, page, search, statusFilter, reload]);

  // --- XỬ LÝ XÁC NHẬN ĐƠN HÀNG (1 -> 2) ---
  const confirmOrder = async (id) => {
    if (!confirm("Xác nhận duyệt đơn hàng này để bắt đầu giao hàng?")) return;
    try {
      // Cập nhật trạng thái lên 2 (Đã xác nhận/Chờ lấy hàng)
      const res = await OrderService.update(id, { status: 2 });
      if (res.status) {
        alert("Đã xác nhận đơn hàng!");
        setReload(reload + 1); // Tải lại danh sách
      }
    } catch (error) {
      alert("Lỗi cập nhật");
    }
  };

  // Xóa đơn hàng
  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa vĩnh viễn đơn này?")) return;
    try {
      const res = await OrderService.delete(id);
      if (res.status) {
        alert("Xóa thành công!");
        setReload(reload + 1);
      }
    } catch (err) {
      alert("Lỗi xóa đơn hàng!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 uppercase flex items-center gap-2">
           📦 Quản Lý Đơn Hàng
        </h1>
      </div>

      {/* 1. THANH CÔNG CỤ (TABS + SEARCH) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        
        {/* Search & Limit */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
            <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="🔍 Tìm mã đơn, tên khách..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-300 pl-4 pr-10 py-2 rounded-md focus:outline-none focus:border-blue-500 transition"
                />
            </div>

            <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none"
            >
                <option value="10">10 dòng</option>
                <option value="20">20 dòng</option>
                <option value="50">50 dòng</option>
            </select>
        </div>

        {/* --- TABS LỌC TRẠNG THÁI (QUAN TRỌNG) --- */}
        <div className="flex flex-wrap gap-2 border-t pt-4">
            {filterTabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        statusFilter === tab.key
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* 2. BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-xs font-bold uppercase border-b">Mã đơn</th>
                <th className="py-3 px-4 text-xs font-bold uppercase border-b">Khách hàng</th>
                <th className="py-3 px-4 text-xs font-bold uppercase border-b">Tổng tiền</th>
                <th className="py-3 px-4 text-xs font-bold uppercase border-b">Ngày đặt</th>
                <th className="py-3 px-4 text-xs font-bold uppercase border-b">Trạng thái</th>
                <th className="py-3 px-4 text-xs font-bold uppercase border-b text-center">Xử lý</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10 text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : orders.length === 0 ? (
                <tr>
                    <td colSpan="6" className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <p>Không tìm thấy đơn hàng nào ở mục này.</p>
                        </div>
                    </td>
                </tr>
              ) : (
                orders.map((o) => {
                  // Tính tổng tiền từ chi tiết đơn hàng
                  const totalAmount = o.details?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0;
                  const status = statusMap[o.status] || { label: "Không xác định", color: "text-gray-500", icon: null };

                  return (
                    <tr key={o.id} className="hover:bg-blue-50 transition duration-150">
                      <td className="py-4 px-4 font-medium text-gray-900">#{o.id}</td>
                      
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-800">{o.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{o.phone}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[200px]" title={o.address}>{o.address}</div>
                      </td>

                      <td className="py-4 px-4 font-bold text-red-600">
                        {formatCurrency(totalAmount)}
                      </td>

                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(o.created_at)}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* --- NÚT DUYỆT ĐƠN (QUAN TRỌNG) --- */}
                          {o.status === 1 && (
                              <button 
                                onClick={() => confirmOrder(o.id)}
                                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition shadow-sm text-sm font-medium"
                                title="Xác nhận đơn này"
                              >
                                <CheckCircle size={14} /> Duyệt
                              </button>
                          )}

                          <Link
                            href={`/admin/order/${o.id}/show`}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </Link>

                          {/* Nếu muốn sửa thủ công */}
                          {o.status !== 1 && (
                            <Link
                                href={`/admin/order/${o.id}/edit`}
                                className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded transition"
                                title="Cập nhật"
                            >
                                <Edit size={18} />
                            </Link>
                          )}

                          <button
                            onClick={() => deleteItem(o.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. PHÂN TRANG */}
      {pageNumber.length > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          {pageNumber.map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded border text-sm font-medium transition ${
                page === num 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
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