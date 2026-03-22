"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductService from "../../../../../services/ProductService";
import ProductSaleService from "../../../../../services/ProductSaleService";
import Link from "next/link";
import { Save, X, Plus, Clock, Tag, Search, Trash2, CalendarClock, Gift, Type } from "lucide-react";

export default function CreateProductSale() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState(20);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await ProductService.getList({ limit: 9999, status: 1 });
        setProducts(res.data || []);
      } catch (e) {
        console.error("Lỗi load sản phẩm:", e);
      }
    })();
  }, []);

  const applyDiscountAll = () => {
    const updated = selectedItems.map((item) => {
      const price = Number(item.price_original);
      let price_sale = price;
      if (discountType === "percent") {
        price_sale = Math.max(0, price - (price * Number(discountValue)) / 100);
      } else {
        price_sale = Math.max(0, price - Number(discountValue));
      }
      return { ...item, price_sale: Math.round(price_sale) };
    });
    setSelectedItems(updated);
  };

  const addProduct = (product) => {
    if (selectedItems.some((i) => i.product_id === product.id)) return;
    setSelectedItems([
      ...selectedItems,
      {
        product_id: product.id,
        name: product.name,
        sku: product.sku || "N/A", // Giả định có SKU như trong hình
        price_original: Number(product.price_buy),
        price_sale: Number(product.price_buy),
      },
    ]);
    setShowPopup(false);
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((i) => i.product_id !== id));
  };

  const updateItemPrice = (id, value) => {
    setSelectedItems(
      selectedItems.map((i) =>
        i.product_id === id ? { ...i, price_sale: Number(value) } : i
      )
    );
  };

  const totalReduce = selectedItems.reduce(
    (sum, item) => sum + (item.price_original - item.price_sale),
    0
  );

  // Trong file CreateProductSale.js

  const handleSubmit = async () => {
    if (!name || !dateBegin || !dateEnd || selectedItems.length === 0) {
      alert("Vui lòng nhập tên chương trình, chọn thời gian và ít nhất 1 sản phẩm!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: name,
        date_begin: dateBegin.replace("T", " ") + ":00",
        date_end: dateEnd.replace("T", " ") + ":00",
        products: selectedItems.map(item => ({
          product_id: Number(item.product_id),
          price_sale: Number(item.price_sale),
          qty: 1
        })),
      };

      const res = await ProductSaleService.create(payload);

      // Kiểm tra phản hồi từ Backend
      if (res.status === true || res.data?.status === true) {
        alert("Tạo khuyến mãi thành công!");
        router.push("/admin/promotion");
      } else {
        // THÔNG BÁO LỖI SẢN PHẨM ĐÃ SALE TỪ BACKEND
        alert("Lỗi: " + (res.data?.message || res.message || "Không thể tạo"));
      }
    } catch (error) {
      // Xử lý lỗi 422 (Validation/Business Logic từ Laravel)
      const errorMsg = error.response?.data?.message || "Lỗi hệ thống khi kiểm tra sản phẩm";
      alert("Cảnh báo: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#f8f9fa] min-h-screen text-slate-800 font-sans">
      {/* HEADER ACTIONS */}
      <div className="flex justify-end gap-3 mb-6">
        <Link href="/admin/productsale" className="px-4 py-2 border border-gray-300 bg-white rounded text-sm hover:bg-gray-50 transition">
          Hủy bỏ
        </Link>
        <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded text-sm font-medium hover:bg-orange-600 transition">
          {loading ? "Đang lưu..." : "Lưu khuyến mãi"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL: THỜI GIAN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-base font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" /> Thời gian áp dụng
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tên chương trình</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded p-2.5 outline-none focus:border-orange-400"
                  placeholder="Nhập tên khuyến mãi..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Thời gian bắt đầu</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-200 rounded p-2.5 outline-none focus:border-orange-400"
                  value={dateBegin}
                  onChange={(e) => setDateBegin(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Thời gian kết thúc</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-200 rounded p-2.5 outline-none focus:border-orange-400"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
              <p className="text-xs text-yellow-700 flex gap-2">
                <CalendarClock className="w-4 h-4 flex-shrink-0" />
                Khuyến mãi sẽ tự động kết thúc vào thời gian này. Sản phẩm sẽ trở về giá gốc.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: SẢN PHẨM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Gift className="w-5 h-5 text-orange-500" /> Sản phẩm khuyến mãi
              </h2>
              <button
                onClick={() => setShowPopup(true)}
                className="text-orange-500 text-sm font-medium hover:underline flex items-center gap-1"
              >
                + Thêm sản phẩm
              </button>
            </div>

            {/* QUICK SETTINGS */}
            <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-md border border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase">Thiết lập nhanh:</span>
              <div className="flex items-center">
                <select
                  className="border border-gray-200 p-2 text-sm rounded-l outline-none"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <option value="percent">Giảm theo %</option>
                  <option value="amount">Giảm theo Tiền</option>
                </select>
                <div className="relative">
                  <input
                    type="number"
                    className="border-y border-r border-gray-200 p-2 text-sm w-20 outline-none"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                  />
                  <span className="absolute right-2 top-2 text-gray-400 text-xs">{discountType === 'percent' ? '%' : 'đ'}</span>
                </div>
              </div>
              <button
                onClick={applyDiscountAll}
                className="text-orange-500 text-sm font-semibold hover:text-orange-600 transition"
              >
                Áp dụng tất cả
              </button>
            </div>

            {/* TABLE */}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase text-[11px] font-bold tracking-wider">
                  <th className="pb-4 text-left font-medium">Sản phẩm</th>
                  <th className="pb-4 text-right font-medium">Giá gốc</th>
                  <th className="pb-4 text-right font-medium">Giá khuyến mãi</th>
                  <th className="pb-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {selectedItems.map((item) => (
                  <tr key={item.product_id} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded border border-gray-50 flex items-center justify-center text-gray-300 italic text-[10px]">
                          product
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{item.name}</div>
                          <div className="text-[11px] text-gray-400">SKU: {item.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-medium text-gray-600">
                      {item.price_original.toLocaleString()} đ
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="relative">
                          <input
                            type="number"
                            className={`border ${item.price_sale > item.price_original ? 'border-red-400 bg-red-50' : 'border-gray-200'} rounded p-2 w-32 text-right font-bold text-orange-600 outline-none`}
                            value={item.price_sale}
                            onChange={(e) => updateItemPrice(item.product_id, e.target.value)}
                          />
                        </div>
                        <span className="text-xs text-red-500 font-medium">
                          -{Math.round(((item.price_original - item.price_sale) / item.price_original) * 100)}%
                        </span>
                      </div>
                      {item.price_sale > item.price_original && (
                        <p className="text-[10px] text-red-500 mt-1 italic">Giá KM không được lớn hơn giá gốc</p>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => removeItem(item.product_id)} className="text-gray-300 hover:text-red-500 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTAL FOOTER */}
            {selectedItems.length > 0 && (
              <div className="mt-10 border-t border-gray-100 pt-6 text-right">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Tổng doanh thu dự kiến giảm</p>
                <p className="text-2xl font-bold text-orange-500">~ {totalReduce.toLocaleString()} đ</p>
                <p className="text-xs text-gray-400 mt-2 italic">Đã chọn {selectedItems.length} sản phẩm</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPUP SELECTION (GIỮ LOGIC, SỬA UI) */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-[600px] max-h-[85vh] rounded-xl shadow-2xl flex flex-col border border-gray-200">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Chọn sản phẩm khuyến mãi</h3>
              <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <div className="p-4 bg-gray-50 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc mã sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-orange-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {products
                .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                .map(product => {
                  const isSelected = selectedItems.some(i => i.product_id === product.id);
                  return (
                    <div key={product.id} className={`p-3 flex justify-between items-center rounded-lg mb-1 ${isSelected ? 'bg-gray-50 opacity-60' : 'hover:bg-orange-50 cursor-pointer transition'}`}
                      onClick={() => !isSelected && addProduct(product)}>
                      <div className="flex items-center gap-3">
                        <Tag className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-sm text-gray-800">{product.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{Number(product.price_buy).toLocaleString()} đ</div>
                        </div>
                      </div>
                      <button className={`px-4 py-1.5 rounded-md text-xs font-bold border ${isSelected ? 'border-gray-200 text-gray-400' : 'border-orange-200 text-orange-500 hover:bg-orange-500 hover:text-white transition'}`}>
                        {isSelected ? 'ĐÃ CHỌN' : 'THÊM'}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}