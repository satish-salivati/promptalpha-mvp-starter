// lib/options.ts

export const ROLES = [
  { value: "Product Manager", help: "Focus on product strategy and requirements" },
  { value: "Software Engineer", help: "Emphasize technical details and implementation" },
  { value: "HR Specialist", help: "Highlight people, culture, and compliance" },
  { value: "Marketing Lead", help: "Stress positioning, messaging, and audience reach" },
];

export const TASKS = [
  { value: "Write a job description", help: "Generate a clear and compelling JD" },
  { value: "Summarize a document", help: "Condense text into key points" },
  { value: "Draft an email", help: "Compose a professional and concise email" },
  { value: "Brainstorm ideas", help: "Produce creative options to choose from" },
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
