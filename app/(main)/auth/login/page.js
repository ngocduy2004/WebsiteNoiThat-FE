"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import * as authService from "../../../../services/authService";
import cartService from "../../../../services/CartService"; // Đảm bảo import đúng đường dẫn

// Thành phần Login chính
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [username, setUsername] = useState(""); // Dùng username làm email/tên đăng nhập
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy tham số redirect từ URL, mặc định là "/" nếu không có
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Gọi API đăng nhập từ authService
      const data = await authService.login(username, password);

      // 2. Cập nhật trạng thái vào Context toàn App
      if (data.user) {
        login(data.user);
      }

      // Lưu token vào localStorage (thường authService đã làm, nhưng làm lại cho chắc chắn)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // 3. THỰC HIỆN MERGE CART NGAY LẬP TỨC
      // Sau khi có token, đẩy hàng từ LocalStorage lên Database
      try {
        await cartService.mergeCart();
      } catch (cartErr) {
        console.error("Lỗi đồng bộ giỏ hàng:", cartErr);
        // Không chặn quá trình đăng nhập nếu merge giỏ hàng lỗi
      }

      alert("Đăng nhập thành công!");

      // 4. ĐIỀU HƯỚNG DỰA TRÊN ROLE HOẶC THAM SỐ REDIRECT
      const role = String(data.role || data.user?.role || "").toLowerCase();

      if (role === "admin") {
        router.push("/admin");
      } else {
        // Nếu có tham số redirect (ví dụ /cart), ưu tiên quay lại đó
        router.push(redirectTo);
      }

      // Làm mới để Header cập nhật trạng thái mới
      router.refresh();

    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      setError(err?.message || "Tên đăng nhập hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ĐĂNG NHẬP
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm border border-red-200 p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Tên đăng nhập hoặc email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Nhập email hoặc tên đăng nhập"
              className="w-full border border-gray-300 h-12 px-3 focus:border-black outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
              className="w-full border border-gray-300 h-12 px-3 focus:border-black outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </button>

          <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
            <Link
              href="/forgot-password"
              className="hover:underline text-gray-500"
            >
              Quên mật khẩu?
            </Link>
            <Link href="/auth/register" className="font-bold hover:underline">
              Đăng ký tài khoản
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Bọc trong Suspense vì dùng useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
      <LoginContent />
    </Suspense>
  );
}