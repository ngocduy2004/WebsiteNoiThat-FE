"use client";
import React from "react";
import Image from "next/image";
import Link from 'next/link'; // ✅ sửa ở đây


const Address = () => {
    return (
        <div
            className="relative w-full h-[610px] bg-cover bg-center flex items-center justify-center mt-5"
            style={{
                backgroundImage:
                    "url('https://nhaxinh.com/wp-content/uploads/2021/11/1920x650-1.jpg')",
            }}>
            <div className="text-center translate-y-40">
                <h1 className="text-white text-7xl font-bold drop-shadow-lg mb-10">
                    Xem, chạm và cảm nhận
                </h1>
                <Link
                    href="/AddressStore/"
                    className="inline-block px-10 py-3 text-white border border-white rounded-md 
                    hover:bg-white hover:text-black transition-all">
                    Tìm cửa hàng
                </Link>
            </div>
        </div>
    );
};

export default Address;
