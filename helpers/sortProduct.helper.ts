interface SortOptions {
  [key: string]: number;
}

export const getSortOption = (sortSelection?: string): SortOptions => {
  if (sortSelection) {
    const [sortField, sortOrder] = sortSelection.split("-");
    return { [sortField]: sortOrder === "asc" ? 1 : -1 };
  } else {
    return { position: -1 };
  }
};
