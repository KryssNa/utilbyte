"use client";
import Link from "next/link";
import { catalog, getTool } from "@/lib/tool-catalog";
import { prepareHandoff } from "@/lib/local-handoff";
export default function NextStepActions({ href, output }: { href: string; output: string }) {
  const tool = getTool(href);
  if (!tool || !output) return null;
  return <div className="my-5 rounded-lg border p-4"><h2 className="text-sm font-semibold">Continue with this result</h2><p className="mt-1 text-xs text-muted-foreground">Selecting a destination explicitly transfers this output in memory to another local tool. It is not added to the URL or saved.</p><div className="mt-3 flex flex-wrap gap-2">{tool.relatedToolIds.map(id => catalog.find(item => item.id === id)).filter((item): item is NonNullable<typeof item> => !!item && item.processingMode === "local" && item.supportedInputs.includes("json")).map(item => <Link key={item.id} href={item.href} onClick={() => prepareHandoff(item.href, output)} className="min-h-11 rounded-lg border px-3 py-3 text-sm hover:bg-muted">{item.title}</Link>)}</div></div>;
}
