const { default: httpAxios } = require("./httpAxios");

const CategoryService = {
    getList: async (data) => {
        return await httpAxios.get('categories', { params: data });
    },
    getTree: () => {
        return httpAxios.get("categories/tree"); // API trả danh mục cha – con
    },
    create: async (data) => {
        return await httpAxios.post("categories", data);
    },
    update: async (id, data) => {
        return await httpAxios.post(`categories/${id}`, data);
    },
    getById: (id) => {
        return httpAxios.get(`/categories/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.delete(`categories/${id}`);
    },
    getProductsBySlug: (slug) => {
        return httpAxios.get(`/categories/${slug}/products`);
    }
}
export default CategoryService;