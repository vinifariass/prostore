"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner"; // <-- Changed this import

const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem }) => {

  const router = useRouter();



  const handleAddToCart = async () => {

    const res = await addItemToCart(item);

    if (!res.success) {

      toast.error(res.message);

      return;

    }

    toast.success(res.message, {

      action: {

        label: "Go to Cart",

        onClick: () => router.push("/cart"),

      },

    });

  }

  const handleRemoveFromCart = async () => {

    // Remove item from cart
    const res = await removeItemFromCart(item.productId);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    return;

  };

  // Check if item is in the cart

  const existItem = cart && cart.items.find((i) => i.productId === item.productId);
  return existItem ? (
    <div>
      <Button type="button" variant='outline' onClick={handleRemoveFromCart}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant='outline' onClick={handleAddToCart}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button
      onClick={handleAddToCart}
      className="w-full"
    >
      <Plus size={16} />
      Add to Cart
    </Button>
  );
};
export default AddToCart;