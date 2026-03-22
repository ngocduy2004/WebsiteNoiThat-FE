"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MenuService from "@/services/MenuService";

export default function EditMenu() {
    const router = useRouter();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        link: "",
        position: "mainmenu",
        status: 0,
    });

    const [loading, setLoading] = useState(false);

    // LOAD MENU DETAIL
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await MenuService.getById(id);

                if (res.status) {
                    const menu = res.data;
                    setForm({
                        name: menu.name,
                        link: menu.link,
                        position: menu.position,
                        status: menu.status,
                    });
                }
            } catch (err) {
                console.error(err);
                alert("❌ Không tải được menu");
            }
        })();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: form.name,
                link: form.link,
                position: form.position,
                status: Number(form.status),
            };

            await MenuService.update(id, payload);

            alert("✅ Cập nhật menu thành công");
            router.push("/admin/menu");
        } catch (err) {
            console.error(err);
            alert("❌ Cập nhật menu thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6">✏️ Cập nhật Menu</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <input
                    type="text"
                    name="link"
                    value={form.link}
                    onChange={handleChange}
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

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Đang cập nhật..." : "Cập nhật menu"}
                </button>
            </form>
        </div>
    );
}
