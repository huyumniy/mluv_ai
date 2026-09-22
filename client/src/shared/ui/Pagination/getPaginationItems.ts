export type PaginationItem = number | "start-dots" | "end-dots";

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 2) {
    return [
      1,
      2,
      currentPage + 1,
      "end-dots",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "start-dots",
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "start-dots",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-dots",
    totalPages,
  ];
}