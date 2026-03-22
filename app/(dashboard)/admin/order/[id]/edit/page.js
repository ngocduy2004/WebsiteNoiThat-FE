"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import OrderService from "@/services/OrderService";

export default function EditOrder() {
    const router = useRouter();
    const { id } = useParams();

    const [form, setForm] = useState({
        user_id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
        status: 1,
    });

    const [loading, setLoading] = useState(false);

    // =========================
    // LOAD ORDER DETAIL
    // =========================
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await OrderService.getById(id);

                // res = { status: true, data: {...} }
                if (res.status) {
                    const order = res.data;

                    setForm({
                        user_id: order.user_id,
                        name: order.name,
                        email: order.email,
                        phone: order.phone,
                        address: order.address,
                        note: order.note || "",
                        status: order.status,
                    });
                }
            } catch (err) {
                console.error(err);
                alert("Không tải được thông tin đơn hàng");
            }
        })();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // =========================
    // SUBMIT UPDATE
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                user_id: Number(form.user_id),
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
                note: form.note,
                status: Number(form.status),
            };

            await OrderService.update(id, payload);

            alert("Cập nhật đơn hàng thành công");
            router.push("/admin/order");
        } catch (err) {
            console.error(err); // ✅ KHÔNG GÂY CRASH
            alert("Cập nhật đơn hàng thất bại");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6">
                ✏️ Cập nhật đơn hàng
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="number"
                    name="user_id"
                    value={form.user_id}
                    onChange={handleChange}
                    placeholder="User ID"
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tên người nhận"
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Địa chỉ giao hàng"
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Ghi chú"
                    rows="3"
                    className="w-full border px-4 py-2 rounded"
                />

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {/* Value phải khớp với Database và Dashboard */}
                    <option value={1}>🟡 Chờ xác nhận (Mới)</option>
                    <option value={2}>🔵 Đã xác nhận (Đang xử lý)</option>
                    <option value={3}>🚚 Đang giao hàng</option>
                    <option value={4}>✅ Giao hàng thành công</option>
                    <option value={0}>❌ Đã hủy</option>
                </select>

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Đang cập nhật..." : "Cập nhật đơn hàng"}
                </button>
            </form>
        </div>
    );
}
