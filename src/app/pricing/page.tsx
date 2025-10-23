export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-6">Pricing</h1>
      <p className="text-lg text-gray-700 mb-12">
        Simple, transparent pricing. Choose the plan that fits your workflow.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="border rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Free</h2>
          <p className="mb-4">Get started with core features at no cost.</p>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li>Basic prompt generation</li>
            <li>Role & tone presets</li>
            <li>Community support</li>
          </ul>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Start Free
          </button>
        </div>

        <div className="border rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Pro</h2>
          <p className="mb-4">Unlock advanced features for power users.</p>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li>Unlimited prompts</li>
            <li>Advanced formatting</li>
            <li>Priority support</li>
          </ul>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Coming Soon!
          </button>
        </div>
      </div>
    </main>
  )
}
