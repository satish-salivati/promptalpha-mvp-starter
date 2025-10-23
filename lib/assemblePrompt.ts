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
  depth?: "Brief" | "Standard" | "Deep Dive"; // NEW: controls output length/detail
};

export type PromptSegment = {
  label: string;
  text: string;
};

// Overloads: TS will infer correct return type
export function assemblePrompt(inputs: Inputs, asSegments: true): PromptSegment[];
export function assemblePrompt(inputs: Inputs, asSegments?: false): string;
export function assemblePrompt(
  inputs: Inputs,
  asSegments = false
): string | PromptSegment[] {
  const segments: PromptSegment[] = [];

  function add(label: string, text?: string | boolean | number) {
    if (text === undefined || text === null || text === "" || text === false) return;
    segments.push({ label, text: String(text) });
  }

  // Core intent
  add("Role", inputs.role ? `Act as ${inputs.role}` : undefined);
  add("Objective", inputs.objective);
  add("Tone", inputs.tone ? `Use a ${inputs.tone} tone` : undefined);
  add("Format", inputs.format ? `Respond in ${inputs.format}` : "Respond in a detailed narrative");
  add("Audience", inputs.audience ? `For ${inputs.audience}` : undefined);

  // Depth control
  if (inputs.depth) {
    if (inputs.depth === "Brief") {
      add("Depth", "Keep it concise, 2–3 paragraphs max.");
    } else if (inputs.depth === "Standard") {
      add("Depth", "Provide balanced detail, around 5–7 paragraphs.");
    } else if (inputs.depth === "Deep Dive") {
      add(
        "Depth",
        "Expand thoroughly with multiple sections, examples, and detailed explanations. Do not artificially limit length."
      );
    }
  }

  // Custom need
  add("Custom need", inputs.customNeed);

  // Constraints
  add("SEO", inputs.seo ? "Optimize for search engines" : undefined);
  add("Citations", inputs.citations ? "Include references when relevant" : undefined);
  add(
    "Structure",
    inputs.structure ? `Structure as ${inputs.structureStyle || "bullet list"}` : undefined
  );
  add(
    "Max words",
    inputs.maxWords && inputs.maxWords > 0 ? `Limit to ${inputs.maxWords} words` : undefined
  );

  // Model hint
  add("LLM", inputs.llm ? `Use ${inputs.llm}` : undefined);

  if (asSegments) return segments;

  return segments.map((s) => `${s.label}: ${s.text}`).join("\n");
}
