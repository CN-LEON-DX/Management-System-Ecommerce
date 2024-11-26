import express, { Router, Request, Response } from "express";
import * as controller from "../../controllers/admin/auth.controller";
import validate from "../../validates/admin/auth.validate";

const router: Router = express.Router();

router.get("/login", (req: Request, res: Response) => controller.login(req, res));

router.post(
  "/login",
  validate.postLogin,
  (req: Request, res: Response) => controller.postLogin(req, res)
);

router.get("/logout", (req: Request, res: Response) => controller.logout(req, res));

export default router;
