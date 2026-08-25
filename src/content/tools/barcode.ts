import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const barcodeArticle: ToolArticleContent = {
  intro: [
    "Barcodes look interchangeable and are not. Picking the wrong symbology is the single most common reason a generated barcode gets rejected by the scanner, the printer or the retailer it was made for.",
    "This generator supports seven of them - CODE128, CODE39, EAN-13, EAN-8, UPC, ITF-14 and MSI - and validates your input against the rules of whichever you choose, because most of them have rules about length and character set that are not optional.",
    "The short version: if you are labelling something for your own use, CODE128. If it is going on a retail shelf, you need a real allocated number and the format follows from that.",
  ],
  sections: [
    {
      heading: "Retail codes versus internal codes",
      body: [
        "This is the distinction that matters most and it is about ownership of the number, not about the picture.",
        "EAN-13, EAN-8 and UPC encode Global Trade Item Numbers. Those numbers are allocated - a company prefix is issued to you, and you assign product numbers underneath it. You cannot invent one. A made-up thirteen digit number will encode into a perfectly valid-looking barcode that collides with somebody else's product and gets your listing rejected. If you are selling through retail or a marketplace that checks, you need a real allocation first.",
        "CODE128 and CODE39 encode whatever you like. They are for internal use: asset tags, shelf locations, work orders, library books, event tickets. Nobody polices the content because the content only means something inside your own system.",
        "ITF-14 sits in between. It marks shipping cases rather than individual items, and it encodes the same GTIN with a packaging indicator on the front.",
      ],
      bullets: [
        "EAN-13 / UPC - retail products, requires an allocated GTIN.",
        "EAN-8 - the short retail form, for packaging too small for a full EAN-13.",
        "CODE128 - the default for anything internal. Dense, alphanumeric, variable length.",
        "CODE39 - older, less dense, wider. Still required by some legacy systems.",
        "ITF-14 - shipping cases and outer cartons.",
        "MSI - inventory and shelf labelling, mostly in warehouses.",
      ],
    },
    {
      heading: "Check digits, and why the tool refuses some input",
      body: [
        "The retail formats end in a check digit calculated from the preceding digits. It exists so a misread produces an error rather than the wrong product.",
        "This means an EAN-13 is not any thirteen digits. It is twelve digits plus one that must be arithmetically correct, and if you type a number where it is not, the generator tells you rather than producing a barcode that every scanner will reject. That refusal is the feature.",
        "The same applies to length. EAN-8 is exactly eight digits. UPC is twelve. ITF-14 is fourteen and, because of how it pairs digits, cannot be odd-length at all. CODE39 accepts a restricted character set - digits, upper case letters and a handful of symbols - and nothing else, which surprises people who try to encode lower case.",
        "CODE128 is the flexible one: variable length, the full ASCII range, and it switches between internal encoding modes automatically to keep numeric runs compact.",
      ],
    },
    {
      heading: "Printing: the quiet zone will get you",
      body: [
        "Barcodes fail in print for boring, repeatable reasons.",
        "The quiet zone is the clear space either side of the bars, and it is part of the symbol, not decoration. Scanners use it to find where the code starts. Crowding it with text or a box edge is probably the most common cause of a code that scans in software and fails on a handheld.",
        "Bar width is the other one. Every symbology has a minimum module width below which an inkjet or a thermal printer cannot hold the edges cleanly, and ink spread closes the gaps between bars. If a printed code scans intermittently, printing it larger fixes it far more often than anything else.",
        "Do not scale non-uniformly. Stretching a barcode horizontally to fill a space changes the ratio between bars and gaps, which is exactly what the decoder measures. Height can be trimmed - it exists so the scanner can find a clean scan line - but width and the relative bar widths cannot.",
      ],
    },
    {
      heading: "Barcode or QR code",
      body: [
        "They solve different problems and the choice is usually made for you.",
        "A linear barcode holds a short identifier and is read by dedicated hardware - the laser scanner at a till, the handheld in a warehouse. It is fast, it works at awkward angles, and it is what retail and logistics infrastructure expects.",
        "A QR code holds far more data, can be read by any phone camera, and survives damage. It is the right answer when the reader is a member of the public with a phone.",
        "If a system, a retailer or a courier has told you which one they want, that is the answer. If you are building something yourself, ask what will be doing the scanning.",
      ],
    },
  ],
  example: {
    title: "Why one number is accepted and another is not",
    input: "Format: EAN-13\nAttempt 1: 5901234123456\nAttempt 2: 5901234123457",
    output: "Attempt 1 -> rejected, check digit mismatch\n  first 12 digits: 590123412345\n  computed check digit: 7\n  supplied: 6\n\nAttempt 2 -> valid, encodes to 95 modules",
    note: "One digit apart, and only one of them exists as far as any scanner is concerned. The check digit is derived from the other twelve by a fixed weighting, so there is exactly one correct value. If the tool refuses your number, it is not being fussy - it is telling you the barcode you were about to print would have been rejected at the till.",
  },
  limitations: [
    "It generates a barcode from the number you supply. It cannot allocate a GTIN for you - retail numbers must come from a real allocation, and inventing one causes collisions.",
    "Validation covers length, character set and check digits. It cannot tell you whether the number is the right one for your product.",
    "No batch generation. One code at a time, so labelling a hundred SKUs is not practical here.",
    "The rendered output has no built-in print calibration. Verify size and quiet zone on your actual printer with your actual scanner before committing to a run.",
    "MSI and CODE39 are legacy formats included for compatibility with older systems. Use CODE128 for anything new.",
  ],
};
