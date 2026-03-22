"use client";

import { LogOut, ChevronRight, User } from "lucide-react"; // Thêm icon User để làm ảnh mặc định
import navItems from "./NavItems";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Định nghĩa đường dẫn gốc của API/Backend để lấy ảnh
    const BACKEND_URL = "http://localhost:8000"; // Thay đổi theo URL backend của bạn

    if (loading) return null;
    if (!user) return null;

    const handleLogout = () => {
        logout();
        router.replace("/auth/login");
    };

    return (
        <aside className="w-72 bg-[#0f172a] text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50 font-sans">
            {/* 1. HEADER - BRANDING */}
            <div className="h-24 flex items-center px-6 border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4 w-full">
                    
                    {/* Logo Avatar - CẬP NHẬT Ở ĐÂY */}
                    <div className="relative group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 overflow-hidden border border-slate-700 group-hover:border-blue-500 transition-all">
                            {user.avatar ? (
                                <img 
                                    src={`${BACKEND_URL}/${user.avatar}`} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Nếu ảnh lỗi, tự động quay về hiện chữ cái đầu
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = user.name.charAt(0).toUpperCase();
                                    }}
                                />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        {/* Status dot nằm đè lên avatar */}
                        <div className="absolute -bottom-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0f172a]"></span>
                        </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-white truncate text-sm leading-tight hover:text-blue-400 transition-colors cursor-default">
                            {user.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase py-0.5 px-1.5 bg-emerald-500/10 rounded">
                                {user.role || "Admin"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MENU LIST */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">
                    Main Menu
                </p>
                
                {navItems.map((item, i) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    
                    return (
                        <Link
                            key={i}
                            href={item.href}
                            className={`group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden
                                ${isActive 
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                                    : "hover:bg-slate-800/50 hover:text-white"
                                }`
                            }
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <item.icon 
                                    size={20} 
                                    className={`transition-transform duration-300 group-hover:scale-110 
                                        ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"}`} 
                                />
                                <span>{item.label}</span>
                            </div>

                            {isActive && (
                                <ChevronRight size={16} className="text-blue-200 animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* 3. FOOTER - LOGOUT */}
            <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white transition-all duration-300 group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Đăng xuất hệ thống</span>
                </button>
            </div>
        </aside>
    );
}