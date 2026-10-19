"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useAdsAllowed } from "./AdSenseScript";

type AdsByGoogleQueue = unknown[] & { pauseAdRequests?: number };
declare global { interface Window { adsbygoogle?: AdsByGoogleQueue; } }
interface AdSlotProps { slot?: string; variant?: "in-article" | "footer"; className?: string; }
const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4931770581801597";

/** Manual units only, outside tool controls and mounted only with visible editorial content. */
export default function AdSlot({ slot, variant = "in-article", className }: AdSlotProps) {
  const insRef = useRef<HTMLModElement | null>(null);
  const allowed = useAdsAllowed();
  const normalizedSlot = slot?.trim();
  const valid = Boolean(normalizedSlot && /^\d{6,20}$/.test(normalizedSlot));
  useEffect(() => {
    const el = insRef.current;
    if (!allowed || !valid || !el) return;
    const initialize = () => {
      if (el.dataset.utilbyteAdInitialized || el.getAttribute("data-adsbygoogle-status") || el.offsetWidth === 0) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        el.dataset.utilbyteAdInitialized = "true";
      } catch { /* Ad failures must not break the tool. */ }
    };
    initialize();
    const observer = new ResizeObserver(initialize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [allowed, valid, normalizedSlot]);
  if (!allowed || !valid) return null;
  return <aside aria-label="Advertisement" className={cn("my-10 flex w-full flex-col items-center overflow-hidden", variant === "footer" && "my-8", className)}>
    <span className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Advertisement</span>
    <ins key={normalizedSlot} ref={insRef} className="adsbygoogle block w-full" style={{ display: "block", minHeight: 250 }}
      data-ad-client={CLIENT_ID} data-ad-slot={normalizedSlot} data-ad-format="auto" data-full-width-responsive="true" />
  </aside>;
}
