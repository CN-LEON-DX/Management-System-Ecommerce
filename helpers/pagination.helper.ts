interface PaginationResult {
  limitItems: number;
  currentPage: number;
  totalPages: number;
  pages: number[];
}

export const getPagination = (
  currentPage: string | number,
  totalProducts: number
): PaginationResult => {
  const limitItems = 5;
  let page =
    typeof currentPage === "string" ? parseInt(currentPage) : currentPage;
  page = isNaN(page) ? 1 : page; // If currentPage is invalid, default to 1

  const totalPages = Math.ceil(totalProducts / limitItems);

  // Ensure the currentPage is within valid range
  page = Math.max(1, Math.min(page, totalPages));

  return {
    limitItems,
    currentPage: page,
    totalPages,
    pages: Array.from({ length: totalPages }, (_, index) => index + 1),
  };
};
