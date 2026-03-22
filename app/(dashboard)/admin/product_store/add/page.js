"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Thêm router để làm nút quay lại
import { ArrowLeft, Package, DollarSign, Layers, Activity, Save } from 'lucide-react'; // Import icon
import Product_StoreService from '../../../../../services/Product_StoreService';
import ProductService from '../../../../../services/ProductService';

const ProductStoreAdd = () => {
    // --- LOGIC GIỮ NGUYÊN ---
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        product_id: '',
        price_root: '',
        qty: '',
        status: 1,
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        ProductService.getList().then(res => {
            setProducts(res.data || []);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                ...form,
                product_id: Number(form.product_id),
                price_root: Number(form.price_root),
                qty: Number(form.qty),
                status: Number(form.status)
            };

            const res = await Product_StoreService.create(dataToSend);

            if (res.data.status) {
                alert('Thêm kho sản phẩm thành công');
                setForm({
                    product_id: '',
                    price_root: '',
                    qty: '',
                    status: 1,
                });
                // Có thể router.push về danh sách nếu muốn
            } else {
                alert(res.data.message || 'Thêm kho sản phẩm thất bại.');
            }
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra trong quá trình thêm sản phẩm vào kho.');
        }
    };

    // --- GIAO DIỆN MỚI ---
    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-600"
                            type="button"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Nhập kho mới</h1>
                            <p className="text-sm text-slate-500">Tạo phiếu nhập hàng vào kho sản phẩm</p>
                        </div>
                    </div>
                </div>

                {/* FORM CARD */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* 1. SẢN PHẨM */}
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
                                        id="product_id"
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
                                {/* 2. GIÁ GỐC */}
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
                                            id="price_root"
                                            value={form.price_root}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* 3. SỐ LƯỢNG */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Số Lượng <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Layers className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="qty"
                                            id="qty"
                                            value={form.qty}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                                            placeholder="0"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 4. TRẠNG THÁI */}
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
                                        id="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                                    >
                                        <option value={1}>Hoạt động</option>
                                        <option value={0}>Tạm ẩn</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" /> Lưu Phiếu Nhập
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
};

export default ProductStoreAdd;