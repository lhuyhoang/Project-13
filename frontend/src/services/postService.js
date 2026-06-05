import api from "./api";

const postService = {
  /**
   * Lấy danh sách bài viết có phân trang, tìm kiếm, lọc category
   * @param {{ page?, limit?, search?, category? }} params
   * @returns {Promise<{ posts, totalPages, currentPage, total }>}
   */
  getAll: async (params = {}) => {
    const res = await api.get("/posts", { params });
    return res.data;
  },

  /**
   * Lấy chi tiết một bài viết theo ID
   * @param {string} id
   * @returns {Promise<{ post }>}
   */
  getById: async (id) => {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  },

  /**
   * Lấy danh sách bài viết của user hiện tại (đang đăng nhập)
   * @param {{ page?, limit? }} params
   * @returns {Promise<{ posts, totalPages, currentPage, total }>}
   */
  getMyPosts: async (params = {}) => {
    const res = await api.get("/posts/me/posts", { params });
    return res.data;
  },

  /**
   * Tạo bài viết mới
   * @param {{ title, content, category, tags? }} data
   * @returns {Promise<{ post }>}
   */
  create: async (data) => {
    const res = await api.post("/posts", data);
    return res.data;
  },

  /**
   * Cập nhật bài viết
   * @param {string} id
   * @param {{ title?, content?, category?, tags? }} data
   * @returns {Promise<{ post }>}
   */
  update: async (id, data) => {
    const res = await api.put(`/posts/${id}`, data);
    return res.data;
  },

  /**
   * Xóa bài viết
   * @param {string} id
   * @returns {Promise<{ message }>}
   */
  delete: async (id) => {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  /**
   * Toggle like/unlike bài viết
   * Backend trả về { liked: boolean, likesCount: number }
   * @param {string} id
   * @returns {Promise<{ liked, likesCount }>}
   */
  toggleLike: async (id) => {
    const res = await api.post(`/posts/${id}/like`);
    return res.data;
  },

  /**
   * Upload ảnh bìa cho bài viết
   * @param {string} postId
   * @param {File} file
   * @returns {Promise<{ coverImage, post }>}
   */
  uploadCover: async (postId, file) => {
    const formData = new FormData();
    formData.append("cover", file);

    const res = await api.post(`/posts/${postId}/cover`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default postService;
