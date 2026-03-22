"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import SettingService from "@/services/SettingService";

export default function EditSetting() {
    const router = useRouter();
    const { id } = useParams();

    const [form, setForm] = useState({
        site_name: "",
        email: "",
        phone: "",
        hotline: "",
        address: "",
        status: 1,
    });

    const [loading, setLoading] = useState(false);

    // =========================
    // LOAD SETTING DETAIL
    // =========================
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await SettingService.getById(id);

                if (res.status) {
                    setForm(res.data);
                }
            } catch (err) {
                console.error(err);
                alert("❌ Không tải được cài đặt");
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
                ...form,
                status: Number(form.status),
            };

            await SettingService.update(id, payload);

            alert("✅ Cập nhật cài đặt thành công");
            router.push("/admin/setting");
        } catch (err) {
            console.error(err);
            alert("❌ Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6">
                ✏️ Cập nhật Cài Đặt
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input name="site_name" value={form.site_name}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="Tên website" required />

                <input name="email" type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded" />

                <input name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded" />

                <input name="hotline"
                    value={form.hotline}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded" />

                <textarea name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="Địa chỉ" />

                <select name="status" value={form.status}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded">
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Tắt</option>
                </select>

                <button disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    {loading ? "Đang cập nhật..." : "💾 Cập nhật Cài Đặt"}
                </button>

            </form>
        </div>
    );
}
