'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Plus } from "lucide-react";
import { CartItem } from "@/types";
import { toast } from "sonner"


const AddToCart = ({ item }: { item: CartItem }) => {
    const handleAddToCard = () => {
        toast.success('Item added to cart');
    }
    return (<Button className="w-full" type="button" onClick={handleAddToCard}>Add to cart</Button>);
}

export default AddToCart;