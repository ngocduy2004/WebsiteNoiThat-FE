"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ContactService from "@/services/ContactService";

const ContactAdd = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        user_id: "",
        name: "",
        email: "",
        phone: "",
        content: "",
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
            const payload = {
                user_id: form.user_id ? Number(form.user_id) : null,
                name: form.name,
                email: form.email,
                phone: form.phone,
                content: form.content,
                status: Number(form.status),
            };

            const res = await ContactService.create(payload);

            if (res.data.status) {
                alert("✅ Thêm liên hệ thành công");
                router.push("/admin/contact");
            } else {
                alert(res.data.message || "❌ Thêm liên hệ thất bại");
            }
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra");
        }
    };

    return (
        <div className="mx-auto mt-10 p-4 max-w-4xl">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">

                {/* HEADER */}
                <div className="bg-indigo-600 text-white p-4">
                    <h4 className="text-2xl font-semibold text-center">
                        📩 Thêm Liên Hệ Mới
                    </h4>
                </div>

                {/* BODY */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="number"
                            name="user_id"
                            value={form.user_id}
                            onChange={handleChange}
                            placeholder="User ID (nếu có)"
                            className="w-full border p-2 rounded-lg"
                        />

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Họ tên"
                            className="w-full border p-2 rounded-lg"
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full border p-2 rounded-lg"
                            required
                        />

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Số điện thoại"
                            className="w-full border p-2 rounded-lg"
                        />

                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            placeholder="Nội dung liên hệ"
                            rows={4}
                            className="w-full border p-2 rounded-lg"
                            required
                        />

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-lg"
                        >
                            <option value={1}>✅ Mới</option>
                            <option value={0}>❌ Đã xử lý</option>
                        </select>

                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                        >
                            💾 Lưu Liên Hệ
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactAdd;
