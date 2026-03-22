const { default: httpAxios } = require("./httpAxios");

const OrderService = {
  getList: async (params) => {
        return await httpAxios.get('order', {
            params: params 
        });
    },
    create: async (data) => {
        return await httpAxios.post("order", data);
    },
    update: async (id, data) => {
        return await httpAxios.put(`order/${id}`, data);
    },
    getById: (id) => {
        return httpAxios.get(`order/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.delete(`order/${id}`);
    },
    cancelOrder: async (id) => {
        return await httpAxios.put(`order/cancel/${id}`);
    }
}
export default OrderService;