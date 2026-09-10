import type { CatalogTool } from "@/lib/tool-catalog";
export default function ProcessingDisclosure({ tool }: { tool: CatalogTool }) {
  return <details className="mb-5 rounded-lg border bg-muted/20 px-4 py-2">
    <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">{tool.processingMode === "local" ? "Processes in your browser" : tool.processingMode === "direct-network" ? "Connects directly to your server" : "Uses a hosted service"} · How your data is handled</summary>
    <p className="pb-3 text-sm leading-relaxed text-muted-foreground">{tool.processingNote}</p>
    {tool.processingMode === "hosted" && <p className="break-all pb-3 text-xs">Endpoint: {process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/request-catcher` : "Not configured in this deployment"}</p>}
  </details>;
}
