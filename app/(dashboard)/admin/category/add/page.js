"use client";

import { useState, useEffect } from "react";
import CategoryService from "../../../../../services/CategoryService";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Dùng router để chuyển trang mượt hơn

export default function AddCategoryPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [parentId, setParentId] = useState(0); // 0 mặc định là Cha
  const [sortOrder, setSortOrder] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load danh mục cha để đổ vào select box
  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryService.getList({ limit: 999 });
        // Tùy cấu trúc API trả về mà lấy res.data hoặc res.data.data
        const list = res.data.data || res.data || [];
        setCategories(list);
      } catch (e) {
        console.error("Lỗi load danh mục:", e);
      }
    })();
  }, []);

  // Tự động tạo slug khi nhập tên
  useEffect(() => {
    const newSlug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setSlug(newSlug);
  }, [name]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("parent_id", parentId); // Gửi 0 backend sẽ tự đổi thành null
    formData.append("sort_order", sortOrder);
    formData.append("description", description);
    formData.append("status", status);

    // Chỉ gửi ảnh nếu là danh mục cha (parentId === 0) và có chọn ảnh
    if (parentId === 0 && image) {
      formData.append("image", image);
    }

    try {
      await CategoryService.create(formData);
      alert("Thêm danh mục thành công!");
      router.push("/admin/category");
      router.refresh(); // Refresh lại dữ liệu
    } catch (error) {
      console.error("Lỗi tạo danh mục:", error);
      alert("Có lỗi xảy ra, vui lòng kiểm tra lại!");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Thêm danh mục mới</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Tên danh mục <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="border p-2 w-full rounded focus:outline-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nhập tên danh mục..."
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block mb-1 font-medium">Slug</label>
            <input
              type="text"
              className="border p-2 w-full rounded bg-gray-50 focus:outline-blue-500"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="block mb-1 font-medium">Danh mục cha</label>
            <select
              className="border p-2 w-full rounded focus:outline-blue-500"
              value={parentId}
              onChange={(e) => setParentId(Number(e.target.value))}
            >
              <option value={0}>— Là danh mục gốc (Cha) —</option>
              {categories
                .filter((cat) => !cat.parent_id) // chỉ lấy danh mục cha
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Image - Chỉ hiện khi là danh mục Cha (parentId === 0) */}
          {parentId === 0 && (
            <div className="border p-4 rounded bg-blue-50">
              <label className="block mb-2 font-medium text-blue-800">Hình ảnh (Dành cho danh mục cha)</label>
              
              {/* Preview ảnh */}
              {image && (
                  <div className="mb-3">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded border border-blue-300"
                      />
                  </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Mô tả</label>
            <textarea
              className="border p-2 w-full rounded focus:outline-blue-500"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block mb-1 font-medium">Thứ tự</label>
            <input
              type="number"
              className="border p-2 w-full rounded focus:outline-blue-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">Trạng thái</label>
            <select
              className="border p-2 w-full rounded focus:outline-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Link
              href="/admin/category"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Quay lại
            </Link>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? "Đang xử lý..." : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}