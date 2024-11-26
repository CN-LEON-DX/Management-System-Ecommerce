import { Request, Response } from "express";
import Accounts from "../../models/account.model"; // Ensure User is defined in your models

const systemConfig = require("../../config/system");

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    res.render("admin/pages/my-account/index", {
      pageTitle: "My Account",
      user: res.locals.user, 
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.error(error);
  }
};
