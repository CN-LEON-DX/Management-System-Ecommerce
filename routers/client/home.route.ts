import { Router } from "express";
import * as controller from "../../controllers/client/home.controller";

const router: Router = Router();

// Define routes
router.get("/", controller.index);

export default router;
