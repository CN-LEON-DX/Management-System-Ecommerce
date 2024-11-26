import mongoose, { Document, Schema } from "mongoose";

// Interface for the Setting document
interface Setting extends Document {
  websiteName: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  copyright: string;
}

// Schema definition
const settingSchema: Schema<Setting> = new mongoose.Schema(
  {
    websiteName: { type: String, required: true },
    logo: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    copyright: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Model definition
const SettingsGeneral = mongoose.model<Setting>("SettingsGeneral", settingSchema, "settings-general");
export default SettingsGeneral;

