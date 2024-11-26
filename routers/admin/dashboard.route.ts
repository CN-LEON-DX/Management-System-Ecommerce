import express, { Router, Request, Response } from "express";
import * as controller from "../../controllers/admin/dashboard.controller";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) =>
  controller.dashboard(req, res)
);

export default router;
