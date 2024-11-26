import express, { Router } from "express";
import * as controller from "../../controllers/admin/myAccount.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";

const router: Router = express.Router();

router.get("/", authMiddleware.requireAuth, controller.index);

export default router;
