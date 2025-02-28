import { error } from 'console';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db/prisma';
import { adapter } from 'next/dist/server/web/adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';

export const config = {
    pages: {
        signIn: '/signin',
        error: '/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: PrismaAdapter(prisma),
    providers: [CredentialsProvider({
        credentials: {
            email: { type: 'email' },
            password: { type: 'password' }
        },
        async authorize(credentials) {
            if (credentials == null) return null;
            //Find user in database
            const user = await prisma.user.findFirst({
                where: {
                    email: credentials.email as string,
                },
            });

            //Check if user exists and password is correct
            if (user && user.password) {
                const isMatch = compareSync(credentials.password as string, user.password);

                //If password is correct, return user
                if (isMatch) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    };
                } else {
                    return null;
                }
            }
            // If user does not exist or password is incorrect
            return null;
        }
    })
    ],
    callbacks: {
        async session({ session, user, trigger, token }: any) {
            //Set the user ID from the token
            session.user.id = token.sub;

            // If there is an update, set the user name
            if (trigger === 'name') {
                session.user.name = user.name;
            }
            return session;
        }
    }
    //Ensures that the object structure, this config is compatible with NextAuth
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
