"use client";

import { useState, useEffect } from "react";
import CategoryService from "../../../../../services/CategoryService";
import ProductService from "../../../../../services/ProductService";
import Link from "next/link";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [priceBuy, setPriceBuy] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState(1);

  // ===== IMAGE =====
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [images, setImages] = useState([]);              
  const [previewImages, setPreviewImages] = useState([]); 

  const [categories, setCategories] = useState([]);
  const [hasVariants, setHasVariants] = useState(false);

  const [attributes, setAttributes] = useState([
    { name: "", values: [], temp: "" },
  ]);

  /* ================= LOAD CATEGORY ================= */
  useEffect(() => {
    (async () => {
      const res = await CategoryService.getList({ limit: 999, page: 1 });
      setCategories(res?.data || []);
    })();
  }, []);

  /* ================= IMAGE ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // 👉 ảnh phụ
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  /* ================= ATTRIBUTES ================= */
  const addAttribute = () => {
    setAttributes([...attributes, { name: "", values: [], temp: "" }]);
  };

  const updateAttribute = (index, key, value) => {
    const newAttrs = [...attributes];
    newAttrs[index][key] = value;
    setAttributes(newAttrs);
  };

  const addValue = (index) => {
    const newAttrs = [...attributes];
    const v = newAttrs[index].temp.trim();
    if (v && !newAttrs[index].values.includes(v)) {
      newAttrs[index].values.push(v);
    }
    newAttrs[index].temp = "";
    setAttributes(newAttrs);
  };

  const removeValue = (attrIndex, valueIndex) => {
    const newAttrs = [...attributes];
    newAttrs[attrIndex].values.splice(valueIndex, 1);
    setAttributes(newAttrs);
  };

  const removeAttribute = (index) => {
    const newAttrs = [...attributes];
    newAttrs.splice(index, 1);
    setAttributes(newAttrs);
  };

  /* ================= SUBMIT ================= */
  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Chuẩn hóa dữ liệu thuộc tính
    const cleanAttributes = attributes
      .map((attr) => {
        let finalValues = [...attr.values];
        const currentTemp = attr.temp?.trim();
        if (currentTemp && !finalValues.includes(currentTemp)) {
          finalValues.push(currentTemp);
        }
        return {
          name: attr.name?.trim(),
          values: finalValues,
        };
      })
      .filter((attr) => attr.name !== "" && attr.values.length > 0);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("content", content || "");
    formData.append("category_id", categoryId);
    formData.append("price_buy", priceBuy);
    formData.append("status", status);

    if (thumbnail) formData.append("thumbnail", thumbnail);

    images.forEach((img) => {
      formData.append("images[]", img);
    });

    // 2. CHÚ Ý QUAN TRỌNG: 
    // Laravel sẽ nhận chuỗi này và bạn đã có json_decode ở Controller
    if (hasVariants && cleanAttributes.length > 0) {
      formData.append("attributes", JSON.stringify(cleanAttributes));
    }

    try {
      const res = await ProductService.create(formData);
      // Lưu ý: api.js của bạn đã có interceptor trả về response.data
      // nên ta kiểm tra res.status trực tiếp
      if (res.status) {
        alert("Thêm sản phẩm thành công!");
        window.location.href = "/admin/products";
      }
    } catch (err) {
      // 3. Hiển thị lỗi chi tiết từ Laravel để debug
      const serverError = err.response?.data?.message || err.message;
      console.error("Lỗi chi tiết từ Server:", err.response?.data);
      alert("Lỗi: " + serverError);
    }
  };
  /* ================= RENDER ================= */
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Thêm sản phẩm mới</h1>
        <div className="flex gap-3">
          <Link href="/admin/products" className="px-4 py-2 border rounded">
            Hủy
          </Link>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Lưu sản phẩm
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded shadow">
            <label className="font-medium">Tên sản phẩm *</label>
            <input
              className="border p-2 w-full rounded mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="bg-white p-5 rounded shadow">
            <label className="font-medium">Mô tả ngắn</label>
            <textarea
              className="border p-2 w-full rounded mt-1"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="bg-white p-5 rounded shadow">
            <label className="font-medium">Nội dung chi tiết</label>
            <textarea
              className="border p-2 w-full rounded mt-1"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded shadow">
            <label className="font-medium">Danh mục *</label>
            <select
              className="border p-2 w-full rounded mt-2"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <label className="font-medium">Giá nhập</label>
            <input
              type="number"
              className="border p-2 w-full rounded mt-1"
              value={priceBuy}
              onChange={(e) => setPriceBuy(e.target.value)}
            />
          </div>

          {/* THUMBNAIL */}
          <div className="bg-white p-5 rounded shadow">
            <label className="font-medium">Ảnh đại diện</label>
            <input type="file" onChange={handleImage} className="mt-2" />
            {previewImage && (
              <img src={previewImage} className="mt-3 w-28 rounded" />
            )}
          </div>

          {/* IMAGES */}
          <div className="bg-white p-5 rounded shadow">
            <label className="font-medium">Ảnh phụ</label>
            <input
              type="file"
              multiple
              onChange={handleImages}
              className="mt-2"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {previewImages.map((img, i) => (
                <img key={i} src={img} className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded shadow flex justify-between">
            <span>Hiển thị</span>
            <input
              type="checkbox"
              checked={status === 1}
              onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
            />
          </div>

          {/* PHẦN THUỘC TÍNH (ATTRIBUTES) */}
          <div className="bg-white p-5 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-lg">Thuộc tính sản phẩm</label>
              <button
                type="button"
                onClick={() => setHasVariants(!hasVariants)}
                className={`px-3 py-1 rounded text-sm ${hasVariants ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
              >
                {hasVariants ? "- Hủy thuộc tính" : "+ Thêm thuộc tính"}
              </button>
            </div>

            {hasVariants && (
              <div className="space-y-4">
                {attributes.map((attr, index) => (
                  <div key={index} className="p-4 border rounded relative bg-gray-50">
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-sm font-medium">Tên thuộc tính (VD: Màu sắc, Size)</label>
                        <input
                          className="border p-2 w-full rounded mt-1"
                          placeholder="Nhập tên..."
                          value={attr.name}
                          onChange={(e) => updateAttribute(index, "name", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Giá trị (Nhấn Enter để thêm)</label>
                        <div className="flex gap-2 mt-1">
                          <input
                            className="border p-2 flex-1 rounded"
                            placeholder="VD: Đỏ, Xanh, XL..."
                            value={attr.temp}
                            onChange={(e) => updateAttribute(index, "temp", e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addValue(index);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => addValue(index)}
                            className="bg-gray-800 text-white px-4 rounded"
                          >
                            Thêm
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {attr.values.map((v, vIdx) => (
                            <span key={vIdx} className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm flex items-center">
                              {v}
                              <button
                                type="button"
                                onClick={() => removeValue(index, vIdx)}
                                className="ml-2 font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAttribute}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:bg-gray-50"
                >
                  + Thêm nhóm thuộc tính khác
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
