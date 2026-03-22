"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MenuService from "@/services/MenuService";

const MenuAdd = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        link: "",
        position: "mainmenu",
        status: 0,
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
                name: form.name,
                link: form.link,
                position: form.position,
                status: Number(form.status),
            };

            const res = await MenuService.create(payload);

            if (res.status) {
                alert("✅ Thêm menu thành công");
                router.push("/admin/menu");
            } else {
                alert(res.data.message || "❌ Thêm menu thất bại");
            }
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra");
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6">➕ Thêm Menu</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tên menu"
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <input
                    type="text"
                    name="link"
                    value={form.link}
                    onChange={handleChange}
                    placeholder="Liên kết (vd: /menu-1)"
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                >
                    <option value="mainmenu">Main Menu</option>
                    <option value="footermenu">Footer Menu</option>
                </select>

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                >
                    <option value={1}>Hiển thị</option>
                    <option value={0}>Ẩn</option>
                </select>

                <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    💾 Lưu menu
                </button>
            </form>
        </div>
    );
};

export default MenuAdd;
