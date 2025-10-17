"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ROLES,
  TASKS,
  TONES,
  FORMATS,
  AUDIENCES,
  LLMS,
} from "../../lib/options";
import { assemblePrompt, Inputs } from "../../lib/assemblePrompt";

// ---------- Types ----------
type Preset = {
  id: string;
  name: string;
  inputs: Inputs;
  tags: string[];
  favorite?: boolean;
  createdAt: number;
};

// ---------- Utils ----------
const STORAGE_KEYS = {
  inputs: "pa.inputs",
  presets: "pa.presets",
  analytics: "pa.analytics",
  dark: "pa.dark",
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function serializeStateToQuery(i: Inputs) {
  const params = new URLSearchParams();
  Object.entries(i).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

function parseQueryToState(): Partial<Inputs> {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const partial: Partial<Inputs> = {};
  ["role", "task", "tone", "format", "audience", "llm", "customNeed", "maxWords", "seo", "citations", "structure"].forEach((key) => {
    const val = params.get(key);
    if (val !== null) {
      // booleans and numbers handling
      if (key === "seo" || key === "citations" || key === "structure") {
        // interpret "true"/"false"
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
  // Lightweight analytics: store counts + last payload in localStorage
  const raw = localStorage.getItem(STORAGE_KEYS.analytics);
  const data = raw ? JSON.parse(raw) : { counts: {} as Record<string, number>, last: {} as Record<string, unknown> };
  data.counts[name] = (data.counts[name] || 0) + 1;
  if (payload) data.last[name] = payload;
  localStorage.setItem(STORAGE_KEYS.analytics, JSON.stringify(data));
  // Also console for quick visibility
  console.log("[analytics]", name, payload || {});
}

// ---------- Component ----------
export default function Home() {
  // Smart defaults
  const defaultInputs: Inputs = {
    role: "Product Manager",
    task: "Summarize a document",
    tone: "Professional",
    format: "Bullet points",
    audience: "Executives",
    llm: "GPT-4",
    customNeed: "",
    // Advanced toggles
    seo: false,
    citations: false,
    structure: true,
    maxWords: 0,
  };

  const [dark, setDark] = useState<boolean>(false);
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [presetName, setPresetName] = useState("");
  const [presetTags, setPresetTags] = useState<string>("");
  const [presets, setPresets] = useState<Preset[]>([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [blocksOrder, setBlocksOrder] = useState<string[]>([
    "role",
    "task",
    "tone",
    "format",
    "audience",
    "llm",
    "customNeed",
  ]);

  // Load persisted state
  useEffect(() => {
    const darkStored = localStorage.getItem(STORAGE_KEYS.dark);
    if (darkStored) setDark(darkStored === "true");

    const rawInputs = localStorage.getItem(STORAGE_KEYS.inputs);
    const rawPresets = localStorage.getItem(STORAGE_KEYS.presets);

    // Merge query params on first load
    const fromQuery = parseQueryToState();

    if (rawInputs) {
      const persisted = JSON.parse(rawInputs);
      setInputs({ ...defaultInputs, ...persisted, ...fromQuery });
    } else {
      setInputs({ ...defaultInputs, ...fromQuery });
    }

    if (rawPresets) {
      setPresets(JSON.parse(rawPresets));
    }
  }, []);

  // Persist inputs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.inputs, JSON.stringify(inputs));
  }, [inputs]);

  // Toggle dark mode persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.dark, String(dark));
  }, [dark]);

  // Real-time assembled prompt
  const prompt = useMemo(() => {
    const p = assemblePrompt(inputs);
    return inputs.maxWords && inputs.maxWords > 0 ? `${p}\n\nConstraint: Limit to approximately ${inputs.maxWords} words.` : p;
  }, [inputs]);

  // Live word count feedback
  const wordCount = useMemo(() => {
    return prompt.trim().split(/\s+/).filter(Boolean).length;
  }, [prompt]);

  // Toast helper
  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 1500);
  }

  // Reorderable blocks via up/down buttons for simplicity
  function moveBlock(id: string, dir: "up" | "down") {
    const idx = blocksOrder.indexOf(id);
    if (idx < 0) return;
    const newOrder = [...blocksOrder];
    if (dir === "up" && idx > 0) {
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    } else if (dir === "down" && idx < newOrder.length - 1) {
      [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
    }
    setBlocksOrder(newOrder);
  }

  // Quick reset
  function resetAll() {
    setInputs(defaultInputs);
    setBlocksOrder(["role", "task", "tone", "format", "audience", "llm", "customNeed"]);
    showToast("Reset complete");
  }

  // Save preset
  function savePreset() {
    const name = presetName.trim() || `Preset ${new Date().toLocaleString()}`;
    const tags = presetTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const p: Preset = {
      id: uid(),
      name,
      inputs,
      tags,
      favorite: false,
      createdAt: Date.now(),
    };
    const next = [p, ...presets];
    setPresets(next);
    localStorage.setItem(STORAGE_KEYS.presets, JSON.stringify(next));
    setPresetName("");
    setPresetTags("");
    showToast("Preset saved");
    logEvent("prompt_saved", { name, tags });
  }

  // Load preset
  function loadPreset(p: Preset) {
    setInputs(p.inputs);
    showToast("Preset loaded");
  }

  // Toggle favorite
  function toggleFavorite(id: string) {
    const next = presets.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p));
    setPresets(next);
    localStorage.setItem(STORAGE_KEYS.presets, JSON.stringify(next));
  }

  // Delete preset
  function deletePreset(id: string) {
    const next = presets.filter((p) => p.id !== id);
    setPresets(next);
    localStorage.setItem(STORAGE_KEYS.presets, JSON.stringify(next));
  }

  // Copy prompt
  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    showToast("✅ Copied to clipboard");
    logEvent("prompt_copied", { length: prompt.length });
  }

  // Share link (query string with current inputs)
  function getShareLink() {
    const url = serializeStateToQuery(inputs);
    navigator.clipboard.writeText(url).then(() => {
      showToast("🔗 Share link copied");
    });
  }

  // Download
  function download(format: "txt" | "md") {
    const filename = `prompt.${format}`;
    const content = format === "md" ? `# Prompt\n\n${prompt}\n` : prompt;
    downloadText(filename, content);
    showToast(`⬇️ Downloaded ${filename}`);
  }

  // Builder blocks render map
  const blockRenderers: Record<string, JSX.Element> = {
    role: (
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <label className="block mb-2 font-medium">Role</label>
          <div className="flex gap-2">
            <button title="Move up" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("role", "up")}>↑</button>
            <button title="Move down" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("role", "down")}>↓</button>
          </div>
        </div>
        <select
          value={inputs.role}
          onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
          className="w-full border rounded p-2"
        >
          <option value="">Select a role</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value} title={r.help}>
              {r.value}
            </option>
          ))}
        </select>
      </div>
    ),
    task: (
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <label className="block mb-2 font-medium">Task</label>
          <div className="flex gap-2">
            <button title="Move up" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("task", "up")}>↑</button>
            <button title="Move down" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("task", "down")}>↓</button>
          </div>
        </div>
        <select
          value={inputs.task}
          onChange={(e) => setInputs({ ...inputs, task: e.target.value })}
          className="w-full border rounded p-2"
        >
          <option value="">Select a task</option>
          {TASKS.map((t) => (
            <option key={t.value} value={t.value} title={t.help}>
              {t.value}
            </option>
          ))}
        </select>
      </div>
    ),
    tone: (
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <label className="block mb-2 font-medium">Tone</label>
          <div className="flex gap-2">
            <button title="Move up" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("tone", "up")}>↑</button>
            <button title="Move down" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("tone", "down")}>↓</button>
          </div>
        </div>
        <select
          value={inputs.tone}
          onChange={(e) => setInputs({ ...inputs, tone: e.target.value })}
          className="w-full border rounded p-2"
        >
          <option value="">Select a tone</option>
          {TONES.map((t) => (
            <option key={t.value} value={t.value} title={t.help}>
              {t.value}
            </option>
          ))}
        </select>
      </div>
    ),
    format: (
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <label className="block mb-2 font-medium">Format</label>
          <div className="flex gap-2">
            <button title="Move up" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("format", "up")}>↑</button>
            <button title="Move down" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("format", "down")}>↓</button>
          </div>
        </div>
        <select
          value={inputs.format}
          onChange={(e) => setInputs({ ...inputs, format: e.target.value })}
          className="w-full border rounded p-2"
        >
          <option value="">Select a format</option>
          {FORMATS.map((f) => (
            <option key={f.value} value={f.value} title={f.help}>
              {f.value}
            </option>
          ))}
        </select>
      </div>
    ),
    audience: (
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <label className="block mb-2 font-medium">Audience</label>
          <div className="flex gap-2">
            <button title="Move up" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("audience", "up")}>↑</button>
            <button title="Move down" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("audience", "down")}>↓</button>
          </div>
        </div>
        <select
          value={inputs.audience}
          onChange={(e) => setInputs({ ...inputs, audience: e.target.value })}
          className="w-full border rounded p-2"
        >
          <option value="">Select an audience</option>
          {AUDIENCES.map((a) => (
            <option key={a.value} value={a.value} title={a.help}>
              {a.value}
            </option>
          ))}
        </select>
      </div>
    ),
    llm: (
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <label className="block mb-2 font-medium">LLM</label>
          <div className="flex gap-2">
            <button title="Move up" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("llm", "up")}>↑</button>
            <button title="Move down" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("llm", "down")}>↓</button>
          </div>
        </div>
        <select
          value={inputs.llm}
          onChange={(e) => setInputs({ ...inputs, llm: e.target.value })}
          className="w-full border rounded p-2"
        >
          <option value="">Select an LLM</option>
          {LLMS.map((l) => (
            <option key={l.value} value={l.value} title={l.help}>
              {l.value}
            </option>
          ))}
        </select>
      </div>
    ),
    customNeed: (
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <label className="block mb-2 font-medium">What do you need this prompt for?</label>
          <div className="flex gap-2">
            <button title="Move up" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("customNeed", "up")}>↑</button>
            <button title="Move down" className="text-xs border px-2 py-1 rounded" onClick={() => moveBlock("customNeed", "down")}>↓</button>
          </div>
        </div>
        <textarea
          value={inputs.customNeed}
          onChange={(e) => setInputs({ ...inputs, customNeed: e.target.value })}
          placeholder="e.g., Need prompt to identify the best cars in 15-17 lakh range with all top features suiting Indian conditions"
          className="w-full border rounded p-2"
          rows={3}
        />
      </div>
    ),
  };

  // Filtered presets
  const filteredPresets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return presets;
    return presets.filter((p) => {
      const hay = `${p.name} ${p.tags.join(" ")} ${JSON.stringify(p.inputs)}`.toLowerCase();
      return hay.includes(q);
    });
  }, [presets, search]);

  // Dark mode classes
  const themeClass = dark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900";
  const panelClass = dark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200";

  return (
    <main className={`min-h-screen ${themeClass}`}>
      <div className="max-w-4xl mx-auto p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">PromptAlpha</h1>
          <div className="flex items-center gap-2">
            <button
              className="border px-3 py-1 rounded text-sm"
              onClick={() => setDark((d) => !d)}
              title="Toggle dark mode"
            >
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
            <button className="border px-3 py-1 rounded text-sm" onClick={resetAll} title="Reset all fields">Reset</button>
          </div>
        </div>

        {/* Builder & Preview */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Builder */}
          <div>
            {/* Progressive Disclosure: essentials first */}
            <div className={`border rounded p-4 mb-4 ${panelClass}`}>
              <h2 className="font-semibold mb-3">Essential</h2>
              {/* Essentials: role + task + customNeed */}
              {blocksOrder
                .filter((id) => ["role", "task", "customNeed"].includes(id))
                .map((id) => (
                  <div key={id}>{blockRenderers[id]}</div>
                ))}
            </div>

            {/* Advanced options */}
            <div className={`border rounded p-4 ${panelClass}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Advanced options</h2>
                <button
                  className="text-sm underline"
                  onClick={() => setAdvancedOpen((o) => !o)}
                  title="Show/hide advanced controls"
                >
                  {advancedOpen ? "Hide" : "Show"}
                </button>
              </div>

              {advancedOpen && (
                <>
                  {/* Remaining blocks */}
                  {blocksOrder
                    .filter((id) => !["role", "task", "customNeed"].includes(id))
                    .map((id) => (
                      <div key={id}>{blockRenderers[id]}</div>
                    ))}

                  {/* Grouped toggles */}
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Constraints</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label title="Optimize for discoverability using best-practice prompting">
                        <input
                          type="checkbox"
                          checked={inputs.seo}
                          onChange={(e) => setInputs({ ...inputs, seo: e.target.checked })}
                          className="mr-2"
                        />
                        SEO guidance
                      </label>
                      <label title="Encourage citing sources where applicable">
                        <input
                          type="checkbox"
                          checked={inputs.citations}
                          onChange={(e) => setInputs({ ...inputs, citations: e.target.checked })}
                          className="mr-2"
                        />
                        Encourage citations
                      </label>
                      <label title="Use a more structured, sectioned output">
                        <input
                          type="checkbox"
                          checked={inputs.structure}
                          onChange={(e) => setInputs({ ...inputs, structure: e.target.checked })}
                          className="mr-2"
                        />
                        Structured output
                      </label>
                      <div title="Approximate max words for the output">
                        <span className="mr-2">Max words</span>
                        <input
                          type="number"
                          min={0}
                          value={inputs.maxWords || 0}
                          onChange={(e) => setInputs({ ...inputs, maxWords: Number(e.target.value) })}
                          className="border rounded p-1 w-24"
                        />
                      </div>
                    </div>
                    {/* Live word count (feedback) */}
                    {inputs.maxWords && inputs.maxWords > 0 && (
                      <p className="text-sm mt-2">Word count (prompt content): {wordCount}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <div className={`border rounded p-4 ${panelClass}`}>
              <h2 className="font-semibold mb-3">Live prompt preview</h2>
              <pre className="whitespace-pre-wrap text-sm">{prompt}</pre>
            </div>

            {/* Presets & Library */}
            <div className={`border rounded p-4 mt-4 ${panelClass}`}>
              <h2 className="font-semibold mb-3">Presets & Library</h2>

              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Preset name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={presetTags}
                  onChange={(e) => setPresetTags(e.target.value)}
                  className="border rounded p-2"
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <button className="bg-yellow-500 text-white px-3 py-2 rounded text-sm" onClick={savePreset} title="Save current configuration">
                  ⭐ Save as preset
                </button>
                <input
                  type="text"
                  placeholder="Search library"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded p-2 flex-1"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-auto">
                {filteredPresets.length === 0 && <p className="text-sm">No presets yet. Save a few to build your library.</p>}
                {filteredPresets.map((p) => (
                  <div key={p.id} className={`border rounded p-2 flex items-center justify-between ${panelClass}`}>
                    <div>
                      <div className="font-medium">{p.name} {p.favorite ? "★" : ""}</div>
                      <div className="text-xs opacity-70">{p.tags.join(", ")}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="border px-2 py-1 rounded text-xs" onClick={() => loadPreset(p)} title="Load">Load</button>
                      <button className="border px-2 py-1 rounded text-xs" onClick={() => toggleFavorite(p.id)} title="Favorite/Unfavorite">Fav</button>
                      <button className="border px-2 py-1 rounded text-xs" onClick={() => deletePreset(p.id)} title="Delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating CTA Bar */}
        <div className={`fixed bottom-4 left-0 right-0`}>
          <div className="max-w-4xl mx-auto px-6">
            <div className={`flex items-center gap-3 border rounded px-4 py-3 shadow ${panelClass}`}>
              <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm" onClick={copyPrompt} title="Copy prompt">
                Copy
              </button>
              <button className="bg-green-600 text-white px-3 py-2 rounded text-sm" onClick={getShareLink} title="Copy shareable link">
                Share
              </button>
              <button className="border px-3 py-2 rounded text-sm" onClick={() => download("txt")} title="Download .txt">
                .txt
              </button>
              <button className="border px-3 py-2 rounded text-sm" onClick={() => download("md")} title="Download .md">
                .md
              </button>
              <span className="text-xs opacity-70 ml-auto">Events: created, copied, saved (local)</span>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}
