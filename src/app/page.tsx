"use client";
import { personaPresets } from "../../lib/personaPresets";


import React, { useEffect, useMemo, useState } from "react";
import {
  ROLES,
  OBJECTIVES,
  TONES,
  FORMATS,
  AUDIENCES,
  LLMS,
  HINTS,
  STRUCTURES,
} from "../../lib/options";
import { assemblePrompt, Inputs, PromptSegment } from "../../lib/assemblePrompt";

// ---------- Types ----------
type Preset = {
  id: string;
  name: string;
  description?: string;
  inputs: Inputs;
  tags: string[];
  favorite?: boolean;
  createdAt: number;
};

type HistoryItem = {
  id: string;
  createdAt: number;
  prompt: string;
  inputs: Inputs;
};

// ---------- Storage keys ----------
const STORAGE = {
  inputs: "pa.inputs",
  presets: "pa.presets",
  analytics: "pa.analytics",
  dark: "pa.dark",
  history: "pa.history",
};

// ---------- Utils ----------
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function serializeStateToQuery(i: Inputs) {
  const params = new URLSearchParams();
  Object.entries(i).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      params.set(k, String(v));
    }
  });
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

function parseQueryToState(): Partial<Inputs> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const partial: Partial<Inputs> = {};
  [
    "role",
    "objective",
    "tone",
    "format",
    "audience",
    "llm",
    "customNeed",
    "maxWords",
    "seo",
    "citations",
    "structure",
    "structureStyle",
  ].forEach((key) => {
    const val = params.get(key);
    if (val !== null) {
      if (key === "seo" || key === "citations" || key === "structure") {
        // @ts-ignore
        partial[key] = val === "true";
      } else if (key === "maxWords") {
        // @ts-ignore
        partial[key] = Number(val) || 0;
      } else {
        // @ts-ignore
        partial[key] = val;
      }
    }
  });
  return partial;
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function logEvent(name: string, payload?: Record<string, unknown>) {
  const raw = localStorage.getItem(STORAGE.analytics);
  const data = raw
    ? JSON.parse(raw)
    : { counts: {} as Record<string, number>, last: {} as Record<string, unknown> };
  data.counts[name] = (data.counts[name] || 0) + 1;
  if (payload) data.last[name] = payload;
  localStorage.setItem(STORAGE.analytics, JSON.stringify(data));
  console.log("[analytics]", name, payload || {});
}

