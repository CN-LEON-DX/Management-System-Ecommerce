// [GET] /products

const productsHelper = require("../../helpers/products");
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
    featured: true,
  }).sort({ position: 1 });

  const newProduct = productsHelper.productsDisplay(products);

  res.render("client/pages/products/index", {
    pageTitle: "List product",
    products: newProduct,
  });
};

module.exports.detailProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      deleted: false,
      status: "active",
    });

    const category = Category.findOne({
      _id: product.product_category_id,
    });
    product.category = category.title;

    product.newPrice = (
      product.price *
      (1.0 - product.discountPercentage / 100)
    ).toFixed(2);
    if (!product) {
      res.status(404).send("Product not found");
    }
    res.render(`client/pages/products/detail`, {
      pageTitle: "Detail product",
      product: product,
    });
  } catch (error) {
    console.error("Error getting product detail:", error);
    res.status(500).send("404 Not Found");
  }
};

module.exports.category = async (req, res) => {
  console.log(req.params.slugCategory);
  try {
    const category = await Category.findOne({
      slug: req.params.slugCategory,
      deleted: false,
    });
    let products = await Product.find({
      product_category_id: category.id,
      deleted: false,
    }).sort({ position: -1 });

    products = productsHelper.productsDisplay(products);

    console.log(products);
    res.render("client/pages/products/category", {
      pageTitle: category.title,
      products: products,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).send("Internal Server Error");
  }
};
