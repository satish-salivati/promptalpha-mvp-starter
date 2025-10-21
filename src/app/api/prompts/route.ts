import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper: get user_id from profiles table by email
async function getUserId(email: string | null | undefined): Promise<string | null> {
  if (!email) return null;
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();
  if (error || !data?.id) return null;
  return data.id;
}

// TEMP: For testing, we’ll pull email from a header.
// Later you can replace this with NextAuth session logic.
function getEmailFromHeaders(req: Request): string | null {
  return req.headers.get("x-demo-email");
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const actionParam =
    url.searchParams.get("action") ||
    (await req.clone().json().catch(() => ({} as any))).action ||
    (await req.clone().json().catch(() => ({} as any))).body?.action ||
    "";

  const email = getEmailFromHeaders(req);
  if (!email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const userId = await getUserId(email);
  if (!userId) return NextResponse.json({ error: "User not found in Supabase profiles" }, { status: 404 });

  try {
    const body = await req.json().catch(() => ({} as any));
    const flat = body?.body && typeof body.body === "object" ? body.body : body;

    // --- SHARE ---
    if (actionParam === "share") {
      const promptText =
        flat.promptText ??
        flat.generatedPrompt ??
        flat.prompt ??
        flat.text ??
        flat.content ??
        (typeof flat === "string" ? flat : "");

      if (!promptText || typeof promptText !== "string") {
        return NextResponse.json({ error: "Missing prompt text", received: body }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin
        .from("shared_prompts")
        .insert({ user_id: userId, prompt_text: promptText })
        .select("id")
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, id: data.id });
    }

    // --- FEEDBACK ---
    if (actionParam === "feedback") {
      const feedbackText =
        flat.feedbackText ??
        flat.feedback ??
        flat.comments ??
        flat.text ??
        "";

      const ratingRaw = flat.rating ?? flat.stars ?? 0;
      const rating = Number.isFinite(Number(ratingRaw)) ? Number(ratingRaw) : 0;

      const promptId =
        flat.promptId ?? flat.sharedPromptId ?? flat.prompt_id ?? null;

      if (!feedbackText || typeof feedbackText !== "string") {
        return NextResponse.json({ error: "feedbackText/comments is required", received: body }, { status: 400 });
      }
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "rating must be an integer between 1 and 5" }, { status: 400 });
      }

      const insertObj: Record<string, any> = {
        user_id: userId,
        feedback_text: feedbackText,
        rating,
      };
      if (promptId) insertObj.prompt_id = promptId;

      const { error } = await supabaseAdmin.from("feedback").insert([insertObj]);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ ok: true });
    }

    // --- UNKNOWN ACTION ---
    return NextResponse.json({ error: "Unknown action", receivedAction: actionParam }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
