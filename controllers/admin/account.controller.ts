import md5 from "md5";
import { systemConfig } from "../../config/system";
import { Request, Response } from "express";
import Accounts from "../../models/account.model";
import Roles from "../../models/role.model";

// Define interface for Account Data
interface AccountData {
  email: string;
  password: string;
  roleID: string;
  deleted: boolean;
  [key: string]: any; // To allow for additional fields in account data
}

// GET /admin/account
export const index = async (req: Request, res: Response) => {
  const find = { deleted: false };

  try {
    const accounts = await Accounts.find(find);
    const roles = await Roles.find(find);

    const roleMap: { [key: string]: string } = {};
    roles.forEach((role) => {
      roleMap[role._id.toString()] = role.title;
    });

    res.render("admin/pages/accounts/index", {
      pageTitle: "Account",
      accounts: accounts,
      roleMap: roleMap,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.log(error);
  }
};

// GET /admin/account/create
export const createAccount = async (req: Request, res: Response) => {
  const find = { deleted: false };

  try {
    const records = await Roles.find(find);
    res.render("admin/pages/accounts/create", {
      pageTitle: "Account",
      records: records,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.log(error);
  }
};

// POST /admin/account/create
export const addAccount = async (req: Request, res: Response) => {
  try {
    const accExist = await Accounts.findOne({ email: req.body.email });
    if (accExist) {
      req.flash("error", "Email already exists!");
      res.redirect("back");
      return;
    }

    req.body.password = md5(req.body.password); // Hash password
    const data: AccountData = req.body;
    const account = new Accounts(data);
    await account.save();

    req.flash("success", "Account added successfully");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    req.flash("error", "Failed to add account.");
    console.log(error);
  }
};

// GET /admin/account/edit/:id
export const editAccount = async (req: Request, res: Response) => {
  try {
    const data = await Accounts.findById(req.params.id);
    const records = await Roles.find();
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Account",
      data: data,
      records: records,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.log(error);
  }
};

// POST /admin/account/update/:id
export const updateAccount = async (req: Request, res: Response) => {
  try {
    const data: AccountData = req.body;

    if (req.body.password) {
      data.password = md5(req.body.password); // Hash password if provided
    } else {
      delete req.body.password; // If no password provided, delete it from the update data
    }

    await Accounts.updateOne({ _id: req.params.id }, data);

    req.flash("success", "Account updated successfully");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    req.flash("error", "Failed to update account.");
    console.log(error);
  }
};
