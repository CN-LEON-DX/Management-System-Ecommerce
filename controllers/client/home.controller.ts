import { Request, Response } from "express";
import Product from "../../models/product.model";
import * as productsHelper from "../../helpers/products.helper";


export const index = async (req: Request, res: Response): Promise<void> => {
    // Render the page with the products
    res.render("client/pages/home/index", {
      pageTitle: "Trang chu",
      layoutCategory: res.locals.layoutCategory,
    });
};
