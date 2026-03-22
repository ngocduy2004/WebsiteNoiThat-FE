"use client";
import React, { useState } from "react";
import Link from "next/link";
import { register } from "../../../../services/authService"; 
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  
  // 1. ✅ Thêm phone vào state ban đầu
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "", 
    phone: "", // Thêm trường này
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      // 2. ✅ Gửi phone lên API
      const res = await register({
        name: formData.name,
        email: formData.email,
        username: formData.username,
        phone: formData.phone, // Truyền số điện thoại vào đây
        password: formData.password,
        password_confirmation: formData.confirm_password,
      });

      console.log("Đăng ký thành công:", res);
      alert("Đăng ký thành công!");
      router.push("/auth/login");
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Đăng ký thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md bg-white shadow-md p-8 rounded-lg">
        <h1 className="text-3xl font-semibold mb-6 uppercase">Đăng ký</h1>

        {error && <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-semibold mb-1">Họ và tên *</label>
            <input
              name="name"
              type="text"
              required
              className="w-full border border-gray-200 h-11 px-3 rounded-sm"
              onChange={handleChange}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-1">Tên đăng nhập *</label>
            <input
              name="username"
              type="text"
              required
              className="w-full border border-gray-200 h-11 px-3 rounded-sm"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email *</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-gray-200 h-11 px-3 rounded-sm"
              onChange={handleChange}
            />
          </div>

          {/* 3. ✅ Ô nhập Số điện thoại */}
          <div>
            <label className="block text-sm font-semibold mb-1">Số điện thoại *</label>
            <input
              name="phone"
              type="text" // Hoặc type="tel"
              required
              className="w-full border border-gray-200 h-11 px-3 rounded-sm"
              onChange={handleChange}
              placeholder="Nhập số điện thoại của bạn"
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-semibold mb-1">Mật khẩu *</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border border-gray-200 h-11 px-3 rounded-sm"
              onChange={handleChange}
            />
          </div>

          {/* Nhập lại mật khẩu */}
          <div>
            <label className="block text-sm font-semibold mb-1">Nhập lại mật khẩu *</label>
            <input
              name="confirm_password"
              type="password"
              required
              className="w-full border border-gray-200 h-11 px-3 rounded-sm"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition-colors"
          >
            ĐĂNG KÝ
          </button>

          <div className="text-sm flex justify-between mt-4">
            <span>Đã có tài khoản?</span>
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}