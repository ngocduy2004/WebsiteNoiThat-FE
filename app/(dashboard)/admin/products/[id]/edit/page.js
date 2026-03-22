"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductService from "@/services/ProductService";
import CategoryService from "@/services/CategoryService";
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  Package,
  Type,
  Tag,
  Layers,
  X,
  AlertCircle
} from "lucide-react";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    slug: "",
    content: "",
    description: "",
    price_buy: "",
    status: 1,
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  /* ================= 1. LOAD DATA ================= */
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const resCat = await CategoryService.getList();
        if (resCat.status) setCategories(resCat.data);

        const resProd = await ProductService.getById(id);

        if (resProd.status) {
          const p = resProd.data;
          setForm({
            category_id: p.category_id,
            name: p.name,
            slug: p.slug,
            content: p.content,
            description: p.description || "",
            price_buy: p.price_buy,
            status: p.status,
          });

          setThumbnailPreview(p.thumbnail_url);
          setOldImages(p.images || []);

          const rawAttributes = p.product_attributes || p.productAttributes;
          if (rawAttributes && rawAttributes.length > 0) {
            const grouped = rawAttributes.reduce((acc, curr) => {
              const attrName = curr.attribute?.name;
              if (attrName) {
                const found = acc.find((a) => a.name === attrName);
                if (found) {
                  found.values.push(curr.value);
                } else {
                  acc.push({ name: attrName, values: [curr.value] });
                }
              }
              return acc;
            }, []);
            setAttributes(grouped);
          }
        }
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
      }
    })();
  }, [id]);

  /* ================= 2. HANDLE ATTRIBUTES ================= */
  const addAttributeRow = () => {
    setAttributes([...attributes, { name: "", values: [""] }]);
  };

  const removeAttributeRow = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeNameChange = (index, value) => {
    const newAttrs = [...attributes];
    newAttrs[index].name = value;
    setAttributes(newAttrs);
  };

  const handleValueChange = (attrIndex, valIndex, value) => {
    const newAttrs = [...attributes];
    newAttrs[attrIndex].values[valIndex] = value;
    setAttributes(newAttrs);
  };

  const addValue = (attrIndex) => {
    const newAttrs = [...attributes];
    newAttrs[attrIndex].values.push("");
    setAttributes(newAttrs);
  };

  const removeValue = (attrIndex, valIndex) => {
    const newAttrs = [...attributes];
    newAttrs[attrIndex].values = newAttrs[attrIndex].values.filter((_, i) => i !== valIndex);
    setAttributes(newAttrs);
  };

  /* ================= 3. OTHER HANDLES ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const removeOldImage = async (imgId) => {
    if (!confirm("Xoá ảnh này khỏi thư viện?")) return;
    try {
      await ProductService.deleteImage(imgId);
      setOldImages(oldImages.filter((img) => img.id !== imgId));
    } catch (error) {
      alert("Không thể xóa ảnh lúc này.");
    }
  };

  /* ================= 4. SUBMIT ================= */
  /* ================= 3. SUBMIT (BẢN CHUẨN) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Bước 1: Chuẩn hóa dữ liệu cực kỳ cẩn thận
    const cleanAttributes = attributes
      .map((attr) => ({
        name: attr.name?.trim(),
        // Chỉ giữ lại những giá trị thực sự có chữ
        values: Array.isArray(attr.values)
          ? attr.values.map(v => v.trim()).filter(v => v !== "")
          : []
      }))
      // Chỉ giữ lại nhóm thuộc tính có Tên và có ít nhất 1 giá trị hợp lệ
      .filter((attr) => attr.name !== "" && attr.values.length > 0);

    const formData = new FormData();
    formData.append("_method", "PUT"); // Laravel Spoofing

    // Append data cơ bản
    formData.append("category_id", form.category_id);
    formData.append("name", form.name);
    formData.append("content", form.content);
    formData.append("price_buy", form.price_buy);
    formData.append("status", form.status);
    formData.append("description", form.description || "");

    // Append JSON string của attributes
    formData.append("attributes", JSON.stringify(cleanAttributes));

    if (thumbnail) formData.append("thumbnail", thumbnail);
    newImages.forEach((img) => formData.append("images[]", img));

    try {
      // Luôn sử dụng ProductService.update (đã được sửa thành POST trong file service trước đó)
      const res = await ProductService.update(id, formData);
      if (res.status) {
        alert("Cập nhật thành công!");
        router.push("/admin/products");
      } else {
        alert("Lỗi: " + res.message);
      }
    } catch (err) {
      console.error("Lỗi:", err.response?.data);
      alert("Lỗi server hoặc kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Sticky Header */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Sửa sản phẩm #{id}</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/products')}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : <><Save size={18} /> Lưu thay đổi</>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CỘT TRÁI: THÔNG TIN CHÍNH */}
          <div className="lg:col-span-2 space-y-6">

            {/* Card: Thông tin cơ bản */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-6 border-b pb-4">
                <Type size={20} className="text-blue-500" /> Thông tin sản phẩm
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên sản phẩm</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border-gray-200 border px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Đường dẫn (Slug)</label>
                    <input
                      name="slug"
                      value={form.slug}
                      readOnly
                      className="w-full border-gray-200 border px-4 py-2.5 rounded-xl bg-gray-50 text-gray-500 italic cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Giá bán (VNĐ)</label>
                    <input
                      name="price_buy"
                      type="number"
                      value={form.price_buy}
                      onChange={handleChange}
                      className="w-full border-gray-200 border px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung chi tiết</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    className="w-full border-gray-200 border px-4 py-3 rounded-xl h-48 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Mô tả đặc điểm nổi bật..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card: Thuộc tính */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Layers size={20} className="text-orange-500" /> Biến thể & Thuộc tính
                </div>
                <button
                  type="button"
                  onClick={addAttributeRow}
                  className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Thêm nhóm mới
                </button>
              </div>

              <div className="space-y-4">
                {attributes.map((attr, idx) => (
                  <div key={idx} className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl relative group">
                    <button
                      type="button"
                      onClick={() => removeAttributeRow(idx)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="space-y-3">
                      <input
                        placeholder="Tên thuộc tính (VD: Màu sắc, Kích thước)"
                        value={attr.name}
                        onChange={(e) => handleAttributeNameChange(idx, e.target.value)}
                        className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-bold text-gray-700 py-1 w-2/3 md:w-1/3"
                      />

                      <div className="flex flex-wrap gap-2 items-center">
                        {attr.values.map((val, vIdx) => (
                          <div key={vIdx} className="flex items-center bg-white border border-gray-200 rounded-lg pl-3 pr-1 py-1 shadow-sm">
                            <input
                              value={val}
                              onChange={(e) => handleValueChange(idx, vIdx, e.target.value)}
                              className="text-sm outline-none w-24 bg-transparent"
                              placeholder="Giá trị..."
                            />
                            <button
                              type="button"
                              onClick={() => removeValue(idx, vIdx)}
                              className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addValue(idx)}
                          className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:bg-blue-50 px-2 py-1.5 rounded-lg border border-dashed border-blue-200"
                        >
                          <Plus size={12} /> Thêm giá trị
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {attributes.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm italic">
                    Chưa có thuộc tính cho sản phẩm này.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: PHÂN LOẠI & MEDIA */}
          <div className="space-y-6">

            {/* Card: Phân loại */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-6 border-b pb-4">
                <Package size={20} className="text-purple-500" /> Tổ chức
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Danh mục</label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="w-full border-gray-200 border px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-gray-50"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Trạng thái</label>
                  <div className="flex items-center gap-2">
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={`w-full border px-4 py-2.5 rounded-xl outline-none font-semibold ${form.status == 1 ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                        }`}
                    >
                      <option value={1}>✅ Đang hiển thị</option>
                      <option value={0}>🚫 Đang tạm ẩn</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Hình ảnh */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-6 border-b pb-4">
                <ImageIcon size={20} className="text-green-500" /> Hình ảnh
              </div>

              {/* Thumbnail */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Ảnh đại diện</label>
                <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-400 transition-all">
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <ImageIcon size={32} strokeWidth={1.5} />
                      <span className="text-[10px] mt-2 font-medium">Chưa có ảnh</span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setThumbnail(file);
                        setThumbnailPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] py-1.5 text-center translate-y-full group-hover:translate-y-0 transition-all font-semibold">
                    NHẤN ĐỂ THAY ĐỔI
                  </div>
                </div>

                {/* Gallery */}
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider pt-4">Ảnh phụ (Album)</label>
                <div className="grid grid-cols-3 gap-2">
                  {oldImages.map((img) => (
                    <div key={img.id} className="relative aspect-square group rounded-lg overflow-hidden border">
                      <img src={img.image_url} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeOldImage(img.id)}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:text-blue-500 hover:border-blue-500 cursor-pointer transition-all">
                    <Plus size={20} />
                    <input type="file" multiple className="hidden" onChange={(e) => setNewImages(Array.from(e.target.files))} />
                  </label>
                </div>
                {newImages.length > 0 && (
                  <p className="text-[10px] text-blue-600 font-bold bg-blue-50 p-2 rounded-lg flex items-center gap-1">
                    <AlertCircle size={12} /> Đã chọn {newImages.length} ảnh mới chờ lưu
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}