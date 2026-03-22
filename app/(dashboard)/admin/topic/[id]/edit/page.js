"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TopicService from "@/services/TopicService";

export default function EditTopic() {
    const router = useRouter();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        sort_order: 0,
        description: "",
        status: 1,
    });

    const [loading, setLoading] = useState(false);

    // =========================
    // LOAD TOPIC DETAIL
    // =========================
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await TopicService.getById(id);

                if (res.status) {
                    const topic = res.data;

                    setForm({
                        name: topic.name,
                        sort_order: topic.sort_order ?? 0,
                        description: topic.description || "",
                        status: topic.status,
                    });
                }
            } catch (err) {
                console.error(err);
                alert("❌ Không tải được dữ liệu chủ đề");
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
                name: form.name,
                sort_order: Number(form.sort_order),
                description: form.description,
                status: Number(form.status),
            };

            await TopicService.update(id, payload);

            alert("✅ Cập nhật chủ đề thành công");
            router.push("/admin/topic");
        } catch (err) {
            console.error(err);
            alert("❌ Cập nhật chủ đề thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6">
                ✏️ Cập nhật chủ đề
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tên chủ đề"
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <input
                    type="number"
                    name="sort_order"
                    value={form.sort_order}
                    onChange={handleChange}
                    placeholder="Thứ tự sắp xếp"
                    className="w-full border px-4 py-2 rounded"
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Mô tả"
                    rows={3}
                    className="w-full border px-4 py-2 rounded"
                />

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                >
                    <option value={1}>Hiển thị</option>
                    <option value={0}>Ẩn</option>
                </select>

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Đang cập nhật..." : "Cập nhật chủ đề"}
                </button>
            </form>
        </div>
    );
}
