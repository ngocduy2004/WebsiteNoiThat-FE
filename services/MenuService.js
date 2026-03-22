const { default: httpAxios } = require("./httpAxios");

const MenuService = {
    getList: async (data) => {
        return await httpAxios.get('menu', { params: data });
    },
    create: async (data) => {
        return await httpAxios.post("menu", data);
    },
    update: async (id, data) => {
        return await httpAxios.put(`menu/${id}`, data);
    },
    getById: (id) => {
        return httpAxios.get(`menu/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.delete(`menu/${id}`);
    }
}
export default MenuService;