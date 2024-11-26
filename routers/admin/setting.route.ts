import express, { Router, Request, Response } from "express";
import * as controller from "../../controllers/admin/settings.controller";

// uploadcloud
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import multer from "multer";

const upload = multer();
const router: Router = express.Router();

router.get("/general", (req: Request, res: Response) => controller.general(req, res));
router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  (req: Request, res: Response) => controller.generalPatch(req, res)
);

export default router;
