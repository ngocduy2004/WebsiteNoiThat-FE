"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Save, ArrowLeft, Trash2, Plus, Search, X, Zap, 
  Calendar, Package, AlertCircle 
} from "lucide-react";
import Link from "next/link";
import ProductSaleService from "@/services/ProductSaleService";
import ProductService from "@/services/ProductService";

const IMAGE_BASE_URL = "http://localhost:8000/storage/";

export default function EditProductSale() {
  const { id } = useParams();
  const router = useRouter();
  
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({ name: "", date_begin: "", date_end: "" });
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Modal & Search
  const [showModal, setShowModal] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Bulk Action
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState(10);

  // --- HELPERS ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/100?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${IMAGE_BASE_URL}${imagePath}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const calculatePercent = (original, sale) => {
    if (!original || !sale) return 0;
    if (sale >= original) return 0;
    return Math.round(((original - sale) / original) * 100);
  };

  // --- LOAD DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ProductSaleService.getById(id);
        const sale = res.data || res;

        if (sale) {
          setFormData({
            name: sale.name,
            date_begin: formatDateTime(sale.date_begin),
            date_end: formatDateTime(sale.date_end),
          });

          const mappedItems = (sale.items || []).map((item) => ({
            id: item.product.id,
            name: item.product.name,
            thumbnail: item.product.thumbnail || item.product.image,
            price_buy: Number(item.product.price_buy),
            price_sale: Number(item.price_sale),
            qty: Number(item.qty),
          }));
          setSelectedProducts(mappedItems);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setError("Không thể tải thông tin đợt sale.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- LOGIC GIẢM GIÁ HÀNG LOẠT (ĐÃ SỬA: CHỈ ÁP DỤNG CHO SP CHƯA GIẢM) ---
  const applyDiscountAll = () => {
    if (selectedProducts.length === 0) {
      alert("Danh sách trống!");
      return;
    }
    
    if (discountValue <= 0) {
      alert("Giá trị giảm phải lớn hơn 0.");
      return;
    }

    if (confirm(`Áp dụng giảm ${discountValue}${discountType === 'percent' ? '%' : 'đ'} cho các sản phẩm CHƯA GIẢM GIÁ?`)) {
      
      let countUpdated = 0;
      let countSkipped = 0;

      const updated = selectedProducts.map((item) => {
        // LOGIC CHECK: Nếu giá sale nhỏ hơn giá gốc => Đã giảm rồi => Bỏ qua
        if (item.price_sale < item.price_buy) {
            countSkipped++;
            return item; 
        }

        // Logic tính toán cho sản phẩm chưa giảm
        countUpdated++;
        const price = item.price_buy;
        let newSalePrice = price;

        if (discountType === "percent") {
          const discountAmount = (price * Number(discountValue)) / 100;
          newSalePrice = price - discountAmount;
        } else {
          newSalePrice = price - Number(discountValue);
        }

        return { ...item, price_sale: Math.max(0, Math.round(newSalePrice)) };
      });

      setSelectedProducts(updated);
      alert(`✅ Đã áp dụng: ${countUpdated} sản phẩm.\n⏭️ Bỏ qua: ${countSkipped} sản phẩm (đã có giá giảm).`);
    }
  };

  // --- LOGIC SẢN PHẨM ---
  const loadAllProducts = async () => {
    if (allProducts.length > 0) return;
    try {
      const res = await ProductService.getList({ limit: 1000 });
      setAllProducts(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    }
  };

  const handleOpenModal = () => { setShowModal(true); loadAllProducts(); };

  const handleAddProduct = (product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      alert("Sản phẩm này đã có trong danh sách!");
      return;
    }
    const newItem = {
      id: product.id,
      name: product.name,
      thumbnail: product.thumbnail || product.image,
      price_buy: Number(product.price_buy),
      price_sale: Number(product.price_buy), 
      qty: 1,
    };
    setSelectedProducts((prev) => [...prev, newItem]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateItem = (productId, field, value) => {
    setSelectedProducts((prev) => prev.map((p) => {
      if (p.id !== productId) return p;
      let newValue = Number(value);
      if (newValue < 0) newValue = 0; 
      return { ...p, [field]: newValue };
    }));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Vui lòng nhập tên đợt khuyến mãi.");
    if (new Date(formData.date_end) <= new Date(formData.date_begin)) return setError("Ngày kết thúc phải sau ngày bắt đầu.");
    if (selectedProducts.length === 0) return setError("Vui lòng chọn ít nhất 1 sản phẩm.");

    setSaving(true);
    const payload = {
      name: formData.name,
      date_begin: formData.date_begin,
      date_end: formData.date_end,
      products: selectedProducts.map((p) => ({
        product_id: p.id,
        price_sale: p.price_sale,
        qty: p.qty,
      })),
    };

    try {
      const res = await ProductSaleService.update(id, payload);
      if (res.status === true || res.data?.status === true) {
        alert("Cập nhật khuyến mãi thành công!");
        router.push("/admin/promotion");
      } else {
        setError(res.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      setError("Có lỗi xảy ra phía server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Cập nhật khuyến mãi</h1>
            <p className="text-sm text-slate-500">Chỉnh sửa thông tin và danh sách sản phẩm giảm giá</p>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={saving} 
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-200 transition-all"
        >
          {saving ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Save size={20} />}
          <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: GENERAL INFO */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Calendar className="text-blue-600" size={20} /> Thông tin chung
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2 border border-red-100">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên chương trình <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bắt đầu <span className="text-red-500">*</span></label>
                <input 
                  type="datetime-local" 
                  value={formData.date_begin} 
                  onChange={(e) => setFormData({ ...formData, date_begin: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kết thúc <span className="text-red-500">*</span></label>
                <input 
                  type="datetime-local" 
                  value={formData.date_end} 
                  onChange={(e) => setFormData({ ...formData, date_end: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[600px]">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Package className="text-blue-600" size={20} /> 
                Sản phẩm áp dụng <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{selectedProducts.length}</span>
              </h2>
              <button 
                type="button" 
                onClick={handleOpenModal} 
                className="flex items-center gap-2 text-sm bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 hover:bg-emerald-100 font-semibold transition-colors"
              >
                <Plus size={16} /> Thêm sản phẩm
              </button>
            </div>

            {/* Bulk Action Bar */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                  <Zap className="w-4 h-4 text-amber-500" /> Thiết lập nhanh:
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                   <div className="flex border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                      <select 
                        className="bg-slate-50 border-r px-3 py-2 text-sm outline-none text-slate-700 font-medium cursor-pointer"
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                      >
                        <option value="percent">Giảm %</option>
                        <option value="amount">Giảm tiền</option>
                      </select>
                      <input 
                        type="number" 
                        min="0"
                        className="w-24 px-3 py-2 text-sm outline-none"
                        placeholder="Giá trị..."
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                      />
                   </div>
                   <button 
                      onClick={applyDiscountAll}
                      className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition shadow-sm whitespace-nowrap"
                   >
                     Áp dụng (Chưa giảm)
                   </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 italic">* Chỉ áp dụng cho các sản phẩm chưa có giá khuyến mãi.</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                  <tr>
                    <th className="p-4 border-b">Sản phẩm</th>
                    <th className="p-4 border-b">Giá gốc</th>
                    <th className="p-4 border-b text-center w-40">Giá Sale</th>
                    <th className="p-4 border-b w-24">SL Sale</th>
                    <th className="p-4 border-b w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400">
                        <div className="flex flex-col items-center">
                          <Package className="w-12 h-12 mb-2 stroke-1" />
                          <p>Chưa có sản phẩm nào được chọn.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    selectedProducts.map((item) => {
                      const percent = calculatePercent(item.price_buy, item.price_sale);
                      return (
                        <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0">
                                <img src={getImageUrl(item.thumbnail)} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-slate-800 line-clamp-1" title={item.name}>{item.name}</p>
                                <p className="text-xs text-slate-500">ID: {item.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-500 font-medium">
                            {item.price_buy.toLocaleString('vi-VN')}
                          </td>
                          <td className="p-4">
                            <div className="relative">
                              <input 
                                type="number" 
                                className={`w-full px-3 py-2 border rounded-lg font-bold text-sm outline-none focus:ring-2 transition-all ${
                                  item.price_sale < item.price_buy 
                                  ? 'text-red-600 border-red-200 bg-red-50 focus:ring-red-500' 
                                  : 'text-slate-800 border-slate-300 focus:ring-blue-500'
                                }`}
                                value={item.price_sale} 
                                onChange={(e) => handleUpdateItem(item.id, "price_sale", e.target.value)} 
                              />
                              {percent > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                  -{percent}%
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <input 
                              type="number" 
                              min="1"
                              className="w-full px-2 py-2 border border-slate-300 rounded-lg text-center outline-none focus:ring-2 focus:ring-blue-500" 
                              value={item.qty} 
                              onChange={(e) => handleUpdateItem(item.id, "qty", e.target.value)} 
                            />
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleRemoveProduct(item.id)} 
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL SELECT PRODUCTS --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Thêm sản phẩm vào khuyến mãi</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm theo tên sản phẩm..." 
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 scrollbar-thin scrollbar-thumb-slate-200">
              <div className="space-y-2">
                {allProducts
                  .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((product) => {
                    const isSelected = selectedProducts.some(sel => sel.id === product.id);
                    return (
                      <div 
                        key={product.id} 
                        onClick={() => !isSelected && handleAddProduct(product)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${
                          isSelected 
                          ? "bg-blue-50 border-blue-200 opacity-60 cursor-not-allowed" 
                          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={getImageUrl(product.thumbnail || product.image)} 
                            className="w-12 h-12 object-cover rounded-lg bg-gray-100" 
                            alt={product.name} 
                            onError={(e) => { e.target.src = "https://placehold.co/100?text=Error"; }} 
                          />
                          <div>
                            <p className={`font-semibold text-sm ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>{product.name}</p>
                            <p className="text-xs text-slate-500">Giá gốc: {Number(product.price_buy).toLocaleString()}đ</p>
                          </div>
                        </div>
                        <div className={`p-2 rounded-full transition-colors ${isSelected ? 'text-blue-600 bg-blue-100' : 'text-slate-300 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white'}`}>
                           {isSelected ? <div className="text-xs font-bold px-1">Đã chọn</div> : <Plus size={18} />}
                        </div>
                      </div>
                    );
                  })
                }
                {allProducts.length === 0 && <p className="text-center text-slate-500 py-4">Đang tải danh sách...</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}