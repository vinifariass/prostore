'use server'

import { cookies } from "next/headers"
import { CartItem } from "@/types"
import { convertToPlainObject, formatErrors, round2 } from "../utils"
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const calcPrices = (items: CartItem[]) => {
    const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)),
        shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
        taxPrice = round2(itemsPrice * 0.15),
        totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2)
    }
}

export async function addItemToCart(data: CartItem) {
    try {
        // Check for cart cookie

        const sessionCartId = (await cookies()).get('sessionCartId')?.value;

        if (!sessionCartId) {
            throw new Error('Cart session not found')
        }

        //Get session and user ID

        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        //Get cart

        const cart = await getMyCard();

        // Parse and validate item

        const item = cartItemSchema.parse(data);

        //Find product in database

        const product = await prisma.product.findFirst({
            where: {
                id: item.productId
            }
        })
        if (!product) throw new Error('Product not found')

        if (!cart) {
            // Create new cart object
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrices([item])
            })

            console.log(newCart)

            //Add to database

            await prisma.cart.create({
                data: newCart
            })

            // Revalidate product page
            revalidatePath(`/product/${product.slug}`)

            return {
                success: true,
                message: `${product.name} added to cart`
            }
        } else {
            // Check if item is already in cart
            const existItem = (cart.items as CartItem[]).find((i) => i.productId === item.productId)

            if (existItem) {
                // Check stock
                if (product.stock < existItem.qty + item.qty) {
                    throw new Error('Product out of stock')
                }
                // Increase the quantity
                (cart.items as CartItem[]).find((i) => i.productId === item.productId)!.qty += existItem.qty
            } else{
                // If item does not exist in cart
                // Check stock
                if(product.stock < 1) {
                    throw new Error('Not enough stock')
                }

                // Add item to the cart.items
                cart.items.push(item)
            }

            // Save to database
            await prisma.cart.update({
                where: {
                    id: cart.id
                },
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrices(cart.items as CartItem[])
                }
            })

            revalidatePath(`/product/${product.slug}`)

            return {
                success: true,
                message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart`
            }
        }

    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}

export async function getMyCard() {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    if (!sessionCartId) {
        throw new Error('Cart session not found')
    }

    //Get session and user ID

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get user cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId } : { sessionCartId: sessionCartId }

    })

    if (!cart) return undefined

    //Convert decimals and return

    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    })
}