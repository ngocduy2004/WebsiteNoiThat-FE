"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TopicService from "@/services/TopicService";

const TopicAdd = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        sort_order: 0,
        description: "",
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
                name: form.name,
                sort_order: Number(form.sort_order),
                description: form.description,
                status: Number(form.status),
            };

            const res = await TopicService.create(payload);

            if (res.data.status) {
                alert("✅ Thêm chủ đề thành công");
                router.push("/admin/topic");
            } else {
                alert(res.data.message || "❌ Thêm chủ đề thất bại");
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
                        📂 Thêm Chủ Đề Mới
                    </h4>
                </div>

                {/* BODY */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Tên chủ đề"
                            className="w-full border p-2 rounded-lg"
                            required
                        />

                        <input
                            type="number"
                            name="sort_order"
                            value={form.sort_order}
                            onChange={handleChange}
                            placeholder="Thứ tự sắp xếp"
                            className="w-full border p-2 rounded-lg"
                        />

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Mô tả"
                            rows={3}
                            className="w-full border p-2 rounded-lg"
                        />

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-lg"
                        >
                            <option value={1}>✅ Hiển thị</option>
                            <option value={0}>❌ Ẩn</option>
                        </select>

                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                        >
                            💾 Lưu Chủ Đề
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default TopicAdd;
