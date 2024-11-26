import express, { Router, Request, Response } from "express";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import multer from "multer";
import * as controller from "../../controllers/admin/product.controller";
import validate from "../../validates/admin/product.validate";

const router: Router = express.Router();
const upload = multer();

// Routes with Permission Checking

router.get(
  "/",
  authMiddleware.checkPermission("product-view"),
  (req: Request, res: Response) => controller.index(req, res)
);

router.patch(
  "/edit/:id/:title/:price/:status",
  authMiddleware.checkPermission("product-edit"),
  (req: Request, res: Response) => controller.editFast(req, res)
);

router.delete(
  "/delete/:id",
  authMiddleware.checkPermission("product-delete"),
  (req: Request, res: Response) => controller.deleteProduct(req, res)
);

router.delete(
  "/delete-multiple",
  authMiddleware.checkPermission("product-delete"),
  (req: Request, res: Response) => controller.deleteMultiple(req, res)
);

router.patch(
  "/change-position/",
  authMiddleware.checkPermission("product-edit"),
  (req: Request, res: Response) => controller.changePosition(req, res)
);

router.get(
  "/create",
  authMiddleware.checkPermission("product-create"),
  (req: Request, res: Response) => controller.create(req, res)
);

router.post(
  "/create",
  authMiddleware.checkPermission("product-create"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createProduct,
  (req: Request, res: Response) => controller.createProduct(req, res)
);

router.get(
  "/edit/:id",
  authMiddleware.checkPermission("product-edit"),
  (req: Request, res: Response) => controller.editProduct(req, res)
);

router.patch(
  "/edit/:id",
  authMiddleware.checkPermission("product-edit"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createProduct,
  (req: Request, res: Response) => controller.updateProduct(req, res)
);

router.get(
  "/detail/:id",
  authMiddleware.checkPermission("product-view"),
  (req: Request, res: Response) => controller.detailProduct(req, res)
);

export default router;
