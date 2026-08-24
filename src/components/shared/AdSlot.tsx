"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotVariant = "in-article" | "footer";

interface AdSlotProps {
  /** AdSense ad unit id (data-ad-slot). Omit and nothing renders. */
  slot?: string;
  variant?: AdSlotVariant;
  className?: string;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * A single display ad unit.
 *
 * Placement rules this component exists to enforce — see
 * https://support.google.com/adsense/answer/1346295:
 *
 *  - Never render inside the tool surface. Ads next to Convert / Download /
 *    Copy controls produce accidental clicks, and accidental clicks are
 *    invalid traffic.
 *  - Never render on a screen with no publisher content of its own. Result
 *    and processing screens are ad-free by design.
 *  - The only permitted labels are "Advertisement" and "Sponsored Links".
 *
 * Renders nothing unless both NEXT_PUBLIC_ADSENSE_CLIENT and a slot id are
 * set, so the component is inert until the account is approved and the units
 * are created.
 */
export default function AdSlot({ slot, variant = "in-article", className }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // An ad failing to fill is never worth breaking the tool over.
    }
  }, [slot]);

  if (!CLIENT_ID || !slot) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        "my-10 flex flex-col items-center",
        variant === "footer" && "my-8",
        className
      )}
    >
      <span className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        Advertisement
      </span>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: 250 }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
