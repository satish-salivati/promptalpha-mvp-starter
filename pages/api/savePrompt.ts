import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, promptText } = req.body;

    if (!userId || !promptText) {
      return res.status(400).json({ error: "Missing userId or promptText" });
    }

    const { error } = await supabaseServer()
      .from("saved_prompts")
      .insert([
        {
          user_id: userId,
          prompt_text: promptText,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("SavePrompt API error:", err.message);
    res.status(500).json({ error: "Failed to save prompt" });
  }
}
