"use client";

import { useState } from "react";

export default function Page() {
  // State hooks
  const [customNeed, setCustomNeed] = useState("");
  const [myRole, setMyRole] = useState(""); // formerly persona
  const [aiRole, setAiRole] = useState(""); // formerly role
  const [audience, setAudience] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [length, setLength] = useState("");
  const [style, setStyle] = useState("");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Neutral");
  const [constraints, setConstraints] = useState("");

  // Example options (adjust to your product taxonomy)
  const myRoleOptions = ["Founder", "HR Manager", "Product Manager", "Sales Lead", "Student", "Researcher"];
  const aiRoleOptions = ["Copywriter", "Analyst", "Recruiter", "Tutor", "Strategist", "Assistant"];
  const audienceOptions = ["General Public", "Executives", "Employees", "Students", "Customers"];
  const outputFormatOptions = ["Email", "Blog Post", "Report", "Slide Deck", "Summary"];
  const lengthOptions = ["Short (100–200 words)", "Medium (300–500 words)", "Long (1000+ words)"];
  const styleOptions = ["Formal", "Casual", "Persuasive", "Storytelling", "Technical"];
  const toneOptions = ["Neutral", "Formal", "Friendly", "Persuasive", "Technical"];
  const languageOptions = ["English", "Spanish", "French", "German", "Hindi"];

  async function handleGeneratePrompt(e: React.FormEvent) {
    e.preventDefault();

    // Map UI names to backend keys (keep persona/role for API compatibility)
    const payload = {
      customNeed,
      persona: myRole,
      role: aiRole,
      audience,
      outputFormat,
      length,
      style,
      language,
      tone,
      constraints,
    };

    try {
      const res = await fetch("/api/testPrompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Prompt generation failed:", text);
        alert("Something went wrong generating the prompt.");
        return;
      }

      const data = await res.json();
      console.log("Generated prompt:", data);
      alert("Prompt generated! Check console for details.");
    } catch (err) {
      console.error("Network/Unexpected error:", err);
      alert("Network error. Please try again.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">PromptAlpha</h1>

      <form onSubmit={handleGeneratePrompt}>
        {/* 1) Custom Need (prominent) */}
        <div className="mb-6">
          <label htmlFor="customNeed" className="block text-sm font-medium text-gray-700">
            Custom Need
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Describe what you want the AI to do, in your own words.
          </p>
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

        {/* 2) My Role (formerly Persona) */}
        <div className="mb-4">
          <label htmlFor="myRole" className="block text-sm font-medium text-gray-700">
            My Role
          </label>
          <select
            id="myRole"
            value={myRole}
            onChange={(e) => setMyRole(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your role</option>
            {myRoleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 3) AI Role (formerly Role) */}
        <div className="mb-4">
          <label htmlFor="aiRole" className="block text-sm font-medium text-gray-700">
            AI Role
          </label>
          <select
            id="aiRole"
            value={aiRole}
            onChange={(e) => setAiRole(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select the AI’s role</option>
            {aiRoleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 4) Audience */}
        <div className="mb-4">
          <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
            Audience
          </label>
          <select
            id="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select audience</option>
            {audienceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 5) Output Format */}
        <div className="mb-4">
          <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700">
            Output Format
          </label>
          <select
            id="outputFormat"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select format</option>
            {outputFormatOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 6) Length */}
        <div className="mb-4">
          <label htmlFor="length" className="block text-sm font-medium text-gray-700">
            Length
          </label>
          <select
            id="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select length</option>
            {lengthOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 7) Style */}
        <div className="mb-4">
          <label htmlFor="style" className="block text-sm font-medium text-gray-700">
            Style
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select style</option>
            {styleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 8) Language */}
        <div className="mb-4">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 9) Tone */}
        <div className="mb-4">
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {toneOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 10) Constraints (optional) */}
        <div className="mb-6">
          <label htmlFor="constraints" className="block text-sm font-medium text-gray-700">
            Constraints (optional)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Add any limits, structure, or must‑include details (e.g., word count, sections, keywords).
          </p>
          <textarea
            id="constraints"
            rows={3}
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Example: 200–300 words, include a CTA, avoid jargon, use bullet points."
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate prompt
          </button>
          <span className="text-sm text-gray-500">
            Your choices + Custom Need will be used to craft the final prompt.
          </span>
        </div>
      </form>
    </main>
  );
}
