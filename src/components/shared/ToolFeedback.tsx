"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Loader2, MessageSquare, X } from "lucide-react";
import type { CatalogTool } from "@/lib/tool-catalog";

export default function ToolFeedback({ tool }: { tool: CatalogTool }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  function close() { setOpen(false); trigger.current?.focus(); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !message.trim()) return;
    const feedbackForm = event.currentTarget;
    const form = new FormData(feedbackForm);
    setPending(true); setError(""); setSent(false);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: tool.id, message: message.trim(), website: form.get("website") }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(response.status === 429 ? "Please wait a few minutes before sending another comment." : "Couldn’t send right now. Your comment is still here—please try again.");
      const focusInside = feedbackForm.contains(document.activeElement);
      setMessage(""); setSent(true); setOpen(false);
      if (focusInside) trigger.current?.focus();
    } catch (cause) {
      setError(cause instanceof Error && cause.name === "Error" ? cause.message : "Couldn’t send right now. Your comment is still here—please try again.");
    } finally { setPending(false); }
  }

  return <>
    <button ref={trigger} type="button" aria-label="Feedback" title="Share feedback" aria-expanded={open} aria-controls={id} onClick={() => { setOpen(!open); setSent(false); }} className="ml-auto inline-flex h-11 w-11 items-center justify-center gap-2 rounded-lg text-xs font-medium sm:w-auto sm:px-3 text-muted-foreground hover:bg-muted hover:text-foreground"><MessageSquare aria-hidden="true" className="h-4 w-4 sm:h-3.5 sm:w-3.5" /><span className="hidden sm:inline">Feedback</span></button>
    {error && !open && <p role="alert" className="w-full pb-2 text-right text-xs text-destructive">Your comment wasn’t sent. Open feedback to retry.</p>}
    {sent && <p role="status" className="w-full pb-2 text-right text-xs text-emerald-600 dark:text-emerald-400">Thanks—your feedback was sent.</p>}
    {open && <form id={id} onSubmit={submit} className="mb-3 w-full rounded-xl border border-border/70 bg-card p-4">
      <div className="mb-2 flex items-start justify-between gap-3"><div><label htmlFor={`${id}-comment`} className="text-sm font-semibold">Help improve {tool.title}</label><p id={`${id}-note`} className="mt-1 text-xs text-muted-foreground">What could work better? Your comment and which tool you’re using are sent to our team.</p></div><button type="button" onClick={close} aria-label="Close feedback" className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><X aria-hidden="true" className="h-4 w-4" /></button></div>
      <textarea id={`${id}-comment`} aria-describedby={`${id}-note`} autoFocus required maxLength={2000} disabled={pending} value={message} onChange={event => { setMessage(event.target.value); setError(""); }} placeholder="Tell us what you expected, or suggest an improvement…" rows={3} className="w-full resize-y rounded-lg border border-border/80 bg-background px-3 py-2.5 text-base leading-relaxed placeholder:text-muted-foreground/70 disabled:opacity-60 sm:text-sm" />
      <div aria-hidden="true" className="hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-muted-foreground">No email needed. You can keep using the tool.</p><button type="submit" disabled={pending || !message.trim()} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">{pending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}{pending ? "Sending…" : "Send feedback"}</button></div>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    </form>}
  </>;
}
