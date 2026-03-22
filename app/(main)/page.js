"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Category from "./components/Category";
import Introduce from "./components/Introduce";
import Article from "./components/Article";
import Address from "./components/Address";
import Product from "./product/product";
import ProductNew from "./product/productnew";
import ProductService from "../../services/ProductService";
import BannerService from "@/services/BannerService";
import Banner from "./components/Banner";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [productNew, setProductNew] = useState([]);

  const [banners, setBanners] = useState([]); // Chuyển thành mảng vì slideshow thường có nhiều ảnh
  const [loading, setLoading] = useState(true);
  

  // SẢN PHẨM
useEffect(() => {
    // Thêm param filter_stock: true
    ProductService.getList({ filter_stock: true }) 
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch(console.error);
}, []);

  // SẢN PHẨM MỚI
  useEffect(() => {
    ProductService.getProductNew()
      .then((res) => {
        if (res.status) {
          setProductNew(res.data || []);
        }
      })
      .catch(console.error);
  }, []);


  return (
    <>
      <div className="w-full h-[850px] relative">
        <Banner />
      </div>

      <Category />

      {/* SẢN PHẨM MỚI */}
      <div className="max-w-7xl mx-auto mt-12 px-4">
        <h2 className="text-lg mb-4">SẢN PHẨM MỚI</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {productNew.length > 0 ? (
            productNew.map((item) => (
              <ProductNew key={item.id} product={item} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Không có sản phẩm mới
            </p>
          )}
        </div>
      </div>

      <Introduce />

      {/* SẢN PHẨM */}
      <div className="max-w-7xl mx-auto mt-16 px-4">
        <h2 className="text-lg mb-4">SẢN PHẨM</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {products.map((item) => (
            <Product key={item.id} product={item} />
          ))}
        </div>
      </div>

      <Article />
      <Address />
    </>
  );
}
