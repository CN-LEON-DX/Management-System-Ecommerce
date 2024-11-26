import { Request, Response } from "express";
import Product from "../../models/product.model";
import Account from "../../models/account.model";
import Category from "../../models/category.model";
import { systemConfig } from "../../config/system";
import { Types, SortOrder } from "mongoose";
import slugify from "slugify";
import { filterProductHelper } from "../../helpers/filterProduct.helper";
import * as paginationHelper from "../../helpers/pagination.helper";
import { getSortOption } from "../../helpers/sortProduct.helper";
import createTreeHelper from "../../helpers/createTree.helper";

// Index - List Products
export const index = async (req: Request, res: Response): Promise<void> => {
  const { priceRange, status, search, sortSelection } = req.query;
  const page = req.query.page as string | number;

  let query: any = filterProductHelper(req);

  const pagination = paginationHelper.getPagination(
    page,
    await Product.countDocuments(query)
  );

  const sortOption = getSortOption(sortSelection as string) as {
    [key: string]: SortOrder;
  };

  let skipPage = (pagination.currentPage - 1) * pagination.limitItems;
  const products = await Product.find(query)
    .limit(pagination.limitItems)
    .skip(skipPage > 0 ? skipPage : 0)
    .sort(sortOption);

  const productsWithCreators = await Promise.all(
    products.map(async (product) => {
      const creator = await Account.findOne({
        _id: product.createdBy.accountID,
        deleted: false,
      })
        .select("fullName")
        .lean();

      product.whoCreated = creator ? creator.fullName : "Unknown";
      return product;
    })
  );

  res.render("admin/pages/products/index", {
    pageTitle: "List product",
    products: productsWithCreators,
    priceRange,
    status,
    search,
    pagination,
    prefixAdmin: systemConfig.prefixAdmin,
  });
};

// Edit Product (Fast)
export const editFast = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, title, price, status } = req.params;
  try {
    let updated = {
      accountID: res.locals.user.id,
      nameEditor: res.locals.user.fullName,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      { _id: req.params.id },
      {
        title: title,
        price: price,
        status: status,
        $push: { updatedBy: updated },
      }
    );
    req.flash("success", "Product updated successfully");
    res.redirect("back");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    if (id) {
      await Product.findByIdAndUpdate(id, {
        $set: {
          deleted: true,
          deletedBy: {
            accountID: res.locals.user.id,
            deletedAt: new Date(),
          },
        },
      });
      req.flash("success", "Product deleted successfully");
      res.redirect("back");
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    res.status(500).send("Error deleting product");
  }
};

// Delete Multiple Products
export const deleteMultiple = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ids: string[] = JSON.parse(req.body.ids);

    const formattedIds = ids.map((id) => new Types.ObjectId(id.trim()));

    await Product.updateMany(
      { _id: { $in: formattedIds } },
      {
        $set: {
          deleted: true,
          deletedBy: {
            accountID: res.locals.user.id,
            deletedAt: new Date(),
          },
        },
      }
    );
    req.flash("success", "Products deleted successfully");
    res.redirect("back");
  } catch (error) {
    console.error("Error processing product IDs:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Change Product Position
export const changePosition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products: { id: string; position: string }[] = JSON.parse(
      req.body.products
    );

    for (const product of products) {
      const { id, position } = product;

      if (!Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid product ID: ${id}`);
      }

      const positionAsInt = parseInt(position, 10);

      await Product.updateOne(
        { _id: new Types.ObjectId(id) },
        { $set: { position: positionAsInt } }
      );
    }
    req.flash("success", "Product positions updated successfully");
    res.redirect("back");
  } catch (error) {
    console.error("Error processing product positions:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Create Product Form
export const create = async (req: Request, res: Response): Promise<void> => {
  const categories = await Category.find({ deleted: false });
  const newCategories = createTreeHelper(
    categories.map((category) => ({
      id: category._id.toString(),
      parentID: category.parentID ? category.parentID.toString() : null,
      name: category.toObject().name,
      children: [],
    }))
  );

  res.render("admin/pages/products/create", {
    pageTitle: "Create product",
    newCategories,
    prefixAdmin: systemConfig.prefixAdmin,
  });
};

// Create Product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  let totalProducts = await Product.countDocuments();

  req.body.title = req.body.name;
  req.body.status = "active";
  req.body.price = req.body.price ? parseFloat(req.body.price) : 0;
  req.body.stock = req.body.stock ? parseInt(req.body.stock) : 0;
  req.body.rating = req.body.rating ? parseFloat(req.body.rating) : 5;
  req.body.position = req.body.position
    ? parseFloat(req.body.position)
    : totalProducts + 1;
  req.body.discountPercentage = req.body.discountPercentage
    ? parseFloat(req.body.discountPercentage)
    : 0;

  // slug
  if (req.body.title) {
    req.body.slug = slugify(req.body.title + totalProducts, { lower: true });
  }

  try {
    const product = new Product(req.body);
    await product.save();

    req.flash("success", "Product created successfully");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Edit Product Form
export const editProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findOne({
      deleted: false,
      _id: req.params.id,
    });
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }

    const categories = await Category.find({ deleted: false });
    const newCategories = createTreeHelper(
      categories.map((category) => ({
        id: category._id.toString(),
        parentID: category.parentID ? category.parentID.toString() : null,
        name: category.toObject().name,
        children: [],
      }))
    );

    res.render("admin/pages/products/edit", {
      pageTitle: "Edit product",
      product,
      newCategories,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    req.flash("error", "Product not found");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// Update Product
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const totalProducts = await Product.countDocuments();

  req.body.title = req.body.name;
  req.body.status = "active";
  req.body.price = req.body.price ? parseFloat(req.body.price) : 0;
  req.body.stock = req.body.stock ? parseInt(req.body.stock) : 1;
  req.body.rating = req.body.rating ? parseFloat(req.body.rating) : 5;
  req.body.position = req.body.position
    ? parseFloat(req.body.position)
    : totalProducts + 1;
  req.body.discountPercentage = req.body.discountPercentage
    ? parseFloat(req.body.discountPercentage)
    : 0;

  let updated = {
    accountID: res.locals.user.id,
    nameEditor: res.locals.user.fullName,
    updatedAt: new Date(),
  };

  try {
    await Product.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: { updatedBy: updated },
      }
    );
    req.flash("success", "Product updated successfully");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Product Detail
export const detailProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }
    let category;
    if (product.product_category_id) {
      category = await Category.findOne({
        _id: product.product_category_id,
        deleted: false,
      });
    }
    const editor = await Product.findOne({ _id: req.params.id }).select(
      "updatedBy"
    );

    res.render("admin/pages/products/detail", {
      pageTitle: "Detail product",
      product,
      category: category || "None",
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.error("Error getting product detail:", error);
    res.status(500).send("Internal Server Error");
  }
};
