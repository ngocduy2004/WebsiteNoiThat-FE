const { default: httpAxios } = require("./httpAxios");

const Product_StoreService = {
    getList: async (data) => {
        return await httpAxios.get('product_store', { params: data });
    },
    create: async (data) => {
        return await httpAxios.post("product_store", data);
    },
    update: async (id, data) => {
        return await httpAxios.put(`product_store/${id}`, data);
    },
    getById: (id) => {
        return httpAxios.get(`/product_store/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.delete(`product_store/${id}`);
    }
}
export default Product_StoreService;