"use client";

import { useState } from "react";

export default function Page() {
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

  // NEW state for linking feedback to a saved prompt
  const [promptId, setPromptId] = useState<string | null>(null);

  const [isTesting, setIsTesting] = useState(false);
  const [testOutput, setTestOutput] = useState("");

  // Options
  const myRoleOptions = [ "Founder","CEO / Executive","HR Manager","Recruiter / Talent Partner","Product Manager","Project Manager","Sales Lead / AE","Customer Success","Marketing Manager","Content Creator","Educator / Trainer","Student","Researcher / Analyst","Operations Manager","Engineer (Non-ML)" ];

  const aiRoleOptions = [ "Copywriter","Editor","Strategist","Analyst","Researcher","Recruiter","Tutor","Assistant","Summarizer","Planner","Scriptwriter","UX Writer","Technical Writer","Email Composer","Social Media Manager" ];

  const audienceOptions = [ "General Public","Prospective Customers","Existing Customers","Executives","Managers","Employees","Partners","Investors","Students","Practitioners / Peers" ];

  const outputFormatOptions = [ "Email","Blog Post","LinkedIn Post","Tweet Thread","Report","Brief / One-pager","Slide Outline","Product Spec","FAQ","Press Release","Case Study","User Story","Job Description","Interview Questions","Checklist" ];

  const lengthOptions = [ "Very short (50–100 words)","Short (100–200 words)","Medium (300–500 words)","Long (800–1200 words)","Extended (1500+ words)" ];

  const styleOptions = [ "Formal","Casual","Persuasive","Storytelling","Technical","Analytical","Instructional","Conversational","Executive-ready","Bullet-heavy" ];

  const toneOptions = [ "Neutral","Friendly","Confident","Empathetic","Direct","Inspirational","Data-driven","Urgent" ];

  // Helper to build the payload
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
      generatedPrompt,
    };
  }

  // Handlers
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

  function handleCopyPrompt() {
    if (!generatedPrompt) return;
    navigator.clipboard
      .writeText(generatedPrompt)
      .then(() => alert("Prompt copied to clipboard!"))
      .catch(() => alert("Copy failed. Please try again."));
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

  async function handleGeneratePrompt(e: React.FormEvent) {
    e.preventDefault();
    console.log("Handler start");
    const payload = buildPayload();
    console.log("Payload:", payload);

    try {
      const res = await fetch("/api/prompts?action=generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Fetch status:", res.status);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("API returned error:", errData);
        alert(errData?.error || "Something went wrong generating the prompt.");
        return;
      }

      const data = await res.json();
      console.log("API response:", data);
      setGeneratedPrompt(data.generatedPrompt || "");
    } catch (err) {
      console.error("Fetch threw:", err);
      alert("Network error. See console for details.");
    }
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">PromptAlpha</h1>

      <form onSubmit={handleGeneratePrompt}>
        {/* Custom Need */}
        <div className="mb-6">
          <label
            htmlFor="customNeed"
            className="block text-sm font-medium text-gray-700"
          >
            Custom Need
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Describe what you want the AI to do. Be specific about goals and
            constraints.
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
            <label
              htmlFor="myRole"
              className="block text-sm font-medium text-gray-700"
            >
              My Role
            </label>
            <select
              id="myRole"
              value={myRole}
              onChange={(e) => setMyRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {myRoleOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="aiRole"
              className="block text-sm font-medium text-gray-700"
            >
              AI Role
            </label>
            <select
              id="aiRole"
              value={aiRole}
              onChange={(e) => setAiRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {aiRoleOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="audience"
              className="block text-sm font-medium text-gray-700"
            >
              Audience
            </label>
            <select
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {audienceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Output group */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label
              htmlFor="outputFormat"
              className="block text-sm font-medium text-gray-700"
            >
              Output Format
            </label>
            <select
              id="outputFormat"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {outputFormatOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Constraints */}
        <div className="mb-6">
          <label
            htmlFor="constraints"
            className="block text-sm font-medium text-gray-700"
          >
            Constraints (optional)
          </label>
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
          <summary className="cursor-pointer font-medium">
            Advanced options
          </summary>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={seoFriendly}
                onChange={(e) => setSeoFriendly(e.target.checked)}
              />
              <span>SEO friendly</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeReferences}
                onChange={(e) => setIncludeReferences(e.target.checked)}
              />
              <span>Include references</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={structuredOutput}
                onChange={(e) => setStructuredOutput(e.target.checked)}
              />
              <span>Structured output</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={avoidPitfalls}
                onChange={(e) => setAvoidPitfalls(e.target.checked)}
              />
              <span>Avoid pitfalls (jargon, fluff)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={complianceMode}
                onChange={(e) => setComplianceMode(e.target.checked)}
              />
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
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
          >
            Share
          </button>
          <button
            type="button"
            onClick={handleFeedback}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
          >
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

    {/* Why this is a super prompt */}
    <div className="mt-6 p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold mb-2">Why this is a super prompt</h3>
      <p className="text-sm text-gray-700">This prompt was enhanced by:</p>
      <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
        <li>Adding clear role/context instructions (e.g. “Act as a …”).</li>
        <li>Specifying output format and tone for consistency.</li>
        <li>Breaking down the task into structured steps.</li>
        <li>Including constraints to avoid vague or generic answers.</li>
        <li>Optimizing wording for LLM interpretability.</li>
      </ul>
      <p className="text-sm text-gray-700 mt-2">
        Compared to a regular prompt, this “super prompt” is explicit, structured, and reusable.
      </p>
    </div>

    {/* Test Prompt button + output */}
    <div className="mt-6">
      <button
        type="button"
        onClick={async () => {
          setIsTesting(true);
          setTestOutput("");
          try {
            const res = await fetch("/api/testPrompt", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt: generatedPrompt }),
            });
            const data = await res.json();
            setTestOutput(data.output);
          } catch (err) {
            setTestOutput("Error testing prompt.");
          } finally {
            setIsTesting(false);
          }
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Prompt
      </button>

      {isTesting && (
        <p className="mt-2 text-sm text-gray-500">Running prompt...</p>
      )}

      {testOutput && (
        <div className="mt-4 p-4 border rounded bg-white">
          <h3 className="text-lg font-semibold mb-2">Test Output</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {testOutput}
          </pre>
        </div>
      )}
    </div>
  </div>
)}
</main>
  );
}

