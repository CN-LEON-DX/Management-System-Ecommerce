import mongoose, { Document, Schema } from "mongoose";

// Interface for the Role document
interface Role extends Document {
  title: string;
  description?: string;
  deleted: boolean;
  permissions: string[];  // Array of strings to hold permissions
  deletedAt?: Date;
}

// Schema definition
const roleSchema: Schema<Role> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    deleted: { type: Boolean, default: false },
    permissions: { type: [String], default: [] },  // Array of strings for permissions
    deletedAt: { type: Date },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Model definition
const Role = mongoose.model<Role>("Role", roleSchema, "roles");

export default Role;
