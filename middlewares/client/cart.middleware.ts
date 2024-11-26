import { Request, Response, NextFunction } from "express";
import Cart from "../../models/cart.model";

interface Product {
  quantity: number;
}

const  cartID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cartCookieID = req.cookies.cartID;

  if (!cartCookieID) {
    const cart = new Cart();
    await cart.save();

    const expiresTime = 1000 * 60 * 60 * 24 * 365; // 1 year

    res.cookie("cartID", cart.id, {
      expires: new Date(Date.now() + expiresTime),
    });
  } else {
    const cart = await Cart.findOne({ _id: cartCookieID });
    if (cart && cart.products) {
      // Assuming `cart.products` is an array of objects with a `quantity` field
      cart.totalQuantity = cart.products.reduce(
        (sum: number, item: Product) => {
          return sum + item.quantity;
        },
        0
      );
    } else {
      cart.totalQuantity = 0;
    }

    res.locals.miniCart = cart;
  }
  next();
};

export default cartID;