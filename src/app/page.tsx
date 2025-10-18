"use client";

import { useState } from "react";

export default function Page() {
  // Core state
  const [customNeed, setCustomNeed] = useState("");
  const [myRole, setMyRole] = useState("Founder");
  const [aiRole, setAiRole] = useState("Copywriter");
  const [audience, setAudience] = useState("Prospective Customers");
  const [outputFormat, setOutputFormat] = useState("Email");
  const [length, setLength] = useState("Short (100–200 words)");
  const [style, setStyle] = useState("Persuasive");
  const [tone, setTone] = useState("Confident");
  const [constraints, setConstraints] = useState("");

  // Advanced toggles
  const [seoFriendly, setSeoFriendly] = useState(false);
  const [includeReferences, setIncludeReferences] = useState(false);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [avoidPitfalls, setAvoidPitfalls] = useState(false);
  const [complianceMode, setComplianceMode] = useState(false);

  // Options
  const myRoleOptions = [
    "Founder",
    "CEO / Executive",
    "HR Manager",
    "Recruiter / Talent Partner",
    "Product Manager",
    "Project Manager",
    "Sales Lead / AE",
    "Customer Success",
    "Marketing Manager",
    "Content Creator",
    "Educator / Trainer",
    "Student",
    "Researcher / Analyst",
    "Operations Manager",
    "Engineer (Non-ML)",
  ];

  const aiRoleOptions = [
    "Copywriter",
    "Editor",
    "Strategist",
    "Analyst",
    "Researcher",
    "Recruiter",
    "Tutor",
    "Assistant",
    "Summarizer",
    "Planner",
    "Scriptwriter",
    "UX Writer",
    "Technical Writer",
    "Email Composer",
    "Social Media Manager",
  ];

  const audienceOptions = [
    "General Public",
    "Prospective Customers",
    "Existing Customers",
    "Executives",
    "Managers",
    "Employees",
    "Partners",
    "Investors",
    "Students",
    "Practitioners / Peers",
  ];

  const outputFormatOptions = [
    "Email",
    "Blog Post",
    "LinkedIn Post",
    "Tweet Thread",
    "Report",
    "Brief / One-pager",
    "Slide Outline",
    "Product Spec",
    "FAQ",
    "Press Release",
    "Case Study",
    "User Story",
    "Job Description",
    "Interview Questions",
    "Checklist",
  ];

  const lengthOptions = [
    "Very short (50–100 words)",
    "Short (100–200 words)",
    "Medium (300–500 words)",
    "Long (800–1200 words)",
    "Extended (1500+ words)",
  ];

  const styleOptions = [
    "Formal",
    "Casual",
    "Persuasive",
    "Storytelling",
    "Technical",
    "Analytical",
    "Instructional",
    "Conversational",
    "Executive-ready",
    "Bullet-heavy",
  ];

  const toneOptions = [
    "Neutral",
    "Friendly",
    "Confident",
    "Empathetic",
    "Direct",
    "Inspirational",
    "Data-driven",
    "Urgent",
  ];

  // API helpers
  function buildPayload() {
    return {
      customNeed,
      persona: myRole,
      role: aiRole,
      audience,
      outputFormat,
      length,
      style,
      tone,
      constraints,
      advanced: {
        seoFriendly,
        includeReferences,
        structuredOutput,
        avoidPitfalls,
        complianceMode,
      },
    };
  }

  async function handleGeneratePrompt(e: React.FormEvent) {
    e.preventDefault();
    const payload = buildPayload();

    try {
      const res = await fetch("/api/testPrompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        alert("Something went wrong generating the prompt.");
        return;
      }
      const data = await res.json();
      console.log("Generated prompt:", data);
      alert("Prompt generated! Check console for details.");
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  }

  async function handleSave() {
    const res = await fetch("/api/savePrompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });
    alert(res.ok ? "Saved!" : "Save failed.");
  }

  async function handleShare() {
    const res = await fetch("/api/sharePrompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });
    const data = res.ok ? await res.json() : null;
    if (data?.url) {
      navigator.clipboard.writeText(data.url).catch(() => {});
      alert("Share link copied to clipboard!");
    } else {
      alert("Share failed.");
    }
  }

  function handleDownload() {
    const payload = buildPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleFeedback() {
    const feedback = prompt("Rate 1–5 and optionally add comments:");
    if (!feedback) return;
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback, context: buildPayload() }),
    });
    alert(res.ok ? "Feedback received. Thank you!" : "Feedback failed.");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">PromptAlpha</h1>

      <form onSubmit={handleGeneratePrompt}>
        {/* Custom Need */}
        <div className="mb-6">
          <label htmlFor="customNeed" className="block text-sm font-medium text-gray-700">
            Custom Need
          </label>
          <p className="text-xs text-gray-500 mb-2">Describe what you want the AI to do.</p>
          <textarea
            id="customNeed"
            rows={4}
            value={customNeed}
            onChange={(e) => setCustomNeed(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Example: Write a persuasive email to a prospective client about our new feature..."
            required
          />
        </div>

        {/* Context group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="myRole" className="block text-sm font-medium text-gray-700">My Role</label>
            <select id="myRole" value={myRole} onChange={(e) => setMyRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {myRoleOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="aiRole" className="block text-sm font-medium text-gray-700">AI Role</label>
            <select id="aiRole" value={aiRole} onChange={(e) => setAiRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {aiRoleOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="audience" className="block text-sm font-medium text-gray-700">Audience</label>
            <select id="audience" value={audience} onChange={(e) => setAudience(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {audienceOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        {/* Output group */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700">Output Format</label>
            <select id="outputFormat" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {outputFormatOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700">Length</label>
            <select id="length" value={length} onChange={(e) => setLength(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {lengthOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700">Style</label>
            <select id="style" value={style} onChange={(e) => setStyle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {styleOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700">Tone</label>
            <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {toneOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        {/* Constraints and advanced */}
        <div className="mb-6">
          <label htmlFor="constraints" className="block text-sm font-medium text-gray-700">Constraints (optional)</label>
          <textarea id="constraints" rows={3} value={constraints} onChange={(e) => setConstraints(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., 200–300 words, include a CTA, avoid jargon, use bullet points." />
        </div>

        <details className="mb-6">
          <summary className="cursor-pointer font-medium">Advanced options</summary>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={seoFriendly} onChange={(e) => setSeoFriendly(e.target.checked)} />
              <span>SEO friendly</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeReferences} onChange={(e) => setIncludeReferences(e.target.checked)} />
              <span>Include references</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={structuredOutput} onChange={(e) => setStructuredOutput(e.target.checked)} />
              <span>Structured output</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={avoidPitfalls} onChange={(e) => setAvoidPitfalls(e.target.checked)} />
              <span>Avoid pitfalls (jargon, fluff)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={complianceMode} onChange={(e) => setComplianceMode(e.target.checked)} />
              <span>Compliance mode (conservative claims)</span>
            </label>
          </div>
        </details>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Generate prompt
          </button>
          <button type="button" onClick={handleSave}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">Save</button>
          <button type="button" onClick={handleShare}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">Share</button>
          <button type="button" onClick={handleDownload}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">Download</button>
          <button type="button" onClick={handleFeedback}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">Give feedback</button>
        </div>
      </form>
    </main>
  );
}
