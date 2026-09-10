export type ProcessingMode = "local" | "direct-network" | "proxied-network" | "hosted";
export interface CatalogTool {
  id: string;
  title: string;
  href: string;
  desc: string;
  category: string;
  categoryHref: string;
  subgroup: string;
  aliases: readonly string[];
  processingMode: ProcessingMode;
  processingNote: string;
  supportedInputs: readonly string[];
  supportedOutputs: readonly string[];
  capabilities: readonly string[];
  relatedToolIds: readonly string[];
  contentUpdatedAt?: string;
  capabilityUpdatedAt?: string;
  featuredWeight: number;
}

// Presentation-independent source for navigation, search, counts, and sitemap.
const definitions = [
  {
    "title": "Image",
    "href": "/image-tools",
    "tools": [
      {
        "title": "Background Remover",
        "href": "/image-tools/remove-background",
        "desc": "Plain backgrounds",
        "aliases": []
      },
      {
        "title": "Blur Image",
        "href": "/image-tools/blur-image",
        "desc": "Blur & pixelate",
        "aliases": []
      },
      {
        "title": "Format Converter",
        "href": "/image-tools/format-converter",
        "desc": "PNG, JPG, WebP",
        "aliases": []
      },
      {
        "title": "Image Compressor",
        "href": "/image-tools/compress-image",
        "desc": "Reduce file size",
        "aliases": [
          "shrink image",
          "reduce image size"
        ]
      },
      {
        "title": "Compress to Size",
        "href": "/image-tools/compress-to-size",
        "desc": "Hit an exact KB limit",
        "aliases": []
      },
      {
        "title": "Document Photo",
        "href": "/image-tools/document-photo",
        "desc": "Passport & visa sizes",
        "aliases": []
      },
      {
        "title": "Image Cropper",
        "href": "/image-tools/crop-image",
        "desc": "Crop with precision",
        "aliases": []
      },
      {
        "title": "Image Resizer",
        "href": "/image-tools/resize-image",
        "desc": "Any dimension",
        "aliases": []
      },
      {
        "title": "Image to Text (OCR)",
        "href": "/image-tools/ocr",
        "desc": "Extract text",
        "aliases": []
      },
      {
        "title": "HEIC to JPG",
        "href": "/image-tools/heic-to-jpg",
        "desc": "iPhone photos",
        "aliases": []
      },
      {
        "title": "WebP to PNG",
        "href": "/image-tools/webp-to-png",
        "desc": "Lossless, keeps alpha",
        "aliases": []
      },
      {
        "title": "AVIF to JPG",
        "href": "/image-tools/avif-to-jpg",
        "desc": "Wide compatibility",
        "aliases": []
      }
    ]
  },
  {
    "title": "PDF",
    "href": "/pdf-tools",
    "tools": [
      {
        "title": "Compress PDF",
        "href": "/pdf-tools/compress-pdf",
        "desc": "Reduce size",
        "aliases": []
      },
      {
        "title": "PDF to Size",
        "href": "/pdf-tools/compress-to-size",
        "desc": "Hit an exact limit",
        "aliases": [
          "shrink pdf"
        ]
      },
      {
        "title": "Image to PDF",
        "href": "/pdf-tools/image-to-pdf",
        "desc": "Create PDF",
        "aliases": []
      },
      {
        "title": "Merge PDF",
        "href": "/pdf-tools/merge-pdf",
        "desc": "Combine files",
        "aliases": []
      },
      {
        "title": "PDF Editor",
        "href": "/pdf-tools/edit-pdf",
        "desc": "Edit any PDF",
        "aliases": []
      },
      {
        "title": "PDF to Image",
        "href": "/pdf-tools/pdf-to-image",
        "desc": "Convert pages",
        "aliases": []
      },
      {
        "title": "Rotate PDF",
        "href": "/pdf-tools/rotate-pdf",
        "desc": "Rotate pages",
        "aliases": []
      },
      {
        "title": "Split PDF",
        "href": "/pdf-tools/split-pdf",
        "desc": "Separate pages",
        "aliases": []
      }
    ]
  },
  {
    "title": "Text",
    "href": "/text-tools",
    "tools": [
      {
        "title": "Case Converter",
        "href": "/text-tools/case-converter",
        "desc": "Change case",
        "aliases": []
      },
      {
        "title": "Lorem Ipsum",
        "href": "/text-tools/lorem-ipsum",
        "desc": "Generate text",
        "aliases": []
      },
      {
        "title": "Remove Duplicates",
        "href": "/text-tools/remove-duplicates",
        "desc": "Clean text",
        "aliases": []
      },
      {
        "title": "Text Formatter",
        "href": "/text-tools/text-formatter",
        "desc": "Format text",
        "aliases": []
      },
      {
        "title": "Word Counter",
        "href": "/text-tools/word-counter",
        "desc": "Count words",
        "aliases": []
      }
    ]
  },
  {
    "title": "Dev",
    "href": "/dev-tools",
    "tools": [
{
      "title": "JSON \u2194 CSV",
      "href": "/dev-tools/json-csv",
      "desc": "Convert flat records and tables",
      "aliases": [
            "json to csv",
            "csv to json"
      ]
},
{
      "title": "JSON Schema Validator",
      "href": "/dev-tools/json-schema",
      "desc": "Validate JSON against a draft-07 schema",
      "aliases": [
            "validate schema",
            "json schema draft 7"
      ]
},
{
      "title": "JSON to TypeScript",
      "href": "/dev-tools/json-to-typescript",
      "desc": "Infer types from a JSON example",
      "aliases": [
            "generate interface",
            "typescript types"
      ]
},
      {
        "title": "API Client",
        "href": "/dev-tools/api-client",
        "desc": "Send HTTP requests",
        "aliases": []
      },
      {
        "title": "Base64",
        "href": "/dev-tools/base64",
        "desc": "Encode/decode",
        "aliases": [
          "base 64",
          "encode decode"
        ]
      },
      {
        "title": "Code Beautifier",
        "href": "/dev-tools/code-beautifier",
        "desc": "Format HTML/CSS/JS",
        "aliases": []
      },
      {
        "title": "Cron Parser",
        "href": "/dev-tools/cron-parser",
        "desc": "Parse cron",
        "aliases": []
      },
      {
        "title": "Diff Checker",
        "href": "/dev-tools/diff-checker",
        "desc": "Compare text",
        "aliases": []
      },
      {
        "title": "Hash Generator",
        "href": "/dev-tools/hash-generator",
        "desc": "MD5, SHA",
        "aliases": []
      },
      {
        "title": "JSON Formatter",
        "href": "/dev-tools/json-formatter",
        "desc": "Format & validate JSON",
        "aliases": [
          "pretty print",
          "json beautifier",
          "validate json"
        ]
      },
      {
        "title": "JWT Decoder",
        "href": "/dev-tools/jwt-decoder",
        "desc": "Decode tokens",
        "aliases": []
      },
      {
        "title": "Markdown Renderer",
        "href": "/dev-tools/markdown-renderer",
        "desc": "Render markdown",
        "aliases": []
      },
      {
        "title": "Online Compiler",
        "href": "/dev-tools/online-compiler",
        "desc": "Run code live",
        "aliases": []
      },
      {
        "title": "Regex Tester",
        "href": "/dev-tools/regex-tester",
        "desc": "Test patterns",
        "aliases": []
      },
      {
        "title": "Request Catcher",
        "href": "/dev-tools/request-catcher",
        "desc": "Capture requests",
        "aliases": [
          "webhook",
          "http bin",
          "request inspector"
        ]
      },
      {
        "title": "Local Proxy",
        "href": "/dev-tools/local-proxy",
        "desc": "Forward to localhost",
        "aliases": []
      },
      {
        "title": "SQL Formatter",
        "href": "/dev-tools/sql-formatter",
        "desc": "Beautify SQL queries",
        "aliases": [
          "postgres",
          "postgresql",
          "mysql",
          "sqlite",
          "beautify query",
          "pretty print sql"
        ]
      },
      {
        "title": "URL Encoder",
        "href": "/dev-tools/url-encoder",
        "desc": "Encode URLs",
        "aliases": [
          "url escape",
          "percent encoding"
        ]
      },
      {
        "title": "UUID Generator",
        "href": "/dev-tools/uuid-generator",
        "desc": "Generate IDs",
        "aliases": []
      },
      {
        "title": "WebSocket Client",
        "href": "/dev-tools/websocket-client",
        "desc": "WS connections",
        "aliases": []
      }
    ]
  },
  {
    "title": "Video",
    "href": "/video-tools",
    "tools": [
      {
        "title": "Video to Audio",
        "href": "/video-tools/video-to-audio",
        "desc": "Extract audio",
        "aliases": []
      },
      {
        "title": "Video Compressor",
        "href": "/video-tools/compress-video",
        "desc": "Reduce size",
        "aliases": []
      },
      {
        "title": "Video to GIF",
        "href": "/video-tools/video-to-gif",
        "desc": "Create GIFs",
        "aliases": []
      }
    ]
  },
  {
    "title": "Utility",
    "href": "/utility-tools",
    "tools": [
      {
        "title": "Barcode Generator",
        "href": "/utility-tools/barcode",
        "desc": "Generate barcodes",
        "aliases": []
      },
      {
        "title": "Color Converter",
        "href": "/utility-tools/color-converter",
        "desc": "HEX, RGB, HSL",
        "aliases": []
      },
      {
        "title": "Countdown Timer",
        "href": "/utility-tools/countdown",
        "desc": "Create timers",
        "aliases": []
      },
      {
        "title": "Password Generator",
        "href": "/utility-tools/password-generator",
        "desc": "Secure passwords",
        "aliases": []
      },
      {
        "title": "QR Code",
        "href": "/utility-tools/qr-code",
        "desc": "Create codes",
        "aliases": []
      },
      {
        "title": "Timestamp Converter",
        "href": "/utility-tools/timestamp",
        "desc": "Unix timestamps",
        "aliases": [
          "epoch",
          "unix time",
          "date time"
        ]
      },
      {
        "title": "Unit Converter",
        "href": "/utility-tools/unit-converter",
        "desc": "Convert units",
        "aliases": []
      }
    ]
  }
] as const;

