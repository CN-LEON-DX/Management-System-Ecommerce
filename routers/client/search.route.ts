import { Router } from "express";
import controller from "../../controllers/client/search.controller";

const router: Router = Router();

// Define routes
router.get("/", controller.index);

export default router;
