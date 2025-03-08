'use server'

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { formatErrors } from "../utils"
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.action";
import { insertOrderSchema } from "../validators";

// Create order and create the order items

export async function createOrder() {
    try {
        const session = await auth();
        if (!session) throw new Error('User not authenticated')

        const cart = await getMyCart();
        const userId = session?.user?.id;
        if(!userId) throw new Error('User not found');

        const user = await getUserById(userId);
        if (!cart || cart.items.length === 0) {
            return {success:false, message: 'Your cart is empty',redirectTo: './cart'}
        }

        if (!user.address) {
            return {success:false, message: 'No shipping address',redirectTo: './shipping-address'}
        }

        if (!user.paymentMethod) {
            return {success:false, message: 'No payment method',redirectTo: './payment-method'}
        }

        //Create order object

        const order = insertOrderSchema.parse({
            userId: user.id,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
            paymentMethod: user.paymentMethod,
            shippingAddress: user.address
        })

        // Create a transaction to create order and order items in the database
    } catch (err) {
        if (isRedirectError(err)) throw err
        return { success: false, message: formatErrors(err) }
    }
}