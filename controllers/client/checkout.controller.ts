import { Request, Response } from 'express';
import { Document } from 'mongoose';
import Cart from '../../models/cart.model';
import Product from '../../models/product.model';
import * as productHelper from '../../helpers/products.helper';
import Order from '../../models/order.model';
import { systemConfig } from '../../config/system';

// Define the interface for Product and Order
interface ProductDocument {
  _id: string;
  price: number;
  discountPercentage: number;
  quantity: number;
  title: string;
  thumbnail: string;
  newPrice?: string;
}

interface CartDocument {
  _id: string;
  products: Array<{
    productID: string;
    quantity: number;
  }>;
}

interface OrderDocument extends Document {
  cartID: string;
  userInfo: Record<string, any>;
  products: Array<{
    productID: string;
    price: number;
    discountPercentage: number;
    quantity: number;
    thumbnail?: string;
    title?: string;
    newPrice?: string;
  }>;
}

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const cartID: string = req.cookies.cartID;
    const cart: CartDocument | null = await Cart.findById(cartID);

    if (!cart) {
      res.status(404).send("Cart not found");
      return;
    }

    let totalPrice = 0;
    const cartProductsPromises = cart.products.map(async (element) => {
      const product: ProductDocument | null = await Product.findById(element.productID);
      if (product) {
        product.quantity = element.quantity;
        return product;
      }
      return null;
    });

    let cartProducts = await Promise.all(cartProductsPromises);
    cartProducts = cartProducts.filter((product) => product !== null) as ProductDocument[];

    cartProducts = productHelper.productsDisplay(cartProducts) as ProductDocument[];
    cartProducts.forEach((item) => {
      totalPrice += item.quantity * parseFloat(item.newPrice);
    });

    res.render("client/pages/checkout/index", {
      cartProducts: cartProducts,
      pageTitle: "Carts",
      totalPrice: totalPrice,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

export const order = async (req: Request, res: Response): Promise<void> => {
  try {
    const cartID: string = req.cookies.cartID;
    const userInfo: Record<string, any> = req.body;

    const cart: CartDocument | null = await Cart.findById(cartID);
    if (!cart) {
      res.status(404).send("Cart not found");
      return;
    }

    let products: Array<{
      productID: string;
      price: number;
      discountPercentage: number;
      quantity: number;
    }> = [];

    for (const item of cart.products) {
      const prod: ProductDocument | null = await Product.findOne({
        _id: item.productID,
      });

      if (prod) {
        products.push({
          productID: item.productID,
          price: prod.price,
          discountPercentage: prod.discountPercentage,
          quantity: item.quantity,
        });
      }
    }

    const newOrder: OrderDocument = new Order({
      cartID: cartID,
      userInfo: userInfo,
      products: products,
    });

    await newOrder.save();

    await Cart.updateOne(
      {
        _id: cartID,
      },
      {
        products: [],
      }
    );

    req.flash("success", "Order successfully!");
    res.redirect(`/checkout/success/${newOrder.id}`);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
};

export const success = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderID: string = req.params.id;
    const order: OrderDocument | null = await Order.findOne({ _id: orderID });

    if (!order) {
      res.status(404).send("Order not found");
      return;
    }

    const products: Array<{
      productID: string;
      price: number;
      discountPercentage: number;
      quantity: number;
      thumbnail?: string;
      title?: string;
      newPrice?: string;
    }> = [];
    let totalPrice = 0;

    for (let prod of order.products) {
      const pro: ProductDocument | null = await Product.findOne({ _id: prod.productID });
      if (pro) {
        prod.thumbnail = pro.thumbnail;
        prod.title = pro.title;
        prod.newPrice = ((1 - prod.discountPercentage / 100) * prod.price).toFixed(2);
        totalPrice += parseFloat(prod.newPrice) * prod.quantity;
        products.push({
          productID: prod.productID,
          price: prod.price,
          discountPercentage: prod.discountPercentage,
          quantity: prod.quantity,
          thumbnail: prod.thumbnail || '',
          title: prod.title || '',
          newPrice: prod.newPrice || ''
        });
      }
    }

    res.render("client/pages/checkout/success", {
      pageTitle: "Order",
      order: order,
      products: products,
      totalPrice: totalPrice,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};
