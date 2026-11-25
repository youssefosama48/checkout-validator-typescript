import { test, expect } from "@playwright/test";
import { validateOrder } from "../src/order-validation.ts";
import type { CartItem, Product, ValidationIssue } from "../src";

const products: Product[] = [
  { sku: "SKU-101", name: "Mouse", price: 2599, stock: 8 },
  { sku: "SKU-102", name: "Keyboard", price: 7999, stock: 2 },
  { sku: "SKU-103", name: "Monitor", price: 45999, stock: 0 },
];

test("shouldReturnEmptyArrayWhenOrderIsValid", () => {
  const cartItems: CartItem[] = [
    { sku: "SKU-101", quantity: 2 },
    { sku: "SKU-102", quantity: 1 },
  ];

  expect(validateOrder(products, cartItems)).toEqual([]);
});

test("shouldReturnProductNotFoundIssueWhenSkuDoesNotExist", () => {
  const cartItems: CartItem[] = [{ sku: "SKU-105", quantity: 5 }];

  const expectedResult = [
    {
      type: "PRODUCT_NOT_FOUND",
      message: "Product SKU-105 is not found",
    },
  ];

  expect(validateOrder(products, cartItems)).toEqual(expectedResult);
});

test("shouldReturnOutOfStockIssueWhenProductHasZeroStock", () => {
  const cartItems: CartItem[] = [{ sku: "SKU-103", quantity: 2 }];

  const expectedResult = [
    {
      type: "OUT_OF_STOCK",
      message: "Product SKU-103 is out of stock right now",
    },
  ];

  expect(validateOrder(products, cartItems)).toEqual(expectedResult);
});

test("shouldReturnInsufficientStockIssueWhenRequestedQuantityExceedsAvailableStock", () => {
  const cartItems: CartItem[] = [{ sku: "SKU-102", quantity: 3 }];

  const expectedResult = [
    {
      type: "INSUFFICIENT_STOCK",
      message: "Requested 3, but only 2 available",
    },
  ];

  expect(validateOrder(products, cartItems)).toEqual(expectedResult);
});

test("shouldReturnInvalidQuantityIssueWhenQuantityIsZero", () => {
  const cartItems: CartItem[] = [{ sku: "SKU-101", quantity: 0 }];

  const expectedResult = [
    { type: "INVALID_QUANTITY", message: "Quantity should be more than zero" },
  ];

  expect(validateOrder(products, cartItems)).toEqual(expectedResult);
});

test("shouldReturnAllValidationIssuesForMultipleInvalidCartItems", () => {
  const cartItems: CartItem[] = [
    { sku: "SKU-103", quantity: 1 },
    { sku: "SKU-999", quantity: 1 },
    { sku: "SKU-102", quantity: 3 },
    { sku: "SKU-101", quantity: 0 },
  ];

  const expectedResult: ValidationIssue[] = [
    {
      type: "OUT_OF_STOCK",
      message: "Product SKU-103 is out of stock right now",
    },
    {
      type: "PRODUCT_NOT_FOUND",
      message: "Product SKU-999 is not found",
    },
    {
      type: "INSUFFICIENT_STOCK",
      message: "Requested 3, but only 2 available",
    },
    {
      type: "INVALID_QUANTITY",
      message: "Quantity should be more than zero",
    },
  ];

  expect(validateOrder(products, cartItems)).toEqual(expectedResult);
});

test("shouldReturnInvalidQuantityIssueWhenQuantityIsNegative", () => {
  const cartItems: CartItem[] = [{ sku: "SKU-101", quantity: -1 }];
  const expectedResult: ValidationIssue[] = [
    { type: "INVALID_QUANTITY", message: "Quantity should be more than zero" },
  ];

  expect(validateOrder(products, cartItems)).toEqual(expectedResult);
});

test("shouldReturnInsufficientStockIssueWhenCombinedQuantityExceedsAvailableStock", () => {
  const cartItems: CartItem[] = [
    { sku: "SKU-101", quantity: 5 },
    { sku: "SKU-101", quantity: 5 },
  ];

  const expectedResult: ValidationIssue[] = [
    {
      type: "INSUFFICIENT_STOCK",
      message: "Requested 10, but only 8 available",
    },
  ];

  expect(validateOrder(products, cartItems)).toEqual(expectedResult);
});
