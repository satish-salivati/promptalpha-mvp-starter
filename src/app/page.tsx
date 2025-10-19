"use client";

import { useState } from "react";
export default function Page() {
  // ✅ Your existing state
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // ✅ NEW state for linking feedback to a saved prompt
  const [promptId, setPromptId] = useState<string | null>(null);

  // ✅ Helper to build the payload you want to send
  function buildPayload() {
    return { generatedPrompt };
  }

  // ✅ Save handler
  async function handleSave() {
    const res = await fetch("/api/prompts?action=save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });

    const data = res.ok ? await res.json() : null;
    if (data?.id) setPromptId(data.id);

    alert(res.ok ? "Saved!" : "Save failed.");
  }

  // ✅ Share handler
  async function handleShare() {
    const res = await fetch("/api/prompts?action=share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });

    const data = res.ok ? await res.json() : null;
    if (data?.id) setPromptId(data.id);

    if (data?.url) {
      await navigator.clipboard.writeText(data.url).catch(() => {});
      alert("Share link copied to clipboard!");
    } else {
      alert("Share failed.");
    }
  }

  // ✅ Feedback handler
  async function handleFeedback() {
    if (!promptId) {
      alert("Please Save or Share first before giving feedback.");
      return;
    }

    const ratingStr = prompt("Rate 1–5:");
    const rating = ratingStr ? parseInt(ratingStr, 10) : undefined;
    const comments = prompt("Any comments?");

    if (!rating || rating < 1 || rating > 5) {
      alert("Please enter a rating from 1 to 5.");
      return;
    }

    const res = await fetch("/api/prompts?action=feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId, rating, comments }),
    });

    alert(res.ok ? "Feedback received. Thank you!" : "Feedback failed.");
  }

  // ✅ Your UI
  return (
    <main>
      {/* Example: textarea for generated prompt */}
      <textarea
        value={generatedPrompt}
        onChange={(e) => setGeneratedPrompt(e.target.value)}
      />

      {/* Buttons wired to handlers */}
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleShare}>Share</button>
        <button onClick={handleFeedback}>Feedback</button>
      </div>
    </main>
  );
}

    // State hooks
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

  // Generated prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");

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

  // Build payload
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

  // Handlers
  async function handleGeneratePrompt(e: React.FormEvent) {
    e.preventDefault();
    const payload = buildPayload();

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
    setGeneratedPrompt(data.prompt || "");
  }

  async function handleSave() {
    const res = await fetch("/api/savePrompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...buildPayload(), generatedPrompt }),
    });
    alert(res.ok ? "Saved!" : "Save failed.");
  }

  async function handleShare() {
    const res = await fetch("/api/sharePrompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...buildPayload(), generatedPrompt }),
    });
    const data = res.ok ? await res.json() : null;
    if (data?.url) {
      navigator.clipboard.writeText(data.url).catch(() => {});
      alert("Share link copied to clipboard!");
    } else {
      alert("Share failed.");
    }
  }

  async function handleFeedback() {
    const rating = prompt("Rate 1–5:");
    const comments = prompt("Optional comments:");
    if (!rating && !comments) return;
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comments, context: buildPayload(), generatedPrompt }),
    });
    alert(res.ok ? "Feedback received. Thank you!" : "Feedback failed.");
  }

  function handleCopyPrompt() {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      alert("Prompt copied to clipboard!");
    }).catch(() => {
      alert("Copy failed. Please try again.");
    });
  }

  function handleDownloadPrompt() {
    if (!generatedPrompt) return;
    const blob = new Blob([generatedPrompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    a.click();
    URL.revokeObjectURL(url);
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
          <p className="text-xs text-gray-500 mb-2">
            Describe what you want the AI to do. Be specific about goals and constraints.
          </p>
          <textarea
            id="customNeed"
            rows={4}
            value={customNeed}
            onChange={(e) => setCustomNeed(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="Example: Write a persuasive email to a prospective client about our new feature..."
            required
          />
        </div>

        {/* Context group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="myRole" className="block text-sm font-medium text-gray-700">My Role</label>
            <select
              id="myRole"
              value={myRole}
              onChange={(e) => setMyRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {myRoleOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="aiRole" className="block text-sm font-medium text-gray-700">AI Role</label>
            <select
              id="aiRole"
              value={aiRole}
              onChange={(e) => setAiRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {aiRoleOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="audience" className="block text-sm font-medium text-gray-700">Audience</label>
            <select
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {audienceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Output group */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700">Output Format</label>
            <select
              id="outputFormat"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {outputFormatOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700">Length</label>
            <select
              id="length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {lengthOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700">Style</label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {styleOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700">Tone</label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {toneOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Constraints */}
        <div className="mb-6">
          <label htmlFor="constraints" className="block text-sm font-medium text-gray-700">Constraints (optional)</label>
          <textarea
            id="constraints"
            rows={3}
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="E.g., 200–300 words, include a CTA, avoid jargon, use bullet points."
          />
        </div>

        {/* Advanced options */}
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
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Generate prompt
          </button>
          <button type="button" onClick={handleSave} className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">
            Save
          </button>
          <button type="button" onClick={handleShare} className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">
            Share
          </button>
          <button type="button" onClick={handleFeedback} className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">
            Give feedback
          </button>
        </div>
      </form>

      {/* Generated prompt output */}
      {generatedPrompt && (
        <div className="mt-8 rounded-md border border-gray-200 p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Generated Prompt</h2>
          <pre className="whitespace-pre-wrap text-sm">{generatedPrompt}</pre>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-100"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={handleDownloadPrompt}
              className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-100"
            >
              Download
            </button>
          </div>
         </div>
        </main>
  );
}
