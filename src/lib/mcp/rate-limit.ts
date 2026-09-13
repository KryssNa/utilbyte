import { createHash } from "node:crypto";

/** Per-instance abuse control, not a distributed quota or authentication layer. */
export function createMcpRateLimiter() {
  const entries = new Map<string, { count: number; expires: number }>();
  let total = { count: 0, expires: 0 };
  return (identity: string, now = Date.now()): boolean => {
    for (const [key, entry] of entries) if (entry.expires <= now) entries.delete(key);
    if (total.expires <= now) total = { count: 0, expires: now + 60_000 };
    if (total.count >= 240) return false;
    // Avoid retaining raw IP addresses in the short-lived in-memory map.
    const key = createHash("sha256").update(identity).digest("hex");
    const current = entries.get(key) ?? { count: 0, expires: now + 60_000 };
    if (current.count >= 60 || (!entries.has(key) && entries.size >= 1000)) return false;
    entries.set(key, { ...current, count: current.count + 1 });
    total.count++;
    return true;
  };
}
