import { Request, Response } from "express";
import Product from "../../models/product.model";
import Category from "../../models/category.model";
import { systemConfig } from "../../config/system";
import * as productsHelper from "../../helpers/products.helper";
import * as categoryHelpers from "../../helpers/categoryHelper";

// Define the types for the Product and Category documents
interface ProductDocument {
  _id: any;
  title: string;
  price: number;
  discountPercentage: number;
  product_category_id: string | null;
  status: string;
  featured?: boolean;
  deleted: boolean;
  slug: string;
  categoryName?: string;
  newPrice?: number;
}

interface CategoryDocument {
  _id: string;
  title: string;
  slug: string;
  deleted: boolean;
}

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch featured products
    const products: ProductDocument[] = await Product.find({
      status: "active",
      deleted: false,
      featured: true,
    }).sort({ position: 1 });

    // Format products for display
    const newProduct = productsHelper.productsDisplay(products);

    res.render("client/pages/products/index", {
      pageTitle: "List product",
      products: newProduct,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).send("Internal Server Error");
  }
};


export const detailProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Find product by slug
    const product: ProductDocument | null = await Product.findOne({
      slug: req.params.slugProduct,
      deleted: false,
      status: "active",
    });

    if (!product) {
      res.status(404).send("Product not found");
      return;
    }

    // Get category info if available
    if (product.product_category_id) {
      const category: CategoryDocument | null = await Category.findById(
        product.product_category_id
      );
      product.categoryName = category ? category.title : "None";
    } else {
      product.categoryName = "None";
    }

    // Calculate the new price after discount
    product.newPrice = parseFloat(
      (
        product.price *
        (1.0 - product.discountPercentage / 100)
      ).toFixed(2)
    ).toString();

    // Render product detail page
    res.render("client/pages/products/detail", {
      pageTitle: "Detail product",
      product: product,
    });
  } catch (error) {
    console.error("Error getting product detail:", error);
    res.status(500).send("404 Not Found");
  }
};


export const category = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Find category by slug
    const category: CategoryDocument | null = await Category.findOne({
      slug: req.params.slugCategory,
      deleted: false,
    });

    if (!category) {
      res.status(404).send("Category not found");
      return;
    }

    // Get subcategories of the category
    const subCategories: { _id: string }[] = (await categoryHelpers.getSubCategory(category._id)).map(sub => ({ _id: String(sub._id) }));

    // Collect products from subcategories
    let arrProducts: string[] = subCategories.map((sub) => sub._id);
    arrProducts.push(category._id);

    // Fetch products from the selected category and its subcategories
    let products: ProductDocument[] = await Product.find({
      product_category_id: { $in: arrProducts },
      status: "active",
      deleted: false,
    });

    // Format products for display
    products = productsHelper.productsDisplay(products);

    // Render category page
    res.render("client/pages/products/category", {
      pageTitle: category.title,
      products: products,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).send("Internal Server Error");
  }
};
