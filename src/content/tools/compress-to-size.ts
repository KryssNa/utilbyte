import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const compressToSizeArticle: ToolArticleContent = {
  intro: [
    "There is a specific kind of frustration that comes from an upload box with a number on it. Photograph must be less than 50 KB. Signature must be under 20 KB. Maximum file size 200 KB. You have a photo from your phone that is four megabytes, a deadline, and a form that will not budge.",
    "The usual advice is to open a compressor and drag a quality slider around until the number goes green. That works, eventually, but it is guesswork - you cannot see the resulting file size until after you export, so you export, check, go back, adjust, export again. Most people do this five or six times.",
    "This tool inverts it. You state the limit and it searches for the answer: encode, measure, adjust, repeat, converging on the highest quality that still fits underneath your number. Usually that takes nine to twenty passes and about a second. You get told exactly what it landed on, and if your target turns out to be impossible for that image, it says so rather than quietly handing you something over the limit.",
  ],
  sections: [
    {
      heading: "How the search actually works",
      body: [
        "File size and quality are related but not in a way you can calculate in your head. The same quality setting produces wildly different sizes depending on how much detail is in the picture. A flat studio-background portrait at quality 60 might be 40 KB; a photo of a tree at the same setting could be 300 KB. That is why a fixed quality preset never reliably hits a size limit.",
        "So the tool measures instead of predicting. It starts by trying the best quality it offers. If that already fits, it stops there and hands it back untouched - no point degrading an image that was already fine. Otherwise it binary-searches the quality range, halving the remaining interval each pass, keeping the largest quality whose encoded output is still under your limit.",
        "If even the lowest sensible quality overshoots, the problem is not compression settings, it is that there are too many pixels. At that point it starts scaling the image down as well, estimating a plausible reduction from how far over the limit it is rather than grinding down one step at a time.",
      ],
    },
    {
      heading: "Why the limits are what they are",
      body: [
        "The numbers on these forms usually come from a database column sized decades ago and never revisited. 20 KB for a signature, 50 KB for a photo - these were reasonable when a scanned photo was 640 pixels wide. They are now absurdly tight for anything a modern phone produces, and nobody is going to change them.",
        "Government portals, university admission systems, competitive exam registrations and visa applications across South Asia are the strictest. They frequently specify a pixel range and a KB cap at the same time, which is a genuinely awkward pair of constraints because meeting one pushes you away from the other.",
        "When you get both, do them in order: resize to land inside the required dimensions first, then compress to get under the byte cap. If you compress first, the downscaling step may push you back over.",
      ],
      bullets: [
        "20 KB - signature strips, the tightest exam portal fields",
        "50 KB - most Indian and Nepali form photographs",
        "100 KB - a very common general government upload cap",
        "200 KB - university applications, job portals",
        "240 KB - the US visa and Diversity Visa photo limit",
        "500 KB to 1 MB - relaxed portals, email attachments, web pages",
      ],
    },
    {
      heading: "What a hard limit costs you visually",
      body: [
        "Below about 30 KB, a portrait starts to show the characteristic signs of heavy JPEG compression: blocky 8x8 squares in smooth areas like a plain background, coloured fringing around the edges of dark hair against a light wall, and a general loss of skin texture.",
        "There is a trick worth knowing. Because compression cost scales with detail, removing detail helps more than turning quality down. Cropping tightly to the head and shoulders, as most document photos require anyway, removes a large amount of background the encoder was spending bytes on. A tightly cropped photo at 40 KB routinely looks better than a wide one squeezed to the same size.",
        "The other lever is format. WebP typically reaches a given file size at noticeably better quality than JPEG, sometimes by a wide margin at very small sizes. The catch is acceptance: many older upload forms only accept JPG or PNG and will reject a .webp outright. Use WebP when the destination is a website you control, JPEG when a form is going to inspect the extension.",
      ],
    },
    {
      heading: "When the target is genuinely impossible",
      body: [
        "Sometimes the answer is no. A detailed 12 megapixel landscape will not become a recognisable 5 KB file, and a tool that claims otherwise is either cropping without telling you or handing back something over the limit and hoping you do not check.",
        "This one walks all the way down its range and then reports what it actually achieved, flagged clearly. If you see that message, the useful responses are: crop away everything that is not the subject, reduce the pixel dimensions deliberately using the resize tool before coming back, or re-read the form - the limit is occasionally stated in the wrong unit, and a surprising number of portals say KB when they mean KiB or vice versa.",
      ],
    },
  ],
  example: {
    title: "A phone photo squeezed into a 50 KB exam portal field",
    input: "IMG_2210.jpg\n3024 x 4032 px\n4,412,193 bytes (4.2 MB)\nTarget: 50 KB, JPEG",
    output: "Pass 1  quality 0.95, full size   -> 1,982,004 bytes  over\nPass 2-9  quality search at full size -> 214,880 bytes at lowest quality, still over\nEstimated scale needed: 0.48 -> jumped to 0.5\nPass 10-18  quality search at 50%   -> best fit found\n\nResult: 51,022 bytes -> 49.8 KB\n1512 x 2016 px, quality 26%\n18 encode passes, about 1.2 seconds",
    note: "Notice what happened at pass 9. Even the lowest quality at full resolution was four times over the limit, so quality was never going to be enough on its own. Rather than stepping down 85%, 70%, 60% in turn, the tool used the overshoot ratio to jump straight to half size. The output is half the pixel dimensions of the original, which matters if the form also specifies a minimum width - always check the reported dimensions when you see the downscale notice.",
  },
  limitations: [
    "Output is JPEG or WebP only. PNG is lossless and has no quality dial, so it cannot be targeted at a byte size - if the form demands PNG, you have to reduce dimensions instead.",
    "Transparency is lost when the output is JPEG. Transparent areas are filled with white, which is right for a document photo and wrong for a logo. Choose WebP if you need the alpha channel.",
    "Very small targets on large, detailed images may be unreachable. The tool will tell you rather than silently overshooting, but it cannot invent a solution that does not exist.",
    "Reaching a tight target often means downscaling. If your form specifies both a minimum pixel size and a maximum file size, verify the output meets both - the tool optimises for the byte limit.",
    "One image at a time. There is no batch mode for pushing a folder of photos under the same cap.",
    "Large images mean many encode passes. On an older phone a 12 megapixel source aiming at 20 KB can take several seconds and will make the tab briefly unresponsive.",
  ],
};
