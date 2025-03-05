'user server'

import { CartItem } from "@/types"

export async function addItemToCart(item: CartItem) {
    return {
        success: true,
        message: 'Item added to cart'
    };
}