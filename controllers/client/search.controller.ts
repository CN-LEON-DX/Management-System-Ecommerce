import { Request, Response } from 'express';
import Product from '../../models/product.model';
import * as productDisplayHelper from '../../helpers/products.helper';

const index = async (req: Request, res: Response): Promise<void> => {
  const keyword: string = req.query.keyword as string; // Type-casting to string
  
  // Create a case-insensitive regex for searching the title
  const keywordRegex: RegExp = new RegExp(keyword, 'i');
  
  try {
    // Fetch products based on the search keyword
    const products = await Product.find({
      title: keywordRegex,
      status: 'active',
      deleted: false,
    });

    // Format products for display
    const formattedProducts = productDisplayHelper.productsDisplay(products);

    // Render the search results page
    res.render('client/pages/search/index', {
      pageTitle: `Result of searching: ${keyword}`,
      keywordSearch: keyword,
      products: formattedProducts,
    });
  } catch (error) {
    // Log the error for debugging and send a 500 error response
    console.error("Error searching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default {
  index,
};