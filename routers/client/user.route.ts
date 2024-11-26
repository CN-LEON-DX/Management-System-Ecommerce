import { Router } from "express";
import * as controller from "../../controllers/client/user.controller";
import validate from "../../validates/client/user.validate";
import authMiddleware from "../../middlewares/client/auth.middleware";

const router: Router = Router();

// User routes
router.get("/register", controller.register);
router.post("/register", validate.registerValid, controller.registerAccount);

router.get("/login", controller.login);
router.post("/login", validate.loginValid, controller.loginAccount);

router.get("/logout", controller.logoutAccount);

router.get("/password/forgot", controller.forgotPasswordPost);
router.post(
  "/password/forgot",
  validate.forgotPassword,
  controller.forgotPasswordPost
);

router.get("/password/otp-password", controller.otpPassword);
router.post("/password/otp-password", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);
router.post(
  "/password/reset",
  validate.passwordMatch,
  controller.resetPasswordPost
);

router.get("/info", authMiddleware.requireAuth, controller.infoUser);

export default router;
