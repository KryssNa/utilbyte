import type { Guide } from "@/content/guides/types";

export const pdfCompressionExplainedGuide: Guide = {
  slug: "pdf-compression-explained",
  title: "What actually happens inside a PDF when you compress it",
  metaTitle: "What happens inside a PDF when you compress it",
  metaDescription:
    "Why the same compressor takes ninety percent off one PDF and four kilobytes off the next. The parts of the file, what a rebuild rewrites, and where no browser tool gets any further.",
  keywords: [
    "pdf compression explained",
    "why did my pdf not get smaller",
    "how pdf compression works",
    "reduce pdf file size",
    "pdf got bigger after compressing",
    "downsampling vs compression",
    "pdf-lib compress",
  ],
  published: "2026-08-24",
  summary:
    "Run two PDFs through the same compressor and one collapses while the other barely moves. The difference is structural, and it is obvious once you know what a PDF is made of. This is the mechanical account: the objects, the stream filters, what a rebuild can remove, and why some files will not shrink at all.",
  readingMinutes: 7,
  intro: [
    "Two documents, both thirty pages, both A4. One goes from 38 MB to 2 MB. The other gives back four kilobytes. Most people conclude the tool is broken, try four more, get the same answer, and give up. The tool is usually fine. The two files differ in a way no PDF reader shows you on screen.",
    "The word compression is doing at least four jobs here, and they operate on different parts of the file. Some are available to code running in a browser tab and some are not. Once you can tell which job a tool is doing, the surprising results stop being surprising.",
    "So this is the mechanical version. What the file is made of, what a save rewrites, why a text document has nothing left to give, and why a compressor sometimes hands back something larger.",
  ],
  sections: [
    {
      heading: "A PDF is a bag of numbered objects",
      body: [
        "Open a PDF in a text editor and most of it is noise, but the skeleton shows through. A header line with a version number. Then a long run of numbered objects. Then a cross-reference table giving the byte offset of each one, and a trailer pointing at the root of the document. A stream is a dictionary followed by a block of raw bytes, and the dictionary says how those bytes were encoded.",
        "That encoding is called the filter, and it is the part people miss. Page drawing instructions, embedded font programs and most other non-image data are stored under FlateDecode, which is the deflate algorithm a ZIP file uses. Photographs are usually stored under DCTDecode, meaning the bytes sitting in the file are a JPEG. Bitonal scans out of an office copier often arrive as CCITTFaxDecode or JBIG2Decode.",
        "The consequence is that a PDF arrives already compressed. Every stream in it was encoded by whatever produced the file. A compressor you run afterwards is not finding untouched data to squeeze. It is reorganising the container around streams that are, in most cases, already about as small as their filter will make them.",
      ],
    },
    {
      heading: "What a rebuild can genuinely remove",
      body: [
        "When a tool opens a document and writes a new one out, the saving comes from a short list of places. None of them involve looking at the picture on the page.",
      ],
      bullets: [
        "Objects nothing points at any more. Delete a page in some editors and the image it used stays in the file, orphaned. A rebuild walks out from the document root, copies what it reaches, and leaves the rest behind.",
        "Incremental save history. A PDF can be updated by appending to the end of the file: new objects, a new cross-reference section, a new trailer, with the previous version left underneath. That is why a contract through eleven rounds of edits may still carry all eleven, including paragraphs somebody believes they deleted.",
        "The cross-reference table itself. Written the old way it is a line of ASCII per object, twenty bytes each, uncompressed. A cross-reference stream stores the same thing as compressed binary, worth a few hundred kilobytes on a file with 40,000 objects.",
        "Small objects, through object streams. Rather than writing every little dictionary as its own top-level object, a modern writer packs hundreds into one Flate-compressed stream. Dictionaries are repetitive text and they deflate well side by side. This is the main structural win.",
        "Metadata. The info dictionary holds title, author, subject, creator and producer, usually with an XMP packet repeating them in XML. A few kilobytes at most, so this is a privacy operation rather than a size one, but those fields carry your name, your software version and sometimes the path you saved from.",
      ],
    },
    {
      heading: "Why two files of the same length behave nothing alike",
      body: [
        "Everything above works on the container. If that is where your megabytes are, the result is dramatic. If they sit inside image streams, the container is a rounding error and the result is close to nothing. That one fact explains most of the variance between files.",
        "Before running anything, divide the file size by the page count. Under 50 KB a page and you have a well-produced text document with no fat on it. Over 1 MB a page and every page is a photograph, whatever the reader shows you.",
      ],
      table: {
        columns: ["What the file is mostly made of", "Result from a structural rebuild", "Why"],
        rows: [
          [
            "Text and vector graphics from Word, Docs or LaTeX",
            "0 to 5 percent",
            "Each page is already a Flate-compressed content stream. Only the container is left to tidy.",
          ],
          [
            "A document with a long history of incremental saves",
            "10 to 40 percent",
            "Every superseded revision is still in the file and can be dropped in one go.",
          ],
          [
            "Thousands of small annotations, comments or form fields",
            "10 to 25 percent",
            "Lots of small dictionaries, which is exactly what object streams were designed for.",
          ],
          [
            "Four full Unicode font families embedded whole",
            "Almost nothing, though this is why the file is large",
            "Re-subsetting means rewriting the font programs. A copy-based rebuild does not do that.",
          ],
          [
            "A scan: one 300 dpi colour image per page",
            "Under 2 percent",
            "The bytes are JPEG already. Nothing outside the images is big enough to matter.",
          ],
          [
            "Slides with a full-bleed photograph behind every one",
            "Under 2 percent",
            "Structurally this is a scan wearing a suit.",
          ],
          [
            "A file already saved with object streams by a careful producer",
            "0 percent, sometimes slightly negative",
            "The work has been done. A second pass has nothing to find.",
          ],
        ],
        caption:
          "Ranges for a browser-side rebuild that repacks the container. A raster pipeline that re-encodes images is playing a different game and the numbers are not comparable.",
      },
    },
    {
      heading: "Compressing and downsampling are not the same operation",
      body: [
        "This is the distinction the whole subject turns on. Compression makes the same data smaller. Deflate finds repetition and encodes it more efficiently, and what comes out is bit for bit what went in. Downsampling means having less data: fewer pixels, fewer colour channels, coarser detail. It cannot be undone, and it is where the large savings live.",
        "The arithmetic is blunt. An A4 page at 600 dpi is about 35 million pixels. Resample to 150 dpi and you keep one sixteenth, because you halve in both directions twice. Convert a colour scan of black text on white to grayscale and two channels of three go with it. Re-encode what survives at JPEG quality 60 rather than 95 and it drops again. That chain, usually Ghostscript behind a preset, explains 40 MB becoming 4 MB.",
        "A library like pdf-lib does none of it, and that is a design choice rather than an oversight. Its job is the object graph: parse the file, copy pages with their resources attached, write a well-formed document. It never decodes an image stream, never looks at a pixel, never touches a font program. So it cannot damage your pages, and it cannot rescue a scan. Those are the same property seen from two sides.",
      ],
      callout: {
        tone: "warning",
        text: "If a browser tool claims it shrank your 40 MB scan to 3 MB, check what came back. Either the file went to a server, or your pages were re-rendered into a canvas as fresh images, which does work but flattens everything: an OCR text layer, links, bookmarks and form fields do not survive. Open the result and try to select a word before sending it anywhere.",
      },
    },
    {
      heading: "Fonts, and the tag that tells you which kind you have",
      body: [
        "Fonts are the second most common reason a document is unexpectedly heavy, and the only one you can diagnose in ten seconds. Open the document properties in any reader and find the fonts list. A name like ABCDEE+Calibri is a subset: the six-letter prefix and plus sign mean only the glyphs the document actually uses were embedded, typically 20 to 60 KB. A name with no prefix is usually the whole font program.",
        "Whole is expensive. A large Unicode family carries several thousand glyphs, and four weights of one can be a few megabytes before anyone types a word. CJK families are worse again. It happens when someone ticks embed all characters, or exports a file for further editing rather than for distribution.",
        "A structural compressor cannot fix this. Re-subsetting means parsing the font program, working out which glyphs the pages use, and writing a new font, which is a different class of work from copying an object. The fix is upstream: export again with subsetting on and the editing option off.",
      ],
    },
    {
      heading: "Why compressing sometimes gives you a bigger file",
      body: [
        "It happens more often than you would expect, and it is not a bug. A rebuild is a rewrite, and a rewrite can land in a worse spot than where it started.",
      ],
      bullets: [
        "The file was already optimised. If the producer wrote compact cross-reference streams and packed its objects sensibly, a second pass has nothing to remove and adds a few hundred bytes of its own overhead.",
        "Streams get decompressed and recompressed. Two deflate implementations tuned differently will not produce byte-identical output, and sometimes the new one is marginally worse.",
        "Shared resources can multiply. If pages 1 and 40 both pointed at one image object, a copy that treats pages independently can embed it twice. On a document with a logo on every page that is not a small mistake.",
        "Linearisation is lost. A file arranged for fast web viewing keeps the first page and a hint table at the front, and re-saving usually drops that arrangement.",
        "Encrypted files never get that far. Password-protected PDFs will not open in pdf-lib at all, so remove the protection in whatever application owns the document first.",
      ],
    },
    {
      heading: "Reading the result honestly",
      body: [
        "A tool reporting a saving of zero percent is often clamping a negative number, so a flat zero can mean the rebuild grew your file. Keep the original either way. Then spend fifteen seconds on the output: confirm the page count matches, and try to select a line of text on a page that had text before. If the text has turned into a picture, something rasterised your document, and you should decide whether you are happy with that before it reaches a portal expecting a searchable file.",
      ],
    },
  ],
  relatedTools: [
    {
      label: "Compress PDF",
      href: "/pdf-tools/compress-pdf",
      description:
        "Repack the object graph and clear metadata in the browser, with the ceiling stated plainly rather than hidden behind a progress bar.",
    },
    {
      label: "Split PDF",
      href: "/pdf-tools/split-pdf",
      description:
        "When the file will not shrink, send fewer pages. Two files of 4 MB clear a 5 MB cap that one 8 MB file never will.",
    },
    {
      label: "Merge PDF",
      href: "/pdf-tools/merge-pdf",
      description:
        "Combine documents once each one is already the size it needs to be, rather than before.",
    },
    {
      label: "Image to PDF",
      href: "/pdf-tools/image-to-pdf",
      description:
        "Build a document from images. They are embedded at the size they arrive at, so compress them first.",
    },
    {
      label: "Compress Image to Size",
      href: "/image-tools/compress-to-size",
      description:
        "The step that actually matters for a photo-heavy PDF, done before the pages are assembled.",
    },
    {
      label: "OCR",
      href: "/image-tools/ocr",
      description:
        "Pull the words out of a scan when what you needed was the text rather than a picture of it.",
    },
  ],
  relatedGuides: ["documents-for-online-forms"],
  faqs: [
    {
      question: "Why did my PDF not get smaller at all?",
      answer:
        "Almost certainly one of two reasons. Either it is a text document whose pages were already Flate-compressed when it was created, in which case there is nothing left to take out, or it is a scan and the tool works on the file structure rather than the pixels inside the images. Divide the file size by the page count. Over about 1 MB a page and you are in the second case, and no structural compressor will help.",
    },
    {
      question: "Why is my compressed PDF larger than the original?",
      answer:
        "Because a rebuild is a rewrite. If the original was already written with compact cross-reference streams and packed objects, the new copy adds a little overhead and removes nothing. Recompressing streams with a different deflate implementation can land a few bytes worse, and copying pages independently can duplicate a resource that was shared. It is not a sign of damage, but keep the original.",
    },
    {
      question: "What is the difference between compressing and downsampling a PDF?",
      answer:
        "Compression encodes the same data more efficiently and gives back exactly what went in. Downsampling throws data away: fewer pixels, fewer colour channels, lower JPEG quality. Every large reduction on a scanned document is downsampling, which is why it is irreversible and why the tools that do it have to decode your images first.",
    },
    {
      question: "Can a browser-based tool compress a scanned PDF properly?",
      answer:
        "Not in the way you want. A tool built on pdf-lib copies pages and their resources without decoding image streams, so a scan comes back within a percent or two of its original size. Real reductions need something that re-encodes the images, which means Ghostscript locally or a server that has your file. The other fix is upstream: re-scan at 200 dpi in grayscale instead of 600 dpi in colour.",
    },
    {
      question: "Does compressing a PDF affect quality?",
      answer:
        "A structural rebuild does not. Page count, layout, fonts and images come out identical, because none of them were opened. A raster pipeline does reduce quality on purpose, and that trade is exactly where its much larger savings come from. If you cannot tell which kind you used, open the output and try to select text on a page that had text before.",
    },
  ],
};
