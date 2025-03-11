import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    export interface Session extends DefaultSession {
        user: {
            role: string;
        } & DefaultSession['user'];
        // We are not going to change the other properties of the user object
    }
}