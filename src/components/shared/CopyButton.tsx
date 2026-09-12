"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const request = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    setStatus("idle");
    return () => { request.current++; clearTimeout(timer.current); };
  }, [value]);

  async function copy() {
    const current = ++request.current;
    clearTimeout(timer.current);
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(value);
      if (current !== request.current) return;
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 2000);
    } catch {
      if (current !== request.current) return;
      setStatus("error");
      toast.error("Couldn’t copy. Select the text and copy it manually.");
    }
  }

  return <span className="inline-flex shrink-0 items-center">
    <button type="button" aria-label={`Copy ${label}`} title={`Copy ${label}`} disabled={status === "copying"} onClick={copy}
      className="inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait disabled:opacity-60">
      {status === "copied" ? <Check aria-hidden="true" className="h-4 w-4 text-emerald-500" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
      <span className="hidden sm:inline">{status === "copied" ? "Copied" : status === "copying" ? "Copying…" : "Copy"}</span>
    </button>
    <span role="status" className="sr-only">{status === "copied" ? `${label} copied to clipboard.` : status === "error" ? "Couldn’t copy. Select the text and copy it manually." : ""}</span>
  </span>;
}
