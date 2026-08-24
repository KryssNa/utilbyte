"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    googlefc?: {
      showRevocationMessage?: () => void;
      callbackQueue?: unknown[];
    };
  }
}

/**
 * Reopens the consent form so a visitor can change or withdraw the choice they
 * made in the CMP.
 *
 * Required in the EEA, the UK and Switzerland: consent has to be as easy to
 * withdraw as it was to give. The link is rendered only once Google's CMP has
 * actually loaded, so visitors outside those regions — who never saw a banner —
 * do not get a control that would do nothing.
 */
export default function ConsentSettingsLink({ className }: { className?: string }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = () => {
      if (cancelled) return;
      if (typeof window.googlefc?.showRevocationMessage === "function") {
        setAvailable(true);
        return true;
      }
      return false;
    };

    if (check()) return;

    // The CMP script loads asynchronously; poll briefly rather than guess.
    const interval = window.setInterval(() => {
      if (check()) window.clearInterval(interval);
    }, 500);
    const stop = window.setTimeout(() => window.clearInterval(interval), 10000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.clearTimeout(stop);
    };
  }, []);

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={() => window.googlefc?.showRevocationMessage?.()}
      className={className}
    >
      Privacy settings
    </button>
  );
}
