import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGO_URI = `mongodb+srv://cn14-leon-dx:${process.env.PASSWORD_MONGO}@tea4y.dxk4h.mongodb.net/product-management?retryWrites=true&w=majority`;

// Export a function to connect to the database
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully via Mongoose!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};
