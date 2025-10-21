import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // make sure this is set in Vercel
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or whichever model you’re using
      messages: [{ role: "user", content: prompt }],
    });

    const output = completion.choices[0].message?.content ?? "";
    res.status(200).json({ output });
  } catch (error: any) {
    console.error("Error testing prompt:", error);
    res.status(500).json({ error: "Failed to test prompt" });
  }
}
