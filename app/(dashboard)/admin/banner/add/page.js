"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BannerService from "../../../../../services/BannerService";
import { Save, X, Upload, Loader2, Image as ImageIcon, Layout, Link as LinkIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function BannerAdd() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        name: "", link: "", position: "slideshow", description: "", status: 1
    });
    const [imageFile, setImageFile] = useState(null); 

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !imageFile) {
            alert("Vui lòng nhập tên và chọn ảnh!");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => formData.append(key, form[key]));
            formData.append("image", imageFile); 

            await BannerService.create(formData);
            router.push("/admin/banner");
        } catch (error) {
            alert("Lỗi khi thêm mới!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/admin/banner" className="text-slate-500 flex items-center gap-1 text-sm font-medium hover:text-indigo-600 transition-colors mb-2">
                            <ChevronLeft size={16}/> Quay lại
                        </Link>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                            <div className="bg-indigo-600 p-2 rounded-lg text-white"><ImageIcon size={24}/></div>
                            Tạo Banner Mới
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin/banner" className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 transition-all">Hủy</Link>
                        <button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Hoàn tất
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Cột chính */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề Banner</label>
                                    <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium" placeholder="Nhập tên chương trình quảng cáo..."/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Đường dẫn đích (Link URL)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                                        <input type="text" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} className="w-full pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" placeholder="https://..."/>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả nội dung</label>
                                    <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all h-32" placeholder="Thông điệp truyền tải trên banner..."/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cột phụ */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hình ảnh */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <label className="block text-sm font-bold text-slate-700 mb-4">Hình ảnh hiển thị</label>
                            <div className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden hover:border-indigo-400 transition-colors group">
                                {preview ? (
                                    <img src={preview} className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="text-center">
                                        <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3 text-slate-400 group-hover:text-indigo-600 transition-colors"><Upload size={24}/></div>
                                        <p className="text-xs font-bold text-slate-400">Tải ảnh lên (Recommended: 1920x600)</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
                            </div>
                        </div>

                        {/* Phân loại */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Vị trí</label>
                                    <select value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 font-bold text-slate-700">
                                        <option value="slideshow">Slide trang chủ</option>
                                        <option value="ads">Vị trí quảng cáo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Trạng thái</label>
                                    <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 font-bold text-slate-700">
                                        <option value="1">Kích hoạt (Hiện)</option>
                                        <option value="0">Tạm khóa (Ẩn)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}