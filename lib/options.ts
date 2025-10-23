// src/lib/options.ts

export const ROLES = [
  { value: "Content Creator", help: "Write blogs, posts, scripts" },
  { value: "Software Developer", help: "Code, explain, review" },
  { value: "UX Designer", help: "User flows, research insights" },
  { value: "Lawyer", help: "Legal analysis, drafting" },
  { value: "Medical Expert", help: "Explain health concepts" },
  { value: "Student", help: "Study, summaries, exam prep" },
  { value: "Researcher", help: "Literature review, analysis" },
  { value: "Salesperson", help: "Pitches, emails, objections" },
  { value: "Product Manager", help: "PRDs, summaries, communication" },
  { value: "Data Analyst", help: "Interpret data, charts" },
  { value: "Educator", help: "Lesson plans, teaching aids" },
  { value: "Journalist", help: "Investigate, report clearly" },
  { value: "Marketing Strategist", help: "Campaigns, positioning" },
];

export const OBJECTIVES = [
  { value: "Summarize an article", help: "Condense text into key points" },
  { value: "Write an email draft", help: "Professional outreach or follow-up" },
  { value: "Explain a concept", help: "Make complex ideas simple" },
  { value: "Brainstorm ideas", help: "Generate creative options" },
  { value: "Translate text", help: "Convert language accurately" },
  { value: "Create a blog outline", help: "Structure a blog post" },
  { value: "Draft social posts", help: "Multiple angles and tones" },
  { value: "Generate code snippet", help: "Small, focused example" },
  { value: "Write step-by-step guide", help: "Clear procedural instructions" },
  { value: "Analyze research", help: "Extract insights and gaps" },
  { value: "Compare alternatives", help: "Pros/cons and recommendation" },
];

export const TONES = [
  { value: "Professional", help: "Clear, formal, concise" },
  { value: "Friendly", help: "Approachable, warm" },
  { value: "Humorous", help: "Light, witty" },
  { value: "Persuasive", help: "Compelling, convincing" },
  { value: "Educational", help: "Instructive, explanatory" },
  { value: "Storytelling", help: "Narrative-driven" },
  { value: "Journalistic", help: "Objective, factual" },
];

export const FORMATS = [
  { value: "Paragraph", help: "Plain text narrative" },
  { value: "Bullet list", help: "Concise points" },
  { value: "Numbered list", help: "Ordered steps" },
  { value: "Table", help: "Structured comparison" },
  { value: "JSON", help: "Machine-readable output" },
  { value: "Code block", help: "Fenced code section" },
  { value: "Dialogue", help: "Conversation format" },
  { value: "Step-by-step instructions", help: "Process breakdown" },
];

export const AUDIENCES = [
  { value: "Children", help: "Simple, age-appropriate" },
  { value: "Executives", help: "High-level, outcome-focused" },
  { value: "Developers", help: "Technical precision" },
  { value: "General public", help: "Accessible, plain language" },
  { value: "Academic", help: "Formal, cited where relevant" },
  { value: "Internal team", help: "Context-aware, concise" },
];

export const STRUCTURES = [
  { value: "Narrative", help: "Continuous prose" },
  { value: "Bullet", help: "Concise highlights" },
  { value: "Table", help: "Rows/columns" },
  { value: "Headline–Subhead", help: "Marketing style" },
  { value: "FAQ", help: "Question–Answer list" },
];

export const LLMS = [
  { value: "GPT-4", help: "High quality general model" },
  { value: "GPT-4o-mini", help: "Fast, cost-effective" },
  { value: "Claude 3.5", help: "Strong reasoning and writing" },
  { value: "Local (OpenAI-compatible)", help: "Custom endpoint via env" },
];

// NEW: Depth options for controlling output length/detail
export const DEPTH = [
  { value: "Brief", help: "Summary, 2–3 paragraphs" },
  { value: "Standard", help: "Balanced detail, 5–7 paragraphs" },
  { value: "Deep Dive", help: "Exhaustive, multi-section, long-form" },
];

// Helper to allow free-text override in UI (used for micro-guide hints)
export const HINTS = {
  role: "Role: e.g., Expert marketer, Research assistant, UX designer",
  objective: "Objective: e.g., Summarize an article, write an email",
  tone: "Tone: e.g., Professional, Friendly, Persuasive",
  format: "Format: e.g., Paragraph, Bullet list, Table",
  audience: "Audience: e.g., Executives, Developers, General public",
  structure: "Structure: e.g., Narrative, Bullet, Table, FAQ",
  depth: "Depth: e.g., Brief, Standard, Deep Dive", // NEW
};
