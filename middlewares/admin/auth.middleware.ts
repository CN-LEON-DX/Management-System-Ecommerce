import { Request, Response, NextFunction } from "express";
import { systemConfig } from "../../config/system";
import Accounts from "../../models/account.model";
import Roles from "../../models/role.model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.signedCookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  const user = await Accounts.findOne({
    token: req.signedCookies.token,
  }).select("-password");
  if (!user) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  const roles = await Roles.findOne({ _id: user.roleID }).select(
    "permissions title"
  );
  if (!roles) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  res.locals.roles = roles;
  res.locals.user = user;
  next();
};

export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const roles = res.locals.roles;
    if (roles && roles.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  };
};

export default { requireAuth, checkPermission };