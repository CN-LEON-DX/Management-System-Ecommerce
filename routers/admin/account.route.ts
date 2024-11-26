import express, { Router, Request, Response } from "express";
import * as controller from "../../controllers/admin/account.controller";
import validate from "../../validates/admin/account.validate";

// uploadcloud
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
// end uploadcloud

import multer from "multer";
const upload = multer();

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => controller.index(req, res));

router.get("/create", (req: Request, res: Response) =>
  controller.createAccount(req, res)
);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createAcc,
  (req: Request, res: Response) => controller.addAccount(req, res)
);

router.get("/edit/:id", (req: Request, res: Response) =>
  controller.editAccount(req, res)
);

router.patch(
  "/update/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.updateAcc,
  (req: Request, res: Response) => controller.updateAccount(req, res)
);

export default router;
