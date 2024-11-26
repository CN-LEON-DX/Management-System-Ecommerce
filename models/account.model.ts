import mongoose, { Document, Schema } from "mongoose";
import * as generateToken from "../helpers/generateToken.helper";

// Interface for Account document
interface Account extends Document {
  fullName: string;
  email: string;
  password: string;
  token: string;
  phone: string;
  avatar: string;
  roleID: string;
  status: string;
  deleted: boolean;
  deletedAt: Date | null;
}

// Schema definition
const accountSchema: Schema<Account> = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String, default: generateToken.genRandomKey(10) },
    phone: { type: String, required: true },
    avatar: { type: String },
    roleID: { type: String, required: true },
    status: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Model
const Accounts =
  mongoose.model < Account > ("Account", accountSchema, "accounts");

export default Accounts;
