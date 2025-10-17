"use client";

import { useState } from "react";
import {
  ROLES,
  TASKS,
  TONES,
  FORMATS,
  AUDIENCES,
  LLMS,
} from "../../lib/options";
import { assemblePrompt, Inputs } from "../../lib/assemblePrompt";

export default function Home() {
  const [inputs, setInputs] = useState<Inputs>({
    role: "",
    task: "",
    tone: "",
    format: "",
    audience: "",
    llm: "",
    customNeed: "", // new free-text field
  });

  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    const assembled = assemblePrompt(inputs);
    setPrompt(assembled);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">PromptAlpha</h1>

      {/* Role */}
      <label className="block mb-2 font-medium">Role</label>
      <select
        value={inputs.role}
        onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select a role</option>
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.value}
          </option>
        ))}
      </select>

      {/* Task */}
      <label className="block mb-2 font-medium">Task</label>
      <select
        value={inputs.task}
        onChange={(e) => setInputs({ ...inputs, task: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select a task</option>
        {TASKS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.value}
          </option>
        ))}
      </select>

      {/* Tone */}
      <label className="block mb-2 font-medium">Tone</label>
      <select
        value={inputs.tone}
        onChange={(e) => setInputs({ ...inputs, tone: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select a tone</option>
        {TONES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.value}
          </option>
        ))}
      </select>

      {/* Format */}
      <label className="block mb-2 font-medium">Format</label>
      <select
        value={inputs.format}
        onChange={(e) => setInputs({ ...inputs, format: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select a format</option>
        {FORMATS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.value}
          </option>
        ))}
      </select>

      {/* Audience */}
      <label className="block mb-2 font-medium">Audience</label>
      <select
        value={inputs.audience}
        onChange={(e) => setInputs({ ...inputs, audience: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select an audience</option>
        {AUDIENCES.map((a) => (
          <option key={a.value} value={a.value}>
            {a.value}
          </option>
        ))}
      </select>

      {/* LLM */}
      <label className="block mb-2 font-medium">LLM</label>
      <select
        value={inputs.llm}
        onChange={(e) => setInputs({ ...inputs, llm: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select an LLM</option>
        {LLMS.map((l) => (
          <option key={l.value} value={l.value}>
            {l.value}
          </option>
        ))}
      </select>

      {/* Custom Need (free-text box) */}
      <label className="block mb-2 font-medium">
        What do you need this prompt for?
      </label>
      <textarea
        value={inputs.customNeed}
        onChange={(e) => setInputs({ ...inputs, customNeed: e.target.value })}
        placeholder="e.g., Need prompt to identify the best cars in 15-17 lakh range with all top features suiting Indian conditions"
        className="w-full border rounded p-2 mb-4"
        rows={3}
      />

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Prompt
      </button>

      {/* Output */}
      {prompt && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Generated Prompt</h2>
          <pre className="whitespace-pre-wrap border rounded p-4 bg-gray-50">
            {prompt}
          </pre>
        </div>
      )}
    </main>
  );
}
