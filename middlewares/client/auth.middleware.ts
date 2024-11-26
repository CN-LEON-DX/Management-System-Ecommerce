import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";

const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.cookies.tokenUser) {
    res.redirect("/user/login");
    return;
  }

  try {
    const user = await User.findOne({ token: req.cookies.tokenUser }).select("-password");

    if (!user) {
      res.redirect("/user/login");
      return;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { requireAuth };