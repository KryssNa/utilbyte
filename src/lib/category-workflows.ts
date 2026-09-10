export const categoryWorkflows: Record<string, { title: string; description: string; links: string[] }[]> = {
  Dev: [
    { title: "Inspect and format data", description: "Use JSON Formatter for strict syntax, tree exploration, and formatted text comparison. Use SQL Formatter to lay out a query in its selected dialect; it does not validate execution.", links: ["/dev-tools/json-formatter", "/dev-tools/sql-formatter", "/dev-tools/diff-checker"] },
    { title: "Convert and validate structured data", description: "Move flat records into a spreadsheet with JSON ↔ CSV. Check an explicit contract with JSON Schema, or infer a starting TypeScript type from one sample.", links: ["/dev-tools/json-csv", "/dev-tools/json-schema", "/dev-tools/json-to-typescript"] },
    { title: "Investigate HTTP and webhooks", description: "Send a request with API Client, inspect incoming test webhooks with Request Catcher, or open a WebSocket connection. These tools contact servers; check the processing disclosure before sending data.", links: ["/dev-tools/api-client", "/dev-tools/request-catcher", "/dev-tools/websocket-client"] },
  ],
  Image: [
    { title: "Meet an upload requirement", description: "Resize sets pixel dimensions. Compress to Size targets a file-size cap. Document Photo combines preset dimensions with an export workflow; confirm the current requirements of your destination.", links: ["/image-tools/resize-image", "/image-tools/compress-to-size", "/image-tools/document-photo"] },
    { title: "Choose a compatible format", description: "Convert HEIC or AVIF when a site requires JPG. Use PNG when you need transparency, and review quality after any lossy conversion.", links: ["/image-tools/heic-to-jpg", "/image-tools/avif-to-jpg", "/image-tools/webp-to-png"] },
  ],
  PDF: [
    { title: "Prepare a document submission", description: "Merge assembles documents, Split extracts pages, and Rotate fixes page orientation. Keep a copy of the originals before exporting.", links: ["/pdf-tools/merge-pdf", "/pdf-tools/split-pdf", "/pdf-tools/rotate-pdf"] },
    { title: "Reduce size or convert pages", description: "Try PDF compression first. Rasterizing to meet a strict cap can remove selectable text and accessibility structure. Image to PDF is appropriate when the source is already a scan or photo.", links: ["/pdf-tools/compress-pdf", "/pdf-tools/compress-to-size", "/pdf-tools/image-to-pdf"] },
  ],
  Text: [
    { title: "Clean and check writing", description: "Count length before submission, normalize capitalization with Case Converter, or remove repeated lines. Review the result before replacing your source text.", links: ["/text-tools/word-counter", "/text-tools/case-converter", "/text-tools/remove-duplicates"] },
  ],
  Video: [
    { title: "Make a smaller shareable clip", description: "Video Compressor reduces size, Video to GIF makes a short animation, and Video to Audio extracts a soundtrack. The processing engine downloads on demand and runs locally; large files may exceed browser memory.", links: ["/video-tools/compress-video", "/video-tools/video-to-gif", "/video-tools/video-to-audio"] },
  ],
  Utility: [
    { title: "Translate units and representations", description: "Use Timestamp Converter for Unix time, Unit Converter for measurements, or Color Converter to switch color notation. Verify the unit and timezone before copying a result.", links: ["/utility-tools/timestamp", "/utility-tools/unit-converter", "/utility-tools/color-converter"] },
    { title: "Generate something to share", description: "Create QR codes and barcodes for supported data types. Test a downloaded code with its intended scanner before printing or distributing it.", links: ["/utility-tools/qr-code", "/utility-tools/barcode"] },
  ],
};
