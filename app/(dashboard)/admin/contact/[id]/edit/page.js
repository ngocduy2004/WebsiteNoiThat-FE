"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ContactService from "@/services/ContactService";

export default function EditContact() {
    const router = useRouter();
    const { id } = useParams();

    const [form, setForm] = useState({
        user_id: "",
        name: "",
        email: "",
        phone: "",
        content: "",
        status: 1,
    });

    const [loading, setLoading] = useState(false);

    // =========================
    // LOAD CONTACT DETAIL
    // =========================
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await ContactService.getById(id);

                if (res.status) {
                    const contact = res.data;

                    setForm({
                        user_id: contact.user_id ?? "",
                        name: contact.name,
                        email: contact.email,
                        phone: contact.phone || "",
                        content: contact.content,
                        status: contact.status,
                    });
                }
            } catch (err) {
                console.error(err);
                alert("❌ Không tải được dữ liệu liên hệ");
            }
        })();
    }, [id]);

    // =========================
    // HANDLE CHANGE
    // =========================
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
                user_id: form.user_id ? Number(form.user_id) : null,
                name: form.name,
                email: form.email,
                phone: form.phone,
                content: form.content,
                status: Number(form.status),
            };

            await ContactService.update(id, payload);

            alert("✅ Cập nhật liên hệ thành công");
            router.push("/admin/contact");
        } catch (err) {
            console.error(err);
            alert("❌ Cập nhật liên hệ thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6">
                ✏️ Cập nhật liên hệ
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="number"
                    name="user_id"
                    value={form.user_id}
                    onChange={handleChange}
                    placeholder="User ID (nếu có)"
                    className="w-full border px-4 py-2 rounded"
                />

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Họ tên"
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
                />

                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Nội dung liên hệ"
                    rows={4}
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                >
                    <option value={1}>Mới</option>
                    <option value={0}>Đã xử lý</option>
                </select>

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Đang cập nhật..." : "Cập nhật liên hệ"}
                </button>
            </form>
        </div>
    );
}
