// src/pages/api/prompts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to build a prompt string from the payload
function buildPrompt(payload: any) {
  const {
    customNeed = "",
    persona = "",
    role = "",
    audience = "",
    outputFormat = "",
    length = "",
    style = "",
    tone = "",
    constraints = "",
    advanced = {},
  } = payload || {};

  return `
You are acting as a ${role} helping a ${persona}.
Your audience is: ${audience}.
The required output format is: ${outputFormat}.
Length: ${length}.
Style: ${style}.
Tone: ${tone}.
${constraints ? `Constraints: ${constraints}` : ""}

Advanced options:
- SEO Friendly: ${advanced?.seoFriendly ? "Yes" : "No"}
- Include References: ${advanced?.includeReferences ? "Yes" : "No"}
- Structured Output: ${advanced?.structuredOutput ? "Yes" : "No"}
- Avoid Pitfalls: ${advanced?.avoidPitfalls ? "Yes" : "No"}
- Compliance Mode: ${advanced?.complianceMode ? "Yes" : "No"}

Task: ${customNeed}

Please generate the best possible draft for this request.
  `;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const action = req.query.action as string;

  try {
    if (req.method === "POST") {
      const body = req.body ?? {};

      switch (action) {
        case "generate": {
          const userPrompt = buildPrompt(body);

          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // you can also use "gpt-4o" or "gpt-3.5-turbo"
            messages: [{ role: "user", content: userPrompt }],
          });

          const generatedPrompt = completion.choices[0].message?.content || "";
          return res.status(200).json({ ok: true, generatedPrompt });
        }

        case "save": {
          const id = `prompt_${Date.now()}`;
          return res.status(200).json({ ok: true, id });
        }

        case "share": {
          const id = body?.id ?? `prompt_${Date.now()}`;
          const url = `https://promptalpha-mvp-starter.vercel.app/shared/${id}`;
          return res.status(200).json({ ok: true, url });
        }

        case "feedback": {
          const { rating, comments, promptId } = body || {};
          if (!promptId) {
            return res.status(400).json({ ok: false, error: "Missing promptId" });
          }
          return res.status(200).json({ ok: true });
        }

        default:
          return res.status(400).json({ ok: false, error: "Unknown action" });
      }
    }

    // GET health check
    return res.status(200).json({ ok: true, route: "/api/prompts", action });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
