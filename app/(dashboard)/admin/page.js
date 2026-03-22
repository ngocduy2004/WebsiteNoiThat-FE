"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  DollarSign,
  Users,
  RefreshCcw,
  Package,
} from "lucide-react";
import DashboardService from "@/services/DashboardService";

// URL ảnh backend (Nên đưa vào file .env: process.env.NEXT_PUBLIC_IMAGE_URL)
const IMAGE_BASE_URL = "http://localhost:8000/storage/";

// --- COMPONENT CON: HIỂN THỊ TRẠNG THÁI ---
const StatusBadge = ({ status }) => {
  const statusConfig = {
    1: { label: "Mới", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    2: { label: "Đang xử lý", className: "bg-blue-100 text-blue-700 border-blue-200" },
    3: { label: "Đang giao", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    4: { label: "Hoàn thành", className: "bg-green-100 text-green-700 border-green-200" },
    0: { label: "Đã hủy", className: "bg-red-100 text-red-700 border-red-200" },
  };

  const config = statusConfig[status] || { label: "Khác", className: "bg-gray-100 text-gray-700" };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

// --- COMPONENT CON: SKELETON LOADING ---
const DashboardSkeleton = () => (
  <div className="animate-pulse">
    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
      ))}
    </div>
    {/* Table Skeleton */}
    <div className="bg-white p-6 rounded-xl border h-96">
      <div className="h-6 w-48 bg-gray-200 mb-6 rounded"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 mb-2 rounded"></div>
      ))}
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_customers: 0,
    total_refunds: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // FETCH DATA
  // ==========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getRecentOrders(),
        ]);

        if (statsRes?.data) setStats(statsRes.data);
        if (ordersRes?.data?.data) setOrders(ordersRes.data.data); // Laravel paginate trả về .data
        else if (Array.isArray(ordersRes?.data)) setOrders(ordersRes.data); // Trường hợp trả về mảng

      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==========================
  // HELPERS
  // ==========================
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getOrderTotal = (order) => {
    if (!order.details?.length) return 0;
    return order.details.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  const getOrderImage = (order) => {
    const thumbnail = order.details?.[0]?.product?.thumbnail;
    if (!thumbnail) return "https://placehold.co/100x100?text=No+Img";
    return thumbnail.startsWith("http") ? thumbnail : `${IMAGE_BASE_URL}${thumbnail}`;
  };

  // ==========================
  // RENDER UI
  // ==========================
  if (loading) return <div className="p-6 bg-gray-50 min-h-screen"><DashboardSkeleton /></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng quan tình hình kinh doanh hôm nay</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
          Tải báo cáo
        </button>
      </div>

      {/* ===== 1. THỐNG KÊ (STATS CARDS) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng Doanh Thu" 
          value={formatCurrency(stats.total_revenue)} 
          icon={<DollarSign size={24} />} 
          color="indigo"
          trend="+12.5%"
        />
        <StatCard 
          title="Tổng Đơn Hàng" 
          value={stats.total_orders} 
          icon={<ShoppingBag size={24} />} 
          color="blue"
          trend="+5.2%"
        />
        <StatCard 
          title="Khách Hàng" 
          value={stats.total_customers} 
          icon={<Users size={24} />} 
          color="emerald"
          subText="Đang hoạt động"
        />
        <StatCard 
          title="Đơn Hủy / Hoàn" 
          value={stats.total_refunds} 
          icon={<RefreshCcw size={24} />} 
          color="rose"
          trend="-2.4%"
          trendDown
        />
      </div>

      {/* ===== 2. BẢNG ĐƠN HÀNG GẦN ĐÂY ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package size={20} className="text-gray-500" /> Đơn Hàng Mới Nhất
          </h2>
          <Link href="/admin/order" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4 w-20">Mã ĐH</th>
                <th className="p-4">Sản phẩm</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Ngày đặt</th>
                <th className="p-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="p-4 font-mono text-sm text-blue-600 font-medium">#{order.id}</td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                          <img 
                            src={getOrderImage(order)} 
                            alt="Product" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-[200px]">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {order.details?.[0]?.product?.name || "Sản phẩm không xác định"}
                          </p>
                          {order.details?.length > 1 && (
                            <p className="text-xs text-gray-500">+{order.details.length - 1} sản phẩm khác</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">{order.user?.name || order.name || "Khách lẻ"}</p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                    </td>

                    <td className="p-4 font-bold text-gray-900 text-sm">
                      {formatCurrency(getOrderTotal(order))}
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>

                    <td className="p-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 italic">
                    Chưa có đơn hàng nào gần đây.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT CON: THẺ THỐNG KÊ (Để code chính gọn hơn) ---
function StatCard({ title, value, icon, color, trend, trendDown, subText }) {
  // Map màu sắc Tailwind
  const colors = {
    indigo: "bg-indigo-500 shadow-indigo-200",
    blue: "bg-blue-500 shadow-blue-200",
    emerald: "bg-emerald-500 shadow-emerald-200",
    rose: "bg-rose-500 shadow-rose-200",
  };

  const bgClass = colors[color] || "bg-gray-500";

  return (
    <div className={`rounded-2xl p-5 text-white shadow-lg ${bgClass} transition-transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-sm font-medium text-white/90">
        {trend && (
          <span className={`flex items-center ${trendDown ? "text-red-200" : "text-emerald-100"} bg-white/10 px-2 py-0.5 rounded mr-2`}>
            {trendDown ? <ArrowDown size={14} className="mr-1" /> : <ArrowUp size={14} className="mr-1" />}
            {trend}
          </span>
        )}
        {subText && <span>{subText}</span>}
        {!trend && !subText && <span className="text-white/60">Cập nhật ngay</span>}
      </div>
    </div>
  );
}