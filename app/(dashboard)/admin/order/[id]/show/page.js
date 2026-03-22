"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderService from "../../../../../../services/OrderService";
import {
    ArrowLeft, User, Phone, MapPin, Calendar,
    CreditCard, CheckCircle, XCircle, Truck, RefreshCw, Box
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailPage() {
    const { id } = useParams(); // Lấy ID từ URL
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Map trạng thái
    const statusMap = {
        0: { label: "Đã hủy", color: "text-red-600 bg-red-50 border-red-200", icon: <XCircle size={18} /> },
        1: { label: "Chờ xác nhận", color: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: <RefreshCw size={18} /> },
        2: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-50 border-blue-200", icon: <CheckCircle size={18} /> },
        3: { label: "Đang giao", color: "text-indigo-600 bg-indigo-50 border-indigo-200", icon: <Truck size={18} /> },
        4: { label: "Hoàn thành", color: "text-green-600 bg-green-50 border-green-200", icon: <CheckCircle size={18} /> },
    };

    // Format tiền
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

    // Load dữ liệu
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await OrderService.getById(id);
                if (res.status) {
                    setOrder(res.data);
                } else {
                    alert("Không tìm thấy đơn hàng");
                    router.push("/admin/order");
                }
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id, router]);

    // Update Status
    const updateStatus = async (newStatus) => {
        if (!confirm("Bạn có chắc muốn cập nhật trạng thái đơn hàng?")) return;
        try {
            const res = await OrderService.update(id, { status: newStatus });
            if (res.status) {
                alert("Cập nhật thành công!");
                setOrder({ ...order, status: newStatus }); // Cập nhật UI ngay lập tức
            }
        } catch (error) {
            alert("Lỗi cập nhật trạng thái");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải chi tiết đơn hàng...</div>;
    if (!order) return null;

    const currentStatus = statusMap[order.status] || statusMap[1];
    // Tính tổng tiền lại cho chắc chắn
    const totalAmount = order.details?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/order" className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            Chi tiết đơn hàng #{order.id}
                        </h1>
                        <p className="text-sm text-gray-500">Ngày đặt: {formatDate(order.created_at)}</p>
                    </div>
                </div>

                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-medium ${currentStatus.color}`}>
                    {currentStatus.icon} {currentStatus.label}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- LEFT COLUMN: DANH SÁCH SẢN PHẨM --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700 flex items-center gap-2">
                            <Box size={18} /> Danh sách sản phẩm
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">Sản phẩm</th>
                                        <th className="px-6 py-3 text-center">Giá</th>
                                        <th className="px-6 py-3 text-center">SL</th>
                                        <th className="px-6 py-3 text-right">Tạm tính</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.details?.map((item) => {
                                        const product = item.product || {};
                                        // Lấy ảnh
                                        let imgPath = product.image;
                                        if (product.images && product.images.length > 0) imgPath = product.images[0].image;

                                        return (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 border rounded overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={product.thumbnail_url}
                                                                alt={product.name}
                                                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 text-sm line-clamp-2">{product.name || "Sản phẩm đã xóa"}</p>
                                                            <p className="text-xs text-gray-500">ID: {item.product_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm">{formatCurrency(item.price)}</td>
                                                <td className="px-6 py-4 text-center text-sm">x{item.qty}</td>
                                                <td className="px-6 py-4 text-right font-medium text-gray-800">
                                                    {formatCurrency(item.price * item.qty)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* TỔNG TIỀN */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-10">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Phí vận chuyển</p>
                                <p className="text-lg font-bold text-gray-700 mt-1">Tổng cộng</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-800">Miễn phí</p>
                                <p className="text-xl font-bold text-red-600 mt-1">{formatCurrency(totalAmount)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: THÔNG TIN KHÁCH HÀNG & THAO TÁC --- */}
                <div className="space-y-6">

                    {/* Thông tin khách hàng */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Thông tin khách hàng</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Họ tên</p>
                                    <p className="font-medium text-gray-800">{order.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Điện thoại</p>
                                    <p className="font-medium text-gray-800">{order.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                                    <p className="font-medium text-gray-800">{order.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CreditCard className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                                    <p className="font-medium text-gray-800 uppercase">{order.payment_method || "COD"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ghi chú */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Ghi chú của khách</h3>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-dashed border-gray-300 italic">
                            {order.note || "Không có ghi chú"}
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Cập nhật trạng thái</h3>
                        <div className="flex flex-col gap-2">
                            {order.status === 1 && (
                                <button
                                    onClick={() => updateStatus(2)}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
                                >
                                    ✅ Xác nhận đơn hàng
                                </button>
                            )}

                            {order.status === 2 && (
                                <button
                                    onClick={() => updateStatus(3)}
                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
                                >
                                    🚚 Bắt đầu giao hàng
                                </button>
                            )}

                            {order.status === 3 && (
                                <button
                                    onClick={() => updateStatus(4)}
                                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition"
                                >
                                    🎉 Hoàn thành đơn
                                </button>
                            )}

                            {order.status !== 0 && order.status !== 4 && (
                                <button
                                    onClick={() => updateStatus(0)}
                                    className="w-full py-2 border border-red-500 text-red-600 hover:bg-red-50 rounded font-medium transition mt-2"
                                >
                                    Hủy đơn hàng
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}