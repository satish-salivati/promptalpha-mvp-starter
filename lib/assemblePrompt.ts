// lib/assemblePrompt.ts

export type Inputs = {
  role: string;
  task: string;
  tone: string;
  format: string;
  audience: string;
  llm: string;
  customNeed: string;
  // Advanced toggles
  seo: boolean;
  citations: boolean;
  structure: boolean;
  maxWords: number;
};

export function assemblePrompt(i: Inputs): string {
  const lines = [
    `You are ${i.role || "a professional"}.`,
    `Your task is to ${i.task || "perform the requested action"} for ${i.audience || "the intended audience"}.`,
    i.customNeed ? `The user specifically needs: ${i.customNeed}` : "",
    `Write in a ${i.tone || "professional"} tone, formatted as ${i.format || "paragraph"}.`,
    `Target LLM: ${i.llm || "a large language model"}.`,
    i.structure ? `Structure the output with clear sections, headings, and bullet points where helpful.` : "",
    i.seo ? `Incorporate SEO best practices: use descriptive headings, relevant keywords, and scannable formatting.` : "",
    i.citations ? `Cite sources where applicable and include references or links when possible.` : "",
    `Provide a clear, actionable, structured output. Avoid fluff. State assumptions if needed.`,
  ];

  return lines.filter(Boolean).join("\n\n");
}
