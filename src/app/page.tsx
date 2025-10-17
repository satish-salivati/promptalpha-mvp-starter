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

{/* Custom Need (new free-text box) */}
<label className="block mb-2 font-medium">What do you need this prompt for?</label>
<textarea
  value={inputs.customNeed}
  onChange={(e) => setInputs({ ...inputs, customNeed: e.target.value })}
  placeholder="e.g., Need prompt to identify the best cars in 15-17 lakh range with all top features suiting Indian conditions"
  className="w-full border rounded p-2 mb-4"
  rows={3}
/>
