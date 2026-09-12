import { catalog, catalogCategories } from "@/lib/tool-catalog";
import { GUIDES } from "@/content/guides";

export function discoveryBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || "https://utilbyte.app").replace(/\/$/, "");
}

const processingLabels = {
  local: "Browser processing",
  "direct-network": "Direct connection to a user-selected server",
  "proxied-network": "Requests pass through the UtilByte proxy",
  hosted: "Hosted service",
} as const;

const overview = () => [
  "# UtilByte",
  "",
  `> ${catalog.length} free browser-based tools for images, PDFs, text, developer tasks, video, and everyday utilities. Most tool processing runs locally; network tools have separate data-handling conditions.`,
  "",
  "Tools are interactive web pages. Input/output labels describe data types, not an exhaustive list of accepted file extensions. File limits, supported formats, browser compatibility, and result quality vary by tool. Read the linked tool page before choosing settings or handling sensitive input.",
  "",
  "Local processing does not mean an offline website: some tools download runtimes or language models, and site analytics and advertising are separate from processing. API Client, Request Catcher, Local Proxy, and WebSocket Client send data over the network. Their individual processing notes apply.",
  "",
  "This directory describes the shipped tools; it is not an endorsement by an AI provider or a guarantee of search ranking. MCP access requires a compatible client and is separate from running a tool in the browser.",
  "",
];

export function renderLlmsIndex(baseUrl = discoveryBaseUrl()): string {
  const url = (path: string) => `${baseUrl}${path}`;
  return [
    ...overview(),
    "## Start here",
    "",
    `- [Tool catalog and processing details](${url("/llms-full.txt")}): Expanded text reference for every tool, including inputs, outputs, and network behavior.`,
    `- [All tools](${url("/")}): Browse and open the interactive tools.`,
    `- [Guides](${url("/guides")}): Practical workflows, tradeoffs, and limitations.`,
    ...catalogCategories.flatMap(category => [
      "",
      `## ${category.title === "Dev" ? "Developer" : category.title} tools`,
      "",
      ...catalog.filter(tool => tool.categoryHref === category.href).map(tool =>
        `- [${tool.title}](${url(tool.href)}): ${tool.desc}. ${processingLabels[tool.processingMode]}.`,
      ),
    ]),
    "",
    "## Guides",
    "",
    ...GUIDES.map(guide => `- [${guide.title}](${url(`/guides/${guide.slug}`)}): ${guide.summary}`),
    "",
    "## Integration and policies",
    "",
    `- [AI access and MCP setup](${url("/ai")}): Connection instructions for compatible clients.`,
    `- [MCP endpoint](${url("/mcp")}): Streamable HTTP protocol endpoint; use an MCP client, not a normal page request.`,
    `- [Privacy](${url("/privacy")}): Site data practices, separate from individual tool processing.`,
    `- [About UtilByte](${url("/about")}): Project information.`,
    `- [Contact](${url("/contact")}): Report a problem or request an improvement.`,
    `- [Terms](${url("/terms")}): Usage terms and limitations.`,
    "",
  ].join("\n");
}

export function renderLlmsFull(baseUrl = discoveryBaseUrl()): string {
  const url = (path: string) => `${baseUrl}${path}`;
  return [
    ...overview(),
    `Directory: ${url("/llms.txt")}`,
    `Privacy policy: ${url("/privacy")}`,
    `MCP setup: ${url("/ai")}`,
    `MCP protocol endpoint: ${url("/mcp")}`,
    "",
    "## Tool reference",
    ...catalog.flatMap(tool => [
      "",
      `### ${tool.title}`,
      "",
      `Canonical page: ${url(tool.href)}`,
      `Catalog ID: ${tool.id}`,
      `Category: ${tool.category === "Dev" ? "Developer" : tool.category}`,
      `Purpose: ${tool.desc}`,
      `Inputs: ${tool.supportedInputs.join(", ")}`,
      `Outputs: ${tool.supportedOutputs.join(", ")}`,
      `Capabilities: ${tool.capabilities.join("; ")}`,
      `Processing: ${processingLabels[tool.processingMode]} (${tool.processingMode})`,
      `Data handling: ${tool.processingNote}`,
      ...(tool.relatedToolIds.length ? [`Related tools: ${tool.relatedToolIds.flatMap(id => {
        const related = catalog.find(item => item.id === id);
        return related ? [`[${related.title}](${url(related.href)})`] : [];
      }).join(", ")}`] : []),
    ]),
    "",
    "## Limits and choosing a tool",
    "",
    "Browser tools operate within device memory and browser codec support. Compression to a target size can require quality or dimension changes; the requested size is not a promise that every file can reach it. Review the actual output before submitting a document or replacing an original.",
    "",
    "Formatting does not execute SQL or establish that a query is correct. JSON Formatter rejects duplicate keys and numbers it cannot represent safely; its path lookup supports property names and array indices, not full JSONPath. JSON conversion and schema validation have different purposes; review spreadsheet-formula handling on their tool pages. Online Compiler runs JavaScript and Python without an isolated security sandbox; its TypeScript mode does not transpile types. An image conversion does not add detail to the original. Background removal works on plain backgrounds; it is not general subject segmentation.",
    "",
    "## Guide summaries",
    ...GUIDES.flatMap(guide => [
      "",
      `### ${guide.title}`,
      "",
      `Canonical page: ${url(`/guides/${guide.slug}`)}`,
      guide.summary,
      ...guide.intro,
      `Related tools: ${guide.relatedTools.map(tool => `[${tool.label}](${url(tool.href)})`).join(", ")}`,
    ]),
    "",
  ].join("\n");
}

export function discoveryTextResponse(text: string): Response {
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
