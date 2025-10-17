// src/lib/assemblePrompt.ts

export type Inputs = {
  role: string;
  task: string;
  tone: string;
  format: string;
  audience: string;
  llm: string;
};

export function assemblePrompt(i: Inputs) {
  const lines = [
    `You are ${i.role}.`,
    `Your task is to ${i.task} for ${i.audience}.`,
    `Write in a ${i.tone} tone, formatted as ${i.format}.`,
    `Target LLM: ${i.llm}.`,
    `Provide a clear, actionable, structured output. Avoid fluff. State assumptions if needed.`,
  ];
  return lines.join("\n\n");
}
