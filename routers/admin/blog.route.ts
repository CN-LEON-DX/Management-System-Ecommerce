// write code for blog route

import { Router } from "express";
import * as controller from "../../controllers/admin/blog.controller"; // Adjust the import as necessary

const router = Router();

// Route to get all blogs
router.get("/", controller.getAllBlogs);

// Route to get a single blog by ID
router.get("/detail/:id", controller.getBlogById);

// Route to create a new blog
router.get("/create", controller.createBlog);
router.post("/create/:id", controller.postCreateBlog);

// Route to update an existing blog by ID
router.put("/update:id", controller.updateBlog);

// Route to delete a blog by ID
router.delete("/delete/:id", controller.deleteBlog);

export default router;
