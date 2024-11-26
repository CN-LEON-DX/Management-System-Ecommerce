import express, { Router, Request, Response } from "express";
import * as controller from "../../controllers/admin/category.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import validate from "../../validates/admin/category.validate";
import multer from "multer";
import streamifier from "streamifier";

const router: Router = express.Router();
const upload = multer();

router.get("/", (req: Request, res: Response) => controller.index(req, res));

router.get("/create", (req: Request, res: Response) =>
  controller.create(req, res)
);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createCategory,
  (req: Request, res: Response) => controller.createCategory(req, res)
);

router.get("/edit/:id", (req: Request, res: Response) =>
  controller.edit(req, res)
);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  (req: Request, res: Response) => controller.update(req, res)
);

export default router;
