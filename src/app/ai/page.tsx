import CopyBlock from "@/components/shared/CopyBlock";
import type { Metadata } from "next";
import Link from "next/link";
import { catalog } from "@/lib/tool-catalog";

const title = "Connect AI assistants with MCP";
const description = "Connect a compatible AI assistant to UtilByte through MCP. Discover tools, format JSON and SQL, and convert JSON and CSV with clear processing limits.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/ai" },
  openGraph: { title, description, url: "https://utilbyte.app/ai", type: "website" },
};

const operations = [
  ["discover_tools", "Find a tool by task, name, category or alias."],
  ["get_tool", "Read a tool’s capabilities, browser link and data-handling details."],
  ["format_json", "Format JSON text on the server."],
  ["format_sql", "Format SQL text on the server without executing the query."],
  ["convert_json_csv", "Convert supported JSON records and CSV text on the server."],
];

export default function AiPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebPage", name: title, description,
        url: "https://utilbyte.app/ai", isPartOf: { "@type": "WebSite", name: "UtilByte", url: "https://utilbyte.app" },
      }) }} />
      <p className="mb-3 text-sm font-semibold text-primary">AI & MCP</p>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Your toolkit, inside your assistant.</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Find the right tool from {catalog.length} utilities, or ask a compatible assistant to format and convert text through UtilByte’s Model Context Protocol (MCP) server.</p>
      <div className="mt-8 rounded-2xl border bg-muted/20 p-5 sm:p-7">
        <h2 className="text-xl font-semibold">Connect in a few steps</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-muted-foreground">
          <li>Open your assistant’s MCP or custom connector settings. It must support remote Streamable HTTP servers.</li>
          <li>Add the endpoint below. This public endpoint does not require an API key.</li>
          <li>Review the available tools and approve the operations you want your assistant to use.</li>
        </ol>
        <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Server URL</p>
        <div className="mt-2"><CopyBlock value="https://utilbyte.app/mcp" label="MCP server URL" /></div>
        <p className="mt-3 text-sm text-muted-foreground">Availability depends on your assistant, plan and administrator settings. MCP connections are separate from whether a search engine indexes or cites UtilByte.</p>
      </div>
      <section className="mt-10">
        <h2 className="text-xl font-semibold">What your assistant can do</h2>
        <div className="mt-4 divide-y rounded-xl border">
          {operations.map(([name, detail]) => <div key={name} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4"><code className="text-sm font-medium">{name}</code><p className="text-sm text-muted-foreground">{detail}</p></div>)}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">The catalog resource below lists every browser tool. Image, PDF and video processing remain browser workflows: the assistant gives you a link so you can choose your files on your device. A catalog listing does not make that browser tool executable through MCP.</p>
        <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Catalog resource</p>
        <CopyBlock value="utilbyte://catalog" label="catalog resource URI" />
      </section>
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Choose where your text is processed</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">MCP formatting and conversion send the text you supply to UtilByte’s server. The handler does not intentionally store or log that text; hosting infrastructure may retain request metadata, and your assistant provider has its own policies. To process text on your device, open the browser tool instead.</p>
        <p className="mt-3 leading-relaxed text-muted-foreground">Text operations accept up to 20,000 input characters and have bounded output. Formatting does not validate business logic or execute code. Review conversions before using their results.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-lg border px-4 py-2 text-sm hover:bg-muted" href="/dev-tools/json-formatter">Open JSON formatter</Link>
          <Link className="rounded-lg border px-4 py-2 text-sm hover:bg-muted" href="/privacy">Read data-handling details</Link>
        </div>
      </section>
      <section className="mt-10 border-t pt-8">
        <h2 className="text-xl font-semibold">A readable reference for assistants</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">Our public pages and guides explain the same tools to people and crawlers. These text references provide a compact directory for clients that use them.</p>
        <div className="mt-4 flex flex-wrap gap-5 text-sm underline underline-offset-4">
          <a href="/llms.txt">Tool directory</a><a href="/llms-full.txt">Full tool reference</a><Link href="/guides">Practical guides</Link>
          <a href="https://github.com/KryssNa/utilbyte/blob/main/docs/mcp.md">Developer setup</a>
        </div>
      </section>
    </article>
  );
}
