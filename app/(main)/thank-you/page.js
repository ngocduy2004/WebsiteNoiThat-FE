"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ArrowRight, Home, ShoppingBag } from 'lucide-react'; // Import icon
import cartService from '../../../services/CartService';
import httpAxios from '../../../services/httpAxios';

const ThankYouContent = () => {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('checking'); // checking | success | failed

    useEffect(() => {
        const checkPayment = async () => {
            const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');

            // --- TRƯỜNG HỢP 1: COD (Không có mã trả về từ VNPAY) ---
            if (!vnp_ResponseCode) {
                // Giả định là COD thành công, xóa giỏ hàng luôn
                await cartService.clearCart();
                setStatus('success');
                return;
            }

            // --- TRƯỜNG HỢP 2: VNPAY TRẢ VỀ ---
            try {
                const queryStr = searchParams.toString();
                // Gọi API backend để verify chữ ký (Secure Hash)
                const res = await httpAxios.get(`vnpay-return?${queryStr}`);

                if (res && res.status) {
                    // ✅ THANH TOÁN THÀNH CÔNG
                    setStatus('success');
                    await cartService.clearCart();
                } else {
                    // ❌ THANH TOÁN THẤT BẠI
                    setStatus('failed');
                }
            } catch (error) {
                console.warn("Lỗi xác thực thanh toán:", error);
                setStatus('failed');
            }
        };

        checkPayment();
    }, [searchParams]);

    // --- GIAO DIỆN: LOADING ---
    if (status === 'checking') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Đang xử lý...</h2>
                    <p className="text-gray-500">Vui lòng đợi trong giây lát, chúng tôi đang xác nhận kết quả thanh toán.</p>
                </div>
            </div>
        );
    }

    // --- GIAO DIỆN: THẤT BẠI ---
    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-50 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại!</h1>
                    <p className="text-gray-500 mb-8">
                        Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại hoặc chọn phương thức khác.
                    </p>

                    <div className="space-y-3">
                        <Link 
                            href="/Checkout" 
                            className="block w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowRight size={18} />
                            Thử thanh toán lại
                        </Link>
                        
                        <Link 
                            href="/" 
                            className="block w-full bg-white text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                        >
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- GIAO DIỆN: THÀNH CÔNG ---
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-green-50 max-w-lg w-full text-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">Đặt hàng thành công!</h1>
                <p className="text-gray-500 mb-8 text-lg">
                    Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được hệ thống xử lý và sẽ sớm được giao.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link 
                        href="/" 
                        className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        <Home size={18} />
                        Trang chủ
                    </Link>
                    
                    <Link 
                        href="/" 
                        className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all"
                    >
                        <ShoppingBag size={18} />
                        Tiếp tục mua
                    </Link>
                </div>

                {/* Optional: Footer text */}
                <p className="mt-8 text-xs text-gray-400">
                    Mọi thắc mắc xin vui lòng liên hệ hotline hỗ trợ.
                </p>
            </div>
        </div>
    );
};

const ThankYouPage = () => (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <ThankYouContent />
    </Suspense>
);

export default ThankYouPage;