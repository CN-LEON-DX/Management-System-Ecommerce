interface Product {
  price: number;
  discountPercentage: number;
  newPrice?: string; // Optional, because it is calculated and added dynamically
  [key: string]: any; // Allowing flexibility for other properties in the product
}

// File: helpers/productDisplayHelper.ts

export const productsDisplay = (products: Product[]): Product[] => {
  // Your logic to format products for display
  return products.map(product => ({
    ...product,
    newPrice: (product.price - (product.price * product.discountPercentage) / 100).toString(),
  }));
};


