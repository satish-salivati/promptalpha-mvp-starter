import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, feedbackText, rating } = req.body;

    if (!userId || !feedbackText || typeof rating !== "number") {
      return res.status(400).json({ error: "Missing userId, feedbackText, or rating" });
    }

    const { error } = await supabaseServer()
      .from("feedback")
      .insert([{ user_id: userId, feedback_text: feedbackText, rating }]);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Feedback API error:", err.message);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
}
