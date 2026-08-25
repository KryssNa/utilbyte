import type { Guide } from "@/content/guides/types";

export const documentsForOnlineFormsGuide: Guide = {
  slug: "documents-for-online-forms",
  title: "Preparing documents for government and university online portals",
  metaTitle: "Preparing documents for online portals",
  metaDescription:
    "The order to do things in, the filename rules nobody writes down, and what to check when a portal rejects your upload without telling you why.",
  keywords: [
    "upload document to government portal",
    "file rejected no error message",
    "document upload requirements",
    "university application document format",
    "scan documents for online form",
    "pdf under 2mb for application",
    "visa application document upload",
  ],
  published: "2026-08-24",
  summary:
    "Portals accept files on rules they mostly do not publish, then reject them with a red box that says nothing useful. This is the working order for getting a document from paper to accepted upload, the traps between each step, and how to diagnose a silent rejection instead of guessing.",
  readingMinutes: 7,
  intro: [
    "The document is fine. You have it in your hand, or on your desktop, and any human looking at it would accept it in a second. The portal will not. It shows a red box saying the file could not be uploaded, or worse, it says nothing at all and quietly leaves the field empty when you scroll back up.",
    "Nearly all of these failures come from a small number of causes, and nearly all are avoidable if you work in the right sequence. The sequence matters more than the tools: people usually own the right software already, they just apply it in an order that destroys quality or breaks a second rule while satisfying the first.",
    "What follows is the end-to-end order, the reasoning behind it, and a diagnostic list for the moment when a technically valid file gets refused anyway.",
  ],
  sections: [
    {
      heading: "Write down the whole specification first",
      body: [
        "Before touching a file, find every constraint the portal states and put them in one place. They are usually scattered: some on the upload page, some in a PDF of instructions linked from a sidebar, some in a tooltip. Collecting them up front stops you doing the work twice.",
        "There are more of them than people expect, and they interact. A 200 KB cap and a 600 by 800 pixel requirement are one problem, not two. Get at least these written down:",
      ],
      bullets: [
        "The accepted formats, exactly as written. PDF and JPG is not the same list as PDF, JPG and JPEG.",
        "The size cap, and whether it applies per file or to the whole application.",
        "Required pixel dimensions or a dpi figure, if the document is a photograph or a signature.",
        "Whether they want one combined file or one per document, and the maximum page count.",
        "Any filename pattern. These are often shown as an example rather than a rule, which is why people miss them.",
        "Whether the file may be password protected or signed, and whether a flavour such as PDF/A is required.",
      ],
    },
    {
      heading: "The order of operations",
      body: [
        "Each step below reduces information, and no later step gets it back. The sequence runs from decisions about what the file contains to decisions about how many bytes it takes to say it. Working in another order is the most common cause of an upload that passes the checks and looks terrible.",
      ],
      table: {
        columns: ["Step", "What you do", "Why it belongs here"],
        rows: [
          [
            "1",
            "Capture. Scan flat, or photograph the page on a flat surface in daylight.",
            "Everything downstream is limited by this. A shadow or a lean cannot be compressed away.",
          ],
          [
            "2",
            "Rotate and straighten.",
            "Do it while you still have all the pixels. Rotating a small file resamples it a second time.",
          ],
          [
            "3",
            "Crop to the edges of the document.",
            "The desk around the page is pure cost. Cropping first spends the byte budget on the document rather than your tablecloth.",
          ],
          [
            "4",
            "Convert the format if needed, and fix the colour space.",
            "Format changes how compression behaves, so settle it before tuning quality.",
          ],
          [
            "5",
            "Resize to the required pixel dimensions.",
            "This is where the big reduction should come from. Fewer pixels means the compressor is not asked to do the impossible.",
          ],
          [
            "6",
            "Compress to the byte limit.",
            "Last of the image steps, working on something that is already the right shape and size.",
          ],
          [
            "7",
            "Combine into a single PDF, if one file is wanted.",
            "Images go into a PDF at whatever size they arrive at, so they have to be small already.",
          ],
          [
            "8",
            "Rename to the pattern the portal expects.",
            "Free and reversible, so do it at the end and keep intermediate files clearly labelled.",
          ],
          [
            "9",
            "Reopen the finished file and read it.",
            "The only step that catches sideways pages, a missing page, and small print that has gone unreadable.",
          ],
        ],
        caption:
          "Steps 5 and 6 are the pair people reverse, and reversing them produces the blocky passport photo everyone recognises.",
      },
    },
    {
      heading: "Why the wrong order costs you quality",
      body: [
        "Take the common case: a form wants a 300 by 400 pixel photograph under 50 KB. Compress the full 12 megapixel camera file to 50 KB first and the encoder has to spread that budget across twelve million pixels. It does that by flattening each block toward a single colour, which is what those square smudges are. Then you resize, shrinking an image that is already ruined. The smudges get smaller. They do not go away.",
        "Do it the other way and the arithmetic changes completely. Resize to 300 by 400 first and you have 120,000 pixels, one percent of what you started with. Now 50 KB is a generous budget and the compressor barely has to work. Same tools, same final numbers, a sharp result instead of a mush.",
        "The same logic applies at step 7. A tool that builds a PDF from images embeds each one as it arrives, so ten photos of 3 MB each produce a PDF of roughly 30 MB. Compressing that PDF afterwards will not save you, because a structural PDF compressor does not re-encode images. Work backwards: if eight pages must fit in 5 MB, each image gets about 550 KB.",
      ],
      callout: {
        tone: "info",
        text: "When one PDF has to hold several scanned pages under a cap, divide the cap by the page count before compressing anything and take ten percent off for overhead. Hitting that target on each image first is the only approach that reliably lands under the limit, because nothing you do to the assembled PDF shrinks the pictures inside it.",
      },
    },
    {
      heading: "Filenames the portal never told you about",
      body: [
        "A surprising share of silent failures are filename problems. The upload control is often an old component sitting in front of an even older backend, and the backend has opinions it never expresses. Some rules come from the browser, some from the server, and some from a scanner in between that drops anything it dislikes.",
        "The safe form is boring: letters, digits, hyphens and underscores, no spaces, a lowercase extension, under about forty characters. If the instructions show an example such as SURNAME_FirstName_Passport.pdf, copy that shape exactly, including the capitalisation and the position of each part. Systems that build a case reference out of the filename reject anything they cannot parse, and never say so.",
        "Spaces are the worst offender because they look harmless. So do ampersands, hash marks, plus signs and accented characters, which all mean something specific in a URL and can be mangled on the way to the server. A file called Passport & Visa (final).pdf is asking for trouble in three places at once.",
      ],
    },
    {
      heading: "When it rejects your file and says nothing",
      body: [
        "This is the situation that costs people an afternoon: the file meets every stated requirement and the portal still refuses it. Work down this list rather than re-exporting at random. It is ordered roughly by how often each turns out to be the cause.",
      ],
      bullets: [
        "Extension case and spelling. A checker written against a list of jpg, png, pdf will reject IMG_4021.JPG, and sometimes scan.jpeg. Rename to lowercase, and if the list says jpg, make it jpg.",
        "The extension does not match the contents. Renaming a HEIC file from an iPhone to photo.jpg does not convert it, and anything that reads the file header catches that immediately.",
        "The PDF is encrypted. Bank statements and payslips are often issued password protected, and the protection stays in the file after you have typed the password to read it.",
        "Units. A limit of 1 MB usually means 1,000,000 bytes, while your file manager calls 1,048,576 bytes 1.0 MB. Aim ten percent under any stated cap.",
        "The colour space. A JPEG saved as CMYK by a design tool, or a PNG with an odd bit depth or an embedded profile, opens fine on your machine and fails on a server running an older image library. Save as plain 8-bit RGB, and if a validator only takes baseline JPEG, turn progressive off.",
        "PDF version or flavour. A few systems reject anything above PDF 1.4, and some public sector portals require PDF/A. Neither is usually mentioned on the upload page.",
        "Dimensions rather than bytes. A photo can sit under the size cap and still be refused for being 4000 pixels wide, or for missing the required aspect ratio.",
        "The upload never completed. Long sessions time out, and some portals encode the file into the page before sending, which inflates it by about a third and can push it past a server-side limit.",
      ],
      callout: {
        tone: "warning",
        text: "If a PDF was issued to you with a password, remove the protection before doing anything else. Most PDF tools, browser-based ones included, cannot open an encrypted file at all, and they fail with an error that never mentions a password. It is the most common reason a bank statement will not upload.",
      },
    },
    {
      heading: "Keep an untouched master copy",
      body: [
        "Every step here is destructive, and applications delight in overwriting the original. Before you start, put the raw scans and photographs in a folder called 01-originals and only ever copy out of it. Work on duplicates elsewhere, and keep finished uploads in a third folder.",
        "The reason is practical rather than tidy-mindedness. Requirements change between intakes, a second institution wants the same documents at different dimensions, and something will be rejected and need redoing. If your only copy of the degree certificate has already been squeezed to 40 KB at 300 pixels, producing a 200 KB version means going back to the paper. Always re-derive from the original, because the artefacts of a first compression pass become permanent features that the second pass has to encode.",
      ],
    },
    {
      heading: "Where you upload matters as much as what",
      body: [
        "The documents here are the exact set an identity thief would want: passport page, driving licence, proof of address, bank statement, birth certificate, signature. Worth a moment of thought before dropping them onto the first converter site that ranks for the query.",
        "A conventional online converter uploads your file to a server, processes it there, and offers a download. Whatever the privacy page says, your passport scan sat on somebody else's disk, possibly in a queue, possibly in a backup, and you cannot check. Retention policies are commitments rather than mechanisms, and a free tool with no obvious business model deserves the question of how it gets paid.",
        "A tool that runs in the browser is a different arrangement. The JavaScript is downloaded to your machine, the file is read from disk into the tab, processed in memory, and written back to your downloads folder. Nothing leaves the device. You can check that yourself: turn off your network connection and run the tool again. Anything that still works was never sending your document anywhere.",
      ],
    },
  ],
  relatedTools: [
    {
      label: "Document Photo Maker",
      href: "/image-tools/document-photo",
      description:
        "Crop to a required document shape and produce the file at exact pixel dimensions, which is steps 3 and 5 in one pass.",
    },
    {
      label: "Compress Image to Size",
      href: "/image-tools/compress-to-size",
      description:
        "Hit a stated byte cap once the image is already the right dimensions. Set the target ten percent under the limit.",
    },
    {
      label: "Image to PDF",
      href: "/pdf-tools/image-to-pdf",
      description:
        "Combine the finished images into one document, in the order the checklist lists them.",
    },
    {
      label: "Merge PDF",
      href: "/pdf-tools/merge-pdf",
      description:
        "Join separate PDFs into the single file a portal asks for, without reordering pages by hand afterwards.",
    },
    {
      label: "Split PDF",
      href: "/pdf-tools/split-pdf",
      description:
        "Send the four pages that were requested rather than the sixty page pack they arrived in.",
    },
    {
      label: "Compress PDF",
      href: "/pdf-tools/compress-pdf",
      description:
        "A structural rebuild for a document that is already assembled. Useful on text-heavy files, close to useless on scans.",
    },
    {
      label: "OCR",
      href: "/image-tools/ocr",
      description:
        "Extract the text from a scan when the form asks you to type the details in as well as attach the document.",
    },
  ],
  relatedGuides: [
    "compress-photo-to-20kb",
    "document-photo-sizes",
    "pdf-compression-explained",
  ],
  faqs: [
    {
      question: "Why does the portal reject my file without giving a reason?",
      answer:
        "Usually because the check that failed runs on the server and the error message was never written. Work through the causes in order: extension case, a file whose contents do not match its extension, an encrypted PDF, a size cap measured in different units from your file manager, an unusual colour space, and pixel dimensions rather than bytes. One of those accounts for most silent rejections.",
    },
    {
      question: "Should I resize before or after compressing?",
      answer:
        "Resize first, always. Compressing at full resolution forces the encoder to spread its byte budget across millions of pixels, which is what produces blocky, smudged output. Resizing to the required dimensions first cuts the pixel count by ninety percent or more, and the same byte limit then buys a sharp image.",
    },
    {
      question: "How do I get several scanned pages into one PDF under 2 MB?",
      answer:
        "Compress the images first, not the finished PDF. Divide the cap by the number of pages, take about ten percent off for document overhead, and compress each image to that target before assembling. Tools that build a PDF from images embed them at the size they arrive at, and a structural PDF compressor will not re-encode them afterwards.",
    },
    {
      question: "Why will my bank statement not upload?",
      answer:
        "Because it is almost certainly password protected. Banks issue statements encrypted with a password based on your details, and the protection stays in the file after you have typed it in to read the document. Portals and PDF tools cannot open an encrypted file. Open it in a reader, print or export it to a new unprotected PDF, and upload that.",
    },
    {
      question: "Is it safe to use an online converter for a passport scan?",
      answer:
        "A conventional converter uploads the file to a server, which means your identity document sat on hardware you cannot inspect, under a retention policy you cannot verify. A browser-based tool processes the file on your own machine and sends nothing. You can confirm which kind you have by opening the network tab in developer tools, or by disconnecting from the internet and seeing whether it still works.",
    },
  ],
};
