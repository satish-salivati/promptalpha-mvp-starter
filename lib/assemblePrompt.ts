// lib/assemblePrompt.ts

export type Inputs = {
  role: string;
  task: string;
  tone: string;
  format: string;
  audience: string;
  llm: string;
  customNeed: string;   // <-- new free-text field
};

export function assemblePrompt(i: Inputs): string {
  const lines = [
    `You are ${i.role || "a professional"}.`,
    `Your task is to ${i.task || "perform the requested action"} for ${i.audience || "the intended audience"}.`,
    // 👇 This line integrates the free-text input if provided
    i.customNeed ? `The user specifically needs: ${i.customNeed}` : "",
    `Write in a ${i.tone || "neutral"} tone, formatted as ${i.format || "paragraph"}.`,
    `Target LLM: ${i.llm || "a large language model"}.`,
    `Provide a clear, actionable, structured output. Avoid fluff. State assumptions if needed.`,
  ];

  // Removes empty strings if customNeed is blank
  return lines.filter(Boolean).join("\n\n");
}
