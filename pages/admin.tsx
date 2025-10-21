import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/adminStats");
      const data = await res.json();
      setStats(data);
    }
    fetchStats();
  }, []);

  if (status === "loading") return <p>Loading...</p>;

  // Restrict access to your Gmail only
  if (!session || session.user?.email !== "ssatish6798@gmail.com") {
    return <p>Access denied</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">PromptAlpha Admin Panel</h1>
      {stats ? (
        <div>
          <p>Saved Prompts: {stats.savedPrompts}</p>
          <p>Feedback Count: {stats.feedbackCount}</p>
          <p>Total Analytics Events: {stats.analyticsCount}</p>
          <h2 className="mt-4 font-semibold">Recent Feedback</h2>
          <ul>
            {stats.recentFeedback.map((f: any) => (
              <li key={f.id}>
                {f.rating}★ — {f.feedback_text}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
    </main>
  );
}

// 👇 This disables static generation and forces runtime rendering
export async function getServerSideProps() {
  return { props: {} };
}
