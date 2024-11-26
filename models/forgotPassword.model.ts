import mongoose, { Document, Schema } from "mongoose";

// Interface for ForgotPassword document
interface ForgotPassword extends Document {
  email: string;
  otp: string;
  expireAt: Date;
}

// Schema definition
const forgotPasswordSchema: Schema<ForgotPassword> = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expireAt: { 
      type: Date, 
      expires: 3000,  // Expiry time in seconds (5 minutes)
      required: true 
    },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Model
const ForgotPassword = mongoose.model<ForgotPassword>("ForgotPassword", forgotPasswordSchema, "forgotPassword");

export default ForgotPassword;
