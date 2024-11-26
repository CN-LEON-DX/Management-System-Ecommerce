import express, { Router, Request, Response } from "express";
import * as controller from "../../controllers/admin/role.controller";

const router: Router = express.Router();

// Routes
router.get("/", (req: Request, res: Response) => controller.index(req, res));
router.get("/create", (req: Request, res: Response) =>
  controller.create(req, res)
);
router.post("/create", (req: Request, res: Response) =>
  controller.createRoles(req, res)
);
router.get("/edit/:id", (req: Request, res: Response) =>
  controller.edit(req, res)
);
router.patch("/edit/:id", (req: Request, res: Response) =>
  controller.updateRoles(req, res)
);

router.get("/permission", (req: Request, res: Response) =>
  controller.permission(req, res)
);
router.patch("/permission", (req: Request, res: Response) =>
  controller.changePermission(req, res)
);

export default router;
