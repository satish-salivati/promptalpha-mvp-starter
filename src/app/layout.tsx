"use client";

import type { ReactNode } from "react";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import "@/app/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <title>PromptAlpha</title>
        <meta name="description" content="AI-powered prompt generator" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <SessionContextProvider supabaseClient={supabase}>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </SessionContextProvider>
      </body>
    </html>
  );
};

export default Layout;
