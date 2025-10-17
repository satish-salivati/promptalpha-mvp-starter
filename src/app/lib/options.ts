// src/lib/options.ts

export const ROLES = [
  { value: 'an academic expert', help: 'Use for essays, research, formal analysis.' },
  { value: 'a business professional', help: 'Use for strategy, emails, pitches, plans.' },
  { value: 'a creative specialist', help: 'Use for storytelling, scripts, branding.' },
  { value: 'a technical expert', help: 'Use for code, architecture, specs.' },
  { value: 'a marketing and sales professional', help: 'Use for ads, copy, funnels.' },
  { value: 'an educator or trainer', help: 'Use for lessons, modules, exercises.' },
  { value: 'a service professional', help: 'Use for legal, medical, finance style.' },
  { value: 'a general assistant', help: 'Use for everyday tasks and summaries.' },
];

export const TASKS = [
  { value: 'generate ideas', help: 'Brainstorm, explore directions and angles.' },
  { value: 'write content', help: 'Produce complete drafts: blogs, posts, emails.' },
  { value: 'summarize or explain', help: 'Condense or clarify material.' },
  { value: 'analyze or evaluate', help: 'Compare, critique, find pros/cons.' },
  { value: 'plan or organize', help: 'Create outlines, strategies, timelines.' },
  { value: 'solve problems', help: 'Technical, logical, business problem-solving.' },
  { value: 'communicate professionally', help: 'Pitches, proposals, cold emails.' },
  { value: 'teach or train', help: 'Lessons, exercises, quizzes.' },
];

export const TONES = [
  { value: 'professional', help: 'Formal, precise, business-ready.' },
  { value: 'conversational', help: 'Approachable, human, easy to read.' },
  { value: 'persuasive', help: 'Compelling, sales-oriented, conversion-focused.' },
  { value: 'creative', help: 'Playful, vivid, imaginative.' },
  { value: 'analytical', help: 'Data-aware, objective, structured.' },
  { value: 'inspirational', help: 'Motivational, uplifting, vision-led.' },
  { value: 'technical', help: 'Exact, jargon-appropriate, rigorous.' },
  { value: 'neutral', help: 'Plain, straightforward, minimal style.' },
];

export const FORMATS = [
  { value: 'an article or essay', help: 'Long-form, structured, headings.' },
  { value: 'a blog post or story', help: 'Narrative, SEO-friendly, scannable.' },
  { value: 'a social media post or thread', help: 'Short, platform-ready, hooks.' },
  { value: 'an email or letter', help: 'Subject, body, CTA, signature.' },
  { value: 'a report or analysis', help: 'Findings, evidence, recommendations.' },
  { value: 'a script or dialogue', help: 'Scenes, beats, roles, stage directions.' },
  { value: 'an outline or plan', help: 'Bullets, steps, milestones.' },
  { value: 'presentation slide notes', help: 'Concise bullets, sections, takeaways.' },
];

export const AUDIENCES = [
  { value: 'the general public', help: 'Broad, accessible, minimal jargon.' },
  { value: 'students or learners', help: 'Educational tone, examples, clarity.' },
  { value: 'professionals or executives', help: 'Concise, strategic, outcome-first.' },
  { value: 'customers or clients', help: 'Benefits, credibility, next steps.' },
  { value: 'investors or stakeholders', help: 'Market, traction, economics.' },
  { value: 'technical experts or peers', help: 'Depth, precision, references.' },
  { value: 'internal teams or employees', help: 'Context, alignment, actions.' },
  { value: 'a creative or entertainment audience', help: 'Hooks, pacing, personality.' },
];

export const LLMS = [
  { value: 'Copilot', help: 'Balanced, productivity-focused.' },
  { value: 'ChatGPT', help: 'Conversational, creative.' },
  { value: 'Claude', help: 'Long-form reasoning, context.' },
  { value: 'Gemini', help: 'Multimodal, experimental.' },
  { value: 'LLaMA', help: 'Open-source, customizable.' },
  { value: 'Any', help: 'Works across most models.' },
];
