import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, feedbackText, rating } = req.body;

    if (!userId || !feedbackText) {
      return res.status(400).json({ error: "Missing userId or feedbackText" });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating)) {
      return res.status(400).json({ error: "Rating must be a number" });
    }

    const { error } = await supabaseServer()
      .from("feedback")
      .insert([
        {
          user_id: userId,
          feedback_text: feedbackText,
          rating: numericRating,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Feedback API error:", err.message);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
}
