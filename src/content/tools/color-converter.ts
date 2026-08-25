import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const colorConverterArticle: ToolArticleContent = {
  intro: [
    "You have a colour in one notation and need it in another. A brand guide gives you CMYK and the CSS wants hex. A designer sends HSL and the API expects RGB. It is a small, constant friction in any work that touches both design and code.",
    "This tool converts between hex, RGB, HSL, HSV and CMYK. The conversions between the first four are exact and reversible. The one to CMYK is not, and that distinction is worth understanding before you rely on it.",
  ],
  sections: [
    {
      heading: "Hex, RGB, HSL and HSV are the same thing wearing different clothes",
      body: [
        "Hex and RGB are notation for identical data. #3A7BD5 is red 58, green 123, blue 213 - two hex digits per channel, nothing lost either way. Anything that accepts one accepts the other.",
        "HSL and HSV are the same colour described in polar terms: a hue angle around a colour wheel, plus saturation, plus either lightness or value. The arithmetic is exact and round-trips cleanly.",
        "The reason to care is that they are useful for different jobs. RGB is how screens work but it is terrible for reasoning about colour - to make #3A7BD5 lighter you have to adjust three numbers in a coordinated way and hope. In HSL you raise the L and leave the rest alone. Building a set of tints and shades from one brand colour is a two-minute job in HSL and an afternoon of guessing in hex.",
        "HSL and HSV differ in what the third number means. HSL's lightness runs from black through the pure hue at 50% to white. HSV's value runs from black to the pure hue at 100%, and white only appears when saturation drops. HSL is the more intuitive of the two for generating palettes; HSV matches how colour pickers in graphics software tend to behave.",
      ],
      bullets: [
        "Hex and RGB: identical data, pick by what the destination accepts.",
        "HSL: best for building tints, shades and accessible variants of one hue.",
        "HSV: matches most graphics-software colour pickers.",
        "CMYK: print only, and not a lossless conversion - see below.",
      ],
    },
    {
      heading: "CMYK is an estimate, and it has to be",
      body: [
        "The other four notations all describe light emitted by a screen. CMYK describes ink absorbed by paper, and the two do not map onto each other cleanly.",
        "The set of colours a screen can show and the set a printing press can produce overlap but are different shapes. Saturated screen colours - vivid cyans, bright oranges, anything that glows - are simply outside what four process inks can reproduce. Converting them yields the nearest printable approximation, and something is lost.",
        "Worse, there is no single correct conversion. The right numbers depend on the press, the ink set, the paper stock and the colour profile in use. A professional workflow converts through an ICC profile for the specific press. A general-purpose formula, which is what this tool uses, gives you a reasonable starting point and nothing more.",
        "So: use the CMYK output to communicate roughly what you want, or as a starting point in a layout application. Do not send it to a printer as a colour specification for anything where the match matters. Ask the printer what profile they want and convert through it.",
      ],
    },
    {
      heading: "The number nobody converts and everybody needs",
      body: [
        "Converting notations is the easy part. The question that actually comes up in the work is whether text in one colour is readable on a background of another.",
        "That is a contrast ratio, computed from the relative luminance of the two colours, and it is not something you can eyeball. The accessibility thresholds in common use are 4.5:1 for normal body text and 3:1 for large text and interface components.",
        "The trap is that a pair of colours can look fine to you and fail badly - light grey on white is the classic, and it is everywhere. Mid-tone colours against each other are the other common failure, because two colours can be very different in hue while being nearly identical in luminance, which is exactly the case that is unreadable for someone with low vision or on a phone in sunlight.",
        "This tool does not compute contrast ratios. It is worth checking yours somewhere that does, particularly for any colour you are about to standardise on.",
      ],
    },
    {
      heading: "Shorthand, alpha and the edge cases",
      body: [
        "Three-digit hex is shorthand where each digit is doubled: #F0C is #FF00CC. It is valid CSS and only capable of expressing 4,096 of the 16.7 million colours, so it is convenient rather than useful.",
        "Eight-digit hex adds an alpha channel as a final pair - #3A7BD5CC is that blue at 80% opacity. Alpha is not part of the colour itself, which is why converting to HSL or CMYK drops it. If you need transparency, carry it separately.",
        "One thing that catches people: colour and opacity are different mechanisms. A colour at 50% alpha over white looks like a lighter colour, but it is not the same as the lighter colour - put it over a dark background and it behaves completely differently. If you want a fixed lighter shade, raise the lightness in HSL rather than reaching for opacity.",
      ],
    },
  ],
  example: {
    title: "One brand colour, five notations",
    input: "#3A7BD5",
    output: "RGB   58, 123, 213\nHSL   217 deg, 64%, 53%\nHSV   217 deg, 73%, 84%\nCMYK  73%, 42%, 0%, 16%\n\nA tint, built in HSL by raising lightness to 90%:\n  HSL 217, 64%, 90%  ->  #D3E2F7",
    note: "The tint took one number. Producing #D3E2F7 by adjusting the hex directly would have meant changing all three channels by different amounts to keep the hue steady, which is why palettes get built in HSL and shipped in hex. Note also the CMYK: 0% yellow and 73% cyan is a plausible recipe, but a press with a different profile will want different numbers for the same visual result.",
  },
  limitations: [
    "CMYK conversion uses a general formula, not an ICC profile. It is an approximation and should not be treated as a print specification.",
    "Screen colours outside the printable gamut have no exact CMYK equivalent. The conversion gives the nearest printable colour and cannot warn you how far off it is.",
    "Alpha is not carried into HSL, HSV or CMYK, because those notations have no concept of it.",
    "No contrast ratio or accessibility checking, which is the calculation most colour work actually needs.",
    "No palette generation, colour naming, or extraction from an image.",
  ],
};
