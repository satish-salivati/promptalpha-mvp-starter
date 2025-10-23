export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold">Generate world‑class prompts in seconds</h1>
        <p className="mt-4 text-xl text-gray-600">
          PromptAlpha helps marketers, developers, and creators craft structured, high‑quality prompts that get better AI results.
        </p>
        <a
          href="/app"
          className="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Start Generating
        </a>
      </section>

      {/* Personas */}
      <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto py-16">
        <div><h2 className="font-semibold">📈 For Marketers</h2><p>Turn campaign ideas into persuasive, audience‑ready prompts.</p></div>
        <div><h2 className="font-semibold">💻 For Developers</h2><p>Get precise, step‑by‑step technical prompts for code and APIs.</p></div>
        <div><h2 className="font-semibold">🎨 For Creators</h2><p>Shape prompts for storytelling, lessons, or creative projects.</p></div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why PromptAlpha?</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div><h3 className="font-semibold">✨ Structured Prompts</h3><p>Role + Task + Tone + Format baked in.</p></div>
          <div><h3 className="font-semibold">🚀 Refinement Loop</h3><p>One click to polish your prompt to V2 or V3.</p></div>
          <div><h3 className="font-semibold">🧠 Context‑Aware</h3><p>Marketing, technical, or storytelling tasks adapt automatically.</p></div>
          <div><h3 className="font-semibold">⚡ Fast & Reliable</h3><p>Optimized backend for quick responses.</p></div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">Ready to supercharge your AI results?</h2>
        <a href="/app" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
          Try PromptAlpha Now
        </a>
      </section>
    </main>
  )
}
