'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.action";

const CredentialsSignInForm = () => {
    const [data, action] = useActionState(signInWithCredentials, {
        success: false,
        message: ''
    });

const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" variant='default' disabled={pending}>
            {pending ? 'Signing In...' : 'Sign In'}
        </Button>
    );
}

    return (
        <form>
            <div className="space-y-6">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" placeholder="Email" required autoComplete="email"
                        defaultValue={signInDefaultValues.email} />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" id="password" name="password" placeholder="Password" required autoComplete="password"
                        defaultValue={signInDefaultValues.password} />
                </div>
                <SignInButton />

                {data && !data.success && (
                    <div className="text-center text-destructive">
                        {data.message} </div>
                )}

                <div className="text-sm text-center text-muted-foreground">
                    Don&apos;t have and account? {' '}
                    <Link href="/sign-up" target="_self" className="link">Sign Up</Link>
                </div>
            </div>
        </form>);
}

export default CredentialsSignInForm;