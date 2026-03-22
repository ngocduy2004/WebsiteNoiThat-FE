"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CategoryService from "../../../../../../services/CategoryService";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); 
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    parent_id: "", 
    sort_order: "",
    status: 1,
    current_image: "", 
  });

  const [allCategories, setAllCategories] = useState([]);

  // 1️⃣ Lấy dữ liệu category
  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await CategoryService.getById(id);
        const data = res.data.data || res.data; 

        if (data) {
          setForm({
            name: data.name || "",
            slug: data.slug || "",
            description: data.description || "",
            parent_id: data.parent_id || "", 
            sort_order: data.sort_order || "",
            status: data.status ?? 1,
            current_image: data.image_url || "", 
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (id) fetchCategory();
  }, [id]);

  // 2️⃣ Lấy tất cả danh mục
  useEffect(() => {
    async function fetchAllCategories() {
      try {
        const res = await CategoryService.getList({ limit: 1000 });
        const list = res.data.data || res.data;
        if (list) {
            setAllCategories(list.filter(cat => cat.id !== Number(id))); 
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchAllCategories();
  }, [id]);

  // Handle Input
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle Submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description || "");
      formData.append("parent_id", form.parent_id || "");
      formData.append("sort_order", form.sort_order || "");
      formData.append("status", String(form.status));
      
      if (!form.parent_id && image instanceof File) {
          formData.append("image", image);
      }

      await CategoryService.update(id, formData);
      
      // ✅ SỬA ĐỔI Ở ĐÂY:
      alert("Cập nhật thành công!"); 
      router.push("/admin/category"); // Chuyển hướng về trang danh sách
      router.refresh(); // Làm mới dữ liệu trang danh sách để thấy thay đổi ngay
      
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-semibold">✏️ Chỉnh sửa danh mục</h1>
         <button onClick={() => router.back()} className="text-gray-500 underline">Quay lại</button>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white shadow rounded-lg p-6 space-y-5">
        
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Tên danh mục <span className="text-red-500">*</span></label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>

        {/* Slug */}
        <div>
          <label className="block font-medium mb-1">Slug <span className="text-red-500">*</span></label>
          <input name="slug" value={form.slug} onChange={handleChange} required className="w-full border rounded px-3 py-2 bg-gray-50" />
        </div>

        {/* Parent Category */}
        <div>
          <label className="block font-medium mb-1">Danh mục cha</label>
          <select name="parent_id" value={form.parent_id || ""} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">— Là danh mục gốc (Cha) —</option>
            {allCategories.filter(cat => !cat.parent_id).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Mô tả</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border rounded px-3 py-2" />
        </div>

        {/* --- KHU VỰC ẢNH --- */}
        {!form.parent_id && (
            <div className="border p-4 rounded bg-gray-50">
              <label className="block font-medium mb-2 text-blue-700">📸 Hình ảnh (Dành cho danh mục cha)</label>
              
              {/* Hiển thị ảnh hiện tại */}
              {form.current_image && !image && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Ảnh hiện tại:</p>
                  <img
                    src={form.current_image}
                    alt="Category Current"
                    className="w-32 h-32 object-cover rounded border bg-white"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://via.placeholder.com/150?text=Lỗi+Ảnh"; 
                    }}
                  />
                </div>
              )}

              {/* Preview ảnh mới */}
              {image && (
                  <div className="mb-3">
                    <p className="text-xs text-green-600 mb-1">Ảnh mới chọn:</p>
                    <img src={URL.createObjectURL(image)} alt="New Preview" className="w-32 h-32 object-cover rounded border border-green-500" />
                  </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
        )}

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Trạng thái</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value={1}>Hiển thị</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={() => router.push("/admin/category")} className="px-4 py-2 border rounded hover:bg-gray-100">Hủy</button>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
            {loading ? "Đang xử lý..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}