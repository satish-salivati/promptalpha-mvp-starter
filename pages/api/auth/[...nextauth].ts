// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import type { NextAuthOptions } from "next-auth";

// Create Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Define NextAuth options inline so we can add callbacks
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Ensure a profile row exists in Supabase when user signs in
    async signIn({ user }) {
      if (!user?.email) return false;

      // Check if profile already exists
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", user.email)
        .single();

      if (error || !data) {
        // Insert new profile row
        await supabaseAdmin.from("profiles").insert({
          email: user.email,
          name: user.name ?? null,
        });
      }

      return true;
    },
  },
};

export default NextAuth(authOptions);

