"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
    Heart,
    ShoppingBag,
    User,
    Search,
    ChevronDown,
    PhoneCall,
    LogOut,
    FileText,
    Settings
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CategoryService from "@/services/CategoryService";

const getAvatarUrl = (avatarPath) => {
    // 1. Nếu không có ảnh -> Trả về ảnh mặc định
    if (!avatarPath) return "/images/default-avatar.png";

    // 2. Nếu là ảnh mạng (Google, Facebook) -> Giữ nguyên
    if (avatarPath.startsWith("http")) return avatarPath;

    // 3. Xử lý đường dẫn nội bộ
    // Xóa dấu / ở đầu nếu có
    const cleanPath = avatarPath.startsWith('/') ? avatarPath.substring(1) : avatarPath;

    // QUAN TRỌNG: Kiểm tra xem đường dẫn bắt đầu bằng gì
    // - Nếu bắt đầu bằng "uploads" (Backend mới) -> Giữ nguyên, KHÔNG thêm storage
    // - Nếu bắt đầu bằng "storage" (Backend cũ) -> Giữ nguyên
    if (cleanPath.startsWith('uploads') || cleanPath.startsWith('storage')) {
        return `http://localhost:8000/${cleanPath}`;
    }

    // Trường hợp dự phòng cho dữ liệu cũ (chỉ có tên file): thêm storage/
    return `http://localhost:8000/storage/${cleanPath}`;
};
const Header = () => {
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState(""); // State lưu từ khóa tìm kiếm
    const router = useRouter();
    const { user, logout, loading } = useAuth();
    /* ================= LOAD CATEGORY CHA – CON ================= */
    useEffect(() => {
        CategoryService.getTree()
            .then(res => {
                setCategories(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.error("CATEGORY TREE ERROR:", err);
                setCategories([]);
            });
    }, []);

    // Hàm xử lý tìm kiếm
    const handleSearch = () => {
        if (keyword.trim()) {
            // Chuyển hướng đến trang tìm kiếm với query param 'keyword'
            // Ví dụ: /search?keyword=iphone
            router.push(`/Search?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    // Xử lý khi nhấn phím Enter trong ô input
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    if (loading) {
        return null; // hoặc skeleton
    }
    return (
        <header className="shadow-md bg-white">
            {/* ================= HEADER TOP ================= */}
            <div className="flex justify-between items-center px-16 py-4 text-xs md:text-sm border-b border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 font-medium hidden sm:flex pr-7">
                        <Image
                            src="/images/vi.png"
                            alt="VN"
                            width={16}
                            height={16}
                            className="rounded-full"
                        />
                        <span className="text-gray-400">VN</span>
                        <span className="text-gray-900">EN</span>
                    </div>

                    <div className="flex items-center space-x-4 pl-3">
                        <span className="hidden md:flex items-center space-x-1 font-bold text-black">
                            <PhoneCall size={15} />
                            <span>0967106379</span>
                        </span>
                        <Link href="/about/" className="text-gray-500 hover:text-black hidden lg:block">
                            Giới thiệu
                        </Link>
                        <span className="text-gray-500 hidden lg:block">Khuyến mại</span>
                        <Link
                            href="/Promotion" // Thay đường dẫn mong muốn của bạn vào đây
                            className="text-red-600 hidden lg:block font-medium hover:underline cursor-pointer"
                        >
                            Giảm giá đặc biệt
                        </Link>

                        <Link href="/Contact/" className="text-gray-500 hover:text-black hidden lg:block">
                            Thiết kế nội thất
                        </Link>

                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Heart size={20} className="text-gray-500 hover:text-red-600 cursor-pointer" />

                    <Link href="/cart/" className="relative">
                        <ShoppingBag size={20} className="text-gray-500 hover:text-red-600" />
                        <span className="absolute -top-1 -right-1 text-white h-4 w-4 rounded-full text-xs flex items-center justify-center">
                        </span>
                    </Link>

                    {!user ? (
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="font-semibold text-gray-700 hover:text-amber-500 transition"
                        >
                            Đăng nhập
                        </button>
                    ) : (
                        <div className="relative group py-2">
                            {/* User Info Trigger */}
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                    <Image
                                        // SỬA LỖI Ở ĐÂY: Dùng hàm getAvatarUrl thay vì biến previewAvatar
                                        src={getAvatarUrl(user?.avatar)}
                                        alt="Avatar"
                                        width={32}
                                        height={32}
                                        className="object-cover w-full h-full"
                                        unoptimized={true} // Giữ nguyên dòng này để sửa lỗi Private IP
                                        onError={(e) => {
                                            // Logic chống lặp vô hạn khi ảnh default cũng lỗi
                                            if (e.currentTarget.src !== window.location.origin + "/images/default-avatar.png") {
                                                e.currentTarget.src = "/images/default-avatar.png";
                                            }
                                        }}
                                    />
                                </div>
                                <span className="font-medium text-gray-700 max-w-[150px] truncate">
                                    {user.name}
                                </span>
                                <ChevronDown size={14} className="text-gray-500 group-hover:rotate-180 transition-transform" />
                            </div>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full w-56 bg-white shadow-xl rounded-md border border-gray-100 
                                opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                                transition-all duration-200 z-[100] overflow-hidden">

                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <p className="text-xs text-gray-500">Xin chào,</p>
                                    <p className="font-bold text-gray-800 truncate">{user.name}</p>
                                </div>

                                <ul className="py-1">
                                    <li>
                                        <Link href="/Profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600">
                                            <User size={16} className="mr-2" /> Thông tin cá nhân
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/Order" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600">
                                            <FileText size={16} className="mr-2" /> Lịch sử đơn hàng
                                        </Link>
                                    </li>
                                    <li className="border-t border-gray-100 mt-1">
                                        <button
                                            onClick={() => { logout(); router.push("/auth/login"); }}
                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={16} className="mr-2" /> Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* ================= HEADER MAIN ================= */}
            <div className="flex justify-between items-center px-16 py-4">
                <div className="flex items-center">
                    {/* LOGO */}
                    <Link href="/" className="mr-8">
                        <Image
                            src="/images/backround.png"
                            alt="Logo"
                            width={170}
                            height={170}
                        />
                    </Link>

                    {/* ================= MENU DESKTOP ================= */}
                    <nav className="hidden lg:flex space-x-8 items-center">
                        {/* ================= MỤC TẤT CẢ SẢN PHẨM (MEGA MENU) ================= */}
                        <div className="relative group">
                            <button className="text-gray-800 text-sm py-3 flex items-center hover:text-amber-500 transition uppercase">
                                Sản phẩm
                                <ChevronDown size={14} className="ml-1 group-hover:rotate-180 transition-transform" />
                            </button>

                            {/* Dropdown bao phủ tất cả danh mục */}
                            <div className="absolute left-0 top-full w-[600px] bg-white shadow-xl border-t-2 border-amber-500 rounded-b-md 
                    opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                    transition-all duration-300 z-50 p-6">
                                <div className="grid grid-cols-3 gap-6">
                                    {categories.map((cat) => (
                                        <div key={cat.id}>
                                            {/* Tiêu đề danh mục cha */}
                                            <Link
                                                href={`/category/${cat.slug}`}
                                                className="font-bold text-gray-900 text-sm mb-2 block hover:text-amber-600 border-b pb-1"
                                            >
                                                {cat.name}
                                            </Link>

                                            {/* Danh sách con */}
                                            <ul className="space-y-1 mt-2">
                                                {cat.children?.map((child) => (
                                                    <li key={child.id}>
                                                        <Link
                                                            href={`/category/${child.slug}`}
                                                            className="text-gray-600 text-xs hover:text-amber-500 transition block py-1"
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ================= CÁC DANH MỤC LẺ (GIỮ NGUYÊN CODE CỦA BẠN) ================= */}
                        {categories.map((cat) => (
                            <div key={cat.id} className="relative group">
                                <Link
                                    href={`/category/${cat.slug}`}
                                    className="text-gray-800 text-sm font-medium py-3 flex items-center hover:text-amber-400 transition uppercase"
                                >
                                    {cat.name}
                                    {cat.children?.length > 0 && (
                                        <ChevronDown size={14} className="ml-1" />
                                    )}
                                </Link>

                                {cat.children?.length > 0 && (
                                    <div className="absolute left-0 top-full w-56 bg-white shadow-lg rounded-md 
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                        transition-all duration-200 z-50 border-t border-gray-100">
                                        <ul className="py-2">
                                            {cat.children.map(child => (
                                                <li key={child.id}>
                                                    <Link
                                                        href={`/category/${child.slug}`}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-500"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}

                        <Link href="/post" className="text-gray-800 text-sm font-medium py-3 hover:text-amber-400 uppercase">
                            GÓC CẢM HỨNG
                        </Link>

                    </nav>
                </div>

                {/* ================= SEARCH ================= */}
                <div className="flex items-center bg-gray-100 rounded-full h-10 w-40 sm:w-60 md:w-80 border">
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        className="flex-grow px-4 bg-transparent outline-none text-sm text-gray-700"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown} // Bắt sự kiện nhấn phím Enter
                    />
                    <button
                        className="p-3 text-gray-600 hover:text-red-600"
                        onClick={handleSearch} // Bắt sự kiện click nút tìm kiếm
                    >
                        <Search size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
