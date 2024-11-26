import mongoose, { Document, Schema } from "mongoose";

// Interface for createdBy, deletedBy, and updatedBy fields
interface CreatedBy {
  accountID: string;
  createdAt: Date;
}

interface DeletedBy {
  accountID: string;
  deletedAt: Date;
}

interface UpdatedBy {
  accountID: string;
  nameEditor: string;
  updatedAt: Date;
}

// Interface for Product document
interface Product extends Document {
  title: string;
  product_category_id: string;
  description?: string;
  price: number;
  discountPercentage: number;
  stock: number;
  thumbnail?: string;
  status: string;
  featured?: boolean;
  position?: number;
  quantity?: number;
  slug: string;
  whoCreated?: string;
  brand?: string;
  rating: number;
  newPrice?: string;
  returnPolicy?: string;
  warrantyInformation?: string;
  createdBy: CreatedBy;
  deleted: boolean;
  deletedBy?: DeletedBy;
  updatedBy: UpdatedBy[];
}

// Schema definition
const productSchema: Schema<Product> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    product_category_id: { type: String, default: "" },
    description: { type: String },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    thumbnail: { type: String },
    status: { type: String, default: "active" },
    featured: { type: Boolean },
    position: { type: Number },
    slug: { type: String, slug: "title", unique: true },
    brand: { type: String },
    rating: { type: Number, default: 5 },
    returnPolicy: { type: String },
    warrantyInformation: { type: String },
    createdBy: {
      accountID: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
    deleted: { type: Boolean, default: false },
    deletedBy: {
      accountID: { type: String },
      deletedAt: { type: Date },
    },
    updatedBy: [
      {
        accountID: { type: String },
        nameEditor: { type: String },
        updatedAt: { type: Date },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Model definition
const Product = mongoose.model<Product>("Product", productSchema, "products");

export default Product;
