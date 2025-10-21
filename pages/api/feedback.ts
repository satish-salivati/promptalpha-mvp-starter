import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Be flexible with incoming keys: support multiple frontend payload shapes
  const raw = req.body || {};
  const userId =
    raw.userId ??
    raw.user_id ??
    raw.user ??
    raw.email ??
    raw.uid ??
    "anonymous"; // fallback so NOT NULL doesn’t break
  const feedbackText =
    raw.feedbackText ??
    raw.feedback_text ??
    raw.feedback ??
    raw.text ??
    raw.message;
  const numericRating = Number(raw.rating ?? raw.score ?? raw.stars);

  // Immediate validation with clear messages
  if (!feedbackText || Number.isNaN(numericRating)) {
    return res.status(400).json({
      error: "Invalid payload: require { feedbackText, rating:number }",
      received: { userId, feedbackText, rating: raw.rating },
    });
  }

  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("feedback")
      .insert([{ user_id: userId, feedback_text: feedbackText, rating: numericRating }])
      .select("id, user_id, feedback_text, rating, created_at")
      .single();

    if (error) {
      console.error("Supabase insert error (feedback):", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, row: data });
  } catch (e: any) {
    console.error("Feedback API unexpected error:", e);
    return res.status(500).json({ error: e.message ?? "Unknown error" });
  }
}
