import { useState } from "react";

interface UsePaginationParams {
  totalItems: number;
  itemsPerPage?: number;
}

export function usePagination({
  totalItems,
  itemsPerPage = 8,
}: UsePaginationParams) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    totalItems / itemsPerPage,
  );

  const firstItemIndex =
    (currentPage - 1) * itemsPerPage;

  const lastItemIndex =
    firstItemIndex + itemsPerPage;

  return {
    currentPage,
    setCurrentPage,

    itemsPerPage,
    totalPages,

    firstItemIndex,
    lastItemIndex,
  };
}
