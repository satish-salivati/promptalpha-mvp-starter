export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-6">
      <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">
        PromptAlpha
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
        AI‑powered prompt generator that helps you create structured, high‑quality prompts in seconds.
      </p>
      <a
        href="/app"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
      >
        Start Generating
      </a>

      <section className="mt-16 grid gap-8 md:grid-cols-3 text-center max-w-5xl">
        <div>
          <h2 className="text-lg font-semibold">✨ Structured Prompts</h2>
          <p className="text-gray-600">Role + Task + Tone + Format, all built in.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">🚀 Refinement Loop</h2>
          <p className="text-gray-600">Click once to polish your prompt to V2 or V3.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">⚡ Fast & Reliable</h2>
          <p className="text-gray-600">Optimized backend for quick responses.</p>
        </div>
      </section>
    </main>
  )
}
