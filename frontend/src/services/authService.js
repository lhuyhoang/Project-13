import api from "./api";

const authService = {
  /**
   * Đăng ký tài khoản mới
   * @param {{ username, email, password }} data
   * @returns {Promise<{ user, token }>}
   */
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  /**
   * Đăng nhập.
   * @param {{ email, password }} data
   * @returns {Promise<{ user, token }>}
   */
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  /**
   * Lấy thông tin user đang đăng nhập
   * @returns {Promise<{ user }>}
   */
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  /**
   * Cập nhật thông tin hồ sơ
   * @param { username?: string, bio?: string } data
   * @returns {Promise<{ user }>}
   */
  updateProfile: async (data) => {
    const res = await api.put("/auth/profile", data);
    return res.data;
  },

  /**
   * Đổi mật khẩu.
   * @param { currentPassword: string, newPassword: string } data
   * @returns {Promise<{ user }>}
   */
  changePassword: async (data) => {
    const res = await api.put("/auth/password", data);
    return res.data;
  },

  /**
   * Cập nhật avatar
   * @param { File } file - Ảnh avatar mới
   * @returns {Promise<{ user }>}
   */
  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    // Phải set lại Content-Type (kèm boundary) vì axios instance mặc định
    // là 'application/json' ở api.js. Không set thì multer sẽ không parse body.
    const res = await api.post("/auth/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default authService;
