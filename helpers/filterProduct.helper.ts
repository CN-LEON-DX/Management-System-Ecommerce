import { Request } from "express";

interface QueryParams {
  priceRange?: string;
  status?: string;
  search?: string;
}

interface Query {
  deleted: boolean;
  price?: { $gte: number; $lte?: number };
  status?: string;
  title?: { $regex: RegExp };
}

export const filterProductHelper = (req: Request): Query => {
  const { priceRange, status, search } = req.query as QueryParams;
  let query: Query = {
    deleted: false,
  };

  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    query.price = maxPrice
      ? { $gte: minPrice, $lte: maxPrice }
      : { $gte: minPrice };
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.title = { $regex: new RegExp(search, "i") };
  }

  return query;
};
