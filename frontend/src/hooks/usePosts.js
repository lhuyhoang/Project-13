import { useState, useEffect, useCallback } from "react";
import postService from "../services/postService";

export default function usePosts(initialParams = {}) {
  // STATE
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(initialParams.search || "");
  const [category, setCategory] = useState(initialParams.category || "");
  const limit = initialParams.limit || 9;

  // FETCH FUNCTION
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postService.getAll({ page, limit, search, category });
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải bài viết");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, category]);

  // Re-fetch khi bất kỳ filter nào thay đổi
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Khi search hoặc category thay đổi, reset về trang 1
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  return {
    posts,
    isLoading,
    error,
    page,
    totalPages,
    total,
    search,
    category,
    setPage,
    setSearch: handleSearchChange,
    setCategory: handleCategoryChange,
    refetch: fetchPosts,
  };
}
