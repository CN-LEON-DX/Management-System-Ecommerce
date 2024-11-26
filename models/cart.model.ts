import mongoose, { Document, Schema } from "mongoose";

// Interface for Cart document
interface Product {
  productID: string;
  quantity: number;
}

interface Cart extends Document {
  userID: string;
  products: Product[];
  totalQuantity: number;
}

// Schema definition
const cartSchema: Schema<Cart> = new mongoose.Schema(
  {
    userID: { type: String, required: true },
    products: [
      {
        productID: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Model
const Cart = mongoose.model<Cart>("Cart", cartSchema, "carts");

export default Cart;
