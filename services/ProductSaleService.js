import httpAxios from "./httpAxios";

const ProductSaleService = {
    getList: (params) => {
        return httpAxios.get("product-sale", { params });
    },

    getById: (id) => {
        return httpAxios.get(`product-sale/${id}`);
    },

    create: (data) => {
        return httpAxios.post("product-sale", data);
    },

    update: (id, data) => {
        return httpAxios.put(`product-sale/${id}`, data);
    },

    delete: (id) => {
        return httpAxios.delete(`product-sale/${id}`);
    },
};

export default ProductSaleService;
