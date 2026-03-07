import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise) as NextAuthOptions["adapter"],
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "donor", // Default role for OAuth users
                    nidStatus: "none",
                    verified: false,
                }
            }
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                await dbConnect();
                const user = await User.findOne({ email: credentials.email }).select(
                    "+password"
                );
                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    nidStatus: user.nidStatus,
                    verified: user.verified,
                };
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                // @ts-expect-error custom fields
                token.role = user.role;
                // @ts-expect-error custom fields
                token.nidStatus = user.nidStatus;
                // @ts-expect-error custom fields
                token.verified = user.verified;
            }
            // Handle session.update() calls — merge any passed fields into token
            if (trigger === "update" && session) {
                if (session.nidStatus) token.nidStatus = session.nidStatus;
                if (session.role) token.role = session.role;
                if (session.verified !== undefined) token.verified = session.verified;
                if (session.name) token.name = session.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-expect-error custom fields
                session.user.id = token.id as string;
                // @ts-expect-error custom fields
                session.user.role = token.role as string;
                // @ts-expect-error custom fields
                session.user.nidStatus = token.nidStatus as string;
                // @ts-expect-error custom fields
                session.user.verified = token.verified as boolean;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
