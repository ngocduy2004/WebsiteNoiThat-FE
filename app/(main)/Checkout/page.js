"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, ChevronLeft, ShieldCheck, MapPin, Info } from 'lucide-react'; 
import OrderService from '../../../services/OrderService';
import cartService from '../../../services/CartService';

const Checkout = () => {
    const router = useRouter();

    // 1. State Cart & Form (Giữ nguyên logic)
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cod'); 
    const [formData, setFormData] = useState({
        user_id: 1,
        name: '', email: '', phone: '', address: '', note: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingCart, setFetchingCart] = useState(true);

    // 2. Fetch Data (Giữ nguyên logic)
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const data = await cartService.getCart();
                if (data && data.items && data.items.length > 0) {
                    setCartItems(data.items);
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error("Lỗi tải giỏ hàng:", error);
                router.push('/cart');
            } finally {
                setFetchingCart(false);
            }
        };

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setFormData(prev => ({
                    ...prev,
                    user_id: user.id || 1,
                    name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || ''
                }));
            } catch (e) { }
        }
        fetchCartData();
    }, [router]);

    const getEffectivePrice = (item) => {
        const originalPrice = Number(item.product?.price_buy || 0);
        const salePrice = Number(item.product?.sale_price || 0);
        if (salePrice > 0 && salePrice < originalPrice) return salePrice;
        return originalPrice || Number(item.price || 0);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (getEffectivePrice(item) * item.quantity), 0);
    const shippingFee = subtotal > 2000000 || subtotal === 0 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            ...formData,
            status: 1,
            payment_method: paymentMethod,
            items: cartItems.map(item => ({
                product_id: item.product_id,
                price: getEffectivePrice(item),
                qty: item.quantity,
                discount: 0
            }))
        };

        try {
            const response = await OrderService.create(payload);
            if (response && response.status) {
                if (paymentMethod === 'vnpay' && response.payment_url) {
                    window.location.href = response.payment_url;
                } else {
                    await cartService.clearCart();
                    router.push('/thank-you');
                }
            } else {
                alert(response.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingCart) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-medium italic">Đang chuẩn bị đơn hàng...</p>
        </div>
    );

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-20">
            {/* Header đơn giản cho Checkout */}
            <div className="bg-white border-b border-zinc-100 mb-8">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <button onClick={() => router.back()} className="flex items-center text-zinc-500 hover:text-zinc-900 transition-colors">
                        <ChevronLeft size={20} />
                        <span className="text-sm font-medium">Quay lại giỏ hàng</span>
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">THANH TOÁN</h1>
                    <div className="w-20 md:block hidden"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Cột Trái: Thông tin khách hàng */}
                <div className="lg:col-span-7 space-y-8">
                    
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                            <h2 className="text-lg font-bold uppercase tracking-wide">Thông tin nhận hàng</h2>
                        </div>
                        
                        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-zinc-100">
                            <form id="checkoutForm" onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2 group">
                                    <label className="text-xs font-bold text-zinc-400 uppercase ml-1 mb-2 block group-focus-within:text-zinc-900 transition-colors">Họ và tên</label>
                                    <input type="text" name="name" required placeholder="Nguyễn Văn A" 
                                        className="w-full bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-900 focus:ring-0 p-4 rounded-2xl transition-all" 
                                        value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div className="group">
                                    <label className="text-xs font-bold text-zinc-400 uppercase ml-1 mb-2 block group-focus-within:text-zinc-900 transition-colors">Email</label>
                                    <input type="email" name="email" required placeholder="vi-du@email.com" 
                                        className="w-full bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-900 focus:ring-0 p-4 rounded-2xl transition-all" 
                                        value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="group">
                                    <label className="text-xs font-bold text-zinc-400 uppercase ml-1 mb-2 block group-focus-within:text-zinc-900 transition-colors">Số điện thoại</label>
                                    <input type="text" name="phone" required placeholder="090 123 4567" 
                                        className="w-full bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-900 focus:ring-0 p-4 rounded-2xl transition-all" 
                                        value={formData.phone} onChange={handleInputChange} />
                                </div>
                                <div className="md:col-span-2 group">
                                    <label className="text-xs font-bold text-zinc-400 uppercase ml-1 mb-2 block group-focus-within:text-zinc-900 transition-colors flex items-center gap-1">
                                        <MapPin size={12} /> Địa chỉ chi tiết
                                    </label>
                                    <input type="text" name="address" required placeholder="Số nhà, tên đường, phường/xã..." 
                                        className="w-full bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-900 focus:ring-0 p-4 rounded-2xl transition-all" 
                                        value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className="md:col-span-2 group">
                                    <label className="text-xs font-bold text-zinc-400 uppercase ml-1 mb-2 block group-focus-within:text-zinc-900 transition-colors">Ghi chú đơn hàng</label>
                                    <textarea name="note" placeholder="Lời nhắn cho cửa hàng hoặc shipper..." 
                                        className="w-full bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-900 focus:ring-0 p-4 rounded-2xl h-28 resize-none transition-all" 
                                        value={formData.note} onChange={handleInputChange}></textarea>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                            <h2 className="text-lg font-bold uppercase tracking-wide">Phương thức thanh toán</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* COD Option */}
                            <div 
                                onClick={() => setPaymentMethod('cod')}
                                className={`group relative p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'border-zinc-900 bg-white shadow-md' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-2xl transition-colors ${paymentMethod === 'cod' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-400 group-hover:text-zinc-600'}`}>
                                        <Truck size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">Tiền mặt (COD)</p>
                                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Thanh toán khi đơn hàng được giao tới tay bạn.</p>
                                    </div>
                                </div>
                                {paymentMethod === 'cod' && (
                                    <div className="absolute top-4 right-4 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                )}
                            </div>

                            {/* VNPAY Option */}
                            <div 
                                onClick={() => setPaymentMethod('vnpay')}
                                className={`group relative p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'vnpay' ? 'border-blue-600 bg-white shadow-md' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-100 flex items-center justify-center overflow-hidden p-2">
                                        <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" alt="VNPAY" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">VNPAY Online</p>
                                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Thanh toán qua QR, ATM hoặc Thẻ quốc tế.</p>
                                    </div>
                                </div>
                                {paymentMethod === 'vnpay' && (
                                    <div className="absolute top-4 right-4 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Cột Phải: Tóm tắt đơn hàng */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-zinc-100 sticky top-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black tracking-tight">TÓM TẮT ĐƠN HÀNG</h2>
                            <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-bold">{cartItems.length} Sản phẩm</span>
                        </div>

                        {/* Danh sách SP */}
                        <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item, index) => {
                                const price = getEffectivePrice(item);
                                const original = Number(item.product?.price_buy || 0);
                                const hasSale = price < original;

                                return (
                                    <div key={index} className="flex gap-4 items-center">
                                        <div className="relative w-20 h-20 bg-zinc-50 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-50">
                                            <img src={item.product?.thumbnail_url || "/placeholder.png"} alt={item.product?.name} className="w-full h-full object-cover" />
                                            <span className="absolute -top-1 -right-1 bg-zinc-900 text-white w-6 h-6 text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-zinc-800 truncate">{item.product?.name}</h3>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-sm font-black text-zinc-900">
                                                    {(price * item.quantity).toLocaleString("vi-VN")}₫
                                                </span>
                                                {hasSale && (
                                                    <span className="text-xs text-zinc-400 line-through italic">
                                                        {(original * item.quantity).toLocaleString("vi-VN")}₫
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Voucher / Mã giảm giá (Mô phỏng thêm cho đẹp) */}
                        <div className="flex gap-2 mb-8">
                            <input type="text" placeholder="Mã giảm giá..." className="flex-1 bg-zinc-50 border-none rounded-xl px-4 text-sm focus:ring-1 focus:ring-zinc-900" />
                            <button className="px-4 py-2 bg-zinc-100 text-zinc-400 rounded-xl text-sm font-bold cursor-not-allowed">Áp dụng</button>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-dashed border-zinc-200">
                            <div className="flex justify-between text-zinc-500 text-sm">
                                <span>Tạm tính</span>
                                <span className="font-medium">{subtotal.toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-zinc-500 text-sm">
                                <span>Phí vận chuyển</span>
                                <span className={shippingFee === 0 ? "text-green-600 font-bold" : "font-medium"}>
                                    {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}₫`}
                                </span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-zinc-900 font-bold">Tổng thanh toán</span>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-red-600 leading-none">
                                        {totalAmount.toLocaleString("vi-VN")}₫
                                    </p>
                                    <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">(Đã bao gồm VAT)</p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit" form="checkoutForm" disabled={loading}
                            className={`w-full mt-10 py-5 text-white font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.97] ${
                                loading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 hover:shadow-zinc-200'
                            }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {paymentMethod === 'vnpay' ? <CreditCard size={20} /> : <ShieldCheck size={20} />}
                                    <span className="tracking-widest uppercase">
                                        {paymentMethod === 'vnpay' ? 'Thanh toán qua VNPAY' : 'Xác nhận đặt hàng'}
                                    </span>
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-zinc-400">
                            <Info size={14} />
                            <span className="text-[11px] font-medium">Bảo mật thông tin thanh toán 100%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e4e4e7;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d4d4d8;
                }
            `}</style>
        </div>
    );
};

export default Checkout;