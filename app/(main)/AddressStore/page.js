"use client";
import React from "react";
import Link from "next/link";
import { Store, Map, Clock, MapPin, Phone, Mail, Car, ArrowRight } from "lucide-react";

// Tái định nghĩa StoreCard trong phạm vi file để đảm bảo tính toàn vẹn
const StoreCard = ({ name, hours, area, phone, email, oldAddress, currentAddress, isLast }) => (
  <div className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-red-500 ${!isLast ? 'mb-10' : ''}`}>

    {/* 1. Tên và Giờ làm việc */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-gray-100 pb-3">
      <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-2 md:mb-0">{name}</h3>
      <div className="flex items-center text-sm text-green-600 font-semibold flex-shrink-0">
        <Clock size={16} className="mr-1" />
        {hours}
      </div>
    </div>

    {/* 2. Chi tiết thông tin */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {/* Cột 1: Thông tin cơ bản */}
      <div className="space-y-3">
        <p className="flex items-center text-gray-700">
          <Car size={18} className="text-blue-500 mr-2 flex-shrink-0" />
          <span className="font-semibold">Diện tích:</span> {area}
        </p>
        <p className="flex items-center text-gray-700">
          <Phone size={18} className="text-blue-500 mr-2 flex-shrink-0" />
          <span className="font-semibold">Điện thoại:</span> {phone}
        </p>
        <p className="flex items-start text-gray-700 break-words">
          <Mail size={18} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="font-semibold">Email:</span>
          <a href={`mailto:${email}`} className="underline hover:text-gray-900 ml-1 text-sm break-all">
            {email}
          </a>
        </p>
      </div>

      {/* Cột 2: Địa chỉ hiện tại */}
      <div className="space-y-3 md:col-span-2 lg:col-span-1">
        <p className="text-gray-800 font-bold flex items-start">
          <MapPin size={18} className="text-gray-800 mr-2 flex-shrink-0 mt-0.5" />
          Địa chỉ: {currentAddress}
        </p>
        <p className="text-red-600 text-sm italic flex items-start mt-2">
          <MapPin size={16} className="text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          Địa chỉ cũ: {oldAddress}
        </p>
      </div>

      {/* Cột 3: Hành động */}
      <div className="flex flex-col justify-end items-start lg:items-end">
        <a
          href="https://www.google.com/maps/place/Nh%C3%A0+Xinh/@10.8016599,106.7387166,15z/data=!4m5!3m4!1s0x0:0xdcfb31733d5ee699!8m2!3d10.801661!4d106.7387165"
          className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-black transition duration-300 flex items-center shadow-lg"
        >
          Xem hướng đi <ArrowRight size={18} className="ml-2" />
        </a>
      </div>
    </div>
  </div>
);


const StorePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner */}
      <div
        className="relative w-full h-[610px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://nhaxinh.com/wp-content/uploads/2021/11/1920x650-1.jpg')",
        }}>
        <div className="text-center translate-y-50">
          <h1 className="text-white text-3xl font-bold drop-shadow-lg ">
            HỆ THỐNG CỬA HÀNG NỘI THẤT NHÀ XINH
          </h1>
        </div>
      </div>

      {/* Nội dung cửa hàng */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">

        {/* --- KHU VỰC TP.HCM --- */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-red-500 pb-3 flex items-center gap-3">
            <Map size={24} className="text-red-500" />
            TP. HỒ CHÍ MINH
          </h2>

          {/* ====== Chi nhánh Thảo Điền ====== */}
          <StoreCard
            name="CỬA HÀNG NHÀ XINH (THẢO ĐIỀN)"
            hours="8h30 – 21h (Cả tuần)"
            area="900 m² (Có chỗ đậu xe ô tô)"
            phone="(028) 3535 1505 | 0902 353 351"
            email="nhaxinhthaodien@akacompany.com.vn"
            oldAddress="107 – 109 Võ Nguyên Giáp (Xa Lộ Hà Nội cũ), Phường Thảo Điền, Quận 2, TP. HCM (Gần Masteri Thảo Điền)"
            currentAddress="107 – 109 Võ Nguyên Giáp, Phường An Khánh, Thành phố Thủ Đức, TP. HCM"
          />

          {/* ====== Chi nhánh Phú Mỹ Hưng ====== */}
          <StoreCard
            name="CỬA HÀNG NHÀ XINH (PHÚ MỸ HƯNG)"
            hours="8h00 – 20h00 (T2–T6) / 8h30 – 20h30 (T7–CN)"
            area="3000 m² (Có chỗ đậu xe ô tô)"
            phone="(028) 5413 6657 | 0974 163 015"
            email="nhaxinh_pmh@akacompany.com.vn"
            oldAddress="111 Đ. Tôn Dật Tiên, Tân Phú, Quận 7, Hồ Chí Minh"
            currentAddress="111 Đ. Tôn Dật Tiên, Phường Tân Mỹ, Quận 7, TP. HCM"
          />
        </div>

        {/* --- KHU VỰC HÀ NỘI (Dữ liệu mẫu) --- */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-red-500 pb-3 flex items-center gap-3">
            <Map size={24} className="text-red-500" />
            HÀ NỘI
          </h2>

          {/* ====== Chi nhánh Tây Hồ ====== */}
          <StoreCard
            name="CỬA HÀNG NHÀ XINH (TÂY HỒ)"
            hours="9h00 – 21h (Cả tuần)"
            area="500 m² (Có chỗ đậu xe ô tô)"
            phone="(024) 3785 5885 | 0918 888 888"
            email="nhaxinh_th@akacompany.com.vn"
            oldAddress="68 Đ. Xuân Diệu, Quận Tây Hồ, Hà Nội"
            currentAddress="68 Đ. Xuân Diệu, Phường Quảng An, Quận Tây Hồ, Hà Nội"
          />

          {/* ====== Chi nhánh Hoàn Kiếm ====== */}
          <StoreCard
            name="CỬA HÀNG NHÀ XINH (HOÀN KIẾM)"
            hours="9h00 – 21h (Cả tuần)"
            area="750 m²"
            phone="(024) 3939 3939 | 0919 191 919"
            email="nhaxinh_hk@akacompany.com.vn"
            oldAddress="120 Đ. Bà Triệu, Quận Hai Bà Trưng, Hà Nội"
            currentAddress="120 Đ. Bà Triệu, Phường Nguyễn Du, Quận Hoàn Kiếm, Hà Nội"
            isLast={true}
          />
        </div>

      </div>
    </div>
  );
};

export default StorePage;