import md5 from "md5";
import { systemConfig } from "../../config/system";
import { Request, Response } from "express";
import Accounts from "../../models/account.model";

// Define interface for User
interface User {
  email: string;
  password: string;
  status: string;
  token: string;
  [key: string]: any; // Allow for additional fields on user model
}

// GET /admin/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  if (req.signedCookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    return;
  }

  res.render("admin/pages/auth/login", {
    pageTitle: "Login",
    prefixAdmin: systemConfig.prefixAdmin,
  });
};

// POST /admin/auth/login
export const postLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { email, password }: { email: string, password: string } = req.body;
    password = md5(password); // Hash password

    const user: User | null = await Accounts.findOne({
      email: email,
      status: "active",
      password: password,
    });

    if (!user) {
      req.flash("error", "Email or password is incorrect");
      res.redirect("back");
      return;
    }

    // Set the token in a signed cookie
    res.cookie("token", user.token, { signed: true });

    // Store the user object in locals for easy access in the views
    res.locals.user = user;

    // Render the dashboard page
    res.render("admin/pages/dashboard/index", {
      pageTitle: "Dashboard",
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    req.flash("error", "Login failed:");
    console.log(error);
  }
};

// POST /admin/auth/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("token"); // Clear the token cookie
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`); // Redirect to login page
};
