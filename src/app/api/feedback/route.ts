import { NextRequest, NextResponse } from "next/server";
import { catalog } from "@/lib/tool-catalog";

// Best-effort spam control per server instance; no database or extra service needed.
const recent = new Map<string, { count: number; expires: number }>();
const WINDOW_MS = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    if (Number(request.headers.get("content-length")) > 10000) return NextResponse.json({ error: "Comment is too long" }, { status: 413 });
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
    const { toolId, message, website } = body as Record<string, unknown>;
    if (typeof website === "string" && website) return NextResponse.json({ success: true });
    const tool = catalog.find(item => item.id === toolId);
    if (!tool || typeof message !== "string" || !message.trim() || message.trim().length > 2000) return NextResponse.json({ error: "Choose a valid tool and enter a comment under 2,000 characters" }, { status: 400 });

    const webhook = process.env.SLACK_WEBHOOK_URL;
    if (!webhook) return NextResponse.json({ error: "Feedback is temporarily unavailable" }, { status: 503 });
    const now = Date.now();
    for (const [key, value] of recent) if (value.expires <= now) recent.delete(key);
    const sender = (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "local").split(",")[0].trim().slice(0, 128);
    const rate = recent.get(sender) || { count: 0, expires: now + WINDOW_MS };
    if (rate.count >= 5 || recent.size >= 10000) return NextResponse.json({ error: "Please try again later" }, { status: 429, headers: { "Retry-After": "300" } });
    recent.set(sender, { count: rate.count + 1, expires: rate.expires });

    const response = await fetch(webhook, {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        text: `New tool feedback: ${tool.title}`,
        blocks: [
          { type: "header", text: { type: "plain_text", text: "💬 Tool feedback", emoji: true } },
          { type: "section", text: { type: "plain_text", text: `${tool.title}\nhttps://utilbyte.app${tool.href}`, emoji: false } },
          // Plain text prevents user comments from creating Slack mentions or links.
          { type: "section", text: { type: "plain_text", text: message.trim(), emoji: false } },
        ],
      }),
    });
    if (!response.ok) return NextResponse.json({ error: "Could not send feedback" }, { status: 502 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Could not send feedback" }, { status: error instanceof SyntaxError ? 400 : 502 });
  }
}
