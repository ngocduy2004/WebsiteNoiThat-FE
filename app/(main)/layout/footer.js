import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#2E2F36] text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">

        {/* KẾT NỐI VỚI NHÀ XINH */}
        <div>
          <h3 className="text-xl font-bold tracking-wide mb-3">KẾT NỐI VỚI NHÀ XINH</h3>
          <div className="w-12 h-[2px] bg-gray-500 mb-6"></div>

          {/* Logo lớn */}
          <div className="relative w-40 h-14 mb-6 opacity-90">
            <Image
              src="/images/logo6.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>

          <p className="text-sm font-semibold mb-2 opacity-80">FOLLOW US</p>
          <p className="text-sm mb-8 opacity-70 hover:opacity-100 cursor-pointer transition">
            Instagram — Youtube — Facebook
          </p>

          <a
            href="#"
            className="inline-block px-6 py-3 border border-white rounded-md hover:bg-white hover:text-black transition text-sm"
          >
            HỆ THỐNG CỬA HÀNG
          </a>
        </div>

        {/* NHÀ XINH */}
        <div>
          <h3 className="text-xl font-bold tracking-wide mb-3">NHÀ XINH</h3>
          <div className="w-12 h-[2px] bg-gray-500 mb-6"></div>

          <ul className="space-y-3 text-sm opacity-80">
            <li className="hover:opacity-100 transition cursor-pointer">Giới thiệu</li>
            <li className="hover:opacity-100 transition cursor-pointer">Chuyện Nhà Xinh</li>
            <li className="hover:opacity-100 transition cursor-pointer">Tổng công ty</li>
            <li className="hover:opacity-100 transition cursor-pointer">Tuyển dụng</li>
            <li className="hover:opacity-100 transition cursor-pointer">Thẻ hội viên</li>
            <li className="hover:opacity-100 transition cursor-pointer">Đổi trả hàng</li>
          </ul>
        </div>

        {/* CẢM HỨNG */}
        <div>
          <h3 className="text-xl font-bold tracking-wide mb-3">CẢM HỨNG #NHAXINH</h3>
          <div className="w-12 h-[2px] bg-gray-500 mb-6"></div>

          <ul className="space-y-3 text-sm opacity-80">
            <li className="hover:opacity-100 transition cursor-pointer">Sản phẩm</li>
            <li className="hover:opacity-100 transition cursor-pointer">Ý tưởng và cảm hứng</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-xl font-bold tracking-wide mb-3">NEWSLETTER</h3>
          <div className="w-12 h-[2px] bg-gray-500 mb-6"></div>

          <p className="text-sm mb-4 opacity-80 leading-relaxed">
            Hãy để lại email của bạn để nhận được những ý tưởng trang trí mới
            và những thông tin, ưu đãi từ Nhà Xinh
          </p>

          <p className="text-sm mb-1 opacity-70">Email: nhaxinhcare@akacompany.com.vn</p>
          <p className="text-sm mb-6 opacity-70">
            Hotline: <span className="font-semibold text-white">0903884358</span>
          </p>

          <div className="flex overflow-hidden rounded-md bg-white">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 text-black text-sm focus:outline-none"
            />
            <button className="bg-black text-white px-3 text-sm font-semibold hover:bg-gray-800 transition">
              GỬI
            </button>
          </div>
        </div>
      </div>

      {/* Hàng logo thương hiệu */}
      <div className="border-t border-gray-600 mt-10 pt-10 flex flex-wrap justify-center gap-24 opacity-70">
        {["logo", "logo1", "logo2", "logo3", "logo4", "logo5"].map((name) => (
          <div key={name} className="relative h-8 w-24">
            <Image
              src={`/images/${name}.png`}
              alt={name}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Dòng bản quyền */}
      <div className="text-center text-sm text-gray-400 mt-10 pt-5 leading-relaxed border-t border-gray-600">
        © 2021 – Bản quyền của Nhà Xinh – thương hiệu thuộc AKA Furniture
        <br />
        Từ năm 1999 – thương hiệu đăng ký số 284074 Cục sở hữu trí tuệ
      </div>
    </footer>
  );
}
