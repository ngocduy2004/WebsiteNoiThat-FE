"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OrderService from "../../../../../services/OrderService";

const OrderAdd = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        user_id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
        status: 1,
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                ...form,
                user_id: Number(form.user_id),
                status: Number(form.status),
            };

            const res = await OrderService.create(dataToSend);

            if (res.data.status) {
                alert("Tạo đơn hàng thành công");
                router.push("/admin/order");
                setForm({
                    user_id: "",
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    note: "",
                    status: 1,
                });
            } else {
                alert(res.data.message || "Tạo đơn hàng thất bại");
            }
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi tạo đơn hàng");
        }
    };

    return (
        <div className="mx-auto mt-10 p-4 max-w-5xl">
            <div className="flex justify-center">
                <div className="w-full">
                    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                        
                        {/* HEADER */}
                        <div className="bg-indigo-600 text-white p-4">
                            <h4 className="text-2xl font-semibold text-center">
                                🧾 Tạo Đơn Hàng Mới
                            </h4>
                        </div>

                        {/* BODY */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                                    {/* User ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            👤 User ID
                                        </label>
                                        <input
                                            type="number"
                                            name="user_id"
                                            value={form.user_id}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                            placeholder="Nhập ID người dùng"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            🧑 Họ tên người nhận
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                            placeholder="Nguyễn Văn A"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📧 Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                            placeholder="email@gmail.com"
                                            required
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📞 Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                            placeholder="090xxxxxxx"
                                            required
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📍 Địa chỉ giao hàng
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                            placeholder="Số nhà, đường, quận, thành phố"
                                            required
                                        />
                                    </div>

                                    {/* Note */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📝 Ghi chú
                                        </label>
                                        <textarea
                                            name="note"
                                            value={form.note}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full p-2 border rounded-lg"
                                            placeholder="Ghi chú thêm cho đơn hàng (nếu có)"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng thái đơn hàng
                                        </label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg bg-white"
                                        >
                                            <option value={0}>🟡 Chờ xác nhận</option>
                                            <option value={1}>✅ Đã xác nhận</option>
                                            <option value={2}>🚚 Đang giao hàng</option>
                                            <option value={3}>✅ Giao hàng thành công</option>
                                            <option value={4}>❌ Hủy</option>
                                        </select>
                                    </div>
                                </div>

                                {/* SUBMIT */}
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                                    >
                                        💾 Lưu Đơn Hàng
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderAdd;
