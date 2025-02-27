'use server';

import { PrismaClient } from "@prisma/client";
import { convertToPlainObject } from "../utils";

// Get latest products

export async function getLatestProducts() {
    const prisma = new PrismaClient();

    const data = await prisma.product.findMany({
        take: 10,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return convertToPlainObject(data);
}
