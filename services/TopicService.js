const { default: httpAxios } = require("./httpAxios");

const TopicService = {
    getList: async (data) => {
        return await httpAxios.get('topic', { params: data });
    },
     create: async (data) => {
        return await httpAxios.post("topic", data);
    },
    update: async (id, data) => {
        return await httpAxios.put(`topic/${id}`, data);
    },
    getById: (id) => {
        return httpAxios.get(`topic/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.delete(`topic/${id}`);
    }
}
export default TopicService;