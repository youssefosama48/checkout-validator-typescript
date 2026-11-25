# Checkout Validator

A small TypeScript project that contains the main calculations and validation checks used during an online shopping checkout.

The project works with a list of products and the items added to a shopping cart. It can calculate the order summary and check whether the cart contains valid quantities and available products.

## What does it do?

The project has two main parts:

### 1. Basket calculations

The calculation functions are in `src/calculations.ts`.

- **Subtotal:** Adds the price of every cart item. The item price is multiplied by its quantity.
- **Shipping fees:** Shipping costs **500 cents** when the subtotal is 10,000 cents or less. Shipping is free when the subtotal is greater than 10,000 cents.
- **VAT:** Calculates the VAT included in the displayed prices, using 20/120 of the subtotal. VAT is not added on top of the prices.
- **Total:** Adds the subtotal and shipping fees.
- **Basket summary:** `calculateBasket()` runs the calculations and returns all four values.

All money values are represented in **cents** (for example, 2,599 means 25.99 in a currency that uses 100 minor units per major unit).

### 2. Order validation

The validation function is in `src/order-validation.ts`.

`validateOrder(products, cartItems)` checks the cart and returns an array of validation issues. An empty array means that no validation issues were found.

It checks for:

| Issue type | Meaning |
| --- | --- |
| `PRODUCT_NOT_FOUND` | The cart contains a SKU that does not exist in the product list. |
| `OUT_OF_STOCK` | The product exists, but its stock is zero. |
| `INSUFFICIENT_STOCK` | The total requested quantity for a SKU is greater than the available stock. |
| `INVALID_QUANTITY` | A cart item has a quantity of zero or less. |

**Duplicate cart lines are considered together for stock validation.** For example, if the same SKU appears twice with quantities of 5 and 5, the requested quantity is 10, not 5.

## Project structure

```text
checkout-validator/
├── src/
│   ├── calculations.ts          # Subtotal, VAT, shipping and total calculations
│   ├── order-validation.ts      # Cart and stock validation
│   ├── index.ts                 # Public exports
│   └── types/
│       ├── product.ts           # Product data structure
│       ├── cart-item.ts          # Cart item data structure
│       ├── order-summary.ts      # Calculated order summary
│       └── validation-issue.ts   # Validation issue types
├── tests/
│   ├── calculations.spec.ts     # Tests for basket calculations
│   └── order-validation.spec.ts # Tests for order validation
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Data structures

### Product

A product contains:

| Field | Type | Description |
| --- | --- | --- |
| `sku` | `string` | Unique product identifier |
| `name` | `string` | Product name |
| `price` | `number` | Product price in cents |
| `stock` | `number` | Available stock quantity |

Example:

```ts
const product: Product = {
  sku: "SKU-101",
  name: "Mouse",
  price: 2599,
  stock: 8,
};
```

### Cart item

A cart item identifies a product and the requested quantity.

```ts
const cartItem: CartItem = {
  sku: "SKU-101",
  quantity: 2,
};
```

### Order summary

`calculateBasket()` returns an object with these fields:

- `subtotal`: total price of cart items before shipping.
- `vat`: VAT amount included in the displayed item prices.
- `shipping`: shipping fee.
- `total`: subtotal plus shipping.

## Getting started

### Requirements

- [Node.js](https://nodejs.org/)
- npm (installed with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/youssefosama48/checkout-validator-typescript.git
cd checkout-validator-typescript
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the tests

```bash
npm test
```

The test command runs the project's Playwright Test test suite.

## Example: calculate a basket

The following example uses the exported functions and types from `src/index.ts`.

```ts
import {
  calculateBasket,
  type Product,
  type CartItem,
} from "./src";

const products: Product[] = [
  { sku: "SKU-101", name: "Mouse", price: 2599, stock: 8 },
  { sku: "SKU-102", name: "Keyboard", price: 7999, stock: 2 },
];

const cartItems: CartItem[] = [
  { sku: "SKU-101", quantity: 2 },
  { sku: "SKU-102", quantity: 1 },
];

const summary = calculateBasket(products, cartItems);

console.log(summary);
```

Expected result:

```ts
{
  subtotal: 13197,
  vat: 2200,
  shipping: 0,
  total: 13197
}
```

The subtotal is 13,197 cents, so shipping is free because it is greater than 10,000 cents.

## Example: validate an order

```ts
import {
  validateOrder,
  type Product,
  type CartItem,
} from "./src";

const products: Product[] = [
  { sku: "SKU-101", name: "Mouse", price: 2599, stock: 8 },
];

const cartItems: CartItem[] = [
  { sku: "SKU-101", quantity: 5 },
  { sku: "SKU-101", quantity: 5 },
];

const issues = validateOrder(products, cartItems);

console.log(issues);
```

Expected result:

```ts
[
  {
    type: "INSUFFICIENT_STOCK",
    message: "Requested 10, but only 8 available"
  }
]
```

## Tests

The project uses **Playwright Test** with TypeScript.

The current test files cover scenarios including:

- Normal basket calculations.
- An empty cart.
- Multiple cart lines containing the same SKU.
- Shipping fee boundary behavior.
- Valid orders.
- Unknown product SKUs.
- Products with zero stock.
- Requested quantities greater than available stock.
- Zero and negative quantities.
- Multiple validation issues in one cart.
- Combined quantities across duplicate SKU lines.

Run all tests with:

```bash
npm test
```

## Technologies

- **TypeScript** — application logic and data types.
- **Playwright Test** — automated tests.
- **Prettier** — code formatting.

## Project goal

This project is a practical exercise in writing TypeScript business logic and testing it with automated test cases. It focuses on checkout calculations, input validation, stock checks, boundary conditions, and handling duplicate cart items.