// ---------- Component ----------
export default function Home() {
  const defaultInputs: Inputs = {
    role: "Product Manager",
    objective: "Summarize an article",
    tone: "Professional",
    format: "Bullet list",
    audience: "Executives",
    llm: "GPT-4",
    customNeed: "",
    seo: false,
    citations: false,
    structure: true,
    maxWords: 0,
    structureStyle: "Bullet",
  };

  const [dark, setDark] = useState(false);
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [showSegments, setShowSegments] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState("");
function applyPersona(persona: string) {
  setSelectedPersona(persona);
  const preset = personaPresets[persona];
  if (preset) {
    setInputs({ ...inputs, ...preset });
    showToast(`Persona applied: ${persona}`);
  }
}

  // Load persisted
  useEffect(() => {
    const darkStored = localStorage.getItem(STORAGE.dark);
    if (darkStored) setDark(darkStored === "true");

    const rawInputs = localStorage.getItem(STORAGE.inputs);
    const rawPresets = localStorage.getItem(STORAGE.presets);
    const rawHistory = localStorage.getItem(STORAGE.history);
    const fromQuery = parseQueryToState();

    if (rawInputs) {
      const persisted = JSON.parse(rawInputs);
      setInputs({ ...defaultInputs, ...persisted, ...fromQuery });
    } else {
      setInputs({ ...defaultInputs, ...fromQuery });
    }
    if (rawPresets) setPresets(JSON.parse(rawPresets));
    if (rawHistory) setHistory(JSON.parse(rawHistory));
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(STORAGE.inputs, JSON.stringify(inputs));
  }, [inputs]);
  useEffect(() => {
    localStorage.setItem(STORAGE.dark, String(dark));
  }, [dark]);

  // Assembled prompt + segments
  const segments = useMemo(() => assemblePrompt(inputs, true), [inputs]);
  const prompt = useMemo(() => assemblePrompt(inputs, false), [inputs]);
  const wordCount = useMemo(
    () => prompt.trim().split(/\s+/).filter(Boolean).length,
    [prompt]
  );

  // Toast helper
  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 1500);
  }

  // Reset flow
  function resetAll() {
    setInputs(defaultInputs);
    showToast("Reset complete");
  }

  // Presets
  function savePreset() {
    const name = `Preset ${new Date().toLocaleString()}`;
    const p: Preset = {
      id: uid(),
      name,
      description: "Saved from current configuration",
      inputs,
      tags: [inputs.role, inputs.objective, inputs.tone, inputs.format, inputs.audience],
      favorite: false,
      createdAt: Date.now(),
    };
    const next = [p, ...presets];
    setPresets(next);
    localStorage.setItem(STORAGE.presets, JSON.stringify(next));
    showToast("⭐ Preset saved");
    logEvent("prompt_saved", { name, tags: p.tags });
  }
  function applyPreset(p: Preset) {
    setInputs(p.inputs);
    showToast(`Applied preset: ${p.name}`);
    logEvent("preset_applied", { name: p.name });
  }
  function toggleFavorite(id: string) {
    const next = presets.map((p) =>
      p.id === id ? { ...p, favorite: !p.favorite } : p
    );
    setPresets(next);
    localStorage.setItem(STORAGE.presets, JSON.stringify(next));
  }
  function deletePreset(id: string) {
    const next = presets.filter((p) => p.id !== id);
    setPresets(next);
    localStorage.setItem(STORAGE.presets, JSON.stringify(next));
  }

  // History
  function addHistoryItem() {
    const item: HistoryItem = {
      id: uid(),
      createdAt: Date.now(),
      prompt,
      inputs,
    };
    const next = [item, ...history].slice(0, 5);
    setHistory(next);
    localStorage.setItem(STORAGE.history, JSON.stringify(next));
    logEvent("prompt_created", { length: prompt.length });
  }

  // Copy / share / download
  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    showToast("✅ Prompt copied!");
    logEvent("prompt_copied", { length: prompt.length });
  }
  function shareLink() {
    const url = serializeStateToQuery(inputs);
    navigator.clipboard.writeText(url).then(() => showToast("🔗 Share link copied"));
  }
  function download(format: "txt" | "md") {
    const filename = `prompt.${format}`;
    const content = format === "md" ? `# Prompt\n\n${prompt}\n` : prompt;
    downloadText(filename, content);
    showToast(`⬇️ Downloaded ${filename}`);
  }

  const themeClass = dark
    ? "bg-gray-900 text-gray-100"
    : "bg-white text-gray-900";
  const cardClass = dark
    ? "bg-gray-800 border border-gray-700"
    : "bg-gray-50 border border-gray-200";

  // Filtering presets
  const filteredPresets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return presets;
    return presets.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [search, presets]);

  // ---------- UI ----------
  return (
    <main className={`min-h-screen ${themeClass}`}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">PromptAlpha</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="border px-3 py-1 rounded"
            >
              {dark ? "Light mode" : "Dark mode"}
            </button>
            <button onClick={resetAll} className="border px-3 py-1 rounded">
              Reset
            </button>
          </div>
        </div>

        {/* Layout: Left = Steps, Right = Preview/Presets/History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Prompt setup */}
          <div className="space-y-4">
              <div className={`p-4 rounded shadow ${cardClass}`}>
  <h2 className="font-semibold mb-1">Persona quick start</h2>
  <p className="text-xs text-gray-500 mb-2">
    Pick a persona to auto-fill Role, Tone, Format, Audience, etc. You can edit anything afterward.
  </p>

  <select
    value={selectedPersona}
    onChange={(e) => applyPersona(e.target.value)}
    className="border rounded p-2 w-full"
    aria-label="Select a persona"
  >
    <option value="">Select a persona</option>
    {Object.keys(personaPresets).map((p) => (
      <option key={p} value={p}>
        {p}
      </option>
    ))}
  </select>

  {selectedPersona && (
    <button
      onClick={() => applyPersona(selectedPersona)}
      className="mt-2 border px-3 py-1 rounded text-sm"
    >
      Reset to {selectedPersona} defaults
    </button>
  )}
</div>
            <div className={`p-4 rounded shadow ${cardClass}`}>
              <h2 className="font-semibold mb-1">1. Role</h2>
              <p className="text-xs text-gray-500 mb-2">{HINTS.role}</p>
              <select
                value={inputs.role}
                onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
                className="border rounded p-2 w-full mb-2"
                aria-label="Choose a role"
              >
                <option value="">Select a role</option>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.value}
                  </option>
                ))}
              </select>
              <input
                value={inputs.role}
                onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
                placeholder="Or type a role"
                className="border rounded p-2 w-full"
                aria-label="Type a custom role"
              />
            </div>

            <div className={`p-4 rounded shadow ${cardClass}`}>
              <h2 className="font-semibold mb-1">2. Objective</h2>
              <p className="text-xs text-gray-500 mb-2">{HINTS.objective}</p>
              <select
                value={inputs.objective}
                onChange={(e) =>
                  setInputs({ ...inputs, objective: e.target.value })
                }
                className="border rounded p-2 w-full mb-2"
                aria-label="Choose an objective"
              >
                <option value="">Select an objective</option>
                {OBJECTIVES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.value}
                  </option>
                ))}
              </select>
              <input
                value={inputs.objective}
                onChange={(e) =>
                  setInputs({ ...inputs, objective: e.target.value })
                }
                placeholder="Or type an objective"
                className="border rounded p-2 w-full"
                aria-label="Type a custom objective"
              />
            </div>

            <div className={`p-4 rounded shadow ${cardClass}`}>
              <h2 className="font-semibold mb-1">3. Tone</h2>
              <p className="text-xs text-gray-500 mb-2">{HINTS.tone}</p>
              <select
                value={inputs.tone}
                onChange={(e) => setInputs({ ...inputs, tone: e.target.value })}
                className="border rounded p-2 w-full mb-2"
                aria-label="Choose a tone"
              >
                <option value="">Select a tone</option>
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.value}
                  </option>
                ))}
              </select>
              <input
                value={inputs.tone}
                onChange={(e) => setInputs({ ...inputs, tone: e.target.value })}
                placeholder="Or type a tone"
                className="border rounded p-2 w-full"
                aria-label="Type a custom tone"
              />
            </div>

            <div className={`p-4 rounded shadow ${cardClass}`}>
              <h2 className="font-semibold mb-1">4. Format</h2>
              <p className="text-xs text-gray-500 mb-2">{HINTS.format}</p>
              <select
                value={inputs.format}
                onChange={(e) =>
                  setInputs({ ...inputs, format: e.target.value })
                }
                className="border rounded p-2 w-full mb-2"
                aria-label="Choose a format"
              >
                <option value="">Select a format</option>
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.value}
                  </option>
                ))}
              </select>
              <input
                value={inputs.format}
                onChange={(e) =>
                  setInputs({ ...inputs, format: e.target.value })
                }
                placeholder="Or type a format"
                className="border rounded p-2 w-full"
                aria-label="Type a custom format"
              />
            </div>

            <div className={`p-4 rounded shadow ${cardClass}`}>
              <h2 className="font-semibold mb-1">5. Audience</h2>
              <p className="text-xs text-gray-500 mb-2">{HINTS.audience}</p>
              <select
                value={inputs.audience}
                onChange={(e) =>
                  setInputs({ ...inputs, audience: e.target.value })
                }
                className="border rounded p-2 w-full mb-2"
                aria-label="Choose an audience"
              >
                <option value="">Select an audience</option>
                {AUDIENCES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.value}
                  </option>
                ))}
              </select>
              <input
                value={inputs.audience}
                onChange={(e) =>
                  setInputs({ ...inputs, audience: e.target.value })
                }
                placeholder="Or type an audience"
                className="border rounded p-2 w-full"
                aria-label="Type a custom audience"
              />
            </div>

            <div className={`p-4 rounded shadow ${cardClass}`}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">6. Advanced options</h2>
                <button
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className="text-sm underline"
                  aria-expanded={advancedOpen}
                >
                  {advancedOpen ? "Hide" : "Show"}
                </button>
              </div>
              {advancedOpen && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inputs.seo}
                      onChange={(e) =>
                        setInputs({ ...inputs, seo: e.target.checked })
                      }
                      aria-label="Enable SEO guidance"
                    />
                    SEO guidance
                    <span className="text-xs text-gray-500">
                      (Optimize for search engines)
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inputs.citations}
                      onChange={(e) =>
                        setInputs({ ...inputs, citations: e.target.checked })
                      }
                      aria-label="Include citations"
                    />
                    Citations
                    <span className="text-xs text-gray-500">
                      (Add references when relevant)
                    </span>
                  </label>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Word count</span>
                      <span>{inputs.maxWords || 0}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2000}
                      step={50}
                      value={inputs.maxWords || 0}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          maxWords: Number(e.target.value),
                        })
                      }
                      className="w-full"
                      aria-label="Word count slider"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Output structure:</span>
                    <select
                      value={inputs.structureStyle}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          structure: true,
                          structureStyle: e.target.value,
                        })
                      }
                      className="border rounded p-1"
                      aria-label="Choose output structure"
                    >
                      {STRUCTURES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm mb-1 block">Custom need</label>
                    <textarea
                      value={inputs.customNeed || ""}
                      onChange={(e) =>
                        setInputs({ ...inputs, customNeed: e.target.value })
                      }
                      placeholder="Describe any special constraints or goals..."
                      className="border rounded p-2 w-full"
                      rows={3}
                      aria-label="Custom need"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={`p-4 rounded shadow ${cardClass}`}>
              <h2 className="font-semibold mb-1">7. LLM choice</h2>
              <p className="text-xs text-gray-500 mb-2">
                Choose a model (used for testing and guidance; output remains model-agnostic).
              </p>
              <select
                value={inputs.llm}
                onChange={(e) => setInputs({ ...inputs, llm: e.target.value })}
                className="border rounded p-2 w-full"
                aria-label="Choose LLM"
              >
                {LLMS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right column: Preview, Presets, History */}
          <div className="space-y-4">
            {/* Preview */}
            <div className={`p-4 rounded shadow ${cardClass}`}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Preview</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-70">Words: {wordCount}</span>
                  <button
                    onClick={() => setShowSegments(!showSegments)}
                    className="border px-2 py-1 rounded text-sm"
                    aria-pressed={showSegments}
                  >
                    {showSegments ? "Show final" : "Show chips"}
                  </button>
                </div>
              </div>
              {!showSegments ? (
                <pre className="whitespace-pre-wrap text-sm bg-gradient-to-br from-gray-100/40 to-transparent dark:from-gray-700/30 p-3 rounded">
                  {prompt}
                </pre>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {segments.map((seg, idx) => (
                    <span
                      key={`${seg.label}-${idx}`}
                      className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                    >
                      <strong>{seg.label}:</strong> {seg.text}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <button onClick={copyPrompt} className="border px-3 py-1 rounded">
                  Copy
                </button>
                <button onClick={shareLink} className="border px-3 py-1 rounded">
                  Share
                </button>
                <button onClick={savePreset} className="border px-3 py-1 rounded">
                  Save preset
                </button>
                <button
                  onClick={() => download("txt")}
                  className="border px-3 py-1 rounded"
                >
                  Download .txt
                </button>
                <button
                  onClick={() => download("md")}
                  className="border px-3 py-1 rounded"
                >
                  Download .md
                </button>
                <button
                  onClick={addHistoryItem}
                  className="border px-3 py-1 rounded"
                >
                  Add to history
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className={`p-4 rounded shadow ${cardClass}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Presets</h2>
                <span className="text-xs opacity-70">
                  {presets.length} saved
                </span>
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search presets"
                className="border rounded p-2 w-full mb-2"
                aria-label="Search presets"
              />
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredPresets.map((p) => (
                  <div
                    key={p.id}
                    className="border rounded p-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs opacity-70">
                        {p.tags.join(", ")}
                      </div>
                      {p.description && (
                        <div className="text-xs opacity-70">{p.description}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => applyPreset(p)}
                        className="text-sm underline"
                      >
                        Use
                      </button>
                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className="text-sm underline"
                        aria-pressed={p.favorite}
                      >
                        {p.favorite ? "★" : "☆"}
                      </button>
                      <button
                        onClick={() => deletePreset(p.id)}
                        className="text-sm underline text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {filteredPresets.length === 0 && (
                  <p className="text-sm opacity-70">
                    No presets yet. Try saving one from the preview above.
                  </p>
                )}
              </div>
              {presets.length === 0 && (
                <div className="mt-3 text-xs bg-yellow-50 border border-yellow-200 p-2 rounded">
                  Try a preset to get started — it’s the fastest way to overcome prompt anxiety.
                </div>
              )}
            </div>

            {/* History */}
            <div className={`p-4 rounded shadow ${cardClass}`}>
              <h2 className="font-semibold mb-2">History (last 5)</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map((h) => (
                  <div key={h.id} className="border rounded p-2">
                    <div className="text-xs opacity-70">
                      {new Date(h.createdAt).toLocaleString()}
                    </div>
                    <pre className="whitespace-pre-wrap text-xs">
                      {h.prompt.slice(0, 200)}...
                    </pre>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-sm opacity-70">No history yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating export bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t p-3 flex justify-center gap-4">
          <button onClick={copyPrompt} className="border px-3 py-1 rounded">
            Copy
          </button>
          <button onClick={shareLink} className="border px-3 py-1 rounded">
            Share
          </button>
          <button onClick={savePreset} className="border px-3 py-1 rounded">
            Save Preset
          </button>
          <button
            onClick={() => download("txt")}
            className="border px-3 py-1 rounded"
          >
            Download .txt
          </button>
          <button
            onClick={() => download("md")}
            className="border px-3 py-1 rounded"
          >
            Download .md
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}
