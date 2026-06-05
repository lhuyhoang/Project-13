/**
 * Format ngày theo locale Việt Nam
 * @param {string|Date} dateStr
 * @param {{ short?: boolean }} options
 * @returns {string}
 */
export const formatDate = (dateStr, { short = false } = {}) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (short) {
    return date.toLocaleDateString("vi-VN");
  }
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Cắt chuỗi với dấu "..." nếu quá dài
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (text, maxLength = 150) => {
  if (!text) return "";
  const stripped = text.replace(/<[^>]+>/g, ""); // strip HTML tags
  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength).trimEnd() + "…";
};

/**
 * Tính thời gian đọc ước tính
 * @param {string} content
 * @param {number} wordsPerMinute
 * @returns {number} số phút (tối thiểu 1)
 */
export const estimateReadTime = (content, wordsPerMinute = 250) => {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

/**
 * Lấy chữ cái đầu để làm avatar placeholder
 * @param {string} name
 * @returns {string}
 */
export const getInitial = (name) => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

/**
 * Extract error message từ Axios error response
 * @param {Error} error
 * @param {string} fallback
 * @returns {string}
 */
export const getErrorMessage = (
  error,
  fallback = "Có lỗi xảy ra. Vui lòng thử lại.",
) => {
  return error?.response?.data?.message || error?.message || fallback;
};
