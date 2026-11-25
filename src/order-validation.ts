import type { Product } from "./types/product";
import type { CartItem } from "./types/cart-item";
import type { ValidationIssue } from "./types/validation-issue";

export function validateOrder(
  products: Product[],
  cartItems: CartItem[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const validatedSkus = new Set<string>();

  for (const cartItem of cartItems) {
    const product = products.find((product) => product.sku === cartItem.sku);
    const totalRequestedQuantity = cartItems
      .filter((item) => item.sku === cartItem.sku)
      .reduce((total, item) => total + item.quantity, 0);

    if (cartItem.quantity <= 0) {
      issues.push({
        type: "INVALID_QUANTITY",
        message: " ",
      });
      continue;
    }

    if (validatedSkus.has(cartItem.sku)) {
      continue;
    }

    if (!product) {
      issues.push({
        type: "PRODUCT_NOT_FOUND",
        message: `Product ${cartItem.sku} is not found`,
      });
      continue;
    }

    validatedSkus.add(cartItem.sku);

    if (product.stock == 0) {
      issues.push({
        type: "OUT_OF_STOCK",
        message: `Product ${cartItem.sku} is out of stock right now`,
      });
      continue;
    }

    if (totalRequestedQuantity > product.stock) {
      issues.push({
        type: "INSUFFICIENT_STOCK",
        message: `Requested ${totalRequestedQuantity}, but only ${product.stock} available`,
      });
    }
  }
  return issues;
}
