import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const webpToPngArticle: ToolArticleContent = {
  intro: [
    "You saved an image from a website and it came down as .webp. Now the design tool will not import it, or the CMS rejects it, or a colleague on an older machine cannot open it.",
    "This converts WebP to PNG, which is lossless, keeps transparency, and is accepted by essentially everything.",
    "It is worth a moment on whether PNG is the right destination, because for a photograph it usually is not.",
  ],
  sections: [
    {
      heading: "Why everything is WebP now",
      body: [
        "WebP is Google's image format and it does both lossy and lossless compression, with an alpha channel and animation support. At comparable quality it is typically 25 to 35 percent smaller than JPEG.",
        "That saving is why it took over. Page weight is a ranking factor and a conversion factor, so sites serve WebP to browsers that accept it, and modern browsers all do. Content management systems increasingly convert uploads automatically, which is why an image you saved as JPEG can come back to you as WebP.",
        "The gap is everything that is not a browser. Plenty of desktop software, older operating systems, print workflows and upload forms still reject .webp outright - sometimes by inspecting the extension rather than the file, which means renaming it will not help either.",
      ],
    },
    {
      heading: "PNG is lossless, and that is not always what you want",
      body: [
        "Converting to PNG guarantees you lose nothing further. Every pixel the WebP decoder produced is preserved exactly, transparency included.",
        "The cost is size, and for photographs the cost is large. PNG compresses losslessly, which works beautifully on flat colour and sharp edges and very badly on the continuous tonal variation in a photograph. A 400 KB WebP photo can become a 3 MB PNG for no visible benefit whatsoever - the artefacts baked in by the original lossy WebP encode are still there, now stored perfectly.",
        "So the rule is about content, not preference. Screenshots, logos, icons, diagrams, anything with flat areas or text or transparency: PNG. Photographs: JPG, unless you need the transparency.",
        "The one genuinely good reason to take a photograph to PNG is that you are about to edit it repeatedly. Each lossy save costs a little quality, so working in a lossless format and exporting to JPEG once at the end is the right workflow.",
      ],
      bullets: [
        "Screenshots, logos, icons, diagrams: PNG is correct.",
        "Photographs: JPG will be a fraction of the size and look identical.",
        "Anything with transparency: PNG or WebP - JPG cannot carry it.",
        "About to edit repeatedly: PNG, then export to JPEG once at the end.",
      ],
    },
    {
      heading: "The animation trap",
      body: [
        "WebP supports animation, and PNG in practice does not. APNG exists but support is inconsistent and most tools that say PNG mean the static kind.",
        "So converting an animated WebP here gives you a single still frame - the first one. No error, no warning from the format itself, just one picture where you expected movement.",
        "If you need to keep the animation, GIF is the compatible option and it will be considerably larger and limited to 256 colours per frame. A short muted MP4 is better on every axis except where the destination will only accept an image.",
      ],
    },
    {
      heading: "Lossless in does not mean lossless throughout",
      body: [
        "Worth being precise, because it catches people out.",
        "Most WebP images on the web are lossy WebP - the format's equivalent of JPEG. Converting one to PNG preserves what you have perfectly, but what you have already went through a lossy encode. Nothing recovers that detail. You get a large file containing exactly the same visual information.",
        "This is the same reasoning as converting a JPEG to PNG, and it produces the same disappointment when someone expects the conversion to improve the image. It cannot. A conversion can preserve, and it can degrade. It never restores.",
      ],
    },
  ],
  example: {
    title: "The same two images, converted the same way",
    input: "A) product-photo.webp   1200 x 800, 340 KB  (lossy WebP, photograph)\nB) app-screenshot.webp  1440 x 900, 180 KB  (lossless WebP, UI capture)",
    output: "A) -> PNG  1200 x 800, 2.9 MB\n   8.5x larger, visually identical, artefacts preserved perfectly\n   Better answer: convert to JPG at 90 -> about 210 KB\n\nB) -> PNG  1440 x 900, 240 KB\n   Modest increase, exactly right for flat UI colour",
    note: "Same operation, two completely different outcomes. The photograph became almost nine times larger for no benefit, because PNG has nothing useful to do with continuous tone. The screenshot barely grew, because flat colour is what lossless compression is good at. Look at what is in the picture before choosing the target format.",
  },
  limitations: [
    "Animated WebP converts to a single still frame. PNG has no widely supported animation, so the movement is lost.",
    "PNG is lossless, so it preserves any compression artefacts already present in a lossy WebP. It cannot improve the image.",
    "Photographs become dramatically larger as PNG. Use JPG unless you need transparency or are about to edit repeatedly.",
    "Metadata and colour profiles are not carried through the canvas re-encode.",
    "One image at a time, and very large files are limited by browser memory.",
  ],
};
