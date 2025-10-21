import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const raw = req.body || {};

  // Accept multiple possible keys from frontend
  const userId = raw.userId || raw.user_id || raw.email || "anonymous";
  const feedbackText = raw.feedbackText || raw.feedback || raw.text || raw.message;
  const numericRating = Number(raw.rating || raw.number || raw.score);

  if (!feedbackText) {
    return res.status(400).json({ error: "Missing feedback text", received: raw });
  }
  if (Number.isNaN(numericRating)) {
    return res.status(400).json({ error: "Rating must be a number", received: raw });
  }

  const { error } = await supabaseServer()
    .from("feedback")
    .insert([{ user_id: userId, feedback_text: feedbackText, rating: numericRating }]);

  if (error) {
    console.error("Supabase insert error (feedback):", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
