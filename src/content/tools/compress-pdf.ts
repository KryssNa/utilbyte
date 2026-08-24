import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const compressPdfArticle: ToolArticleContent = {
  intro: [
    "Most people arrive here with a hard number already in their head. The upload form says 5 MB and the file is 14. The email came back undelivered. Court filing portals, visa applications, university submission systems, insurance claim forms: they all have a cap, and none of them tell you what to do when you go over it.",
    "This tool opens the PDF inside your browser tab with pdf-lib, rebuilds the document from its pages, and writes it back out using object streams, which packs the many small internal objects of a PDF together and leaves behind parts of the old file structure that nothing references any more. Turn on metadata removal and the title, author, subject, creator and producer fields are cleared as well. No part of the file is uploaded. It is read from disk into the tab, and the rebuilt copy goes straight to your downloads folder.",
    "How much that saves depends almost entirely on what is inside the document, and for some files the honest answer is not much. It is worth understanding why, rather than trying six tools in a row and concluding they are all broken.",
  ],
  sections: [
    {
      heading: "Where the megabytes actually are",
      body: [
        "Open an oversized PDF and the weight is almost never in the words. A page of text is a few kilobytes of drawing instructions, already compressed by whatever produced the file. The size lives somewhere else, and it helps to know which of these you are dealing with before you try to fix it.",
      ],
      bullets: [
        "Embedded images. One 300 dpi colour scan of an A4 page is around 3,500 by 4,900 pixels. Even as JPEG that is often 1 to 3 MB, so a 40 page scan ends up exactly where you would expect.",
        "Embedded fonts. A subsetted font is usually 20 to 60 KB and harmless. A document that embeds four full weights of a large Unicode family can be carrying several megabytes before anyone has typed a word.",
        "Metadata and XMP packets. Tiny in bytes, but they carry your name, your software, and occasionally the full path the file was saved from.",
        "Revision history. PDFs can be written incrementally, where each save appends to the file and the previous version stays behind it. A contract that went through eleven rounds of edits may still be carrying all eleven.",
        "Duplicated resources. Depending on how the file was generated, the same logo placed on 200 pages is sometimes stored 200 separate times.",
      ],
    },
    {
      heading: "Why a text PDF barely moves and a scan collapses",
      body: [
        "A PDF exported from Word, Pages or LaTeX is mostly Flate-compressed content streams. That is the same algorithm behind a ZIP file, and it has already been applied. Compressing it again gets you very little, which is why a 300 page text document that weighs 1.2 MB will not turn into 400 KB no matter what you feed it to. There is nothing left in it to squeeze.",
        "A scanned document is the opposite. Every page is a photograph of a piece of paper, usually captured at whatever the scanner defaulted to, which is frequently 300 or 600 dpi in full colour for a page that is black text on white. Drop it to 150 dpi and three quarters of the pixels disappear. Convert it to grayscale and two of the three colour channels go with them. Reductions of 70 to 90 percent are normal for that kind of file.",
        "The distinction matters here for a specific reason: the second kind of saving requires decoding and re-encoding the image data, and a client-side pdf-lib rebuild does not do that. Read the limitations at the bottom of this page before you plan around it.",
      ],
    },
    {
      heading: "Getting under a specific limit",
      body: [
        "Nobody wants a smaller PDF for its own sake. They want it under a number, and the number is usually somebody else's. Gmail stops at 25 MB. Plenty of government and legal portals sit at 2 MB or 5 MB. Older internal systems sometimes still enforce 1 MB. If you have a target, work down this list in order, because the earlier items give up far more than the later ones.",
      ],
      bullets: [
        "Go back to the source file and export again. Word, Docs, InDesign and most design tools have a smallest-file or screen-quality export preset, and it usually beats anything applied afterwards, because it downsamples the images before they are ever embedded.",
        "If it is a scan, re-scan it. 200 dpi grayscale instead of 600 dpi colour is the single biggest change available to you, and it takes less time than searching for a compressor.",
        "Strip metadata and rebuild the structure, which is what this tool does. Expect a few percent on a normal file, sometimes more on one with a long edit history.",
        "Split it. Two attachments of 4 MB clear a 5 MB cap that one 8 MB file never will, and the split tool on this site runs in the browser the same way.",
        "Send only the pages that are needed. Most people attaching a 60 page document are being asked about four of those pages.",
      ],
    },
    {
      heading: "What Ghostscript does that a browser tool does not",
      body: [
        "Server-side compressors are usually Ghostscript with a preset behind them. Run it with -dPDFSETTINGS=/ebook and it decodes every embedded image, downsamples each one to a target resolution, re-encodes it as JPEG at a chosen quality, and can convert colour to grayscale, re-subset fonts and flatten transparency on the way. That is a full raster pipeline, and it is why those tools can turn 40 MB into 4 MB.",
        "pdf-lib is a different kind of library. Its job is the object graph: parse the file, copy pages with their resources intact, write out a clean and well-formed document. It never touches the pixels inside an image stream. The saving on this page therefore comes from structure and metadata rather than image data, and the tool will not drop pages, flatten a form or rasterise anything. Page count and visible content come out identical to what went in.",
        "If you genuinely need the Ghostscript kind of reduction and you still do not want to hand your file to a stranger's server, Ghostscript is free and runs locally: gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile=out.pdf in.pdf. That is a fair thing to tell you, and more useful than pretending a browser tab does the same job.",
      ],
    },
  ],
  example: {
    title: "A worked example: a 32 page quarterly report",
    input:
      "quarterly-report.pdf\n4.8 MB  -  32 pages\nVector text, 6 embedded PNG charts\nTitle / Author / Producer metadata present\nPreset: Web Optimized (metadata removal on)",
    output:
      "quarterly-report_compressed.pdf\n4.3 MB  -  32 pages\nSaved 512 KB (10.4%)\nMetadata fields cleared\nProcessing time: 840 ms",
    note: "Ten percent is a realistic result for a structural rewrite of a document that was already produced sensibly. The six PNG charts come out byte for byte identical, which is why the remaining 4.3 MB stays where it is. Run the same tool over a 38 MB scanned contract and it hands back roughly 37 MB, because that file is one large image per page and none of those images are re-encoded. When the file is mostly scans, the fix is upstream at the scanner, not here.",
  },
  limitations: [
    "It does not re-encode or downsample embedded images. The image quality and DPI sliders under Custom Settings record your preference and appear in the summary, but they do not currently change the bytes that get written. A scan-heavy PDF comes back close to the size it went in at.",
    "Encrypted and password-protected PDFs cannot be opened. pdf-lib refuses to load them and that file will fail with an error. Remove the password in whatever application owns the document first, then compress.",
    "Some files come back the same size, and a few come back very slightly larger. If the original was already linearised and optimised by a good producer, rewriting the object graph can add a handful of bytes. The reported saving is clamped at zero, so a flat 0% result may mean the rebuild grew the file and you should keep your original.",
    "Everything happens in browser memory. The drop zone accepts up to 5 files at 50 MB each, and during processing the source document, the rebuilt document and the analysis data all exist at once. On a phone or an older laptop, a file well under 50 MB can still make the tab run out of room.",
    "The content analysis is an estimate rather than an audit. It inspects the first three pages for text and image operators and extrapolates from there, and the estimated savings figure is a heuristic. A document whose first three pages are a text cover sheet followed by 200 scanned pages will be described inaccurately.",
  ],
};
