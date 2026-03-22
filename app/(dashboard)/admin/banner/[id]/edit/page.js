"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BannerService from "../../../../../../services/BannerService";
import Link from "next/link";
import {
    Save, X, Link as LinkIcon,
    Loader2, Upload, ChevronLeft, Layout, 
    Type, AlignLeft, Info, Eye, EyeOff
} from "lucide-react";

export default function BannerEdit() {
    const router = useRouter();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        link: "",
        position: "slideshow",
        sort_order: 0,
        description: "",
        status: 1,
    });

    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [newImageFile, setNewImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const getBackendImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http") || path.startsWith("blob:")) return path;
        const baseUrl = "http://localhost:8000";
        return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    };

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await BannerService.getById(id);
                const banner = res.data?.data || res.data;
                if (banner) {
                    setForm({
                        name: banner.name || "",
                        link: banner.link || "",
                        position: banner.position || "slideshow",
                        sort_order: banner.sort_order || 0,
                        description: banner.description || "",
                        status: banner.status ?? 1,
                    });
                    setCurrentImageUrl(banner.image_url || banner.image || "");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setNewImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCancelNewImage = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setNewImageFile(null);
        setPreviewUrl("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("name", form.name.trim());
            formData.append("link", form.link || "");
            formData.append("description", form.description || "");
            formData.append("status", Number(form.status));
            formData.append("sort_order", Number(form.sort_order) || 0);
            formData.append("position", form.position || "slideshow");
            if (newImageFile) formData.append("image", newImageFile);
            await BannerService.update(id, formData);
            router.push("/admin/banner");
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <span className="text-slate-500 font-medium">Đang tải dữ liệu...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12 font-sans text-slate-900">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/banner" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Cập nhật Banner <span className="text-indigo-600">#{id}</span></h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-indigo-200"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Main Settings */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Section: General Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-50">
                                <Info size={18} className="text-indigo-500" />
                                <h2 className="font-bold text-slate-700">Thông tin cơ bản</h2>
                            </div>
                            
                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tên hiển thị</label>
                                    <div className="relative">
                                        <Type className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input 
                                            type="text" name="name" value={form.name} onChange={handleChange} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="VD: Banner khuyến mãi mùa hè"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Đường dẫn liên kết</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input 
                                            type="text" name="link" value={form.link} onChange={handleChange} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="https://example.com/san-pham"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mô tả ngắn</label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <textarea 
                                            name="description" value={form.description} onChange={handleChange} rows={3} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                                            placeholder="Nội dung hiển thị hoặc ghi chú..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Image Preview */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Layout size={18} className="text-indigo-500" />
                                    <h2 className="font-bold text-slate-700">Hình ảnh quảng cáo</h2>
                                </div>
                                {previewUrl && (
                                    <button onClick={handleCancelNewImage} className="text-xs font-semibold text-rose-500 hover:underline">Hủy ảnh mới</button>
                                )}
                            </div>

                            <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 aspect-[21/9] flex items-center justify-center transition-all hover:border-indigo-300">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                
                                {previewUrl || currentImageUrl ? (
                                    <>
                                        <img 
                                            src={previewUrl || getBackendImageUrl(currentImageUrl)} 
                                            className="w-full h-full object-cover" 
                                            alt="Preview"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                            <Upload size={32} className="mb-2" />
                                            <span className="font-bold text-sm">Thay đổi hình ảnh</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="mx-auto text-slate-300 mb-2" size={40} />
                                        <span className="text-slate-400 text-sm font-medium">Nhấp hoặc kéo thả ảnh vào đây</span>
                                    </div>
                                )}
                            </div>
                            <p className="mt-3 text-[11px] text-slate-400 italic text-center uppercase tracking-wider">Khuyên dùng tỷ lệ rộng để hiển thị đẹp nhất trên Slideshow</p>
                        </div>
                    </div>

                    {/* Sidebar Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Trạng thái hoạt động</label>
                                    <div className="flex p-1 bg-slate-200 rounded-lg">
                                        <button 
                                            onClick={() => setForm({...form, status: 1})}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${form.status == 1 ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                                        >
                                            <Eye size={14} /> Hiển thị
                                        </button>
                                        <button 
                                            onClick={() => setForm({...form, status: 0})}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${form.status == 0 ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500'}`}
                                        >
                                            <EyeOff size={14} /> Tạm ẩn
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Vị trí hiển thị</label>
                                    <select 
                                        name="position" value={form.position} onChange={handleChange} 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                    >
                                        <option value="slideshow">📺 Trang chủ (Slideshow)</option>
                                        <option value="ads">📢 Quảng cáo (Ads Sidebar)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Thứ tự ưu tiên</label>
                                    <input 
                                        type="number" name="sort_order" value={form.sort_order} onChange={handleChange} 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono" 
                                    />
                                    <p className="text-[10px] text-slate-400 pl-1 italic">Số càng nhỏ sẽ được ưu tiên hiển thị trước.</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <Link href="/admin/banner" className="w-full py-2.5 flex items-center justify-center text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors">
                                    Hủy bỏ mọi thay đổi
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}