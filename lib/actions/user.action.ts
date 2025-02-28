"use server";

import { signInFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Sign in user with credentials

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        // Validate form data
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        });
        await signIn('credentials', user);

        return { success: true, message: 'Signed in successfully' };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: 'Invalid email or password' };
    }
}

// Sign out user

export async function signOutUser() {
    await signOut();
}