const formatTools = new Set(["sql-formatter", "json-formatter", "code-beautifier", "diff-checker", "markdown-renderer", "json-csv", "json-schema", "json-to-typescript"]);
const networkTools = new Set(["api-client", "request-catcher", "local-proxy", "websocket-client"]);
const encodingTools = new Set(["base64", "url-encoder", "jwt-decoder", "hash-generator"]);
const processing: Record<string, { mode: ProcessingMode; note: string }> = {
  "api-client": { mode: "proxied-network", note: "Your URL, headers, and body go through UtilByte's /api/proxy server to the destination. Responses return through that server. Do not send secrets you cannot share with the destination and proxy." },
  "request-catcher": { mode: "hosted", note: "Incoming requests are stored in a hosted Supabase database, including body, query, headers (except Authorization), and IP address. Anyone with the bin ID can read or clear it. The supplied database policies also permit broad anonymous access. No automatic retention cleanup is implemented in the supplied source. Clear deletes the bin's request rows; infrastructure logs/backups are outside this control. Use synthetic test data only." },
  "local-proxy": { mode: "hosted", note: "Requests are stored by the hosted Request Catcher, then forwarded to the configured URL when enabled. Bin IDs are shared with Request Catcher and saved in this browser. Anyone with an ID can change forwarding settings; no owner authentication is implemented. No automatic retention cleanup is implemented. Use synthetic test data only." },
  "websocket-client": { mode: "direct-network", note: "Connects directly from this browser to the WebSocket URL you enter. Messages are sent to that server; its retention policy applies." },
  "online-compiler": { mode: "local", note: "Code executes in this browser. Python downloads Pyodide from jsDelivr on first use. Code you run may itself make network requests; do not run untrusted code." },
  "markdown-renderer": { mode: "local", note: "Markdown renders in your browser. Remote images embedded in the document can contact their source servers." },
  "ocr": { mode: "local", note: "Recognition runs in this browser. The OCR worker and language models may be downloaded from external hosts; image processing remains local." },
};
const io: Record<string, [string[], string[]]> = {
  "ocr": [["image"], ["text"]], "jwt-decoder": [["jwt"], ["json"]],
  "hash-generator": [["text"], ["hash"]], "uuid-generator": [["settings"], ["uuid"]],
  "password-generator": [["settings"], ["password"]], "qr-code": [["text"], ["image"]], "barcode": [["text"], ["image"]],
  "timestamp": [["timestamp", "date"], ["timestamp", "date"]], "countdown": [["date"], ["timer"]],
  "api-client": [["http-request"], ["http-response"]], "request-catcher": [["http-request"], ["request-log"]],
  "local-proxy": [["http-request"], ["http-response"]], "websocket-client": [["text"], ["messages"]],
  "online-compiler": [["code"], ["execution-output"]], "markdown-renderer": [["markdown"], ["html"]],
  "json-formatter": [["json"], ["json"]], "sql-formatter": [["sql"], ["sql"]],
  "json-csv": [["json", "csv"], ["json", "csv"]], "json-schema": [["json", "json-schema"], ["validation-report"]],
  "json-to-typescript": [["json"], ["typescript"]], "base64": [["text", "base64"], ["base64", "text"]],
  "url-encoder": [["text"], ["text"]], "diff-checker": [["text"], ["text-diff"]],
  "compress-image": [["image"], ["image"]], "resize-image": [["image"], ["image"]],
  "image-to-pdf": [["image"], ["pdf"]], "pdf-to-image": [["pdf"], ["image"]],
};
const related: Record<string, string[]> = {
  "json-formatter": ["dev-json-csv", "dev-json-schema", "dev-json-to-typescript"],
  "json-csv": ["dev-json-formatter", "dev-json-schema"], "json-schema": ["dev-json-formatter"],
  "json-to-typescript": ["dev-json-schema", "dev-json-formatter"], "sql-formatter": ["dev-diff-checker"],
  "compress-image": ["image-resize-image", "pdf-image-to-pdf"],
};
const featured = ["edit-pdf", "compress-image", "online-compiler", "merge-pdf", "remove-background", "json-formatter", "qr-code", "password-generator", "video-to-gif", "word-counter"];
export const catalogCategories = definitions.map(group => ({ title: group.title, href: group.href }));
export const catalog: CatalogTool[] = definitions.flatMap(group => group.tools.map(tool => {
  const slug = tool.href.split("/").pop()!;
  const prefix = group.href.slice(1).replace("-tools", "");
  const subgroup = group.title === "Dev" ? formatTools.has(slug) ? "Format and inspect" : networkTools.has(slug) ? "API and HTTP" : encodingTools.has(slug) ? "Encoding and security" : "Other developer utilities" : `${group.title} workflows`;
  const formats = io[slug] ?? (group.title === "Image" ? [["image"], ["image"]] : group.title === "PDF" ? [["pdf"], ["pdf"]] : group.title === "Video" ? [["video"], ["media"]] : [["text"], ["text"]]);
  return { ...tool, id: `${prefix}-${slug}`, category: group.title, categoryHref: group.href, subgroup,
    processingMode: processing[slug]?.mode ?? "local",
    processingNote: processing[slug]?.note ?? (group.title === "Video" ? "Media processing runs in this browser. FFmpeg downloads its runtime from an external CDN when needed. Your selected video is not uploaded by the tool." : "This tool processes input in your browser. Site analytics and advertising are separate from tool processing; see the privacy policy."),
    supportedInputs: formats[0], supportedOutputs: formats[1], capabilities: [tool.desc],
    relatedToolIds: related[slug] ?? [], featuredWeight: featured.includes(slug) ? 100 - featured.indexOf(slug) : 0,
    ...(["sql-formatter", "json-formatter", "base64", "url-encoder", "json-csv", "json-schema", "json-to-typescript"].includes(slug) ? { contentUpdatedAt: "2026-09-10", capabilityUpdatedAt: "2026-09-10" } : {}),
  };
}));
export function getTool(href: string) { return catalog.find(tool => tool.href === href); }
