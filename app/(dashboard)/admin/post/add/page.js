"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PostService from "@/services/PostService";

const PostAdd = () => {
    const router = useRouter();

    // Tách riêng state cho file ảnh và các field text khác
    const [imageFile, setImageFile] = useState(null); // Lưu file ảnh upload
    const [previewImage, setPreviewImage] = useState(null); // Lưu URL để preview ảnh

    const [form, setForm] = useState({
        topic_id: "",
        title: "",
        description: "",
        content: "",
        post_type: 1,
        status: 1,
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Hàm xử lý khi chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file)); // Tạo URL tạm để xem trước
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 🔥 QUAN TRỌNG: Dùng FormData để gửi file lên server
            const formData = new FormData();
            formData.append("topic_id", form.topic_id);
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("content", form.content);
            formData.append("post_type", form.post_type);
            formData.append("status", form.status);

            // Chỉ append nếu có file ảnh
            if (imageFile) {
                formData.append("image", imageFile);
            }

            // Gọi API (Lưu ý: Content-Type sẽ tự động được set là multipart/form-data bởi axios/fetch)
            const res = await PostService.create(formData);

            if (res.data.status) {
                alert("✅ Thêm bài viết thành công");
                router.push("/admin/post");
            } else {
                alert(res.data.message || "❌ Thêm bài viết thất bại");
            }
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra khi thêm bài viết");
        }
    };

    return (
        <div className="mx-auto mt-10 p-4 max-w-5xl">
            <div className="flex justify-center">
                <div className="w-full">
                    <div className="bg-white shadow-xl rounded-xl overflow-hidden">

                        {/* HEADER */}
                        <div className="bg-indigo-600 text-white p-4">
                            <h4 className="text-2xl font-semibold text-center">
                                📝 Thêm Bài Viết Mới
                            </h4>
                        </div>

                        {/* BODY */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                                    {/* TOPIC ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Topic ID
                                        </label>
                                        <input
                                            type="number"
                                            name="topic_id"
                                            value={form.topic_id}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    {/* TITLE */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            🏷️ Tiêu đề
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                            required
                                        />
                                    </div>

                                    {/* IMAGE UPLOAD (SỬA ĐỔI) */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            🖼️ Ảnh đại diện
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-indigo-50 file:text-indigo-700
                                                    hover:file:bg-indigo-100"
                                            />
                                            {/* Preview ảnh nếu có */}
                                            {previewImage && (
                                                <div className="w-20 h-20 border rounded-lg overflow-hidden relative">
                                                    <img 
                                                        src={previewImage} 
                                                        alt="Preview" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📌 Mô tả ngắn
                                        </label>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows="2"
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📄 Nội dung
                                        </label>
                                        <textarea
                                            name="content"
                                            value={form.content}
                                            onChange={handleChange}
                                            rows="6"
                                            className="w-full p-2 border rounded-lg"
                                            required
                                        />
                                    </div>

                                    {/* POST TYPE */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Loại bài viết
                                        </label>
                                        <select
                                            name="post_type"
                                            value={form.post_type}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg bg-white"
                                        >
                                            <option value={1}>Bài viết</option>
                                            <option value={2}>Trang</option>
                                        </select>
                                    </div>

                                    {/* STATUS */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng thái
                                        </label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg bg-white"
                                        >
                                            <option value={1}>✅ Hiển thị</option>
                                            <option value={0}>❌ Ẩn</option>
                                        </select>
                                    </div>
                                </div>

                                {/* SUBMIT */}
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                                    >
                                        💾 Lưu Bài Viết
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostAdd;