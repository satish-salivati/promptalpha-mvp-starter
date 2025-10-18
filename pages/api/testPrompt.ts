// pages/api/testPrompt.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Payload = {
  customNeed: string;
  persona: string;
  role: string;
  audience?: string;
  outputFormat?: string;
  length?: string;
  style?: string;
  tone?: string;
  constraints?: string;
  advanced?: {
    seoFriendly?: boolean;
    includeReferences?: boolean;
    structuredOutput?: boolean;
    avoidPitfalls?: boolean;
    complianceMode?: boolean;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body: Payload = req.body;

    // Basic validation
    if (!body?.customNeed) {
      return res.status(400).json({ error: "customNeed is required" });
    }

    // Build a draft prompt from the payload (you can customize this)
    const lines: string[] = [];

    lines.push(`You are acting as: ${body.role || "Assistant"}.`);
    lines.push(`User context (My Role): ${body.persona || "Unknown"}.`);
    lines.push(`Audience: ${body.audience || "General"}.`);
    lines.push(`Output format: ${body.outputFormat || "Text"}.`);
    lines.push(`Length: ${body.length || "Medium"}.`);
    lines.push(`Style: ${body.style || "Persuasive"}.`);
    lines.push(`Tone: ${body.tone || "Neutral"}.`);
    lines.push("");
    lines.push(`Task: ${body.customNeed}`);
    if (body.constraints) {
      lines.push("");
      lines.push(`Constraints: ${body.constraints}`);
    }

    // Advanced options
    const adv = body.advanced || {};
    const advNotes: string[] = [];
    if (adv.seoFriendly) advNotes.push("Make it SEO-friendly with clear headings and keywords.");
    if (adv.includeReferences) advNotes.push("Include credible references or sources where relevant.");
    if (adv.structuredOutput) advNotes.push("Use a structured output with sections and subheadings.");
    if (adv.avoidPitfalls) advNotes.push("Avoid jargon, fluff, and unsupported claims.");
    if (adv.complianceMode) advNotes.push("Keep claims conservative and compliant.");

    if (advNotes.length) {
      lines.push("");
      lines.push("Advanced instructions:");
      advNotes.forEach((n) => lines.push(`- ${n}`));
    }

    const generatedPrompt = lines.join("\n");

    return res.status(200).json({
      success: true,
      prompt: generatedPrompt,
      echo: body,
    });
  } catch (err: any) {
    console.error("testPrompt error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
