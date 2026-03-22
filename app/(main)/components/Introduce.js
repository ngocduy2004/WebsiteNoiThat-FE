"use client";
import React from "react";
import Image from "next/image";

const Introduce = () => {
  return (
    <div className="bg-[#7a9c59]/10 w-full overflow-hidden py-15 flex mt-5">

      {/* Ảnh lớn bên trái */}
      <div className="w-[882px] h-[1039px] relative shrink-0">
        <Image
          src="/images/gioithieu.jpg"
          alt="Banner"
          fill
          className="object-cover"
        />
      </div>

      {/* Ảnh nhỏ + nội dung bên phải */}
      <div className="w-[391px] m-20">
        {/* Ảnh nhỏ */}
        <div className="w-full h-[556px] relative">
          <Image
            src="/images/gioithieu1.jpg"
            alt="Banner nhỏ"
            fill
            className="object-cover"
          />
        </div>

        {/* Chữ mô tả */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">VỀ NHÀ XINH</h3>

          <p className="leading-relaxed text-gray-700">
            Nhà Xinh, ra đời vào năm 1999, là một trong những thương hiệu 
            tiên phong trong ngành nội thất, với nguồn cảm hứng 
            văn hóa Việt và gu thẩm mỹ tinh tế. Qua 26 năm hoạt động, 
            Nhà Xinh luôn chú trọng đổi mới để duy trì vị thế 
            là thương hiệu nội thất hàng đầu tại Việt Nam.
          </p>

          {/* Nút xem thêm */}
          <div className="mt-6 flex justify-center">
            <a
              href="/about/"
              className="px-6 py-2 text-[#7a9c59] rounded-full border border-[#7a9c59] hover:bg-[#7a9c59] hover:text-white transition-all"
            >
              Xem thêm
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
