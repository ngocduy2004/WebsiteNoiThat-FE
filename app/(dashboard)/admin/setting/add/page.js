"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SettingService from "@/services/SettingService";

const SettingAdd = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        site_name: "",
        email: "",
        phone: "",
        hotline: "",
        address: "",
        status: 1,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...form,
                status: Number(form.status),
            };

            const res = await SettingService.create(payload);

            if (res.data.status) {
                alert("✅ Thêm cài đặt thành công");
                router.push("/admin/setting");
            } else {
                alert(res.data.message || "❌ Thêm thất bại");
            }
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto mt-10 p-4 max-w-4xl">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">

                <div className="bg-indigo-600 text-white p-4">
                    <h4 className="text-2xl font-semibold text-center">
                        ⚙️ Thêm Cài Đặt Website
                    </h4>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input name="site_name" value={form.site_name}
                            onChange={handleChange}
                            placeholder="Tên website"
                            className="w-full border p-2 rounded-lg" required />

                        <input name="email" type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full border p-2 rounded-lg" />

                        <input name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Số điện thoại"
                            className="w-full border p-2 rounded-lg" />

                        <input name="hotline"
                            value={form.hotline}
                            onChange={handleChange}
                            placeholder="Hotline"
                            className="w-full border p-2 rounded-lg" />

                        <textarea name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Địa chỉ"
                            className="w-full border p-2 rounded-lg" />

                        <select name="status" value={form.status}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-lg">
                            <option value={1}>✅ Hoạt động</option>
                            <option value={0}>❌ Tắt</option>
                        </select>

                        <button disabled={loading}
                            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">
                            {loading ? "Đang lưu..." : "💾 Lưu Cài Đặt"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingAdd;
