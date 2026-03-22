"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Camera, User, Mail, Phone, Lock, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

// --- Hàm xử lý đường dẫn ảnh (Dùng chung) ---
const getAvatarUrl = (avatarPath) => {
    if (!avatarPath || typeof avatarPath !== 'string') return "/images/default-avatar.png";
    if (avatarPath.startsWith("http")) return avatarPath;
    const cleanPath = avatarPath.startsWith('/') ? avatarPath.substring(1) : avatarPath;
    if (cleanPath.startsWith('uploads') || cleanPath.startsWith('storage')) {
        return `http://localhost:8000/${cleanPath}`;
    }
    return `http://localhost:8000/storage/${cleanPath}`;
};

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState("/images/default-avatar.png");
    const [message, setMessage] = useState({ type: "", content: "" });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                password: "",
            });
            setPreviewAvatar(getAvatarUrl(user.avatar));
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: "", content: "" });

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage({ type: "error", content: "Phiên đăng nhập đã hết hạn." });
            setIsSaving(false);
            return;
        }

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("username", user.username);
            data.append("phone", formData.phone || "");
            data.append("roles", user.roles || "customer");
            data.append("status", user.status ?? 1);
            if (formData.password) data.append("password", formData.password);
            if (avatarFile) data.append("avatar", avatarFile);
            data.append("_method", "PUT");

            const response = await axios.post(
                `http://localhost:8000/api/users/${user.id}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status) {
                setMessage({ type: "success", content: "Thông tin của bạn đã được cập nhật thành công!" });
                const updatedUser = response.data.data;
                localStorage.setItem("user", JSON.stringify(updatedUser));
                window.dispatchEvent(new Event("storage"));
                setPreviewAvatar(getAvatarUrl(updatedUser.avatar));
            }
        } catch (error) {
            let errorMsg = "Không thể cập nhật thông tin lúc này.";
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                errorMsg = errors ? Object.values(errors)[0][0] : error.response.data.message;
            } else {
                errorMsg = error.response?.data?.message || error.message;
            }
            setMessage({ type: "error", content: errorMsg });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-amber-500" size={48} />
        </div>
    );
    
    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl">
                <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
                <p className="text-slate-600 font-medium">Vui lòng đăng nhập để xem thông tin.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cài đặt tài khoản</h1>
                    <p className="text-slate-500 mt-2">Quản lý thông tin cá nhân và bảo mật tài khoản của bạn</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Avatar Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-amber-400 to-orange-500 opacity-10"></div>
                            
                            <div className="relative z-10">
                                <div className="relative w-32 h-32 mx-auto mb-4 group">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 animate-pulse opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    <Image
                                        src={previewAvatar}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="rounded-full w-full h-full object-cover border-4 border-white shadow-lg relative z-10"
                                        unoptimized={true}
                                        onError={(e) => { e.currentTarget.src = "/images/default-avatar.png"; }}
                                    />
                                    <label htmlFor="avatar-upload" className="absolute bottom-1 right-1 z-20 bg-slate-900 text-white p-2.5 rounded-full cursor-pointer hover:bg-amber-500 transition-all shadow-xl hover:scale-110 active:scale-95">
                                        <Camera size={18} />
                                    </label>
                                    <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                                <p className="text-sm text-slate-400 mb-6 italic">@{user.username}</p>
                                
                                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl text-[13px] font-bold text-slate-600 border border-slate-100 uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    {user.roles || "Thành viên"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-10">
                            
                            {message.content && (
                                <div className={`flex items-center gap-3 p-4 mb-8 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
                                    message.type === 'success' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                                }`}>
                                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                    <p className="text-sm font-medium">{message.content}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                                            <User size={16} className="text-slate-400" /> Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 placeholder:text-slate-400"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="Nhập họ tên của bạn"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                                            <Mail size={16} className="text-slate-400" /> Email liên hệ
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed italic shadow-inner"
                                            value={formData.email}
                                            readOnly
                                        />
                                    </div>

                                    {/* Phone Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                                            <Phone size={16} className="text-slate-400" /> Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 shadow-sm"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="09xx xxx xxx"
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                                            <Lock size={16} className="text-slate-400" /> Thay đổi mật khẩu
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 shadow-sm"
                                            placeholder="Để trống nếu không đổi"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
                                    <p className="text-xs text-slate-400 max-w-xs italic text-center md:text-left">
                                        * Lưu ý: Email không thể thay đổi để đảm bảo tính xác thực của tài khoản.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full md:w-auto min-w-[180px] bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:shadow-amber-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-slate-900"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <Save size={20} />
                                        )}
                                        {isSaving ? "Đang xử lý..." : "Lưu"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}