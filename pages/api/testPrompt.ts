// pages/api/testPrompt.ts

import type { NextApiRequest, NextApiResponse } from "next";

type Body = {
  prompt: string;
  userInput?: string;
  llm?: string; // optional, e.g., "gpt-4o-mini" or "gpt-4o"
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, userInput = "", llm = "gpt-4o-mini" } = req.body as Body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Invalid prompt" });
  }

  const finalPrompt = `${prompt}\n\nUser input:\n${userInput}`.trim();

  try {
    // Call OpenAI Responses API
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: llm,
        input: finalPrompt,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(resp.status).json({ error: errText || "OpenAI error" });
    }

    const data = await resp.json();

    // Safely extract text from the response
    const output =
      (data?.output_text as string) ||
      (Array.isArray(data?.output) &&
        data.output[0]?.content?.[0]?.text) ||
      JSON.stringify(data);

    return res.status(200).json({ output });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
}
