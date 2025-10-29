"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

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
  const [depth, setDepth] = useState("Standard"); // NEW
  const [constraints, setConstraints] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);

  // ✅ Only declare once
  const session = useSession();
  const supabase = useSupabaseClient();
  // If user is not signed in, show a clear path to sign in
  if (!session) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">PromptAlpha</h1>
        </div>
        <div className="rounded-md border border-gray-200 p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">You’re not signed in</h2>
          <p className="text-sm text-gray-700">
            Please{" "}
            <Link href="/sign-in" className="underline text-blue-600">
              sign in
            </Link>{" "}
            to continue.
          </p>
        </div>
      </main>
    );
  }
  

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

  // Test prompt state
  const [isTesting, setIsTesting] = useState(false);
  const [testOutput, setTestOutput] = useState("");

  // Options
  const myRoleOptions = [
    "Founder","CEO / Executive","HR Manager","Recruiter / Talent Partner",
    "Product Manager","Project Manager","Sales Lead / AE","Customer Success",
    "Marketing Manager","Content Creator","Educator / Trainer","Student",
    "Researcher / Analyst","Operations Manager","Engineer (Non-ML)"
  ];

  const aiRoleOptions = [
    "Copywriter","Editor","Strategist","Analyst","Researcher","Recruiter","Tutor",
    "Assistant","Summarizer","Planner","Scriptwriter","UX Writer","Technical Writer",
    "Email Composer","Social Media Manager"
  ];

  const audienceOptions = [
    "General Public","Prospective Customers","Existing Customers","Executives","Managers",
    "Employees","Partners","Investors","Students","Practitioners / Peers"
  ];

  const outputFormatOptions = [
    "Email","Blog Post","LinkedIn Post","Tweet Thread","Report","Brief / One-pager",
    "Slide Outline","Product Spec","FAQ","Press Release","Case Study","User Story",
    "Job Description","Interview Questions","Checklist"
  ];

  const lengthOptions = [
    "Very short (50–100 words)","Short (100–200 words)","Medium (300–500 words)",
    "Long (800–1200 words)","Extended (1500+ words)"
  ];

  const styleOptions = [
    "Formal","Casual","Persuasive","Storytelling","Technical","Analytical",
    "Instructional","Conversational","Executive-ready","Bullet-heavy"
  ];

  const toneOptions = [
    "Neutral","Friendly","Confident","Empathetic","Direct","Inspirational","Data-driven","Urgent"
  ];

  const depthOptions = [ // NEW
    "Brief","Standard","Deep Dive"
  ];

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
      depth, // NEW
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
  // --- Save ---
async function handleSave() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.access_token) {
      alert("Please sign in to save.");
      return;
    }

    const res = await fetch("/api/prompts?action=save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(buildPayload()),
    });

    const data = res.ok ? await res.json() : await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error || "Save failed.");
      return;
    }

    if (data?.id) setPromptId(data.id);
    alert("Saved!");
  } catch (err) {
    console.error("Save failed:", err);
    alert("Network error while saving.");
  }
}

