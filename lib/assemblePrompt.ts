// src/lib/assemblePrompt.ts

export type Inputs = {
  role: string;
  objective: string;
  tone: string;
  format: string;
  audience: string;
  llm: string;
  customNeed?: string;
  seo?: boolean;
  citations?: boolean;
  structure?: boolean;
  maxWords?: number;
  structureStyle?: string;
};

export type PromptSegment = {
  label: string;
  text: string;
};

function addSegment(
  segments: PromptSegment[],
  label: string,
  text?: string | boolean | number
) {
  if (text === undefined || text === null || text === "" || text === false) return;
  segments.push({ label, text: String(text) });
}

export function assemblePrompt(
  inputs: Inputs,
  asSegments = false
): string | PromptSegment[] {
  const segments: PromptSegment[] = [];

  // Core intent
  addSegment(segments, "Role", inputs.role ? `Act as ${inputs.role}` : undefined);
  addSegment(segments, "Objective", inputs.objective);
  addSegment(segments, "Tone", inputs.tone ? `Use a ${inputs.tone} tone` : undefined);
  addSegment(segments, "Format", inputs.format ? `Respond in ${inputs.format}` : undefined);
  addSegment(segments, "Audience", inputs.audience ? `For ${inputs.audience}` : undefined);

  // Custom need
  addSegment(segments, "Custom need", inputs.customNeed);

  // Constraints / advanced
  addSegment(segments, "SEO", inputs.seo ? "Optimize for SEO" : undefined);
  addSegment(segments, "Citations", inputs.citations ? "Include citations or references when relevant" : undefined);
  addSegment(
    segments,
    "Structure",
    inputs.structure ? `Structure the answer as ${inputs.structureStyle || "bullet list"}` : undefined
  );
  addSegment(
    segments,
    "Max words",
    inputs.maxWords && inputs.maxWords > 0 ? `Limit to ${inputs.maxWords} words` : undefined
  );

  // Model hint (non-binding)
  addSegment(segments, "LLM", inputs.llm ? `Use ${inputs.llm}` : undefined);

  if (asSegments) return segments;

  // Build final prompt string
  const lines = segments.map((s) => `${s.label}: ${s.text}`);
  return lines.join("\n");
}
