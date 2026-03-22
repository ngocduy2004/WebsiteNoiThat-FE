"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, Package, DollarSign, Layers, Activity, Loader2 } from "lucide-react"; // Import icon
import Product_StoreService from "@/services/Product_StoreService";
import ProductService from "@/services/ProductService";

export default function EditProductStore() {
    const router = useRouter();
    const { id } = useParams();
    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        product_id: "",
        price_root: "",
        qty: "",
        status: 1,
    });

    const [loading, setLoading] = useState(false);

    // =========================
    // LOAD PRODUCT LIST
    // =========================
    useEffect(() => {
        (async () => {
            try {
                const res = await ProductService.getList();
                setProducts(res.data?.data || res.data || []);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    // =========================
    // LOAD PRODUCT_STORE DETAIL
    // =========================
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await Product_StoreService.getById(id);

                // res = { status: true, data: {...} }
                if (res.status) {
                    const store = res.data;

                    setForm({
                        product_id: store.product_id,
                        price_root: store.price_root,
                        qty: store.qty,
                        status: store.status,
                    });
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [id]);

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
                product_id: Number(form.product_id),
                price_root: Number(form.price_root),
                qty: Number(form.qty),
                status: Number(form.status),
            };

            await Product_StoreService.update(id, payload);

            alert("Cập nhật kho thành công");
            router.push("/admin/product_store");
        } catch (err) {
            console.error(err.response?.data);
            alert("Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // GIAO DIỆN MỚI
    // =========================
    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-600"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Cập nhật phiếu nhập</h1>
                            <p className="text-sm text-slate-500">Chỉnh sửa thông tin giá và số lượng nhập kho</p>
                        </div>
                    </div>
                </div>

                {/* FORM CARD */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* SECTION 1: SẢN PHẨM */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Chọn Sản Phẩm <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Package className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <select
                                        name="product_id"
                                        value={form.product_id}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">-- Chọn sản phẩm --</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* SECTION 2: GIÁ NHẬP */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Giá Nhập (VNĐ) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="price_root"
                                            value={form.price_root}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* SECTION 3: SỐ LƯỢNG */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Số Lượng Nhập <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Layers className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="qty"
                                            value={form.qty}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 4: TRẠNG THÁI */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Trạng Thái
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Activity className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                                    >
                                        <option value={1}>Hoạt động (Hiển thị)</option>
                                        <option value={0}>Tạm ẩn</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="pt-4 flex items-center gap-4 border-t border-slate-100 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin w-5 h-5" /> Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" /> Lưu Thay Đổi
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}