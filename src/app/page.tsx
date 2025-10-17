"use client";

"use client";

import React from "react";
import { ROLES, TASKS, TONES, FORMATS, AUDIENCES, LLMS } from "../../lib/options";
import { assemblePrompt, Inputs } from "../../lib/assemblePrompt";


export default function Home() {
const [inputs, setInputs] = useState({
  role: "",
  task: "",
  tone: "",
  format: "",
  audience: "",
  llm: "",
  customNeed: "",   // 👈 add this line
});

  const [prompt, setPrompt] = React.useState("");

  function update<K extends keyof Inputs>(key: K, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function generate() {
    setPrompt(assemblePrompt(inputs));
  }

  function copyPrompt() {
    navigator.clipboard.writeText(prompt);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-indigo-600">PromptAlpha 🚀</h1>
      <p className="mt-2 text-gray-700">Your AI-powered prompt generator</p>

      {/* Picklists */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        <Select
          label="Role"
          value={inputs.role}
          onChange={(v) => update("role", v)}
          options={ROLES}
        />
        <Select
          label="Task"
          value={inputs.task}
          onChange={(v) => update("task", v)}
          options={TASKS}
        />
        <Select
          label="Tone"
          value={inputs.tone}
          onChange={(v) => update("tone", v)}
          options={TONES}
        />
        <Select
          label="Format"
          value={inputs.format}
          onChange={(v) => update("format", v)}
          options={FORMATS}
        />
        <Select
          label="Audience"
          value={inputs.audience}
          onChange={(v) => update("audience", v)}
          options={AUDIENCES}
        />
        <Select
          label="LLM"
          value={inputs.llm}
          onChange={(v) => update("llm", v)}
          options={LLMS}
        />
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Generate Prompt
      </button>

      {/* Output */}
      {prompt && (
        <div className="mt-6 p-4 bg-white shadow rounded w-full max-w-3xl">
          <h2 className="font-semibold mb-2">Generated Prompt</h2>
          <pre className="whitespace-pre-wrap">{prompt}</pre>
          <div className="mt-3 flex gap-2">
            <button
              className="px-4 py-1 bg-gray-100 rounded"
              onClick={copyPrompt}
            >
              Copy to clipboard
            </button>
            <button
              className="px-4 py-1 bg-gray-100 rounded"
              onClick={() => setPrompt("")}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* Reusable select component */
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; help: string }[];
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        className="border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.value}
          </option>
        ))}
      </select>
      {value && (
        <span className="text-xs text-gray-500 mt-1">
          {options.find((o) => o.value === value)?.help || ""}
        </span>
      )}
    </div>
  );
}
