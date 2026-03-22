import httpAxios from "./httpAxios";

const BannerService = {
    getList: async (data) => {
        return await httpAxios.get('banner', { params: data });
    },
    create: async (data) => {
        return await httpAxios.post("banner", data);
    },
    
    // 👇 ĐÃ SỬA: Đổi từ .put() thành .post()
    update: async (id, data) => {
        // Khi gửi FormData (có file), bắt buộc dùng POST.
        // Laravel sẽ tự hiểu đây là PUT nhờ trường "_method": "PUT" bạn đã thêm ở Frontend.
        return await httpAxios.post(`banner/${id}`, data);
    },

    getById: (id) => {
        return httpAxios.get(`banner/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.delete(`banner/${id}`);
    }
}

export default BannerService;