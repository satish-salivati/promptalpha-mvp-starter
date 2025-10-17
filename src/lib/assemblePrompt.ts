// src/lib/assemblePrompt.ts

export interface Inputs {
  role: string;
  task: string;
  tone: string;
  format: string;
  audience: string;
  llm: string;
}

export function assemblePrompt(inputs: Inputs): string {
  const { role, task, tone, format, audience, llm } = inputs;

  return `
You are acting as a ${role || "professional"}.
Your task is to ${task || "perform the requested action"}.
Write in a ${tone || "neutral"} tone and use ${format || "paragraph"} format.
The intended audience is ${audience || "general"}.
Optimize the response for ${llm || "a large language model"}.
  `.trim();
}
