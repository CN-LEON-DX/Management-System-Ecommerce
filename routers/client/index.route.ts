import { Application } from "express";
import homeRouters from "./home.route";
import searchRouter from "./search.route";
import userRouter from "./user.route";
import chatRouter from "./chat.route";

import settingMiddleware from "../../middlewares/client/setting.middleware";
import authMiddleware from "../../middlewares/client/auth.middleware";
import categoryMiddleware from "../../middlewares/client/category.middleware";
import cartMiddleware from "../../middlewares/client/cart.middleware";
import userMiddleware from "../../middlewares/client/user.middleware";

const routeClient = (app: Application): void => {
  app.use(categoryMiddleware);
  app.use(cartMiddleware);
  app.use(userMiddleware);
  app.use(settingMiddleware);

  app.use("/", homeRouters);
  app.use("/search", searchRouter);
  app.use("/user", userRouter);
  app.use("/chat", authMiddleware.requireAuth, chatRouter);
};

export default routeClient;