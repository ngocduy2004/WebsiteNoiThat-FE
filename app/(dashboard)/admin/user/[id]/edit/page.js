"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import UserService from "@/services/UserService";
import { 
  User, Mail, Phone, ShieldCheck, 
  Lock, Camera, Save, ArrowLeft, 
  UserCircle, Loader2 
} from "lucide-react";
import Link from "next/link";

export default function EditUser() {
    const router = useRouter();
    const { id } = useParams();

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
    const [fetching, setFetching] = useState(true);

    const BACKEND_URL = "http://localhost:8000"; 

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                setFetching(true);
                const res = await UserService.getById(id);

                if (res.status) {
                    const user = res.data;
                    setForm({
                        name: user.name,
                        email: user.email,
                        phone: user.phone || "",
                        username: user.username,
                        password: "",
                        roles: user.roles,
                        status: user.status,
                    });
                    
                    if (user.avatar) {
                        setPreview(`${BACKEND_URL}/${user.avatar}`);
                    }
                }
            } catch (err) {
                console.error(err);
                alert("❌ Không tải được dữ liệu người dùng");
            } finally {
                setFetching(false);
            }
        })();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("username", form.username);
            formData.append("roles", form.roles);
            formData.append("status", Number(form.status));
            formData.append("_method", "PUT");

            if (form.password) {
                formData.append("password", form.password);
            }

            if (selectedFile) {
                formData.append("avatar", selectedFile);
            }

            await UserService.update(id, formData);
            alert("✅ Cập nhật người dùng thành công");
            router.push("/admin/user");
        } catch (err) {
            console.error(err);
            alert("❌ Cập nhật người dùng thất bại");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
                <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 mb-12 px-4">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <UserCircle className="w-8 h-8 text-blue-600" />
                        Chỉnh sửa Thành viên
                    </h1>
                    <p className="text-gray-500 text-sm">Cập nhật thông tin chi tiết của người dùng hệ thống</p>
                </div>
                <Link 
                    href="/admin/user" 
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
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
                            <div className="relative group cursor-pointer w-40 h-40">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-50 shadow-inner">
                                    {preview ? (
                                        <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <User className="w-16 h-16" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-1 right-1 bg-blue-600 p-2.5 rounded-full text-white shadow-lg cursor-pointer hover:scale-110 transition-transform active:scale-95">
                                    <Camera className="w-5 h-5" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-400 mt-4 text-center italic">Định dạng hỗ trợ: JPG, PNG, GIF. Tối đa 2MB.</p>
                        </div>

                        {/* Cột phải: Thông tin chi tiết */}
                        <div className="md:col-span-2 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Họ tên
                                    </label>
                                    <input name="name" value={form.name} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                        placeholder="Nguyễn Văn A" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Tên đăng nhập
                                    </label>
                                    <input name="username" value={form.username} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl bg-gray-50 font-medium" 
                                        placeholder="username123" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email
                                    </label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                        required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Số điện thoại
                                    </label>
                                    <input name="phone" value={form.phone} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                        placeholder="0123.456.789" />
                                </div>
                            </div>

                            <div className="space-y-1 pt-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4" /> Mật khẩu mới
                                </label>
                                <input name="password" type="password" value={form.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                <p className="text-[11px] text-amber-600 font-medium italic">* Để trống nếu bạn không muốn thay đổi mật khẩu.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Vai trò</label>
                                    <select name="roles" value={form.roles} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="admin">Quản trị viên (Admin)</option>
                                        <option value="user">Người dùng (User)</option>
                                        <option value="customer">Khách hàng</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Trạng thái</label>
                                    <select name="status" value={form.status} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value={1}>Đang hoạt động</option>
                                        <option value={0}>Tạm khóa tài khoản</option>
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
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed font-semibold"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {loading ? "Đang xử lý..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}