// blog model for web page blog have basic information of blog
// like author, title, content, image, created date, updated date
// and status of blog
import { Schema, model, Document } from "mongoose";

export interface Blog {
  author: string;
  title: string;
  content: string;
  category: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}

export interface BlogDocument extends Blog, Document {}

const blogSchema = new Schema<BlogDocument>({
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, required: true, enum: ["active", "inactive"], default: "active" },
});

blogSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Blog = model<BlogDocument>("Blog", blogSchema);
export default Blog;