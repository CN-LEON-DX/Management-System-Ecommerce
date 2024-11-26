import { Application } from "express";
import dashboardRouters from "./dashboard.route";
import productRouters from "./product.route";
import categoryRouters from "./category.route";
import blogRouters from "./blog.route";
import roleRouters from "./role.route";
import accountRouters from "./account.route";
import authRouters from "./auth.router";
import { systemConfig } from "../../config/system";
import myAccountRouters from "./my-account.route";
import settingsRouters from "./setting.route";

import authMiddleware from "../../middlewares/admin/auth.middleware";
import * as authController from "../../controllers/admin/auth.controller";

const setupAdminRoutes = (app: Application): void => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.get(PATH_ADMIN + "/", authController.login);

  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRouters
  );
  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRouters);

  app.use(PATH_ADMIN + "/blogs", authMiddleware.requireAuth, blogRouters);
  app.use(
    PATH_ADMIN + "/category",
    authMiddleware.requireAuth,
    categoryRouters
  );
  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRouters);
  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRouters);
  app.use(
    PATH_ADMIN + "/my-account",
    authMiddleware.requireAuth,
    myAccountRouters
  );
  app.use(
    PATH_ADMIN + "/settings",
    authMiddleware.requireAuth,
    settingsRouters
  );
  app.use(PATH_ADMIN + "/auth", authRouters);
};

export default setupAdminRoutes;
