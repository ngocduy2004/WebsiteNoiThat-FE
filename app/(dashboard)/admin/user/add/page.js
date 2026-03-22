"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UserService from "@/services/UserService";
import { 
  UserPlus, Mail, Phone, ShieldCheck, 
  Lock, Camera, Save, ArrowLeft, 
  Loader2, User
} from "lucide-react";
import Link from "next/link";

const UserAdd = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        roles: "customer",
        status: 1,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    // =========================
    // XỬ LÝ NHẬP LIỆU
    // =========================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Xử lý chọn ảnh đại diện
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // =========================
    // SUBMIT FORM
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Sử dụng FormData để gửi kèm file ảnh
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("username", form.username);
            formData.append("password", form.password);
            formData.append("roles", form.roles);
            formData.append("status", Number(form.status));

            if (selectedFile) {
                formData.append("avatar", selectedFile);
            }

            const res = await UserService.create(formData);

            // Tùy vào cấu trúc res.data của bạn (đoạn này khớp với code cũ của bạn)
            if (res.status) {
                alert("✅ Thêm người dùng thành công");
                router.push("/admin/user");
            } else {
                alert(res.message || "❌ Thêm người dùng thất bại");
            }
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra khi lưu người dùng");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 mb-12 px-4">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <UserPlus className="w-8 h-8 text-indigo-600" />
                        Thêm Thành Viên Mới
                    </h1>
                    <p className="text-gray-500 text-sm">Tạo tài khoản mới cho nhân viên hoặc khách hàng</p>
                </div>
                <Link 
                    href="/admin/user" 
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5" /> Quay lại
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Cột trái: Ảnh đại diện */}
                        <div className="md:col-span-1 flex flex-col items-center border-r border-gray-50 pr-8">
                            <label className="text-sm font-semibold text-gray-700 mb-4 self-start">Ảnh đại diện</label>
                            <div className="relative group w-40 h-40">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-indigo-50 shadow-inner bg-gray-100 flex items-center justify-center">
                                    {preview ? (
                                        <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-gray-300" />
                                    )}
                                </div>
                                <label className="absolute bottom-1 right-1 bg-indigo-600 p-2.5 rounded-full text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                    <Camera className="w-5 h-5" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-4 text-center">Tải lên ảnh chân dung rõ nét (JPG, PNG)</p>
                        </div>

                        {/* Cột phải: Thông tin chi tiết */}
                        <div className="md:col-span-2 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        Họ tên <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <input name="name" value={form.name} onChange={handleChange}
                                            className="w-full border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                            placeholder="Nguyễn Văn A" required />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        Tên đăng nhập <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <input name="username" value={form.username} onChange={handleChange}
                                            className="w-full border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                            placeholder="username123" required />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email <span className="text-red-500">*</span>
                                    </label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                        placeholder="vi-du@gmail.com" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Số điện thoại
                                    </label>
                                    <input name="phone" value={form.phone} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                        placeholder="0123.456.789" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4" /> Mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <input name="password" type="password" value={form.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                    required />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Vai trò</label>
                                    <select name="roles" value={form.roles} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="admin">Quản trị viên (Admin)</option>
                                        <option value="user">Khách hàng (Customer)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Trạng thái</label>
                                    <select name="status" value={form.status} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value={1}>✅ Đang hoạt động</option>
                                        <option value={0}>❌ Tạm khóa</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <Link href="/admin/user" className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                            Hủy bỏ
                        </Link>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 font-semibold"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {loading ? "Đang lưu..." : "Lưu Người Dùng"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserAdd;