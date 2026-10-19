"use client";
import { useEffect, useState } from "react";

type ConsentData = { gdprApplies?: boolean; listenerId?: number };
declare global {
  interface Window {
    googlefc?: { showRevocationMessage?: () => void; callbackQueue?: { push: (entry: Record<string, () => void>) => unknown } };
    __tcfapi?: (command: string, version: number, callback: (data: ConsentData, success: boolean) => void, parameter?: number) => void;
  }
}
/** Use the supported CMP callback queue; a delayed banner must not miss a polling deadline. */
export default function ConsentSettingsLink({ className }: { className?: string }) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let listenerId: number | undefined;
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || ([] as Record<string, () => void>[]);
    window.googlefc.callbackQueue.push({ CONSENT_API_READY: () => {
      if (cancelled) return;
      window.__tcfapi?.("addEventListener", 2, (data, success) => {
        listenerId = data?.listenerId;
        if (!cancelled) setAvailable(success && data?.gdprApplies === true && typeof window.googlefc?.showRevocationMessage === "function");
      });
    } });
    return () => { cancelled = true; if (listenerId !== undefined) window.__tcfapi?.("removeEventListener", 2, () => {}, listenerId); };
  }, []);
  if (!available) return null;
  return <button type="button" className={className} onClick={() => window.googlefc?.callbackQueue?.push({ CONSENT_API_READY: () => window.googlefc?.showRevocationMessage?.() })}>Privacy settings</button>;
}
