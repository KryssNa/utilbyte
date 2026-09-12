# UtilByte MCP

UtilByte exposes a public, stateless **Streamable HTTP** MCP endpoint at
`https://utilbyte.app/mcp` after deployment. During development, use
`http://localhost:3000/mcp` (or your preview server's port).

This is a standard MCP integration for clients that support remote Streamable
HTTP servers. It does not automatically connect every LLM, and publishing the
endpoint does not guarantee search rankings or AI citations.

## Connect

In a compatible client's remote MCP server settings, enter the endpoint URL.
No UtilByte API key, OAuth account, database, or additional service is required.
The client's subscription and connector policies may impose their own requirements.
Use its **Streamable HTTP** transport option, not legacy SSE or local stdio.

Clients with a URL-based `mcpServers` configuration often accept this form;
verify the exact configuration schema in that client's current documentation:

```json
{
  "mcpServers": {
    "utilbyte": {
      "url": "https://utilbyte.app/mcp"
    }
  }
}
```

## Available tools

| MCP name | Behavior |
| --- | --- |
| `discover_tools` | Search the public tool catalog by task/name/alias, optional category, and limit (1–20). Returns canonical browser URLs and processing disclosures. |
| `get_tool` | Get a tool by the catalog ID returned by discovery. |
| `format_json` | Format strict JSON, optionally sort object keys, with 2- or 4-space indentation. Rejects duplicate keys, unsafe numeric conversions and excessive nesting. |
| `format_sql` | Format Standard SQL, PostgreSQL, MySQL or SQLite with indentation and keyword-case options. Never executes or validates queries. |
| `convert_json_csv` | Convert JSON records to CSV or CSV to JSON, with comma, semicolon or tab delimiter. Text mode protects formula-like spreadsheet values and treats CSV cells as strings. JSON-cells mode preserves nested values for machine exchange; it is not spreadsheet-safe mode. |

The `utilbyte://catalog` resource contains all current browser-tool listings.
Listing a browser tool does **not** make it executable over MCP. Only the three
text operations above execute on the server. Image, PDF, video and other browser
tools must be opened using their returned URL. No file upload, arbitrary URL
fetching, command execution, third-party service credentials or Slack actions are
exposed through MCP.

## Processing and limits

**Text supplied to an MCP transformation leaves the client and is processed on
the UtilByte server.** This differs from local processing in the browser tools.
The MCP handler does not store or log submitted text, and responses use
`Cache-Control: no-store`. The hosting provider, client and connected model may
have their own data retention policies. Use the browser tools when data needs
to stay local; do not submit secrets or sensitive data through public MCP.

- Maximum HTTP request body: 128 KiB, enforced on streamed bytes too.
- Maximum transformation input: 20,000 characters; output: 100,000 characters.
- Existing JSON safety checks limit nesting to 64 levels. CSV conversion also
  bounds rows and columns. Parser failure messages do not echo user input.
- Request-body reads time out after 5 seconds. The route's serverless maximum
  duration is 10 seconds; deployment platforms must support/enforce this setting.
- At most 8 in-flight requests per server instance. Best-effort rate limits allow
  60 requests/minute per caller and 240/minute per instance, including discovery
  and protocol messages. Rejections return HTTP 429 and `Retry-After: 60`.
- Caller identification uses Vercel's platform header only when `VERCEL=1`.
  Other hosting environments share an anonymous bucket. Counts and hashed caller
  identifiers remain in instance memory for the short rate-limit window; they are
  not a durable or distributed quota. Apply hosting/firewall rate limits for
  sustained public traffic and configure equivalent trusted proxy identification
  when self-hosting.

Browser origins are restricted to `https://utilbyte.app` and
`https://www.utilbyte.app`; local HTTP origins are accepted in development.
Native/server MCP clients typically omit the `Origin` header. Arbitrary browser
origins are rejected, and cross-origin browser integrations are not enabled by
default. No Origin header is treated as a native request, not as authentication.

## Protocol and verification

The implementation uses the official `@modelcontextprotocol/sdk` and its
`WebStandardStreamableHTTPServerTransport` with JSON responses, one server per
request, and no session IDs. POST handles initialization, notifications, tool
calls and resource reads. GET and DELETE return 405 because this service has no
SSE subscriptions or persisted sessions. JSON-RPC batches are rejected.

Run the targeted tests with `npx tsx --test tests/mcp.test.ts`. They connect the
official SDK client to the route handler, initialize the protocol, discover and
call all three transformations, read resources, and verify processing disclosures,
validation, origin checks, byte limits and rate limits without external services.

After deployment, separately connect a real remote MCP client to the production
URL; local tests cannot confirm hosting configuration or a particular client's
connector availability.

Primary references: [official SDK server documentation](https://ts.sdk.modelcontextprotocol.io/server)
and [MCP transport specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports).
