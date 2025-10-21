import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const raw = req.body || {};

  const userId = raw.userId || raw.user_id || raw.email || "anonymous";
  const promptText = raw.promptText || raw.prompt || raw.text || raw.content;

  if (!promptText) {
    return res.status(400).json({ error: "Missing prompt text", received: raw });
  }

  const { error } = await supabaseServer()
    .from("saved_prompts")
    .insert([{ user_id: userId, prompt_text: promptText }]);

  if (error) {
    console.error("Supabase insert error (saved_prompts):", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
