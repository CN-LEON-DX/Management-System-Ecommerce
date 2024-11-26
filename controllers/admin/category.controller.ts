import { Request, Response } from "express";
import slugify from "slugify";
import { systemConfig } from "../../config/system";
import Category from "../../models/category.model";
import createTreeHelper from "../../helpers/createTree.helper";

// GET /admin/category
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ deleted: false });

    const newCategories = createTreeHelper(
      categories.map((category) => ({
        id: category._id.toString(),
        parentID: category.parentID ? category.parentID.toString() : null,
        name: category.toObject().name,
        children: [],
      }))
    );
    res.render("admin/pages/category/index", {
      pageTitle: "Category",
      newCategories,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("An error occurred while fetching categories.");
  }
};

// GET /admin/category/create
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ deleted: false });

    const newCategories = createTreeHelper(
      categories.map((category) => ({
        id: category._id.toString(),
        parentID: category.parentID ? category.parentID.toString() : null,
        name: category.toObject().name,
        children: [],
      }))
    );
    res.render("admin/pages/category/create", {
      pageTitle: "Add category",
      newCategories,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("An error occurred while fetching categories.");
  }
};

// POST /admin/category/create
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let totalCategories = await Category.countDocuments();

    // Ensuring the correct fields are passed in the request body
    const categoryData = {
      ...req.body,
      title: req.body.name,
      status: "active",
      position: req.body.position
        ? parseFloat(req.body.position)
        : totalCategories + 1,
      slug: req.body.name
        ? slugify(req.body.name + totalCategories, { lower: true })
        : undefined,
    };

    const category = new Category(categoryData);
    await category.save();

    req.flash("success", "Category created successfully");
    res.redirect(`${systemConfig.prefixAdmin}/category`);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).send("Internal Server Error");
  }
};

// GET /admin/category/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    const originalCategory = await Category.find({ deleted: false });
    const newCategories = createTreeHelper(
      originalCategory.map((category) => ({
        id: category._id.toString(),
        parentID: category.parentID ? category.parentID.toString() : null,
        name: category.toObject().name,
        children: [],
      }))
    );
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (!category) {
      res.status(404).send("Category not found.");
      return;
    }

    res.render("admin/pages/category/edit", {
      pageTitle: "Edit category",
      category,
      newCategories,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).send("Not found.");
  }
};

// POST /admin/category/edit/:id
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    let totalCategories = await Category.countDocuments();

    const categoryData = {
      ...req.body,
      title: req.body.name,
      status: "active",
      position: req.body.position
        ? parseFloat(req.body.position)
        : totalCategories + 1,
      slug: req.body.name ? slugify(req.body.name, { lower: true }) : undefined,
    };

    console.log(categoryData);

    await Category.updateOne({ _id: req.params.id }, categoryData);

    req.flash("success", "Category updated successfully");
    res.redirect(`${systemConfig.prefixAdmin}/category`);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("Internal Server Error");
  }
};
