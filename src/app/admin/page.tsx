"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

type PromptRow = {
  id: string;
  user_id: string;
  prompt_text: string;
  created_at: string;
};

type SharedPromptRow = {
  id: string;
  user_id: string;
  prompt_text: string;
  created_at: string;
};

type FeedbackRow = {
  id: string;
  user_id: string;
  prompt_id: string | null;
  feedback_text: string;
  rating: number;
  created_at: string;
};

// Replace with your admin email for MVP gating
const ADMIN_EMAIL = "you@example.com"; // TODO: set your email

export default function AdminPage() {
  const session = useSession();
  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [sharedPrompts, setSharedPrompts] = useState<SharedPromptRow[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Simple admin gate: allow only your email
  const isAdmin = !!session?.user?.email && session.user.email === ADMIN_EMAIL;

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        // Prompts
        const { data: promptsData, error: promptsErr } = await supabase
          .from("prompts")
          .select("*")
          .order("created_at", { ascending: false });
        if (promptsErr) throw new Error(`Prompts error: ${promptsErr.message}`);

        // Shared prompts
        const { data: sharedData, error: sharedErr } = await supabase
          .from("shared_prompts")
          .select("*")
          .order("created_at", { ascending: false });
        if (sharedErr) throw new Error(`Shared error: ${sharedErr.message}`);

        // Feedback
        const { data: feedbackData, error: feedbackErr } = await supabase
          .from("feedback")
          .select("*")
          .order("created_at", { ascending: "desc" });
        if (feedbackErr) throw new Error(`Feedback error: ${feedbackErr.message}`);

        if (!isCancelled) {
          setPrompts((promptsData as PromptRow[]) || []);
          setSharedPrompts((sharedData as SharedPromptRow[]) || []);
          setFeedback((feedbackData as FeedbackRow[]) || []);
        }
      } catch (e: any) {
        if (!isCancelled) setError(e?.message || "Failed to load admin data.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    // Load only if signed in and admin
    if (isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [isAdmin, supabase]);

  // KPIs
  const totalPrompts = prompts.length;
  const totalShared = sharedPrompts.length;
  const feedbackCount = feedback.length;
  const avgRating = useMemo(() => {
    if (!feedback.length) return 0;
    const sum = feedback.reduce((acc, f) => acc + (Number(f.rating) || 0), 0);
    return Number((sum / feedback.length).toFixed(2));
  }, [feedback]);

  // Prompts over time (daily counts)
  const promptsOverTime = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of prompts) {
      const day = new Date(p.created_at).toISOString().slice(0, 10);
      counts[day] = (counts[day] || 0) + 1;
    }
    const arr = Object.entries(counts)
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([date, count]) => ({ date, count }));
    return arr;
  }, [prompts]);

  // Ratings distribution
  const ratingsDist = useMemo(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const f of feedback) {
      const r = Number(f.rating);
      if (r >= 1 && r <= 5) dist[r] = (dist[r] || 0) + 1;
    }
    return [1, 2, 3, 4, 5].map((r) => ({ rating: `${r}★`, count: dist[r] || 0 }));
  }, [feedback]);

  // Top prompts by average rating
  const topPrompts = useMemo(() => {
    const byPrompt: Record<string, { total: number; count: number; text?: string }> = {};

    for (const f of feedback) {
      const pid = f.prompt_id || "unlinked";
      if (!byPrompt[pid]) byPrompt[pid] = { total: 0, count: 0 };
      byPrompt[pid].total += Number(f.rating) || 0;
      byPrompt[pid].count += 1;
    }

    // Attach prompt text if available
    const textById: Record<string, string> = {};
    for (const p of prompts) textById[p.id] = p.prompt_text;

    const items = Object.entries(byPrompt)
      .map(([pid, stats]) => ({
        prompt_id: pid,
        avg: stats.count ? stats.total / stats.count : 0,
        count: stats.count,
        text: textById[pid] || (pid === "unlinked" ? "(feedback not linked to a prompt)" : "(prompt text unavailable)"),
      }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.avg - a.avg || b.count - a.count)
      .slice(0, 5);

    return items;
  }, [feedback, prompts]);

  if (!session) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
        <p className="text-gray-700">Please sign in to view admin insights.</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        <p className="text-gray-700">
          Your account is not authorized to view this page. If you believe this is an error, update ADMIN_EMAIL in app/admin/page.tsx.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">PromptAlpha Admin</h1>
        <div className="text-sm">
          <span className="text-gray-600">Signed in as {session.user?.email}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-md border p-4 bg-white">
          <div className="text-xs text-gray-500">Total prompts</div>
          <div className="text-2xl font-semibold">{totalPrompts}</div>
        </div>
        <div className="rounded-md border p-4 bg-white">
          <div className="text-xs text-gray-500">Saved vs Shared</div>
          <div className="text-2xl font-semibold">
            {totalPrompts} saved / {totalShared} shared
          </div>
        </div>
        <div className="rounded-md border p-4 bg-white">
          <div className="text-xs text-gray-500">Feedback count</div>
          <div className="text-2xl font-semibold">{feedbackCount}</div>
        </div>
        <div className="rounded-md border p-4 bg-white">
          <div className="text-xs text-gray-500">Average rating</div>
          <div className="text-2xl font-semibold">{avgRating ? `${avgRating} / 5` : "—"}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-md border p-4 bg-white">
          <h2 className="text-lg font-semibold mb-3">Prompts over time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={promptsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#2563eb" name="Prompts" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-md border p-4 bg-white">
          <h2 className="text-lg font-semibold mb-3">Ratings distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingsDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top prompts by rating */}
      <div className="rounded-md border p-4 bg-white mb-8">
        <h2 className="text-lg font-semibold mb-3">Top prompts by rating</h2>
        {topPrompts.length === 0 ? (
          <p className="text-sm text-gray-600">Not enough feedback yet.</p>
        ) : (
          <ul className="space-y-3">
            {topPrompts.map((item) => (
              <li key={item.prompt_id} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {item.prompt_id === "unlinked" ? "Unlinked feedback" : `Prompt ${item.prompt_id}`}
                  </div>
                  <div className="text-sm text-gray-700">
                    {item.avg.toFixed(2)}★ ({item.count})
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent feedback */}
      <div className="rounded-md border p-4 bg-white">
        <h2 className="text-lg font-semibold mb-3">Recent feedback</h2>
        {loading ? (
          <p className="text-sm text-gray-600">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : feedback.length === 0 ? (
          <p className="text-sm text-gray-600">No feedback yet.</p>
        ) : (
          <ul className="space-y-3">
            {feedback.slice(0, 10).map((f) => (
              <li key={f.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-800">
                    {f.rating}★ — {f.feedback_text}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(f.created_at).toLocaleString()}
                  </div>
                </div>
                {f.prompt_id && (
                  <div className="mt-1 text-xs text-gray-600">
                    Prompt ID: {f.prompt_id}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-500">
        <p>
          Tip: Replace ADMIN_EMAIL with your email to restrict access. For multi‑admin support, store roles in Supabase and enforce via RLS.
        </p>
      </div>
    </main>
  );
}
