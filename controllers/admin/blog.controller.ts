import { Request, Response } from "express";
import Blog, { BlogDocument } from "../../models/blog.model";
// Display all blogs
export const getAllBlogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const blogs = await Blog.find();
    res.render("admin/pages/blogs/index", { blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Display a single blog
export const getBlogById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).send("Blog not found");
      return;
    }
    res.render("admin/pages/blogs/detail", { blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Create a new blog
export const createBlog = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      res.render("admin/pages/blogs/create", { pageTitle: "Create blog" });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).send("Internal Server Error B");
    }
  };
export const postCreateBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { author, title, content, image, status } = req.body;
    const newBlog = new Blog({ author, title, content, image, status });
    await newBlog.save();
    res.redirect("/admin/blogs");
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Update an existing blog
export const updateBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { author, title, content, image, status } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { author, title, content, image, status },
      { new: true }
    );
    if (!blog) {
      res.status(404).send("Blog not found");
      return;
    }
    res.redirect("/admin/blogs");
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Delete a blog
export const deleteBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).send("Blog not found");
      return;
    }
    res.redirect("/admin/blogs");
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send("Internal Server Error");
  }
};
