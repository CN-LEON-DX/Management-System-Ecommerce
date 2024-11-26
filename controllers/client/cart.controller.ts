import { Request, Response } from 'express';
import { systemConfig } from '../../config/system';
import Cart from '../../models/cart.model';
import Product from '../../models/product.model';
import IProduct from '../../models/product.model';
import { productsDisplay } from '../../helpers/products.helper';

// Add product to the cart
export const addPostProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const cartID: string = req.cookies.cartID;
    const productID: string = req.params.id;
    const quantity: number = parseInt(req.body.quantity, 10);

    const cart = await Cart.findById(cartID);
    if (!cart) {
      res.status(404).send("Cart not found");
      return;
    }

    const existProductInCart = cart.products.find(
      (item) => item.productID === productID
    );

    if (existProductInCart) {
      await Cart.updateOne(
        {
          _id: cartID,
          "products.productID": productID,
        },
        {
          $set: {
            "products.$.quantity": quantity + existProductInCart.quantity,
          },
        }
      );
    } else {
      const objCart = {
        productID: productID,
        quantity: quantity,
      };
      await Cart.updateOne(
        {
          _id: cartID,
        },
        {
          $push: { products: objCart },
        }
      );
    }

    req.flash("success", "Added product to cart successfully!");
    res.redirect("back");
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};

// View cart and calculate total price
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const cartID: string = req.cookies.cartID;
    const cart = await Cart.findById(cartID);
    if (!cart) {
      res.status(404).send("Cart not found");
      return;
    }

    let totalPrice: number = 0;
    const cartProductsPromises = cart.products.map(async (element) => {
      const product = await Product.findById(element.productID);
      if (product) {
        product.quantity = element.quantity;
        return product;
      }
    });

    let cartProducts = (await Promise.all(cartProductsPromises)).filter(
      (product) => product !== undefined
    ) as IProduct[];

    cartProducts = productsDisplay(cartProducts);
    cartProducts.forEach((item) => {
      totalPrice += item.quantity * item.newPrice;
    });

    res.render("client/pages/cart/index", {
      cartProducts: cartProducts,
      pageTitle: "Carts",
      totalPrice: totalPrice,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};

// Delete product from cart
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const productID: string = req.params.id;
  try {
    const cartID: string = req.cookies.cartID;
    await Cart.updateOne(
      {
        _id: cartID,
      },
      {
        $pull: { products: { productID: productID } },
      }
    );
    req.flash("success", "Deleted product successfully!");
    res.redirect("back");
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};

// Update product quantities in cart
export const updateQuantities = async (req: Request, res: Response): Promise<void> => {
  try {
    const cartID: string = req.cookies.cartID;
    const { products } = req.body;

    for (const { productID, quantity } of products) {
      await Cart.updateOne(
        {
          _id: cartID,
          "products.productID": productID,
        },
        {
          $set: { "products.$.quantity": quantity },
        }
      );
    }
    req.flash("success", "Updated quantities successfully!");
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};
