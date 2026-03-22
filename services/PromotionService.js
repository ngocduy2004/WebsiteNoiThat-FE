const { default: httpAxios } = require("./httpAxios");

const PromotionService = {
    getList: async (data) => {
        return await httpAxios.get('promotion', { params: data });
    },
    update: async (id, data) => {
        return await httpAxios.post(`promotion/${id}`, data);
    },
    getById: (id) => {
        return httpAxios.get(`/promotion/${id}`);
    },
}
export default PromotionService;