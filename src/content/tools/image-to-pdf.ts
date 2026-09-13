import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const imageToPdfArticle: ToolArticleContent = {
  intro: [
    "A university portal, a visa centre or an insurance claim asks you to upload one PDF. What you have is nine photos in a camera roll, in whatever order they happened to be taken. There is no obvious way to get from one to the other without installing something, and most sites that offer to do it want your documents on their server first.",
    "This tool builds the PDF in the browser tab you already have open. You add the images, drag them into the order you want, pick a page size, and it writes a document where each image becomes one page. The work is done by pdf-lib running as JavaScript on your own machine, so the files are read from disk into memory and never sent anywhere. You can add up to 50 images at a time, and each file can be up to 50 MB.",
    "Most of the outcome is decided by the settings rather than by the conversion itself. Page size, orientation, margin and fit mode are what separate a document that looks like a scanned pack from one that looks like holiday photos pasted into a report.",
  ],
  sections: [
    {
      heading: "Why the form wants one file instead of nine",
      body: [
        "Loose images travel badly. Attach eight JPEGs to an email and the recipient sees them sorted by filename, which is almost never the order you meant. Upload them to a portal and each one tends to eat a separate attachment slot. Plenty of systems resize images, strip them, or reject anything that is not a PDF.",
        "A PDF fixes the sequence. Page 3 is page 3 for everyone who opens it, on any device, and it prints in that order without anyone thinking about it. It also gives the reviewer a page count, which is what they use to check that a six page tenancy agreement really is six pages. That is why the instruction is usually worded as a single document. Send a folder of images instead and you will often be asked again.",
      ],
    },
    {
      heading: "Page size, orientation, margins and fit mode",
      body: [
        "A4 is the default and is correct almost everywhere outside North America. Letter is slightly wider and shorter, and is what US institutions expect. A3 suits posters and plans. Custom takes a width and height in millimetres, anywhere from 50 to 1000, for things that are not paper shaped at all. Orientation simply swaps those two numbers over.",
        "The margin slider runs from 0 to 50 mm in 5 mm steps and applies to all four edges. Zero suits photos that should run right to the edge. Ten to fifteen suits anything that might be printed, because desktop printers cannot reach the paper edge and will clip whatever sits in that band. The fit mode then decides how each image is placed inside what is left:",
      ],
      bullets: [
        "Fit keeps the proportions and shrinks the image until all of it sits inside the margins. Nothing is lost, but blank space appears above and below, or at the sides, when the image shape does not match the page. This is the safe choice for documents.",
        "Fill keeps the proportions and scales up until the page is covered, so the overhanging edges fall off the page. Fine for photographs, risky for anything with text near the border.",
        "Stretch ignores the proportions and forces the image to the exact page area. Circles become ovals and faces get wider. Only use it when the image already matches the page ratio.",
      ],
    },
    {
      heading: "A phone photo is not a scan",
      body: [
        "A flatbed scanner hands you an evenly lit, square-on, already cropped page. A phone hands you the page plus a bit of desk, a shadow down one side cast by your own head, a slight lean because the camera was not quite overhead, and a file several times larger than it needs to be.",
        "The size is the part that catches people out. Images are embedded at their original resolution and are not resampled or recompressed. A 12 megapixel photo that is 3.5 MB on your phone is still about 3.5 MB inside the PDF, so ten of them produce a PDF near 35 MB. A lot of upload forms stop at 5 or 10 MB. If you are anywhere near a limit, shrink the images before you build the document.",
        "Two habits fix most of the rest. Lay the page flat near a window rather than under a ceiling light, and stand so your shadow falls away from the paper. Then crop each photo down to the page edges first, because this tool centres whatever you give it and will not detect the paper or trim the background for you.",
      ],
    },
    {
      heading: "Putting an application pack together",
      body: [
        "The most common job here is an application that wants ID, certificates and proof of address as one file. Add everything, then use the numbered thumbnails to sort it. Drag a thumbnail to move it; the number in its corner is the page it will become. Match the order to the order on the checklist, because the person opening it is working down that list.",
        "A landscape certificate inside a portrait pack is the usual snag. On Fit it lands in the middle of a portrait page with white space above and below, which reads perfectly well. If it comes out too small to read, rotate the image to portrait before you add it, or build that one certificate as a separate landscape PDF where the form allows more than one file.",
        "Open the result before you submit it. Check the page count, check nothing is sideways, and zoom in to confirm the small print is still legible.",
      ],
    },
  ],
  example: {
    title: "Four documents into one A4 pack",
    input: `passport-photo.jpg
  2.4 MB   3024 x 4032

degree-certificate.jpg
  3.1 MB   4032 x 3024

transcript-p1.jpg
  2.8 MB   3024 x 4032

transcript-p2.jpg
  2.7 MB   3024 x 4032

Page size:    A4
Orientation:  Portrait
Fit mode:     Fit
Margin:       10 mm`,
    output: `images-to-pdf-4-pages.pdf
11.2 MB

p1  passport photo, centred,
    10 mm white on all sides
p2  certificate, a landscape
    image on a portrait page,
    band of white above and
    below it
p3  transcript page 1
p4  transcript page 2`,
    note: "The four photos add up to 11.0 MB and the finished PDF is 11.2 MB, because nothing is recompressed on the way in. If the portal caps uploads at 10 MB this pack fails, and no amount of changing the page settings will save it. Compress the four images first, then build the PDF.",
  },
  limitations: [
    "It does not compress anything. The PDF ends up roughly the size of your images added together, so a pack of phone photos gets large quickly. There is no quality slider and no downscaling step.",
    "The pages are pictures, not text. You cannot select, copy or search a word in the finished PDF, and a screen reader gets nothing from it. If you need the words out of a document, run it through OCR instead.",
    "One page size and one orientation apply to the whole document. You cannot mix a portrait page and a landscape page in a single run.",
    "There is no rotate control, and the rotation flag some cameras write into a JPEG is not applied when the image is embedded. A photo that looks upright in the preview can come out on its side, so rotate and re-save it in your photo app first.",
    "HEIC and HEIF files from an iPhone usually will not decode in a desktop browser at all. Convert them to JPEG or PNG before adding them. There is also no password protection, no page numbering and no way to edit document metadata.",
  ],
};
