// lib/options.ts

export const ROLES = [
  { value: "Product Manager", help: "Focus on product strategy and requirements" },
  { value: "Software Engineer", help: "Emphasize technical details and implementation" },
  { value: "HR Specialist", help: "Highlight people, culture, and compliance" },
  { value: "Marketing Lead", help: "Stress positioning, messaging, and audience reach" },
];
export const OBJECTIVES = [
  { value: "Summarize an article", help: "Condense text into key points" },
  { value: "Write an email draft", help: "Generate a professional email" },
  { value: "Explain a concept", help: "Break down complex ideas simply" },
  { value: "Brainstorm ideas", help: "Generate creative options" },
  { value: "Translate text", help: "Convert text into another language" },
];
export const TONES = [
  { value: "Formal", help: "Professional and structured" },
  { value: "Casual", help: "Friendly and conversational" },
  { value: "Persuasive", help: "Convincing and motivating" },
  { value: "Analytical", help: "Data-driven and logical" },
];

export const FORMATS = [
  { value: "Paragraph", help: "Continuous prose" },
  { value: "Bullet points", help: "Concise, scannable list" },
  { value: "Table", help: "Organized rows and columns" },
  { value: "Outline", help: "Hierarchical structure" },
];

export const AUDIENCES = [
  { value: "Executives", help: "High-level, strategic focus" },
  { value: "Team members", help: "Practical, actionable details" },
  { value: "Customers", help: "Clear, benefit-driven language" },
  { value: "General public", help: "Accessible and jargon-free" },
];

export const LLMS = [
  { value: "GPT-4", help: "Balanced reasoning and creativity" },
  { value: "Claude", help: "Helpful, concise, and safe outputs" },
  { value: "Llama", help: "Open-source, customizable model" },
  { value: "Gemini", help: "Strong multimodal reasoning" },
];
