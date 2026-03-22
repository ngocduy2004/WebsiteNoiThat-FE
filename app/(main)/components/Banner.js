'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BannerService from '../../../services/BannerService';

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    const getBannerUrl = (imagePath) => {
        if (!imagePath) return "https://placehold.co/1920x850?text=No+Image";
        if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) return imagePath;
        // Xóa dấu / ở đầu nếu có để tránh lỗi nối chuỗi dư dấu /
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        return `http://localhost/CDTT_Backend/public/${cleanPath}`;
    };

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await BannerService.getList();
                let bannerList = res?.data?.data || res?.data || res || [];

                const activeSlides = bannerList.filter(
                    (b) => Number(b.status) === 1 && b.position === 'slideshow'
                );
                setSlides(activeSlides);
            } catch (error) {
                console.error('❌ Lỗi tải banner:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    // Hiệu ứng Loading Skeleton cao 850px
    if (loading) {
        return (
            <div className="w-full h-[500px] md:h-[700px] lg:h-[850px] bg-gray-200 animate-pulse" />
        );
    }

    if (slides.length === 0) return null;

    return (
        /* Thay đổi: h-[850px] cho màn hình lớn, bỏ rounded nếu muốn full sát mép màn hình */
        <div className="relative w-full h-[500px] md:h-[700px] lg:h-[850px] overflow-hidden group shadow-xl">
            {/* Slides */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentSlide
                            ? 'opacity-100 scale-100 z-10'
                            : 'opacity-0 scale-105 z-0'
                            }`}
                    >
                        {/* Lớp phủ tối dần phía dưới để nổi bật chữ */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-[1]" />

                        <Link href={slide.link || '#'} className="block w-full h-full">
                            <img
                                src={getBannerUrl(slide.image)}
                                alt={slide.name}
                                // object-cover đảm bảo hình luôn lấp đầy chiều cao 850px mà không bị méo
                                className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear transform scale-100 group-hover:scale-110"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://placehold.co/1920x850?text=Image+Not+Found";
                                }}
                            />

                            {/* Nội dung banner */}
                            <div className="absolute bottom-24 left-8 md:left-20 z-[2] text-white max-w-2xl">
                               
                                <p className="text-lg md:text-xl mb-6 opacity-90 drop-shadow-md hidden md:block">
                                    Khám phá bộ sưu tập mới nhất với ưu đãi hấp dẫn ngay hôm nay.
                                </p>
                                <button className="px-8 py-3 bg-white text-black font-bold rounded-sm uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300 shadow-2xl transform hover:-translate-y-1">
                                    Mua ngay
                                </button>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Nút Điều Hướng hiện đại */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white backdrop-blur-md text-white hover:text-black rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-10 group-hover:translate-x-0"
                    >
                        <span className="text-3xl">❮</span>
                    </button>

                    <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white backdrop-blur-md text-white hover:text-black rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-10 group-hover:translate-x-0"
                    >
                        <span className="text-3xl">❯</span>
                    </button>

                    {/* Thanh chỉ số (Indicators) dạng vạch nằm ngang */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1 transition-all duration-500 ${index === currentSlide
                                    ? 'w-16 bg-white'
                                    : 'w-8 bg-white/40 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Banner;