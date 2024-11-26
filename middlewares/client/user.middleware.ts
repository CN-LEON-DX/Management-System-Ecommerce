import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model"; // Assuming you have a UserDocument type
import UserDocument from "../../models/user.model";

const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const tokenUser = req.cookies.tokenUser;

  if (tokenUser) {
    try {
      const user: UserDocument | null = await User.findOne({
        token: tokenUser,
        deleted: false,
      }).select("-password");

      if (user) {
        res.locals.user = user; // Views can use this
      }
    } catch (error) {
      // Handle the error if needed, for now pass to the next middleware
      next(error);
    }
  }

  next();
};

export default userMiddleware;
