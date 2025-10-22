"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function SignInPage() {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]} // keep empty for email/password only
        view="sign_in"
      />
      <p className="mt-4 text-sm text-gray-600">
        After signing in, return to the homepage to generate prompts.
      </p>
    </main>
  );
}
