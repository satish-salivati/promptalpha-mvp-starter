import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = supabaseServer();

  // Count saved prompts
  const { count: savedPrompts } = await supabase
    .from("saved_prompts")
    .select("*", { count: "exact", head: true });

  // Count feedback
  const { count: feedbackCount } = await supabase
    .from("feedback")
    .select("*", { count: "exact", head: true });

  // Count analytics events
  const { count: analyticsCount } = await supabase
    .from("analytics")
    .select("*", { count: "exact", head: true });

  // Get 5 most recent feedback entries
  const { data: recentFeedback } = await supabase
    .from("feedback")
    .select("id, feedback_text, rating")
    .order("created_at", { ascending: false })
    .limit(5);

  res.status(200).json({
    savedPrompts,
    feedbackCount,
    analyticsCount,
    recentFeedback: recentFeedback || [],
  });
}
