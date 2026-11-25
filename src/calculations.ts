import { CartItem } from "./types/cart-item";
import { OrderSummary } from "./types/order-summary";
import { Product } from "./types/product";

// function to calculate order subtotal price
export function calculateSubTotal(products : Product[], cartItems : CartItem[]) : number {

    const subtotal = cartItems.reduce((acc, cartItem) => {
        const addedProduct = products.find(
            product => cartItem.sku === product.sku
        );
        if (addedProduct) {
            // Calcualtion of item total price in the shopping cart
            const itemTotalPrice = cartItem.quantity * addedProduct.price;
            return itemTotalPrice + acc ;
        } 
        else {
            throw new Error("Product not found");
        }

    }, 0);

    return subtotal ;
}

export function calculateShippingFees(subtotal : number) : number {
    if(subtotal > 10000) {
        return 0;
    } else if (subtotal < 0) {
        throw new Error("Shipping fees can not be negative")
    }

    return 500 ;
};

export function calculateVat(subtotal : number) : number {
    return Math.round((subtotal * (20/120)));
};

export function calculateTotalOrderPrice(subtotalPrice : number , shippingFees : number) : number {
    return subtotalPrice + shippingFees ;
};



//Order Summary Function
export function calculateBasket(products : Product[], cartItems : CartItem[]) : OrderSummary {

   const subtotal = calculateSubTotal(products, cartItems);
   const vat = calculateVat(subtotal);
   const shippingFees = calculateShippingFees(subtotal);
   const totalOrderPrice = calculateTotalOrderPrice (subtotal, shippingFees);

   return {
    "subtotal" : subtotal,
    "vat" : vat,
    "shipping" : shippingFees,
    "total" : totalOrderPrice
   };
}