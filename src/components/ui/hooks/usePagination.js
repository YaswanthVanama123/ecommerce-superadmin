import { useState, useCallback } from 'react';

/**
 * usePagination Hook
 * Hook for managing pagination state
 *
 * @param {number} initialPage - Initial page number
 * @param {number} itemsPerPage - Items per page
 * @returns {object} Pagination state and methods
 */
export const usePagination = (initialPage = 1, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const previousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const getPageData = useCallback((data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage]);

  const getTotalPages = useCallback((totalItems) => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [itemsPerPage]);

  return {
    currentPage,
    itemsPerPage,
    goToPage,
    nextPage,
    previousPage,
    reset,
    getPageData,
    getTotalPages,
  };
};

export default usePagination;
