import type { CatalogTool } from "@/lib/tool-catalog";
export default function ProcessingDisclosure({ tool }: { tool: CatalogTool }) {
  return <details className="mt-2 rounded-lg text-muted-foreground">
    <summary className="min-h-11 cursor-pointer py-3 text-xs marker:text-primary hover:text-foreground">{tool.processingMode === "local" ? "Processes in your browser" : tool.processingMode === "direct-network" ? "Connects directly to your server" : "Uses a hosted service"} · How your data is handled</summary>
    <p className="max-w-3xl pb-3 text-sm leading-relaxed text-muted-foreground">{tool.processingNote}</p>
    {tool.processingMode === "hosted" && <p className="break-all pb-3 text-xs">Endpoint: {process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/request-catcher` : "Not configured in this deployment"}</p>}
  </details>;
}
