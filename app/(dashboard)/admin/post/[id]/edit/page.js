"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PostService from "@/services/PostService";

// Cấu hình URL ảnh để hiển thị ảnh cũ
const IMAGE_BASE_URL = "http://localhost:8000/storage/";

export default function EditPost() {
    const router = useRouter();
    const { id } = useParams();

    // Thêm state để xử lý file và preview ảnh
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [form, setForm] = useState({
        topic_id: "",
        title: "",
        description: "",
        content: "",
        post_type: 1,
        status: 1,
    });

    const [loading, setLoading] = useState(false);

    // =========================
    // LOAD POST DETAIL
    // =========================
    // =========================
    // LOAD POST DETAIL
    // =========================
  // =========================
    // LOAD POST DETAIL (ĐÃ FIX LỖI)
    // =========================
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await PostService.getDetail(id);
                console.log("🔍 API Response Debug:", res); // F12 để xem cấu trúc thực tế

                // FIX LỖI: Tự động phát hiện cấu trúc dữ liệu
                // Trường hợp 1: Axios chuẩn (res.status = 200, dữ liệu nằm trong res.data)
                // Trường hợp 2: Đã qua Interceptor (res chính là dữ liệu trả về từ Laravel)
                const apiData = (res.status === 200 && res.data) ? res.data : res;

                if (apiData.status) {
                    const post = apiData.data; // Lấy dữ liệu bài viết thật

                    if (post) {
                        setForm({
                            topic_id: post.topic_id,
                            title: post.title,
                            description: post.description || "",
                            content: post.content,
                            post_type: post.post_type,
                            status: post.status,
                        });

                        // Hiển thị ảnh cũ
                        if (post.image) {
                            const imgUrl = post.image.startsWith("http") 
                                ? post.image 
                                : IMAGE_BASE_URL + post.image;
                            setPreviewImage(imgUrl);
                        }
                    } else {
                        console.error("❌ Lỗi: Có status=true nhưng không có data bài viết");
                    }
                } else {
                    alert(apiData.message || "Không tìm thấy bài viết");
                }
            } catch (err) {
                console.error("❌ Lỗi call API:", err);
            }
        })();
    }, [id]);
    // =========================
    // HANDLE CHANGE INPUT TEXT
    // =========================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // =========================
    // [MỚI] HANDLE CHANGE FILE
    // =========================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file)); // Tạo link ảnh tạm để xem
        }
    };

    // =========================
    // SUBMIT UPDATE
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // [SỬA ĐỔI] Dùng FormData thay vì JSON để gửi file
            const formData = new FormData();

            // Laravel yêu cầu gửi POST kèm _method: PUT khi có file
            formData.append("_method", "PUT");

            formData.append("topic_id", form.topic_id);
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("content", form.content);
            formData.append("post_type", form.post_type);
            formData.append("status", form.status);

            // Nếu người dùng chọn ảnh mới thì gửi, không thì thôi (giữ ảnh cũ)
            if (imageFile) {
                formData.append("image", imageFile);
            }

            // Gọi API Update
            await PostService.update(id, formData);

            alert("✅ Cập nhật bài viết thành công");
            router.push("/admin/post");
        } catch (err) {
            console.error(err);
            alert("❌ Cập nhật bài viết thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6">
                ✏️ Cập nhật bài viết
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

                <input
                    type="number"
                    name="topic_id"
                    value={form.topic_id}
                    onChange={handleChange}
                    placeholder="Topic ID"
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Tiêu đề bài viết"
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                {/* [SỬA ĐỔI] Thay input text bằng input file */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border px-4 py-2 rounded"
                    />
                    {/* Hiển thị ảnh xem trước */}
                    {previewImage && (
                        <div className="mt-2">
                            <img src={previewImage} alt="Preview" className="h-32 w-auto object-cover rounded border" />
                        </div>
                    )}
                </div>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Mô tả ngắn"
                    className="w-full border px-4 py-2 rounded"
                    rows={2}
                />

                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Nội dung bài viết"
                    className="w-full border px-4 py-2 rounded"
                    rows={6}
                    required
                />

                <select
                    name="post_type"
                    value={form.post_type}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                >
                    <option value={1}>Bài viết</option>
                    <option value={2}>Trang</option>
                </select>

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                >
                    <option value={1}>Hiển thị</option>
                    <option value={0}>Ẩn</option>
                </select>

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Đang cập nhật..." : "Cập nhật bài viết"}
                </button>
            </form>
        </div>
    );
}