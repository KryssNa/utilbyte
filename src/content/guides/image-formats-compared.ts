import type { Guide } from "@/content/guides/types";

export const imageFormatsComparedGuide: Guide = {
  slug: "image-formats-compared",
  title: "Image formats compared: JPEG, PNG, WebP, AVIF, GIF, SVG and HEIC",
  metaTitle: "Image Formats Compared: Which One to Use",
  metaDescription:
    "What each image format was actually built for, how they compare on transparency, animation and file size, and how to choose one from where the file is going rather than by guessing.",
  keywords: [
    "image formats compared",
    "jpeg vs png",
    "webp vs jpeg",
    "avif vs webp",
    "svg vs png",
    "gif alternatives",
    "which image format to use",
    "image format comparison table",
  ],
  published: "2026-08-24",
  summary:
    "Seven formats cover nearly every image you will ever save or be sent, and each was designed against a different problem. This guide sets them side by side on the properties that actually decide things, then works through what each one is for, where it fails, and how to choose based on who opens the file next.",
  readingMinutes: 7,
  intro: [
    "Seven formats cover almost every image most people deal with. They are not really competitors and there is no winner at the top of the list. Each was designed against a different problem, and format choice feels like guesswork mainly because the export dialog offers all of them at once with no clue which problem you have.",
    "Two questions settle it nearly every time. Is the image a photograph, or flat colour with hard edges. And who opens the file next - a browser on a site you control, or an upload form written a decade ago.",
    "The short version: JPEG for photographs going to strangers, PNG for screenshots and flat graphics, WebP or AVIF for a site you control, SVG for logos and icons, GIF only when something old insists. The rest is why, and where those defaults break.",
  ],
  sections: [
    {
      heading: "The seven side by side",
      body: [
        "The table covers structural facts rather than opinions. These are the properties that hold whatever settings you choose, and they decide whether a format is eligible for a job at all. No quality slider gives JPEG an alpha channel.",
        "The size column compares each format against a JPEG of the same photograph at matching visual quality, which is a slippery comparison. Published figures move around depending on the encoder, the settings and the quality metric somebody optimised for, so read it as a direction of travel.",
      ],
      table: {
        columns: [
          "Format",
          "Lossy / lossless",
          "Transparency",
          "Animation",
          "Typical size vs JPEG",
          "Browser support",
          "Best use",
        ],
        rows: [
          [
            "JPEG",
            "Lossy only",
            "None",
            "No",
            "Baseline",
            "Universal",
            "Photographs going anywhere",
          ],
          [
            "PNG",
            "Lossless only",
            "Full 8-bit alpha",
            "Only as APNG",
            "5 to 20 times larger on photos",
            "Universal",
            "Screenshots, diagrams, flat graphics",
          ],
          [
            "WebP",
            "Both modes",
            "Yes, in both modes",
            "Yes",
            "About 25 to 35 percent smaller",
            "All current browsers",
            "Images on a site you control",
          ],
          [
            "AVIF",
            "Both modes",
            "Yes, plus 10 and 12-bit colour",
            "Yes",
            "Smaller again, most at low bitrates",
            "All current browsers, newest to arrive",
            "Assets encoded once and served often",
          ],
          [
            "GIF",
            "Lossless within 256 colours",
            "1-bit, on or off only",
            "Yes",
            "Much larger for what it shows",
            "Universal",
            "Legacy compatibility, little else",
          ],
          [
            "SVG",
            "Neither, it is not pixels",
            "Yes",
            "Yes, via CSS or SMIL",
            "Tiny for flat shapes, hopeless for photos",
            "Universal",
            "Logos, icons, charts, line art",
          ],
          [
            "HEIC",
            "Lossy in practice",
            "Yes",
            "Yes, as image sequences",
            "Roughly half",
            "Safari yes, Chrome and Firefox no",
            "iPhone camera storage, convert to send",
          ],
        ],
        caption:
          "Browser support means what a current browser will draw on screen. Whether your desktop viewer, a phone gallery app or an upload validator accepts the same file is a separate and usually narrower question.",
      },
    },
    {
      heading: "JPEG and PNG, the pair that always works",
      body: [
        "JPEG is from the early nineties and lossy only. It splits the picture into eight by eight blocks, describes each block as a set of frequency coefficients, then rounds those off against a table scaled by the quality setting. What goes missing is the finest variation inside each block, the part your eye checks last on a photograph and notices immediately on text.",
        "It has no alpha channel, and that is the format rather than the encoder. Save a logo with a transparent background as JPEG and that area gets filled in, usually with black or white, permanently. Every JPEG save also starts from scratch, and the new encoder cannot tell the old one's block edges and ringing apart from real detail, so it spends bytes preserving them and adds its own on top. A few rounds of that and there are visible blocks in the sky.",
        "PNG is the opposite. It is lossless, so what comes out is bit for bit what went in, and it compresses by finding repetition - a run of identical pixels written down in a handful of bytes, a row nearly the same as the one above stored as the difference. Screenshots, charts and line art are made of exactly that, which is why a screenshot is often smaller as PNG than as a quality-80 JPEG.",
        "Photographs contain no exact repetition, so PNG ends up storing nearly all of it. A twelve megapixel photo can run past 20 MB, ten to thirty times a good JPEG of the same shot. PNG also has a palette mode capped at 256 colours, sometimes called PNG-8, which on icons and flat graphics often halves the file at no visible cost.",
      ],
      callout: {
        tone: "warning",
        text: "Re-saving a damaged JPEG at high quality does not repair it. You get a larger file that faithfully describes the previous encoder's mistakes. Keep one master and export every copy from that, never from your last export.",
      },
    },
    {
      heading: "WebP and AVIF, smaller with conditions attached",
      body: [
        "WebP does both jobs. It has a lossy mode derived from video keyframe coding and a proper lossless mode, it carries a real alpha channel in both, and it animates. On a photograph at comparable visual quality it lands roughly 25 to 35 percent below JPEG, and every current browser renders it.",
        "The wall it hits is not the browser but the upload form. Plenty of portals still validate by checking the extension against a list somebody wrote before 2015, so a WebP gets rejected even though the same site would display it fine. Desktop software is patchy the same way. WebP is a good format for images you serve and a poor one for images you hand to a stranger.",
        "AVIF comes out of AV1 video coding and is smaller again, with the gap widest at low bitrates and on gradients and flat colour, narrowest on noisy detailed photographs. It also handles 10 and 12-bit colour, so skies band less. Current browsers are fine with it. Older software, desktop editors and upload validators are thinner on it than on WebP.",
        "The cost is encoding time. AVIF encoding is heavy, and one large image can take seconds where JPEG takes a fraction of one - noticeable in a batch, very noticeable in a tab on a phone. Decoding is fast, so it suits assets you encode once and serve a million times.",
      ],
    },
    {
      heading: "GIF and SVG are not in the same race",
      body: [
        "GIF is from 1987 and every property it has follows from that. A maximum of 256 colours per frame, so photographs come out dithered and blotchy. One bit of transparency, meaning a pixel is either fully opaque or fully clear, which is why old cut-out GIF logos show jagged fringed edges against any background but the one they were made on.",
        "For animation, the only reason anyone still reaches for it, animated WebP compresses far better and keeps full colour. Past a couple of seconds a muted looping MP4 or WebM is smaller again, which is what most sites now serve where a GIF used to sit. Use GIF when the other end genuinely cannot take anything else.",
        "SVG is a different kind of object. It is not a grid of pixels but an XML document describing shapes: this path, that fill, this stroke width. There is no resolution in it, so it is sharp at sixteen pixels and sharp on a billboard, and a logo is often two or three kilobytes. Text inside stays real text, selectable and searchable.",
        "It is the wrong answer for photographs, and the failure is total rather than a matter of degree. There is no way to describe a photograph as a few hundred shapes. Tools offering to convert a photo to SVG either trace it into something resembling a screen print, or quietly embed the original JPEG inside an SVG wrapper.",
      ],
      callout: {
        tone: "warning",
        text: "An SVG is a document, not just a picture, and it can contain script. A browser will not run that script when the file is shown through an img tag, but it will when the SVG is opened directly or pasted inline into a page. Sanitise any SVG uploaded by users.",
      },
    },
    {
      heading: "HEIC is in the table for a different reason",
      body: [
        "HEIC is what an iPhone camera has produced by default since 2017. It stores a picture in roughly half the space of a JPEG at comparable quality, holds ten bits per colour channel, supports transparency, and can carry a depth map and a burst of frames in one file.",
        "It also fails to open on a large share of the machines you might send it to. Safari renders it, Chrome and Firefox do not, and Windows needs a codec that is not always installed. So HEIC is not a format you choose. It is one you are handed, and what to do about it has its own guide, linked below.",
      ],
    },
    {
      heading: "Picking by where the file is going",
      body: [
        "None of the decisions below are really about the image. They are about the destination. The same photograph is correctly saved in three different formats depending on who opens it next.",
      ],
      bullets: [
        "A website you control: AVIF first, WebP second, JPEG as the fallback, served through a picture element. If you can publish only one file, make it WebP.",
        "An email attachment: JPEG for photographs, PNG for screenshots. Mail clients are old, varied and often corporate, and that is the wrong place to be adventurous.",
        "A government form or job portal: JPEG, unless the instructions name something else. These validators are the oldest software in the chain and most only check the extension.",
        "A logo, icon or diagram you have vector source for: SVG, with a PNG export for the places that will not take it.",
        "A screenshot for documentation or a bug report: PNG, every time.",
        "Your own archive: keep the original camera file untouched and convert copies, never the master.",
      ],
      callout: {
        tone: "warning",
        text: "Renaming a file does not convert it. Changing photo.webp to photo.jpg leaves WebP data inside a misleadingly named file. Some systems reject it, others accept it and fail to display it months later.",
      },
    },
  ],
  relatedTools: [
    {
      label: "Format Converter",
      href: "/image-tools/format-converter",
      description:
        "Convert properly between formats in the browser, rather than renaming the file and hoping the next system does not check.",
    },
    {
      label: "Image Compressor",
      href: "/image-tools/compress-image",
      description:
        "A quality slider with a live size estimate, so you can see what a lossy encode costs on your own picture instead of somebody else's test image.",
    },
    {
      label: "Compress to Size",
      href: "/image-tools/compress-to-size",
      description:
        "When the destination sets a byte limit, state it and let the tool search for the highest quality that fits underneath.",
    },
    {
      label: "Resize Image",
      href: "/image-tools/resize-image",
      description:
        "Pixel dimensions move file size more than format choice does. Settle them before arguing about which format to save as.",
    },
  ],
  relatedGuides: ["heic-explained", "compress-photo-to-20kb"],
  faqs: [
    {
      question: "Which image format should I use by default?",
      answer:
        "JPEG for photographs and PNG for anything with flat colour and hard edges. Those two open everywhere and will never be the reason something fails. Move to WebP or AVIF when you control the page the image appears on and the saving is worth the compatibility risk.",
    },
    {
      question: "Is WebP better than JPEG?",
      answer:
        "Smaller at the same visual quality, commonly by 25 to 35 percent on photographs, and it supports transparency and animation, which JPEG does not. Whether that makes it better depends on where the file is going. For a site you control it is a clear win. For an upload form, or an email to someone with unknown software, JPEG is still the format that reliably works.",
    },
    {
      question: "Why is my PNG file so large?",
      answer:
        "Almost certainly because it contains a photograph. PNG compresses by finding repetition and photographs have essentially none, so nearly everything gets stored. A twelve megapixel photo as PNG can exceed 20 MB while a good JPEG of the same shot sits well under 2 MB with no visible difference. If the image is a graphic rather than a photo, try palette mode, which caps the colours at 256 and often cuts the file substantially.",
    },
    {
      question: "Can I convert a photo to SVG?",
      answer:
        "Not in any way that helps. SVG describes shapes, and a photograph is not made of shapes. Converters either trace it down to a few flat colour regions, which looks like a screen print rather than a photo, or wrap the original JPEG inside an SVG file, which gives you a bigger file with none of the scalability that made SVG worth using.",
    },
    {
      question: "Is it safe to open an SVG file?",
      answer:
        "An SVG is an XML document and it can carry script inside it. Displayed through an img tag on a page, browsers do not execute that script. Opened directly as a file, or inlined into a page's markup, they do. Treat an SVG from an untrusted source the way you would treat an HTML file from the same source, and sanitise any SVG uploaded by users before serving it back.",
    },
  ],
};
