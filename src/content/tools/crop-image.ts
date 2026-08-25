import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const cropImageArticle: ToolArticleContent = {
  intro: [
    "Cropping is the one edit that almost every photo needs and almost nobody plans for. You take the picture wide because you are not sure what matters yet, and then something downstream asks for a square, or a 16:9 banner, or just for the subject to actually be the subject.",
    "This page gives you a draggable crop box with resize handles, an optional aspect ratio lock, presets for the shapes people are usually asked for, and a choice of output format. The crop happens on a canvas in your browser, so the file never goes anywhere.",
    "What follows is the part that is less obvious than dragging a box: what cropping does to file size, why the order of crop and resize matters, and which output format to pick on the way out.",
  ],
  sections: [
    {
      heading: "Crop first, resize second - always in that order",
      body: [
        "These two operations get confused constantly and they do different jobs. Cropping decides what is inside the frame. Resizing decides how many pixels that frame is made of.",
        "When a form or a platform gives you a target like 400 by 400, it is stating both a shape and a size. The shape is the part that cropping handles. If you skip the crop and resize a 4:3 photo straight into a square, the image gets stretched and a face gets visibly wider - a mistake that is instantly recognisable and surprisingly common.",
        "So: lock the aspect ratio to the target shape, crop to include what you want, then resize the result to the exact pixel count. Doing it the other way round means you resize, discover the shape is wrong, crop, and end up with fewer pixels than you needed.",
        "The presets here set the aspect ratio for you. They are named for common social and web slots rather than exact rules, and platforms change their specs, so treat them as convenient starting shapes rather than authority.",
      ],
      bullets: [
        "Profile 400x400 and Post 1080x1080 are square (1:1).",
        "Cover 1200x630 is close to 1.91:1, the usual link-preview shape.",
        "Story 1080x1920 is vertical 9:16.",
        "Banner 1500x500 is a wide 3:1 strip.",
        "Thumbnail 1280x720 is 16:9.",
      ],
    },
    {
      heading: "Cropping is the cheapest way to shrink a file",
      body: [
        "This is underrated. File size depends on two things: how many pixels there are, and how much detail is in them. Cropping reduces both at once.",
        "Removing the outer third of an image removes roughly half its pixels, and the parts you crop away are usually background - wall, sky, desk, floor - which is exactly the busy, high-frequency material a compressor spends most of its bytes on. A tightly cropped portrait routinely encodes to a fraction of the size of the same photo with a metre of room around it, at identical quality.",
        "This is the fix people miss when they are fighting a file size limit. Turning the quality down makes the whole image worse. Cropping tighter usually makes it better, because most document and profile specifications want a tight crop anyway.",
      ],
    },
    {
      heading: "Choosing the output format",
      body: [
        "The crop is a re-encode, so the format you pick matters more than it looks.",
        "PNG is lossless. Nothing degrades, transparency survives, and the file will be large if the content is photographic. It is the right choice for screenshots, logos, diagrams and anything with flat colour or sharp edges.",
        "JPEG is lossy and the right default for photographs. The quality setting controls how much detail is discarded. Note that cropping a JPEG and saving as JPEG means a second round of lossy encoding on top of whatever the camera already did - the damage is usually invisible at high quality, but it is real and it accumulates if you keep re-editing the same file.",
        "WebP does both lossy and lossless, keeps transparency, and generally reaches a given file size at better quality than JPEG. The catch is acceptance: plenty of upload forms and older software still reject a .webp outright, so it is a good choice for a site you control and a risky one for a form that checks extensions.",
        "The SVG option is a wrapper, not a conversion. It embeds the cropped raster image inside an SVG document. That can be convenient when a system insists on an SVG file extension, but it does not make the image vector and it does not make it scale cleanly - the pixels inside are the same pixels.",
      ],
    },
    {
      heading: "Cropping scans and documents",
      body: [
        "Photographs of documents are a slightly different job. What you want is the page and nothing else: no desk, no fingers, no shadow of the phone.",
        "Cropping tightly to the page edges before anything else helps three separate things. It makes the file smaller. It makes OCR noticeably more accurate, because the recogniser is no longer trying to find text regions in a photo of a table. And it makes the result look like a scan rather than a snapshot, which matters when a human is going to look at it.",
        "The one thing cropping cannot fix is skew. If the page was photographed at an angle, the edges are not parallel and a rectangular crop will always leave some background in one corner or cut into the page in another. Photograph flat and from directly above, and the crop becomes trivial.",
      ],
    },
  ],
  example: {
    title: "A wide phone photo cropped for a profile picture",
    input: "IMG_3389.jpg\n4032 x 3024 px (4:3), 3.9 MB\nSubject occupies roughly the middle third\nTarget: 400 x 400 profile image",
    output: "Aspect lock: 1:1 via the Profile preset\nCrop box: 2100 x 2100 px around the head and shoulders\nOutput format: JPEG, quality 92\n\nAfter crop:  2100 x 2100 px, 486 KB\nAfter resize to 400 x 400: 38 KB",
    note: "The crop alone took the file from 3.9 MB to 486 KB - an eight-fold reduction with no quality setting touched, purely from discarding pixels and background. The resize then did the rest. Had this been done in the other order, resizing 4032x3024 down to 400x400 first would have distorted the face, and cropping afterwards would have left far too few pixels to work with.",
  },
  limitations: [
    "The crop is a re-encode, so saving a JPEG as JPEG adds a second generation of lossy compression. Choose PNG or WebP if you plan to edit the result again.",
    "There is no rotation or straightening. A photo taken at an angle cannot be squared up here - crop what you can and accept the skew, or straighten it elsewhere first.",
    "The SVG output embeds the raster image rather than tracing it. It is a container, not a vector conversion.",
    "The preset shapes are common conventions, not guaranteed platform requirements. Platforms change their specs; check the current one if it matters.",
    "One image at a time, and no batch cropping of a folder to the same shape.",
    "Very large images are bounded by browser memory and the maximum canvas size, which varies by device.",
  ],
};
