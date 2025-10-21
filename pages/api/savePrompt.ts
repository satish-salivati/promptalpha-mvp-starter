import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const raw = req.body || {};
  const userId =
    raw.userId ??
    raw.user_id ??
    raw.user ??
    raw.email ??
    raw.uid ??
    "anonymous";
  const promptText =
    raw.promptText ??
    raw.prompt_text ??
    raw.prompt ??
    raw.text ??
    raw.content;

  if (!promptText) {
    return res.status(400).json({
      error: "Invalid payload: require { promptText }",
      received: { userId, promptText },
    });
  }

  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("saved_prompts")
      .insert([{ user_id: userId, prompt_text: promptText }])
      .select("id, user_id, prompt_text, created_at")
      .single();

    if (error) {
      console.error("Supabase insert error (saved_prompts):", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, row: data });
  } catch (e: any) {
    console.error("SavePrompt API unexpected error:", e);
    return res.status(500).json({ error: e.message ?? "Unknown error" });
  }
}
