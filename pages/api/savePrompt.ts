import type { NextApiRequest, NextApiResponse } from "next";

// Simple Save API: accepts POST and returns a success message.
// Later, you can store this in a database. For now, it just works.

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests (the Save button sends POST)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // The request body contains your form fields + generatedPrompt
    const body = req.body;

    // Basic validation: ensure we have something to save
    if (!body || !body.generatedPrompt) {
      return res.status(400).json({ error: "generatedPrompt is required" });
    }

    // TODO (optional, later):
    // - Store `body` in a database (Supabase/Firestore/etc.)
    // - Return the created record ID

    // For now: Always return success
    return res.status(200).json({
      success: true,
      message: "Prompt saved (demo)",
      id: "demo-id-123",
    });
  } catch (err) {
    console.error("savePrompt error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
