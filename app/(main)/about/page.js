"use client";
import React from "react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div>
            {/* Banner */}
            <div className="w-full h-[850px] relative">
                <Image
                    src="/images/logonhaxinh.jpg"
                    alt="Banner"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Nội dung giới thiệu */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12">
                {/* Phần lịch sử */}
                <div>
                    <h1 className="text-3xl font-semibold mb-6">LỊCH SỬ HÌNH THÀNH</h1>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                        Từ năm 1999, Nhà Xinh không ngừng sáng tạo để mang đến những thiết kế đổi mới,
                        thanh lịch và đa dạng, hòa quyện giữa nét tinh tế của gu thẩm mỹ Việt và hơi thở hiện đại.
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                        Mỗi sản phẩm là kết quả của quy trình chế tác tỉ mỉ, lựa chọn chất liệu kỹ lưỡng
                        và cam kết chất lượng bền vững theo thời gian — để không gian sống không chỉ đẹp,
                        mà còn lưu giữ những khoảnh khắc và giá trị trọn vẹn.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Nhà Xinh hiện có hệ thống cửa hàng tại Hà Nội và TP. Hồ Chí Minh với những không gian gợi cảm hứng và dịch vụ thân thiện.
                    </p>
                    <p className="mt-4 text-blue-600 font-medium">www.nhaxinh.com</p>
                </div>
            </div>
            {/* Hình ảnh + timeline */}
            <div className="max-w-7xl mx-auto px-6 pb-16 flex flex-col md:flex-row md:items-start gap-8"> {/* Thêm gap-8 để có khoảng trống giữa hình và timeline */}
                <div className="w-full md:w-1/2 relative h-[820px]">
                    <Image
                        src="/images/about.jpg"
                        alt="Chair"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                <div className="flex-1 pt-4 md:pt-0"> {/* Thêm pt-4 cho timeline trên mobile để cân đối với hình ảnh */}
                    <ul className="space-y-6 text-gray-700 text-lg"> {/* Tăng khoảng cách và kích thước chữ cho timeline */}
                        <li>
                            <span className="font-bold text-gray-900">2024:</span> 25 năm kiến tạo. Nhà Xinh bước vào giai đoạn đổi mới toàn diện...
                        </li>
                        <li>
                            <span className="font-bold text-gray-900">2019:</span> Kỷ niệm 20 năm. Hệ thống đạt 9 cửa hàng tại các khu vực chiến lược...
                        </li>
                        <li>
                            <span className="font-bold text-gray-900">2015:</span> Lột xác toàn diện về nhận diện, sản phẩm và không gian trưng bày...
                        </li>
                        <li>
                            <span className="font-bold text-gray-900">2011:</span> Hiện diện tại các khu đô thị kiểu mẫu như Phú Mỹ Hưng (TP.HCM) và Yên Hòa (HN)...
                        </li>
                        <li>
                            <span className="font-bold text-gray-900">2005:</span> Mở rộng quy mô với thêm các cửa hàng mới tại Đà Nẵng và Bình Dương.
                        </li>
                        <li>
                            <span className="font-bold text-gray-900">1999:</span> Ra đời với hai cửa hàng tại Hà Nội và TP.HCM...
                        </li>
                    </ul>
                </div>
            </div>

            {/* Hình ảnh + timeline */}
            <div className="max-w-7xl mx-auto px-6 pb-16 flex flex-col md:flex-row md:items-start gap-8"> {/* Thêm gap-8 để có khoảng trống giữa hình và timeline */}
                <div className="w-full md:w-1/2 relative h-[820px]">
                    <Image
                        src="/images/duy.jpg"
                        alt="Chair"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                <div className="flex-1 pt-4 md:pt-0"> {/* Thêm pt-4 cho timeline trên mobile để cân đối với hình ảnh */}
                    <ul className="space-y-6 text-gray-700 text-lg"> {/* Tăng khoảng cách và kích thước chữ cho timeline */}
                        <li>
                            <span className="font-bold text-gray-900">Nhà sáng lập</span>
                            <p className="text-gray-700 leading-relaxed">
                                Ông Nguyễn Ngọc Duy là người sáng lập tập đoàn AA, thương hiệu nội thất Nhà Xinh. Là một kiến trúc sư, nhà thiết kế nội thất, Ông đam mê ngành gỗ cũng như tham vọng mang thương hiệu Việt ra toàn thế giới.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Hình ảnh + timeline */}
            <div className="max-w-7xl mx-auto px-6 pb-16 flex flex-col md:flex-row md:items-start gap-8"> {/* Thêm gap-8 để có khoảng trống giữa hình và timeline */}
                <div className="w-full md:w-1/2 relative h-[820px]">
                    <Image
                        src="/images/about1.jpg"
                        alt="Chair"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                <div className="flex-1 pt-4 md:pt-0"> {/* Thêm pt-4 cho timeline trên mobile để cân đối với hình ảnh */}
                    <ul className="space-y-6 text-gray-700 text-lg"> {/* Tăng khoảng cách và kích thước chữ cho timeline */}
                        <li>
                            <span className="font-bold text-gray-900">Giá trị và sự khác biệt</span>
                            <p className="text-gray-700 leading-relaxed">
                                Với mong muốn phát triển thương hiệu Việt bằng nội lực, Nhà Xinh đã chú trọng vào thiết kế và sản xuất nội thất trong nước.
                                Danh mục sản phẩm của Nhà Xinh thường xuyên được đổi mới và cập nhật, liên tục cung cấp cho khách hàng các dòng sản phẩm theo xu hướng mới nhất.
                                Do chính người Việt thiết kế và sản xuất, nội thất thương hiệu Nhà Xinh luôn phù hợp với cuộc sống Á Đông, đem đến sự tiện nghi hoàn hảo trong mọi không gian sống.
                            </p>
                            <p className="text-gray-700 leading-relaxed py-5">
                                Hơn 70% sản phẩm của Nhà Xinh được thiết kế, sản xuất bởi đội ngũ nhân viên cùng công nhân ưu tú với nhà máy có cơ sở vật chất hiện đại bậc nhất tại Việt Nam.
                            </p>
                             <p className="text-gray-700 leading-relaxed py-5">
                                Sự khác biệt của Nhà Xinh chính là sáng tạo nội thất thành phong cách riêng, phù hợp với nhu cầu khách hàng. 
                                Không chỉ là sản phẩm nội thất đơn thuần, mà còn là không gian sống theo phong cách riêng với cách bày trí hài hòa từ đồ nội thất kết hợp với đồ trang trí. 
                                Giúp khách hàng cảm nhận được một không gian sống thực sự, cảm thấy thoải mái để tận hưởng cuộc sống.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>

             {/* Hình ảnh + timeline */}
            <div className="max-w-7xl mx-auto px-6 pb-16 flex flex-col md:flex-row md:items-start gap-8"> {/* Thêm gap-8 để có khoảng trống giữa hình và timeline */}
                <div className="w-full md:w-1/2 relative h-[420px]">
                    <Image
                        src="/images/about2.jpg"
                        alt="Chair"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                <div className="flex-1 pt-4 md:pt-0">
                    <ul className="space-y-6 text-gray-700 text-lg">
                        <li>
                            <span className="font-bold text-gray-900">Chất lượng và dịch vụ</span>
                            <p className="text-gray-700 leading-relaxed">
                               Chất lượng của nguyên vật liệu, phụ kiện và quy trình sản xuất đều được kiểm định và giám sát chặt chẽ bởi hệ thống quản lý chất lượng ISO 9001.
                                Sản phẩm của Nhà Xinh được thiết kế theo định hướng công năng sử dụng, thẩm mỹ và chất lượng. 
                                Trong những năm gần đây, thương hiệu luôn hướng đến xu hướng thiết kế xanh nhằm đóng góp không chỉ một không gian sống tiện nghi mà còn là một môi trường sống trong lành cho người sử dụng và cộng đồng.
                                Với nhiều cống hiến như vậy, Nhà Xinh vinh dự nhiều năm liền được trao tặng các danh hiệu “Hàng Việt Nam chất lượng cao”, “Trusted brand” và “Top 100 nhà cung cấp hàng đầu”.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>

             {/* Hình ảnh + timeline */}
            <div className="max-w-7xl mx-auto px-6 pb-16 flex flex-col md:flex-row md:items-start gap-8"> {/* Thêm gap-8 để có khoảng trống giữa hình và timeline */}
                <div className="w-full md:w-1/2 relative h-[420px]">
                    <Image
                        src="/images/about3.jpg"
                        alt="Chair"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>
            </div>
             <div className="max-w-7xl mx-auto px-6 pb-16 flex flex-col md:flex-row md:items-start gap-8"> {/* Thêm gap-8 để có khoảng trống giữa hình và timeline */}
                <div className="w-full md:w-1/2 relative h-[420px]">
                    <Image
                        src="/images/about4.jpg"
                        alt="Chair"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}