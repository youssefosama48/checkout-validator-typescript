import { test, expect } from "@playwright/test";
import { calculateBasket, CartItem, Product } from "../src/index";

const products : Product[] = [
    { sku: "SKU-101", name: "Mouse", price: 2599, stock: 8 },
    { sku: "SKU-102", name: "Keyboard", price: 7999, stock: 2 },
    { sku: "SKU-103", name: "Monitor", price: 45999, stock: 0},
    { sku: "SKU-104", name: "Below Boundary Product", price: 9999, stock: 3},
    { sku: "SKU-105", name: "Boundary Product", price: 1000, stock: 3},
    { sku: "SKU-106", name: "Above Boundary Product", price: 10001, stock: 30},
];

const cartItems = [
    { sku: "SKU-101", quantity: 2 },
    { sku: "SKU-102", quantity: 1 }
];

// First playwright test
test("should calculate a normal basket correctly", () => {
    const result = calculateBasket(products, cartItems);
    console.log(result);

    // Assertion
    expect(result).toEqual({
        subtotal: 13197,
        vat: 2200,
        shipping: 0,
        total: 13197
    });
});

// Test empty cart scenarion
test("should calculate an empty basket correctly", () => {
    const emptyCartItems : CartItem[] = [];

    const result = calculateBasket(products, emptyCartItems);
    console.log(result);

    expect(result).toEqual({
        subtotal: 0,
        vat: 0,
        shipping: 500,
        total: 500
    });
});

// Duplicate SKU 
test("should calculate duplicate SKU items correctly", () => {

    const duplicateCartItems: CartItem[] = [
    { sku: "SKU-101", quantity: 1 },
    { sku: "SKU-101", quantity: 2 },
    ];

    const result = calculateBasket(products, duplicateCartItems);
    console.log(result);

    expect(result).toEqual({
        subtotal: 7797,
        vat: 1300,
        shipping: 500,
        total: 8297
    });
});

// Below Boundary Shipping Fees (price is 9999)
test("should charge shipping when subtotal is below 10000 cents", () => {

    const testCartItems: CartItem[] = [
    { sku: "SKU-104", quantity: 1 }
    ];

    const result = calculateBasket(products, testCartItems);

    expect(result).toEqual({
        subtotal: 9999,
        vat: 1667,
        shipping: 500,
        total: 10499
    });
});
