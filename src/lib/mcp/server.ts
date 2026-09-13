import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { catalog, type CatalogTool } from "../tool-catalog";
import { searchTools } from "../tool-search";
import { parseSafeJson, sortJsonKeys } from "../json-safe";
import { formatSql } from "../sql-format";
import { csvToJson, jsonToCsv } from "../data-workflows";

export const MCP_PROCESSING_NOTICE = "Discovery returns public browser tool information. Only format_json, format_sql and convert_json_csv execute through MCP. Their text is sent to and processed on the UtilByte server, unlike local browser tools. The MCP handler does not store or log submitted text. Your MCP client and hosting provider may have their own data policies. Do not send secrets or sensitive data; use the browser tool when local processing is needed.";
export const MAX_MCP_TEXT_LENGTH = 20_000;
export const MAX_MCP_OUTPUT_LENGTH = 100_000;
const executionNames: Record<string, string> = { "dev-json-formatter": "format_json", "dev-sql-formatter": "format_sql", "dev-json-csv": "convert_json_csv" };

function describeTool(tool: CatalogTool) {
  return {
    id: tool.id,
    title: tool.title,
    url: `https://utilbyte.app${tool.href}`,
    description: tool.desc,
    category: tool.category,
    browserProcessingMode: tool.processingMode,
    browserProcessingNote: tool.processingNote,
    supportedInputs: tool.supportedInputs,
    supportedOutputs: tool.supportedOutputs,
    capabilities: tool.capabilities,
    relatedToolIds: tool.relatedToolIds,
    mcpExecutionAvailable: Boolean(executionNames[tool.id]),
    ...(executionNames[tool.id] ? { mcpTool: executionNames[tool.id], mcpProcessingMode: "server" } : {}),
  };
}

function result(value: Record<string, unknown>) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value) }], structuredContent: value };
}

function textResult(transform: () => string) {
  try {
    const output = transform();
    if (output.length > MAX_MCP_OUTPUT_LENGTH) throw new Error("Output is too large; use a smaller input or the browser tool.");
    return result({ output, processingMode: "server", processingNotice: MCP_PROCESSING_NOTICE });
  } catch {
    // Parser exceptions can contain fragments of input. Keep errors useful without
    // copying sensitive user content into diagnostics or SDK protocol errors.
    return { content: [{ type: "text" as const, text: "Unable to transform this input safely. Check syntax, nesting, duplicate keys, number precision, and output size. For CSV, use a header with unique columns and matching row lengths; text mode requires flat records. Try a smaller sample or use the browser tool for detailed validation." }], isError: true };
  }
}

/** A separate server per HTTP request: no sessions or user payloads are retained. */
export function createUtilByteMcpServer() {
  const server = new McpServer(
    { name: "utilbyte", title: "UtilByte tools", version: "1.0.0", websiteUrl: "https://utilbyte.app" },
    { instructions: MCP_PROCESSING_NOTICE },
  );
  const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

  server.registerTool("discover_tools", {
    title: "Find a UtilByte tool",
    description: "Search the public UtilByte catalog by task, tool name, or alias. Returns browser URLs and processing disclosures. Does not process files or execute browser tools.",
    inputSchema: {
      query: z.string().trim().max(120).default("").describe("Task or tool name, such as compress image or JSON formatter. Empty lists tools."),
      category: z.enum(["Image", "PDF", "Text", "Dev", "Video", "Utility"]).optional(),
      limit: z.number().int().min(1).max(20).default(10),
    },
    annotations,
  }, async ({ query, category, limit }) => {
    const matches = searchTools(category ? catalog.filter(tool => tool.category === category) : catalog, query);
    return result({ tools: matches.slice(0, limit).map(describeTool), total: matches.length, processingNotice: MCP_PROCESSING_NOTICE });
  });

  server.registerTool("get_tool", {
    title: "Get UtilByte tool details",
    description: "Get a known tool's public capabilities, canonical browser URL, related tools, and processing disclosure using the ID returned by discover_tools.",
    inputSchema: { id: z.string().min(1).max(100) },
    annotations,
  }, async ({ id }) => {
    const tool = catalog.find(item => item.id === id);
    if (!tool) return { content: [{ type: "text" as const, text: "Tool not found. Use discover_tools to find an existing tool ID." }], isError: true };
    return result({ tool: describeTool(tool), processingNotice: MCP_PROCESSING_NOTICE });
  });

  const textInput = z.string().min(1).max(MAX_MCP_TEXT_LENGTH).describe("Text to process on the UtilByte server. Maximum 20,000 characters; do not include secrets or sensitive data.");
  server.registerTool("format_json", {
    title: "Format JSON on the server",
    description: "Format strict JSON on the UtilByte server. Rejects duplicate keys, unsafe numeric conversion and nesting over 64 levels. Does not execute code. Maximum 20,000 input / 100,000 output characters. Use the browser JSON Formatter for local-only processing.",
    inputSchema: { text: textInput, indent: z.union([z.literal(2), z.literal(4)]).default(2), sortKeys: z.boolean().default(false) },
    annotations,
  }, async ({ text, indent, sortKeys }) => textResult(() => {
    const value = parseSafeJson(text);
    return JSON.stringify(sortKeys ? sortJsonKeys(value) : value, null, indent);
  }));

  server.registerTool("format_sql", {
    title: "Format SQL on the server",
    description: "Format SQL text on the UtilByte server without executing or validating the query. Supports Standard SQL, PostgreSQL, MySQL and SQLite. Maximum 20,000 input / 100,000 output characters. Use the browser SQL Formatter for local-only processing.",
    inputSchema: {
      text: textInput,
      dialect: z.enum(["sql", "postgresql", "mysql", "sqlite"]).default("sql"),
      indent: z.union([z.literal(2), z.literal(4)]).default(2),
      keywordCase: z.enum(["preserve", "upper", "lower"]).default("upper"),
    },
    annotations,
  }, async ({ text, dialect, indent, keywordCase }) => textResult(() => formatSql(text, dialect, indent, keywordCase)));

  server.registerTool("convert_json_csv", {
    title: "Convert JSON and CSV on the server",
    description: "Convert JSON records to CSV or CSV to JSON on the UtilByte server. Text mode uses flat records, string CSV cells and spreadsheet formula protection. JSON-cells mode preserves nested cell values using JSON encoding and is intended for machine exchange, not spreadsheets. Maximum 20,000 input / 100,000 output characters. Use the browser tool for local-only processing.",
    inputSchema: {
      text: textInput,
      direction: z.enum(["json-to-csv", "csv-to-json"]),
      delimiter: z.enum([",", ";", "\t"]).default(","),
      mode: z.enum(["text", "json-cells"]).default("text"),
    },
    annotations,
  }, async ({ text, direction, delimiter, mode }) => textResult(() => direction === "json-to-csv" ? jsonToCsv(text, delimiter, mode, true) : csvToJson(text, delimiter, mode)));

  server.registerResource("tool-catalog", "utilbyte://catalog", {
    title: "UtilByte public tool catalog",
    description: "All available browser tools and their actual processing modes. These listings are not executable MCP tools.",
    mimeType: "application/json",
  }, async uri => ({
    contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify({ tools: catalog.map(describeTool), processingNotice: MCP_PROCESSING_NOTICE }) }],
  }));

  return server;
}
