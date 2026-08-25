import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const avifToJpgArticle: ToolArticleContent = {
  intro: [
    "AVIF is the newest of the web image formats and the most efficient by a clear margin. That efficiency is exactly why you have a file you cannot open: the site served it, your browser displayed it, and then the software you wanted to use it in had never heard of it.",
    "This converts AVIF to JPG, which every piece of software made in the last thirty years will accept.",
  ],
  sections: [
    {
      heading: "What AVIF is, and why it is worth the trouble",
      body: [
        "AVIF stores still images using the AV1 video codec's intra-frame compression. AV1 is royalty-free, developed by a consortium including Google, Mozilla, Netflix and Apple, which is the main reason it spread where earlier candidates stalled on patents.",
        "The compression is a genuine step up. AVIF commonly reaches file sizes around half of a comparable JPEG, and it holds together at very low bitrates in a way JPEG does not - where JPEG breaks into visible 8x8 blocks, AVIF degrades into something softer and much less objectionable.",
        "It also carries things JPEG cannot: an alpha channel, higher bit depths, wide colour gamut and HDR. For a photograph destined for a modern screen it is simply a better container.",
        "Browser support is now good - current Chrome, Firefox, Safari and Edge all decode it. Support in desktop applications, older operating systems and upload forms lags well behind, which is the gap this page exists to bridge.",
      ],
    },
    {
      heading: "What the conversion costs",
      body: [
        "Going from AVIF to JPEG is a downgrade in every technical respect, and it is worth knowing which of those will actually affect you.",
        "The file gets larger, usually around twice the size for equivalent visual quality. That is simply JPEG being a much older codec.",
        "Transparency is lost. JPEG has no alpha channel, so transparent areas are filled - white, here. If the AVIF had a transparent background, the JPEG will not.",
        "Bit depth is reduced. AVIF can store 10 or 12 bits per channel; JPEG is 8. On an image with subtle gradients this can introduce visible banding where the original had none.",
        "HDR and wide-gamut information is discarded. An AVIF mastered for HDR display converts to a standard-range JPEG, which usually looks flatter and less saturated than the original did.",
        "For a photograph headed to an upload form, none of this matters. For an image you are archiving, all of it does - keep the AVIF as your master.",
      ],
      bullets: [
        "Roughly double the file size, for the same apparent quality.",
        "Transparency lost - filled with white.",
        "10 or 12 bit depth reduced to 8, which can band smooth gradients.",
        "HDR and wide gamut discarded; expect it to look flatter.",
      ],
    },
    {
      heading: "When JPG is not the right target",
      body: [
        "JPG is the safe answer, not always the best one.",
        "If the image has transparency, JPG cannot carry it and you want PNG or WebP instead.",
        "If the destination is a website you control, converting away from AVIF at all is a step backwards - serve the AVIF and let older browsers fall back to a JPEG via the picture element. You get the small file for most visitors and compatibility for the rest.",
        "If the image is a screenshot, a logo or a diagram rather than a photograph, PNG will look better than JPG at a smaller size, because JPEG handles hard edges badly and produces visible ringing around text.",
        "Convert to JPG when something else demands a JPG. That is the whole rule.",
      ],
    },
    {
      heading: "If the conversion fails",
      body: [
        "The decoding happens in your browser, so a failure almost always means the browser is too old for AVIF rather than anything being wrong with the file.",
        "Updating the browser is the fix. AVIF decoding has been in Chrome since 2020, Firefox since 2021, and Safari since version 16 in 2022, so a current version of any of them will handle it.",
        "This is a considerably better situation than HEIC, which most browsers still cannot decode at all because of licensing rather than age.",
      ],
    },
  ],
  example: {
    title: "A hero image taken back to JPEG",
    input: "hero.avif\n2400 x 1350 px, 186 KB\n10-bit, wide gamut",
    output: "Converted at quality 90:\n  hero.jpg  2400 x 1350, 412 KB\n\n  file size:   2.2x larger\n  bit depth:   10-bit -> 8-bit\n  gamut:       wide -> sRGB\n  transparency: none in the original, so nothing lost here",
    note: "The size more than doubled for a picture that looks the same on an ordinary screen, which is the compression gap between a 2019 codec and a 1992 one. The bit depth reduction is the one to watch: on this image the sky is a smooth gradient, and 8-bit is where faint banding can appear that was not in the original. If that matters, keep the AVIF and convert only the copy you have to hand over.",
  },
  limitations: [
    "Decoding requires a reasonably current browser. An older version will fail, and updating is the fix.",
    "Transparency is lost when converting to JPG, filled with white. Use PNG or WebP if you need the alpha channel.",
    "Bit depth drops to 8, and HDR and wide-gamut data is discarded. Expect a flatter image and possible banding in smooth gradients.",
    "Output is typically about twice the size of the AVIF for the same apparent quality.",
    "Animated AVIF converts to a single still frame.",
    "One image at a time, and metadata is not carried through the re-encode.",
  ],
};
