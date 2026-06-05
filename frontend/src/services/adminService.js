import api from "./api";

const adminService = {
 getStats: async () => {
 const { data } = await api.get("/admin/stats");
 return data;
 },

 getUsers: async (page = 1, search = "") => {
 const { data } = await api.get("/admin/users", {
 params: { page, limit: 20, search },
 });
 return data;
 },

 updateUserRole: async (id, role) => {
 const { data } = await api.patch(`/admin/users/${id}/role`, { role });
 return data;
 },

 deleteUser: async (id) => {
 const { data } = await api.delete(`/admin/users/${id}`);
 return data;
 },

 getPosts: async (page = 1, search = "") => {
 const { data } = await api.get("/admin/posts", {
 params: { page, limit: 20, search },
 });
 return data;
 },

 deletePost: async (id) => {
 const { data } = await api.delete(`/admin/posts/${id}`);
 return data;
 },

 getComments: async (page = 1, search = "") => {
 const { data } = await api.get("/admin/comments", {
 params: { page, limit: 20, search },
 });
 return data;
 },

 deleteComment: async (id) => {
 const { data } = await api.delete(`/admin/comments/${id}`);
 return data;
 },
};

export default adminService;
