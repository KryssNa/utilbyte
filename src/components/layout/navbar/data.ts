import {
  Code2,
  FileText,
  Image,
  Type,
  Video,
  Wrench,
} from "lucide-react";
import { FlattenedTool, ToolCategory } from "./types";

export const toolCategories: ToolCategory[] = [
  {
    title: "Image",
    icon: Image,
    href: "/#image-tools",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-500/10",
    hoverBg: "hover:bg-violet-500/10",
    tools: [
      { title: "Image Cropper", href: "/image-tools/crop-image", desc: "Crop with precision" },
      { title: "Image Compressor", href: "/image-tools/compress-image", desc: "Reduce file size" },
      { title: "Format Converter", href: "/image-tools/format-converter", desc: "PNG, JPG, WebP" },
      { title: "Image Resizer", href: "/image-tools/resize-image", desc: "Any dimension" },
      { title: "Background Remover", href: "/image-tools/remove-background", desc: "AI-powered" },
      { title: "Image to Text (OCR)", href: "/image-tools/ocr", desc: "Extract text" },
      { title: "Blur Image", href: "/image-tools/blur-image", desc: "Blur & pixelate" },
    ],
  },
  {
    title: "PDF",
    icon: FileText,
    href: "/#pdf-tools",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    hoverBg: "hover:bg-rose-500/10",
    tools: [
      { title: "Merge PDF", href: "/pdf-tools/merge-pdf", desc: "Combine files" },
      { title: "Split PDF", href: "/pdf-tools/split-pdf", desc: "Separate pages" },
      { title: "Compress PDF", href: "/pdf-tools/compress-pdf", desc: "Reduce size" },
      { title: "PDF to Image", href: "/pdf-tools/pdf-to-image", desc: "Convert pages" },
      { title: "Image to PDF", href: "/pdf-tools/image-to-pdf", desc: "Create PDF" },
      { title: "Rotate PDF", href: "/pdf-tools/rotate-pdf", desc: "Rotate pages" },
    ],
  },
  {
    title: "Text",
    icon: Type,
    href: "/#text-tools",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    hoverBg: "hover:bg-emerald-500/10",
    tools: [
      { title: "Word Counter", href: "/text-tools/word-counter", desc: "Count words" },
      { title: "Case Converter", href: "/text-tools/case-converter", desc: "Change case" },
      { title: "Remove Duplicates", href: "/text-tools/remove-duplicates", desc: "Clean text" },
      { title: "Text Formatter", href: "/text-tools/text-formatter", desc: "Format text" },
      { title: "Lorem Ipsum", href: "/text-tools/lorem-ipsum", desc: "Generate text" },
    ],
  },
  {
    title: "Dev",
    icon: Code2,
    href: "/#dev-tools",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    hoverBg: "hover:bg-amber-500/10",
    tools: [
      { title: "JSON Formatter", href: "/dev-tools/json-formatter", desc: "Format & validate JSON" },
      { title: "Code Beautifier", href: "/dev-tools/code-beautifier", desc: "Format HTML/CSS/JS" },
      { title: "SQL Formatter", href: "/dev-tools/sql-formatter", desc: "Beautify SQL queries" },
      { title: "Diff Checker", href: "/dev-tools/diff-checker", desc: "Compare text" },
      { title: "Regex Tester", href: "/dev-tools/regex-tester", desc: "Test patterns" },
      { title: "Base64", href: "/dev-tools/base64", desc: "Encode/decode" },
      { title: "URL Encoder", href: "/dev-tools/url-encoder", desc: "Encode URLs" },
      { title: "JWT Decoder", href: "/dev-tools/jwt-decoder", desc: "Decode tokens" },
      { title: "Hash Generator", href: "/dev-tools/hash-generator", desc: "MD5, SHA" },
      { title: "UUID Generator", href: "/dev-tools/uuid-generator", desc: "Generate IDs" },
      { title: "Cron Parser", href: "/dev-tools/cron-parser", desc: "Parse cron" },
      { title: "Markdown Renderer", href: "/dev-tools/markdown-renderer", desc: "Render markdown" },
    ],
  },
  {
    title: "Video",
    icon: Video,
    href: "/#video-tools",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    hoverBg: "hover:bg-purple-500/10",
    tools: [
      { title: "Video to Audio", href: "/video-tools/video-to-audio", desc: "Extract audio" },
      { title: "Video Compressor", href: "/video-tools/compress-video", desc: "Reduce size" },
      { title: "Video to GIF", href: "/video-tools/video-to-gif", desc: "Create GIFs" },
    ],
  },
  {
    title: "Utility",
    icon: Wrench,
    href: "/#utility-tools",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-500/10",
    hoverBg: "hover:bg-cyan-500/10",
    tools: [
      { title: "Password Generator", href: "/utility-tools/password-generator", desc: "Secure passwords" },
      { title: "QR Code", href: "/utility-tools/qr-code", desc: "Create codes" },
      { title: "Barcode Generator", href: "/utility-tools/barcode", desc: "Generate barcodes" },
      { title: "Unit Converter", href: "/utility-tools/unit-converter", desc: "Convert units" },
      { title: "Color Converter", href: "/utility-tools/color-converter", desc: "HEX, RGB, HSL" },
      { title: "Timestamp Converter", href: "/utility-tools/timestamp", desc: "Unix timestamps" },
      { title: "Countdown Timer", href: "/utility-tools/countdown", desc: "Create timers" },
    ],
  },
];

// Flatten all tools for search
export const allTools: FlattenedTool[] = toolCategories.flatMap((cat) =>
  cat.tools.map((tool) => ({
    ...tool,
    category: cat.title,
    color: cat.color,
    bgColor: cat.bgColor
  }))
);

