import mongoose, { Document, Schema } from "mongoose";

// Interface for Category document
interface Category extends Document {
  title: string;
  description?: string;
  parentID: string;
  thumbnail?: string;
  status: string;
  position?: number;
  slug: string;
  deleted: boolean;
  deletedAt?: Date;
  name?: string;
}

// Schema definition
const categorySchema: Schema<Category> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    parentID: { type: String, default: "" },
    thumbnail: { type: String },
    status: { type: String, default: "active" },
    position: { type: Number },
    slug: { type: String, unique: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Model
const Category = mongoose.model<Category>(
  "Category",
  categorySchema,
  "category"
);

export default Category;
