import mongoose, { Document, Schema } from "mongoose";
import * as generateToken from "../helpers/generateToken.helper";

// Interface for the User document
interface User extends Document {
  fullName: string;
  email: string;
  password: string;
  token: string;
  phone: string;
  avatar: string;
  roleID: string;
  status: string;
  deleted: boolean;
  deletedAt?: Date;
}

// Schema definition
const userSchema: Schema<User> = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String, default: generateToken.genRandomKey(10) },
    phone: { type: String },
    avatar: { type: String },
    roleID: { type: String },
    status: { type: String, default: "active" },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<User>("User", userSchema, "users");

export default User;
