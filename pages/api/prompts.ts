// pages/api/prompts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
// IMPORTANT: Update this path to your actual auth options export
import authOptions from "./auth-options"; // e.g., "../../pages/api/auth/[...nextauth]"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
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

// Helper: reset daily usage if a new day
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

// Helper: ensure a usage row exists, and check quota
// ⚠️ Modified: always return allowed:true for testing
async function checkAndIncrementQuota(userId: string) {
  // Ensure row exists
  const { error: fetchErr } = await supabaseAdmin
    .from("usage_limits")
    .select("daily_quota, used_today")
    .eq("user_id", userId)
    .single();

  if (fetchErr && fetchErr.code === "PGRST116") {
    await supabaseAdmin
      .from("usage_limits")
      .insert({ user_id: userId, daily_quota: 10, used_today: 0 });
  }

  // For testing: bypass quota enforcement
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
  if (!email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Resolve userId
  const userId = await getUserId(email);
  if (!userId) {
    return res.status(404).json({ error: "User not found in Supabase profiles" });
  }

  try {
    // Generate a super prompt via OpenAI with usage caps
    if (action === "generate") {
      await resetUsageIfNewDay(userId);

      // Quota check now always allows
      const { allowed, used, quota } = await checkAndIncrementQuota(userId);
      if (!allowed) {
        return res
          .status(429)
          .json({ error: `Daily generation limit reached (${quota}/day). Try again tomorrow.` });
      }

      const body = req.body;
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

    // Save a prompt for the current user
    if (action === "save") {
      const { inputText = "", generatedPrompt = "", model = "gpt-4o-mini" } = req.body;

      if (!generatedPrompt) {
        return res.status(400).json({ error: "generatedPrompt is required" });
      }

      const { data, error } = await supabaseAdmin
        .from("prompts")
        .insert({
          user_id: userId,
          input_text: inputText,
          generated_prompt: generatedPrompt,
          model,
        })
        .select("id")
        .single();

      if (error) return res.status(400).json({ error: error.message });

      return res.status(200).json({ ok: true, id: data.id });
    }

    // List saved prompts for the current user
    if (action === "list") {
      const { data, error } = await supabaseAdmin
        .from("prompts")
        .select("id, created_at, input_text, generated_prompt, model")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) return res.status(400).json({ error: error.message });

      return res.status(200).json({ ok: true, prompts: data ?? [] });
    }

    // ✅ New: Feedback branch
    if (action === "feedback") {
      const { feedbackText = "", rating = 0 } = req.body;

      if (!feedbackText) {
        return res.status(400).json({ error: "feedbackText is required" });
      }

      const { error } = await supabaseAdmin
        .from("feedback")
        .insert([{ user_id: userId, feedback_text: feedbackText, rating: Number(rating) }]);

      if (error) {
        console.error("Supabase insert error (feedback):", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (e: any) {
    console.error("API error:", e);
    return res.status(500).json({ error: "Server error" });
  }
}
