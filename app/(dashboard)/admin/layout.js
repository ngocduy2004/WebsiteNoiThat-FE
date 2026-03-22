import { Inter } from "next/font/google"; // Đổi sang font Inter cho hiện đại
import { AuthProvider } from "../../context/AuthContext";
import "../../globals.css";
import Sidebar from "./components/Sidebar";

// Font Inter (Google Font chuẩn cho Dashboard)
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Dashboard Pro",
  description: "Hệ thống quản trị cao cấp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <div className="min-h-screen flex relative">
            
            {/* 1. Sidebar Fixed */}
            <Sidebar />

            {/* 2. Main Content Wrapper */}
            {/* ml-72: Đẩy sang phải 288px (khớp w-72 của sidebar mới) */}
            <div className="flex-1 ml-72 flex flex-col min-h-screen w-full transition-all duration-300">
                
                {/* (Optional) Top Header nếu cần */}
                {/* <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-slate-700">Dashboard Overview</h1>
                </header> */}

                {/* Main Body */}
                <main className="flex-1 p-8 w-full max-w-7xl mx-auto">
                    {children}
                </main>

                {/* Footer Admin */}
                <footer className="py-6 text-center text-xs text-slate-400">
                    &copy; 2026 Admin System. All rights reserved.
                </footer>
            </div>
            
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}