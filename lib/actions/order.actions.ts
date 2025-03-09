'use server'

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { convertToPlainObject, formatErrors } from "../utils"
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.action";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";

// Create order and create the order items

export async function createOrder() {
    try {
        const session = await auth();
        if (!session) throw new Error('User not authenticated')

        const cart = await getMyCart();
        const userId = session?.user?.id;
        if (!userId) throw new Error('User not found');

        const user = await getUserById(userId);
        if (!cart || cart.items.length === 0) {
            return { success: false, message: 'Your cart is empty', redirectTo: './cart' }
        }

        if (!user.address) {
            return { success: false, message: 'No shipping address', redirectTo: './shipping-address' }
        }

        if (!user.paymentMethod) {
            return { success: false, message: 'No payment method', redirectTo: './payment-method' }
        }

        //Create order object

        const order = insertOrderSchema.parse({
            userId: user.id,
            paymentMethod: user.paymentMethod,
            shippingAddress: user.address,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        })

        // Create a transaction to create order and order items in the database

        const insertedOrderId = await prisma.$transaction(async (tx) => {
            //Create order

            const insertedOrder = await tx.order.create({ data: order });
            //Create order items from the cart items
            for (const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id
                    }
                })
            }
            //Clear the cart
            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    itemsPrice: 0,
                    totalPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0
                }
            });
            return insertedOrder.id;
        })

        if (!insertedOrderId) throw new Error('Order not created');

        return {
            success: true,
            message: 'Order created',
            redirectTo: `/order/${insertedOrderId}`
        }

    } catch (err) {
        if (isRedirectError(err)) throw err
        return { success: false, message: formatErrors(err) }
    }
}

// Get order by id
export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderitems: true,
            user: { select: { email: true, name: true } }

        }
    })

    return convertToPlainObject(data);
}