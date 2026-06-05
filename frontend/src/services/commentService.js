import api from "./api";

const commentService = {
  /**
   * Lấy danh sách comment của một bài viết
   * @param {string} postId
   * @returns {Promise<{ comments }>}
   */
  getByPost: async (postId) => {
    const res = await api.get(`/posts/${postId}/comments`);
    return res.data;
  },

  /**
   * Thêm comment mới
   * @param {string} postId
   * @param {{ content: string }} data
   * @returns {Promise<{ comment }>}
   */
  create: async (postId, data) => {
    const res = await api.post(`/posts/${postId}/comments`, data);
    return res.data;
  },

  /**
   * Xóa comment (chỉ chủ sở hữu)
   * @param {string} commentId
   * @returns {Promise<{ message }>}
   */
  delete: async (commentId) => {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  },
};

export default commentService;
