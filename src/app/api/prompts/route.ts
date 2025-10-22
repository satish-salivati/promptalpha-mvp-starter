import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // 1) Extract and verify token
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = user.id;

    // 2) Parse action and body
    const url = new URL(req.url);
    const queryAction = url.searchParams.get("action") || "";
    const rawBody = await req.json().catch(() => ({} as any));
    const bodyAction = rawBody?.action ?? rawBody?.body?.action ?? "";
    const action = (queryAction || bodyAction || "").toLowerCase();

    // Normalize body object (support both { body: {...} } and {...})
    const body =
      rawBody?.body && typeof rawBody.body === "object" ? rawBody.body : rawBody;

    // 3) Handle actions
    if (action === "generate") {
      // Extract fields from your form payload
      const {
        customNeed = "",
        myRole = "",
        aiRole = "",
        audience = "",
        outputFormat = "",
        length = "",
        style = "",
        tone = "",
        constraints = "",
      } = body;

      // Basic validation
      if (!customNeed || typeof customNeed !== "string") {
        return NextResponse.json(
          { error: "customNeed is required" },
          { status: 400 }
        );
      }

      // For MVP: synthesize prompt on server (replace with LLM call later)
      const generatedPrompt =
        [
          `You are ${aiRole || "an expert assistant"} helping a ${myRole || "user"}.`,
          `Audience: ${audience || "general"}.`,
          `Output format: ${outputFormat || "text"}.`,
          `Length: ${length || "short"}.`,
          `Style: ${style || "clear"}. Tone: ${tone || "confident"}.`,
          constraints ? `Constraints: ${constraints}.` : "",
          `Task: ${customNeed}`,
        ]
          .filter(Boolean)
          .join(" ");

      return NextResponse.json({ generatedPrompt });
    }

    if (action === "share") {
      const promptText =
        body.promptText ??
        body.generatedPrompt ??
        body.prompt ??
        body.text ??
        body.content ??
        (typeof body === "string" ? body : "");

      if (!promptText || typeof promptText !== "string") {
        return NextResponse.json(
          { error: "Missing prompt text", received: rawBody },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin
        .from("shared_prompts")
        .insert({ user_id: userId, prompt_text: promptText })
        .select("id")
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, id: data.id });
    }

    if (action === "feedback") {
      const feedbackText =
        body.feedbackText ?? body.feedback ?? body.comments ?? body.text ?? "";
      const ratingRaw = body.rating ?? body.stars ?? 0;
      const rating = Number.isFinite(Number(ratingRaw)) ? Number(ratingRaw) : 0;
      const promptId = body.promptId ?? body.sharedPromptId ?? body.prompt_id ?? null;

      if (!feedbackText || typeof feedbackText !== "string") {
        return NextResponse.json(
          { error: "feedbackText/comments is required", received: rawBody },
          { status: 400 }
        );
      }
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: "rating must be an integer between 1 and 5" },
          { status: 400 }
        );
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

    // 4) Unknown action
    return NextResponse.json(
      { error: "Unknown action", receivedAction: action || "(none)" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
