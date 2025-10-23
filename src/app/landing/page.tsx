export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-b from-white to-gray-100">
        <h1 className="text-5xl font-bold mb-4">
          Turn vague ideas into precise AI prompts — in seconds
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          PromptAlpha helps professionals across industries save time, cut costs,
          and get consistently better results from AI.
        </p>
        <a
          href="/app"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Start Generating
        </a>
      </section>

      {/* Problem */}
      <section className="bg-white py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-6">The $10B Productivity Problem</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          70% of users struggle with effective prompting. Knowledge workers waste
          2 hours daily navigating AI tools inefficiently — costing organizations
          $15K–$18K per employee every year.
        </p>
      </section>

      {/* Solution */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">The PromptAlpha Solution</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          <div>
            <h3 className="font-semibold">🎭 Role‑Based Intelligence</h3>
            <p>Define the expertise perspective — marketer, developer, educator, analyst — for tailored outputs.</p>
          </div>
          <div>
            <h3 className="font-semibold">🎯 Objective Clarity</h3>
            <p>Set explicit goals so AI delivers exactly what you need.</p>
          </div>
          <div>
            <h3 className="font-semibold">🎨 Tonal Precision</h3>
            <p>Choose tone — persuasive, professional, empathetic — for the right impact.</p>
          </div>
          <div>
            <h3 className="font-semibold">📑 Format Control</h3>
            <p>Paragraph, bullet list, table, step‑by‑step — you decide the structure.</p>
          </div>
          <div>
            <h3 className="font-semibold">👥 Audience Targeting</h3>
            <p>Adapt complexity and style for executives, students, or the general public.</p>
          </div>
          <div>
            <h3 className="font-semibold">⚙️ Advanced Options</h3>
            <p>Power users can fine‑tune with presets, history, and model choice.</p>
          </div>
        </div>
      </section>

      {/* Quantified Benefits */}
      <section className="py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-12">Proven Impact</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-4xl font-bold text-indigo-600">75%</h3>
            <p>Time saved on prompt creation</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-600">50%</h3>
            <p>Fewer iterations needed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-600">90%</h3>
            <p>User satisfaction rate</p>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Built for Every Professional</h2>
        <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto text-center">
          <div>
            <h3>✍️ Creators</h3>
            <p>Blogs, captions, storytelling</p>
          </div>
          <div>
            <h3>📈 Marketers</h3>
            <p>Ad copy, campaigns, briefs</p>
          </div>
          <div>
            <h3>💻 Developers</h3>
            <p>Docs, APIs, system prompts</p>
          </div>
          <div>
            <h3>🎓 Educators</h3>
            <p>Lesson plans, quizzes</p>
          </div>
          <div>
            <h3>🧑‍💼 Teams</h3>
            <p>Reports, summaries, onboarding</p>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-12">What Sets PromptAlpha Apart</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div>
            <h3 className="font-semibold">📐 Structured Methodology</h3>
            <p>No more guesswork — a guided framework for effective prompts.</p>
          </div>
          <div>
            <h3 className="font-semibold">🔄 Model‑Agnostic</h3>
            <p>Works across GPT‑4, Claude, Gemini, and more.</p>
          </div>
          <div>
            <h3 className="font-semibold">⚡ Professional Simplicity</h3>
            <p>Powerful for experts, simple for beginners.</p>
          </div>
          <div>
            <h3 className="font-semibold">📚 Knowledge Amplification</h3>
            <p>Presets and history turn one‑time efforts into repeatable workflows.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-indigo-600 text-white text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-6">Ready to transform your AI workflow?</h2>
        <a
          href="/app"
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100"
        >
          Try PromptAlpha Now
        </a>
      </section>
    </main>
  )
}
