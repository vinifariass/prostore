import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';
import { PAYMENT_METHODS } from './constants';

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

//Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
    id: z.string().min(1, 'Product ID is required')
});


//Schema for signing users in

export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});
//Schema for signing up a user
export const singUpFormSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});


// Cart schema
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().nonnegative('Quantity must be a positive integer'),
    image: z.string().min(1, 'Image is required'),
    price: currency
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
    userId: z.string().optional().nullable()
});

//Schema for shipping address

export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
    city: z.string().min(3, 'City must be at least 3 characters'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
    country: z.string().min(3, 'Country must be at least 3 characters'),
    lat: z.number().optional(),
    lng: z.number().optional(),
})

//Schema for payment method

export const paymentMethodSchema = z.object({
    type: z.string().min(1, 'Payment method type is required'),

}).refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
});

export const insertOrderSchema = z.object({
    userId: z.string().min(1, 'User is required'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((val) => PAYMENT_METHODS.includes(val), {
        message: 'Invalid payment method',
    }),
    shippingAddress: shippingAddressSchema,
})

// Schema for inserting a order item

export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency,
    qty: z.number(),

})

export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
})

//Schema for updating the user profile
export const updateProfileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().min(3, 'Email must be at least 3 characters'),
})

//Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
    id: z.string().min(1, 'ID is required'),
    role: z.string().min(1, 'Role is required'),
})

// Schema to insert reviews
export const insertReviewSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    productId: z.string().min(1, 'Product is required'),
    userId: z.string().min(1, 'User is required'),
    rating: z.coerce.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5')
})