// --- Share ---
async function handleShare() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.access_token) {
      alert("Please sign in to share.");
      return;
    }

    const res = await fetch("/api/prompts?action=share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(buildPayload()),
    });

    const data = res.ok ? await res.json() : await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error || "Share failed.");
      return;
    }

    if (data?.id) setPromptId(data.id);
    if (data?.url) {
      await navigator.clipboard.writeText(data.url).catch(() => {});
      alert("Share link copied to clipboard!");
    } else {
      alert("Share succeeded but no URL returned.");
    }
  } catch (err) {
    console.error("Share failed:", err);
    alert("Network error while sharing.");
  }
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
  // --- Feedback ---
  async function handleFeedback(e: React.MouseEvent) {
    e.preventDefault();

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.access_token) {
        alert("Please sign in to give feedback.");
        return;
      }

      if (!generatedPrompt) {
        alert("Generate a prompt before giving feedback.");
        return;
      }

      if (!feedbackText || rating < 1 || rating > 5) {
        alert("Please enter feedback text and select a rating (1–5).");
        return;
      }

      const res = await fetch("/api/prompts?action=feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          promptId,
          feedbackText,
          rating,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Feedback error:", data.error);
        alert(data?.error || "Failed to submit feedback.");
        return;
      }

      console.log("Feedback saved:", data);
      alert("Thank you for your feedback!");

      // Reset and close form
      setFeedbackText("");
      setRating(0);
      setFeedbackOpen(false);
    } catch (err) {
      console.error("Feedback failed:", err);
      alert("Network error while submitting feedback.");
    }
  }

  // --- Generate Prompt ---
  async function handleGeneratePrompt(e: React.FormEvent) {
    e.preventDefault();
    const payload = buildPayload();

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.access_token) {
        alert("Please sign in to generate prompts.");
        return;
      }

      const res = await fetch("/api/prompts?action=generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData?.error || "Something went wrong generating the prompt.");
        return;
      }

      const data = await res.json();
      setGeneratedPrompt(data.generatedPrompt || "");
    } catch (err) {
      alert("Network error. See console for details.");
      console.error(err);
    }
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">PromptAlpha</h1>
                  {/* Show login status */}
        {session ? (
          <p className="text-sm text-green-600">
            ✅ Signed in as {session.user?.email}
          </p>
        ) : (
          <p className="text-sm text-red-600">
            ❌ Not signed in — please <Link href="/sign-in" className="underline">sign in</Link>
          </p>
        )}
      </div>

      <form onSubmit={handleGeneratePrompt}>
        {/* Custom Need */}
        <div className="mb-6">
          <label htmlFor="customNeed" className="block text-sm font-medium text-gray-700">
            What do you need?
          </label>
          <textarea
            id="customNeed"
            rows={2}
            value={customNeed}
            onChange={(e) => setCustomNeed(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="E.g., Write a LinkedIn post about our new product launch"
          />
        </div>

        {/* Context group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="myRole" className="block text-sm font-medium text-gray-700">
              My Role
            </label>
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
            <label htmlFor="aiRole" className="block text-sm font-medium text-gray-700">
              AI Role
            </label>
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
            <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
              Audience
            </label>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700">
              Output Format
            </label>
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
            <label htmlFor="length" className="block text-sm font-medium text-gray-700">
              Length
            </label>
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
            <label htmlFor="style" className="block text-sm font-medium text-gray-700">
              Style
            </label>
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
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
              Tone
            </label>
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

          <div>
            <label htmlFor="depth" className="block text-sm font-medium text-gray-700">
              Depth
            </label>
            <select
              id="depth"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {depthOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Constraints */}
        <div className="mb-6">
          <label htmlFor="constraints" className="block text-sm font-medium text-gray-700">
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
            Generate Prompt
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
            disabled={!generatedPrompt}
            title={!generatedPrompt ? "Generate a prompt first" : ""}
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
            disabled={!generatedPrompt}
            title={!generatedPrompt ? "Generate a prompt first" : ""}
          >
            Share
          </button>

          {!feedbackOpen ? (
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
            disabled={!generatedPrompt}
            title={!generatedPrompt ? "Generate a prompt first" : ""}
          >
            Give feedback
          </button>
        ) : (
          <div className="border rounded-md p-3 space-y-2">
            <textarea
              placeholder="Your feedback..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full border rounded-md p-2"
            />
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`px-2 py-1 border rounded-md ${rating === star ? "bg-gray-200 font-bold" : ""}`}
                >
                  {star}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleFeedback}
                className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => {
                  setFeedbackOpen(false);
                  setFeedbackText("");
                  setRating(0);
                }}
                className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
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

          {/* Why this is a super prompt */}
          <div className="mt-6 p-4 border rounded bg-white">
            <h3 className="text-lg font-semibold mb-2">Why this is a super prompt</h3>
            <p className="text-sm text-gray-700">This prompt was enhanced by:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
              <li>Adding clear role/context instructions (e.g. “Act as a …”).</li>
              <li>Specifying output format, tone, and depth for consistency.</li>
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
    
