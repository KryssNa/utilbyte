// One explicitly requested transfer, held in memory for this tab only.
let pending: { destination: string; text: string; expires: number } | undefined;
export function prepareHandoff(destination: string, text: string) {
  if (text.length > 1_000_000 || !["/dev-tools/json-csv", "/dev-tools/json-schema", "/dev-tools/json-to-typescript", "/dev-tools/json-formatter"].includes(destination)) throw new Error("Unsupported handoff.");
  pending = { destination, text, expires: Date.now() + 60_000 };
}
export function takeHandoff(destination: string): string | undefined {
  if (!pending || pending.destination !== destination) return;
  const value = pending;
  pending = undefined;
  return value.expires >= Date.now() ? value.text : undefined;
}
export function clearHandoff() { pending = undefined; }
