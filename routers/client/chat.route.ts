import { Router } from "express";
import * as controller from "../../controllers/client/chat.controller";

const router: Router = Router();

// Define routes
router.get("/", controller.index);

export default router;
