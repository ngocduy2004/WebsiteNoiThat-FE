const { default: httpAxios } = require("./httpAxios");

const PostService = {
    getList: async (data) => {
        return await httpAxios.get('post', { params: data });
    },
    create: async (data) => {
        return await httpAxios.post("post", data);
    },
    // SỬA ĐỔI: Dùng .post thay vì .put
    update: async (id, data) => {
        // Lưu ý: data ở đây là FormData có chứa field "_method": "PUT"
        return await httpAxios.post(`post/${id}`, data); 
    },
    getById: (id) => {
        return httpAxios.get(`post/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.delete(`post/${id}`);
    },
    // Lấy chi tiết bài viết
    getDetail: (id) => {
        return httpAxios.get(`post/${id}`);
    },

    // Lấy bài viết mới nhất (Ví dụ lấy 5 bài)
    getLatest: () => {
        return httpAxios.get("post?limit=5&sort_by=created_at&sort_dir=desc");
    },

    // Lấy bài viết theo Topic (Nếu bạn dùng Cách 2 ở Backend)
    getByTopic: (topicId) => {
        return httpAxios.get(`post_by_topic/${topicId}`);
    },
    // services/PostService.js
    getById: (id) => {
        return httpAxios.get(`post/${id}`); // Đảm bảo URL này đúng với Route backend
    }
}
export default PostService;