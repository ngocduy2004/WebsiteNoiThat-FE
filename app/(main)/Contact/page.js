"use client";
import React, { useState } from "react";
import { MapPin, Phone, Mail, Instagram, Youtube, Facebook } from "lucide-react";
import ContactService from "../../../services/ContactService";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        content: "",
        status: 1, // Mặc định status là 1 theo yêu cầu validate của Laravel
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Gọi hàm store từ ContactController
            const res = await ContactService.sendContact(formData);
            if (res.status) {
                alert("Gửi liên hệ thành công!");
                setFormData({ name: "", email: "", phone: "", content: "", status: 1 });
            }
        } catch (error) {
            console.error(error);
            alert("Gửi liên hệ thất bại. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white font-sans text-slate-900">
            {/* --- Tiêu đề trang --- */}
            <div className="py-12 border-b border-gray-100 text-center">
                <h1 className="text-3xl font-light tracking-widest uppercase">Liên Hệ</h1>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    
                    {/* --- Cột trái: Hệ thống Showroom --- */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Hệ thống Showroom</h2>
                            <p className="text-gray-500 leading-relaxed mb-8">
                                Trải nghiệm không gian sống đẳng cấp với các sản phẩm nội thất tinh tế tại hệ thống showroom của chúng tôi trên toàn quốc.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Showroom HCM */}
                            <div className="space-y-4">
                                <h3 className="font-bold uppercase text-sm">Showroom Hồ Chí Minh</h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <p className="flex items-start gap-3">
                                        <MapPin size={18} className="shrink-0" /> 
                                        123 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <Phone size={18} /> 1800 1234 (Miễn phí)
                                    </p>
                                    <p className="flex items-center gap-3 underline">
                                        <Mail size={18} /> cskh@nhaxinhfake.com
                                    </p>
                                </div>
                            </div>

                            {/* Showroom Hà Nội */}
                            <div className="space-y-4">
                                <h3 className="font-bold uppercase text-sm">Showroom Hà Nội</h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <p className="flex items-start gap-3">
                                        <MapPin size={18} className="shrink-0" /> 
                                        Vincom Center, Bà Triệu, Hà Nội
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <Phone size={18} /> 024 3999 9999
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kết nối mạng xã hội */}
                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="font-bold uppercase text-xs tracking-[0.2em] mb-4">Kết nối với Nhà Xinh</h3>
                            <div className="flex gap-6 text-gray-400">
                                <Instagram size={20} className="hover:text-black cursor-pointer transition" />
                                <Youtube size={20} className="hover:text-black cursor-pointer transition" />
                                <Facebook size={20} className="hover:text-black cursor-pointer transition" />
                            </div>
                        </div>
                    </div>

                    {/* --- Cột phải: Form gửi tin nhắn --- */}
                    <div className="bg-gray-50 p-8 lg:p-12 rounded-sm">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold uppercase tracking-wider mb-2">Gửi tin nhắn</h2>
                            <p className="text-sm text-gray-500">Vui lòng điền thông tin bên dưới, chúng tôi sẽ liên hệ lại sớm nhất.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input
                                type="text"
                                name="name"
                                placeholder="Họ tên *"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black outline-none transition text-sm"
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email *"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black outline-none transition text-sm"
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Số điện thoại"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black outline-none transition text-sm"
                                />
                            </div>

                            <textarea
                                name="content"
                                placeholder="Nội dung *"
                                rows="4"
                                required
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black outline-none transition text-sm resize-none"
                            ></textarea>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition duration-300 disabled:bg-gray-400"
                            >
                                {loading ? "Đang gửi..." : "Gửi liên hệ"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- Bản đồ --- */}
                <div className="mt-20 h-[450px] w-full bg-gray-100">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.261273394632!2d106.6781440757356!3d10.791295258913926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528d49488a06d%3A0xc3485749f7d6a543!2zMTIzIE5ndXnhu4VuIFbEg24gVHLhu5dpLCBQaMO6IE5odeG6rW4sIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: "grayscale(1) contrast(1.2) opacity(0.8)" }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}