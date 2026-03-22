"use client";
import React, { useEffect, useState } from "react";
import OrderService from "@/services/OrderService";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Search, Truck, ShoppingBag, MessageSquare, Store, ChevronRight, HelpCircle } from "lucide-react";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function OrderHistory() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const tabs = [
        { id: "all", label: "Tất cả" },
        { id: "1", label: "Chờ xác nhận" },
        { id: "2", label: "Chờ lấy hàng" },
        { id: "3", label: "Đang giao" },
        { id: "4", label: "Hoàn thành" },
        { id: "0", label: "Đã hủy" },
    ];

    const statusMap = {
        0: { text: "ĐÃ HỦY", color: "text-red-500" },
        1: { text: "CHỜ XÁC NHẬN", color: "text-[#ee4d2d]" },
        2: { text: "ĐANG XỬ LÝ", color: "text-[#ee4d2d]" },
        3: { text: "ĐANG GIAO", color: "text-[#26aa99]" },
        4: { text: "HOÀN THÀNH", color: "text-[#ee4d2d]" },
    };

    const fetchOrders = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await OrderService.getList({ user_id: user.id });
            if (res.status) setOrders(res.data);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const handleCancel = async (orderId) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
            try {
                const res = await OrderService.cancelOrder(orderId);
                if (res.status) {
                    alert("Đã hủy đơn hàng thành công!");
                    fetchOrders();
                }
            } catch (error) {
                alert("Lỗi hệ thống khi hủy đơn");
            }
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesTab = activeTab === "all" || order.status.toString() === activeTab;
        const matchesSearch = order.id.toString().includes(searchTerm) ||
            order.details?.some(d => d.product?.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4 bg-[#f5f5f5]">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ee4d2d] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f5f5f5] pb-20">
            <div className="container mx-auto max-w-5xl pt-4 px-2">

                {/* 1. THANH TAB SHOPEE STYLE */}
                <div className="bg-white sticky top-0 z-20 shadow-sm mb-3 flex overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-4 px-2 text-base whitespace-nowrap transition-all border-b-2 font-normal
                                ${activeTab === tab.id ? "border-[#ee4d2d] text-[#ee4d2d]" : "border-transparent text-gray-800 hover:text-[#ee4d2d]"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 2. THANH TÌM KIẾM */}
                <div className="relative mb-3">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Bạn có thể tìm kiếm theo ID đơn hàng hoặc Tên Sản phẩm"
                        className="w-full pl-12 pr-4 py-3 bg-[#eaeaea] border-none rounded-sm text-sm outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
                    />
                </div>

                {/* 3. DANH SÁCH ĐƠN HÀNG */}
                <div className="space-y-3">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center bg-white py-24 shadow-sm rounded-sm">
                            <div className="bg-[url('https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5fafbb923393a712b96488592e8f76d4.png')] bg-contain bg-no-repeat w-24 h-24 mx-auto mb-4"></div>
                            <p className="text-gray-600">Chưa có đơn hàng</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const status = statusMap[order.status] || statusMap[1];
                            const totalAmount = order.details?.reduce((sum, item) => {
                                const unitPrice = Number(item.product?.price_buy || item.price || 0);
                                return sum + (unitPrice * item.qty);
                            }, 0) || 0;

                            return (
                                <div key={order.id} className="bg-white shadow-sm rounded-sm overflow-hidden mb-3">
                                    {/* Header Shop */}
                                    <div className="px-5 py-3 flex justify-between items-center border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#ee4d2d] text-white text-[10px] px-1 rounded-sm font-bold">Yêu thích</span>
                                            <span className="font-bold text-sm text-gray-800">Nội Thất Nhà Xinh</span>
                                            <button className="flex items-center gap-1 bg-[#ee4d2d] text-white px-2 py-1 rounded-sm text-xs ml-2">
                                                <MessageSquare size={12} /> Chat
                                            </button>
                                            <button className="flex items-center gap-1 border border-gray-200 px-2 py-1 rounded-sm text-xs text-gray-600 ml-1">
                                                <Store size={12} /> Xem Shop
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            {order.status === 3 && (
                                                <div className="flex items-center gap-1 text-[#26aa99] border-r pr-2">
                                                    <Truck size={16} />
                                                    <span>Giao hàng thành công</span>
                                                </div>
                                            )}
                                            <span className={`font-medium uppercase ${status.color}`}>{status.text}</span>
                                        </div>
                                    </div>

                                    {/* Products List */}
                                    <div
                                        className="p-5 cursor-pointer hover:bg-gray-50/50"
                                        // Đổi từ `/product/${id}` sang `/product/${id}/detail/`
                                        onClick={() => router.push(`/product/${order.details?.[0]?.product_id}/detail/`)}
                                    >
                                        {order.details?.map((detail, idx) => {
                                            const displayPrice = Number(detail.product?.price_buy || detail.price || 0);
                                            return (
                                                <div key={idx} className="flex gap-3 py-3 first:pt-0 last:pb-0 border-b last:border-0 border-gray-50">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-sm flex-shrink-0 border border-gray-100">
                                                        <img
                                                            src={detail.product?.thumbnail_url}
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <h3 className="text-gray-800 text-lg leading-tight truncate">{detail.product?.name}</h3>
                                                        <p className="text-gray-400 text-sm mt-1">Phân loại hàng: Mặc định</p>
                                                        <p className="text-gray-800 text-sm mt-1 font-medium">x{detail.qty}</p>
                                                    </div>
                                                    <div className="text-right flex flex-col justify-center">
                                                        <span className="text-[#ee4d2d] text-sm">{formatCurrency(displayPrice)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Summary & Actions */}
                                    <div className="bg-[#fffefb] border-t border-gray-100">
                                        <div className="px-5 py-6 flex flex-col items-end gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-gray-600 text-sm flex items-center gap-1">
                                                    <HelpCircle size={14} className="text-gray-400" /> Thành tiền:
                                                </div>
                                                <div className="text-2xl text-[#ee4d2d] font-medium">
                                                    {formatCurrency(totalAmount)}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {order.status === 1 && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCancel(order.id); }}
                                                        className="px-8 py-2 border border-gray-300 text-gray-700 text-sm rounded-sm min-w-[150px] hover:bg-gray-50"
                                                    >
                                                        Hủy đơn hàng
                                                    </button>
                                                )}
                                                <button className="px-8 py-2 bg-[#ee4d2d] text-white text-sm rounded-sm min-w-[150px] hover:bg-[#d73211]">
                                                    {order.status === 4 ? "Đánh giá" : "Mua lại"}
                                                </button>
                                                <button className="px-8 py-2 border border-gray-300 text-gray-700 text-sm rounded-sm min-w-[150px] hover:bg-gray-50">
                                                    Liên hệ người bán
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}