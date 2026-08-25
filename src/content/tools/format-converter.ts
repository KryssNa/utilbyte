import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const formatConverterArticle: ToolArticleContent = {
  intro: [
    "Most format conversions happen because something refused a file. An upload form only takes JPG. A colleague cannot open the WebP you sent. A print shop wants PNG. A build pipeline chokes on a BMP that came out of an old scanner.",
    "The conversion itself is not complicated: the image is decoded into pixels, then re-encoded into the format you asked for. What is worth understanding is what that round trip does and does not preserve, because a conversion can quietly lose something you needed, and no conversion ever puts back something that was already gone.",
    "Everything here runs in the browser. Your file is decoded and re-encoded on your own machine, which also means the formats available depend on what your browser can encode.",
  ],
  sections: [
    {
      heading: "What a conversion actually preserves",
      body: [
        "Pixels survive. Almost everything else is negotiable.",
        "Transparency is the one that catches people. PNG, WebP and GIF have an alpha channel; JPEG and BMP do not. Convert a logo with a transparent background to JPEG and the transparent areas become solid - white here, because that is what gets painted underneath before encoding. There is no way to recover the alpha channel afterwards.",
        "Colour profiles and metadata generally do not survive a canvas round trip. EXIF data - camera model, exposure, GPS coordinates, orientation - is read to decode the image correctly and then not written back out. That is a privacy improvement more often than it is a loss, but if you needed the capture date embedded in the file, note that it will be gone.",
        "Animation does not survive either. An animated GIF converted here becomes a single still frame.",
      ],
      bullets: [
        "Transparency: kept by PNG, WebP and GIF. Lost by JPEG and BMP.",
        "EXIF and colour profiles: not carried through the re-encode.",
        "Animation: flattened to one frame.",
        "Pixel dimensions: unchanged - this tool converts, it does not resize.",
      ],
    },
    {
      heading: "Lossy to lossless does not restore anything",
      body: [
        "This is the single most common misunderstanding about format conversion. Converting a JPEG to PNG produces a lossless file, and people reasonably assume that means better quality. It does not. It means the compression artefacts that were already baked into the JPEG are now preserved perfectly and forever.",
        "The pixels handed to the PNG encoder are the pixels the JPEG decoder produced, blocking and colour fringing included. You end up with a considerably larger file containing exactly the same visual information. The only thing you have gained is that further edits will not add more loss.",
        "Which is a real reason to do it, incidentally. If you are about to make several rounds of edits to a photo, converting to PNG or lossless WebP first stops each save from compounding the damage. Convert back to JPEG once at the end.",
        "The reverse direction is the one that costs you. JPEG to JPEG, or PNG to JPEG, discards detail permanently. Do it deliberately, at the end of your workflow, not casually in the middle.",
      ],
    },
    {
      heading: "Picking the destination format",
      body: [
        "PNG for anything with sharp edges, flat colour or transparency: screenshots, logos, diagrams, UI mockups. It is lossless and it is a bad choice for photographs, where it will produce files several times larger than JPEG for no visible benefit.",
        "JPEG for photographs, and for any upload form that inspects the file extension. It is the format with genuinely universal support and it will still be accepted everywhere in a decade.",
        "WebP when you control the destination. It handles both lossy and lossless, supports transparency, and typically reaches a given file size at better quality than JPEG. Browser support is broad now. Form and desktop-software support is not, which is the whole reason to be careful with it.",
        "GIF is worth choosing only for legacy compatibility. It is limited to 256 colours per frame, so photographs come out visibly banded, and file sizes are poor. If you want animation, a short muted MP4 or an animated WebP beats it on every axis.",
        "BMP is uncompressed. Files are enormous. The only good reason to produce one is that some specific old piece of software demands it.",
        "The SVG option wraps the raster image inside an SVG document. It is useful when a system insists on the .svg extension, but it is a container, not a tracing - the image inside is still made of the same pixels and will not scale cleanly.",
      ],
    },
    {
      heading: "When the browser is the limiting factor",
      body: [
        "Because the work happens locally, the set of formats that can be decoded depends on your browser rather than on this site.",
        "Common inputs - JPEG, PNG, GIF, WebP, BMP - are decoded everywhere. AVIF is decoded by current versions of most browsers. HEIC, the format an iPhone produces by default, is the awkward one: Safari decodes it, most other browsers historically do not, so a .heic file may simply fail to load outside Safari. The most reliable fix is on the phone - Settings, Camera, Formats, Most Compatible, which makes the camera capture JPEG instead.",
        "Encoding has its own limits. JPEG, PNG and WebP encoding is well supported. Some browsers will silently fall back to PNG when asked for a format they cannot encode, which shows up as an unexpectedly large output file. If the size looks wrong, that is usually why.",
      ],
    },
  ],
  example: {
    title: "A transparent logo converted to JPEG for a form that would not take PNG",
    input: "logo-mark.png\n1024 x 1024 px, 148 KB\nTransparent background, sharp edges\nTarget: JPEG at quality 90",
    output: "logo-mark.jpg\n1024 x 1024 px, 71 KB\nTransparent areas filled white\nVisible ringing along the high-contrast edges of the mark",
    note: "Two costs, both predictable. The transparency became a white rectangle, which is fine on a white page and wrong on any other background - and it cannot be undone by converting back. And JPEG handles hard edges badly: the halo around the logo outline is the encoder spending too few bits on a very high-frequency transition. For a mark like this, WebP would have kept the transparency and encoded the edges cleanly, if the form had accepted it.",
  },
  limitations: [
    "Conversion does not resize. Pixel dimensions come out exactly as they went in - use the resizer if you also need different dimensions.",
    "Transparency is lost when converting to JPEG or BMP, and filled with white. There is no way to recover it afterwards.",
    "EXIF metadata and colour profiles are not carried through the re-encode.",
    "Animated GIFs are flattened to a single frame.",
    "Input formats depend on what your browser can decode. HEIC in particular will usually only load in Safari.",
    "The SVG output is a wrapper around the raster image, not a vector trace. It will not scale cleanly.",
    "One image at a time. There is no batch conversion.",
  ],
};
