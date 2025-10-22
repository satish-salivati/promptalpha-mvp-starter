"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function SignInPage() {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  // Redirect to homepage once signed in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = "/";
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.href = "/";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]} // no social providers yet
        view="magic_link" // 👈 switch to magic link flow
        redirectTo="https://promptalpha-mvp-starter.vercel.app"
      />
      <p className="mt-4 text-sm text-gray-600">
        Enter your email and click the link we send you to sign in.
      </p>
    </main>
  );
}
