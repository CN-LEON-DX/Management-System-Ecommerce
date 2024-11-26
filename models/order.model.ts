import mongoose, { Document, Schema } from "mongoose";

// Interface for Order document
interface UserInfo {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  additionalInfo: string;
}

interface Product {
  productID: string;
  quantity: number;
  price: number;
  discountPercentage: number;
}

interface Order extends Document {
  cartID: string;
  userInfo: UserInfo;
  products: Product[];
}

// Schema definition
const orderSchema: Schema<Order> = new mongoose.Schema(
  {
    cartID: { type: String, required: true },
    userInfo: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      additionalInfo: { type: String, required: false },
    },
    products: [
      {
        productID: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discountPercentage: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Model
const Order = mongoose.model < Order > ("Order", orderSchema, "orders");

export default Order;
