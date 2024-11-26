import mongoose, { Document, Schema } from "mongoose";

// Interface for Chat document
interface Chat extends Document {
  userID: string;
  roomChatID: string;
  content: string;
  images: string[];  // Array of image URLs (or string paths)
  deleted: boolean;
  deletedAt?: Date;
}

// Schema definition
const chatSchema: Schema<Chat> = new mongoose.Schema(
  {
    userID: { type: String, required: true },
    roomChatID: { type: String, required: true },
    content: { type: String, required: true },
    images: { type: [String], default: [] },  // Array of strings for image URLs
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Model
const Chat = mongoose.model<Chat>("Chat", chatSchema, "chats");

export default Chat;
