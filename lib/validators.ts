import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';

// Schema for inserting products
const currency = z
    .string()
    .refine((val) =>
        /^\d+(\.\d{2})?/.test(formatNumberWithDecimal(Number(val))),
        'Price must be a number with up to 2 decimal places');
export const insertProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    category: z.string().min(3, 'Category must be at least 3 characters'),
    brand: z.string().min(3, 'Brand must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'Product must have at least 1 image'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency

});

//Schema for signing users in

export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});