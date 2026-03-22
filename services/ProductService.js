import httpAxios from "./httpAxios"; // Nên dùng import thay vì require trong React

const ProductService = {
    // Lấy danh sách (có lọc/phân trang)
    getList: (params = {}) => {
        return httpAxios.get('products', { params });
    },

    // Lấy sản phẩm khuyến mãi
    getSaleProducts: () => {
        return httpAxios.get("products-sale");
    },

    // Lấy sản phẩm mới
    getProductNew: () => {
        return httpAxios.get("products-new");
    },

    // Lấy chi tiết theo ID
    getById: (id) => {
        return httpAxios.get(`products/${id}`);
    },

    // Lấy chi tiết theo Slug (Cần bổ sung Route bên Laravel)
    getBySlug: (slug) => {
        return httpAxios.get(`products/slug/${slug}`);
    },

    // Thêm mới
    create: (data) => {
        return httpAxios.post("products", data);
    },

    // Cập nhật (SỬA LẠI THÀNH PUT ĐỂ KHỚP BACKEND)
    update: (id, data) => {
        // Lưu ý: Nếu data là FormData (có file ảnh), Laravel có thể không nhận được file qua PUT.
        // Nếu lỗi file, hãy dùng post và thêm data.append('_method', 'PUT');
        return httpAxios.post(`products/${id}?_method=PUT`, data); 
    },

    // Xóa sản phẩm
    delete: (id) => {
        return httpAxios.delete(`products/${id}`);
    },

    // Xóa ảnh con
    deleteImage: (id) => {
        return httpAxios.delete(`product-images/${id}`);
    }
};

export default ProductService;