import { Request, Response, NextFunction } from "express";
import Category from "../../models/category.model";
import createTreeHelper from "../../helpers/createTree.helper";
import CategoryDocument from "../../models/category.model"; // Assuming you have a CategoryDocument type
import exp from "constants";

const categoryMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productCategory: CategoryDocument[] = await Category.find({ deleted: false });
    const newProductCategory = createTreeHelper(
      productCategory.map((category) => ({
        id: category._id.toString(),
        parentID: category.parentID ? category.parentID.toString() : null,
        name: category.toObject().name,
        children: [],
      }))
    );
    res.locals.layoutCategory = newProductCategory;
    next();
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
};
export default categoryMiddleware;