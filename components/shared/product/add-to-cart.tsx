"use client";



import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { CartItem } from "@/types";

import { addItemToCart } from "@/lib/actions/cart.actions";

import { toast } from "sonner"; // <-- Changed this import



const AddToCart = ({ item }: { item: CartItem }) => {

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
  return (
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