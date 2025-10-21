// pages/api/prompts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
// IMPORTANT: Update this import path to where your NextAuth options are exported
import authOptions from "./auth-options"; // e.g., "../../pages/api/auth/[...nextauth]"

// Create a server-side Supabase client using the SERVICE ROLE key (never expose to client)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper: get current user_id from Supabase profiles by session email
async function getUserId(email: string | null | undefined): Promise<string | null> {
  if (!email) return null;
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();
  if (error || !data?.id) return null;
  return data.id;
}

// Helper: reset daily usage if a new day (no-op if row missing)
async function resetUsageIfNewDay(userId: string) {
  const { data: limit } = await supabaseAdmin
    .from("usage_limits")
    .select("last_reset_date, used_today")
    .eq("user_id", userId)
    .single();

  const lastReset = limit?.last_reset_date ? new Date(limit.last_reset_date) : null;
  const today = new Date();
  const isNewDay =
    !lastReset ||
    lastReset.getUTCFullYear() !== today.getUTCFullYear() ||
    lastReset.getUTCMonth() !== today.getUTCMonth() ||
    lastReset.getUTCDate() !== today.getUTCDate();

  if (isNewDay) {
    await supabaseAdmin
      .from("usage_limits")
      .update({ used_today: 0, last_reset_date: new Date().toISOString().slice(0, 10) })
      .eq("user_id", userId);
  }
}

// Helper: ensure a usage row exists, and check quota (testing: always allow)
async function checkAndIncrementQuota(userId: string) {
  const { error: fetchErr } = await supabaseAdmin
    .from("usage_limits")
    .select("daily_quota, used_today")
    .eq("user_id", userId)
    .single();

  // If row not found (PostgREST code), create a default row
  if (fetchErr && (fetchErr as any).code === "PGRST116") {
    await supabaseAdmin
      .from("usage_limits")
      .insert({ user_id: userId, daily_quota: 10, used_today: 0 });
  }

  // For now, allow unlimited during testing
  return { allowed: true, used: 0, quota: 9999 };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Authenticate user via NextAuth
  const session: any = await getServerSession(req, res, authOptions as any);
  const email = session?.user?.email ?? null;
  console.log("prompts.ts: session email =", email);
  if (!email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Resolve userId via profiles table
  const userId = await getUserId(email);
  console.log("prompts.ts: resolved userId =", userId);
  if (!userId) {
    return res.status(404).json({ error: "User not found in Supabase profiles" });
  }

  try {
    // Generate a super prompt
    if (action === "generate") {
      await resetUsageIfNewDay(userId);

      const { allowed, used, quota } = await checkAndIncrementQuota(userId);
      if (!allowed) {
        return res
          .status(429)
          .json({ error: `Daily generation limit reached (${quota}/day). Try again tomorrow.` });
      }

      const body = req.body || {};
      const {
        customNeed = "",
        persona = "",
        role = "",
        audience = "",
        outputFormat = "",
        length = "",
        style = "",
        tone = "",
        constraints = "",
        model = process.env.MODEL_NAME ?? "gpt-4o-mini",
      } = body;

      const userPrompt = `
You are a prompt engineering assistant. Convert the user's request into a structured, reusable super prompt.
Follow this format:
- Objective
- Requirements (What, Why/Need, Market, Potential, Problem it Solves, Revenue, End Users, Additional Info)
Be explicit, concise, and professional. Avoid filler. Ensure completeness.

User request:
Custom Need: ${customNeed}
Persona: ${persona}
AI Role: ${role}
Audience: ${audience}
Output Format: ${outputFormat}
Length: ${length}
Style: ${style}
Tone: ${tone}
Constraints: ${constraints}
      `.trim();

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are a senior prompt engineer. You transform vague requests into clear, structured super prompts that are reusable and comprehensive.",
            },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
        }),
      });

      if (!resp.ok) {
        const err = await resp.text();
        return res.status(resp.status).json({ error: err });
      }

      const data = await resp.json();
      const generated = data.choices?.[0]?.message?.content?.trim() || "";

      return res.status(200).json({
        ok: true,
        generatedPrompt: generated,
        usage: { usedToday: used, dailyQuota: quota },
      });
    }

    // Save a prompt
    if (action === "save") {
      const raw = req.body || {};
      const flat =
        raw && typeof raw === "object" && raw.body && typeof raw.body === "object"
          ? raw.body
          : raw;

      const promptText =
        flat.promptText ??
        flat.generatedPrompt ??
        flat.prompt ??
        flat.text ??
        flat.content ??
        (typeof flat === "string" ? flat : "");

      if (!promptText || typeof promptText !== "string") {
        return res.status(400).json({ error: "Missing prompt text", received: raw });
      }

      const { data, error } = await supabaseAdmin
        .from("saved_prompts")
        .insert({
          user_id: userId,
          prompt_text: promptText,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Supabase insert error (saved_prompts):", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ ok: true, id: data.id });
    }

    // Share a prompt
    if (action === "share") {
      const raw = req.body || {};
      console.log("Share request body:", JSON.stringify(raw));

      const flat =
        raw && typeof raw === "object" && raw.body && typeof raw.body === "object"
          ? raw.body
          : raw;

      const promptText =
        flat.promptText ??
        flat.generatedPrompt ??
        flat.prompt ??
        flat.text ??
        flat.content ??
        (typeof flat === "string" ? flat : "");

      console.log("Share resolved promptText:", promptText);

      if (!promptText || typeof promptText !== "string") {
        return res.status(400).json({ error: "Missing prompt text", received: raw });
      }

      const { data, error } = await supabaseAdmin
        .from("shared_prompts")
        .insert({
          user_id: userId,
          prompt_text: promptText,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Supabase insert error (shared_prompts):", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ ok: true, id: data.id });
    }

    // List saved prompts
    if (action === "list") {
      const { data, error } = await supabaseAdmin
        .from("saved_prompts")
        .select("id, created_at, prompt_text")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ ok: true, prompts: data ?? [] });
    }

        // Feedback branch — aligned with your DB
    if (action === "feedback") {
      const raw = req.body || {};
      console.log("Feedback request body:", JSON.stringify(raw));

      const flat =
        raw && typeof raw === "object" && raw.body && typeof raw.body === "object"
          ? raw.body
          : raw;

      // Accept multiple possible keys, including "comments"
      const comments =
        flat.comments ??
        flat.feedbackText ??
        flat.feedback ??
        flat.text ??
        "";

      const ratingRaw = flat.rating ?? flat.stars ?? 0;
      const rating = Number.isFinite(Number(ratingRaw)) ? Number(ratingRaw) : 0;

      // Optional: link feedback to a prompt
      const promptId = flat.promptId ?? null;

      console.log("Feedback resolved comments & rating:", comments, rating, "promptId:", promptId);

      if (!comments || typeof comments !== "string") {
        return res
          .status(400)
          .json({ error: "comments are required", received: raw });
      }

      // Build insert object using your actual column names
      const insertObj: Record<string, any> = {
        user_id: userId,
        text: comments,   // 👈 matches your DB column
        rating,           // 👈 integer 1–5
      };

      // Only include prompt_id if you add that column to your table
      if (promptId) insertObj.prompt_id = promptId;

      const { error } = await supabaseAdmin.from("feedback").insert([insertObj]);

      if (error) {
        console.error("Supabase insert error (feedback):", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ ok: true });
    }

    // Unknown action
    return res.status(400).json({ error: "Unknown action" });
  } catch (e: any) {
    console.error("API error:", e);
    return res.status(500).json({ error: "Server error" });
  }
}
