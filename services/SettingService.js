const { default: httpAxios } = require("./httpAxios");

const SettingService = {
    getList: async (data) => {
        return await httpAxios.get('setting', { params: data });
    },
    create: async (data) => {
        return await httpAxios.post("setting", data);
    },
    update: async (id, data) => {
        return await httpAxios.put(`setting/${id}`, data);
    },
    getById: (id) => {
        return httpAxios.get(`setting/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.delete(`setting/${id}`);
    }
}
export default SettingService;