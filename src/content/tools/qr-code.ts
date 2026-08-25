import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const qrCodeArticle: ToolArticleContent = {
  intro: [
    "QR codes went from a joke to infrastructure in about two years, and most people making them still treat them as a black box that turns a link into a square.",
    "They are worth understanding slightly better than that, because the decisions you make when generating one - what you encode, how much error correction you allow, how big you print it - decide whether it scans reliably in the real world or fails in a way nobody reports back to you.",
    "This generator handles the common payload types, exports to PNG, SVG or JPEG, and lets you set the error correction level and drop a logo in the middle. All of it happens in your browser.",
  ],
  sections: [
    {
      heading: "A QR code is a container format, not just a link",
      body: [
        "The square encodes text. What makes a phone do something useful with that text is a convention about how it is formatted.",
        "A URL is just the URL. A wifi payload is a specific string listing the network name, security type and password, which the camera recognises and offers to join. A vCard is a structured contact record. An SMS payload carries a number and a pre-filled message body. A calendar payload carries an event.",
        "This matters because the payload type changes how much data goes into the code, and data volume is what determines how dense the pattern becomes. A short URL produces a sparse, forgiving code. A full vCard with an address and three phone numbers produces a dense one that needs to be printed larger and held steadier to scan.",
        "If a code has to work on a poster read from two metres away, encode as little as possible. A short link that redirects beats a long one, and beats a vCard outright.",
      ],
      bullets: [
        "URL, text, email, phone, SMS - small payloads, sparse codes, easy scans.",
        "Wifi - convenient for guest networks, and note the password is in plain text in the image.",
        "vCard, calendar - large payloads, dense codes, need size and good light.",
      ],
    },
    {
      heading: "Error correction, and the logo trade-off",
      body: [
        "QR codes carry redundant data so they still scan when part of the code is dirty, torn, curved or covered. That redundancy comes in four levels, conventionally described as tolerating roughly 7, 15, 25 and 30 percent damage.",
        "Higher correction is not free. The redundancy is more data, more data means a denser pattern at the same physical size, and a denser pattern is harder for a camera to resolve. Pushing to the highest level for a code that will be viewed on a clean screen makes it worse, not better.",
        "The one case where high correction genuinely earns its place is a logo in the middle. That logo is damage as far as the decoder is concerned - you are deliberately destroying part of the code and relying on the redundancy to survive it. Keep the logo small, well under the fraction the level tolerates, and centred, because the corner alignment patterns must stay intact.",
        "Whatever you do, scan the result with more than one phone before it goes to print. A code with a logo that scans on your device and fails on a five year old Android is a failure mode you will never hear about.",
      ],
    },
    {
      heading: "Printing: quiet zone, contrast and size",
      body: [
        "Three things break printed QR codes, and all three are avoidable.",
        "The quiet zone is the blank margin around the code. The specification asks for a border equal to four modules - four of the smallest squares - and decoders genuinely need it to find the code's edges. Designers crop it constantly. Do not.",
        "Contrast has to be dark-on-light. Not light-on-dark, which some decoders refuse outright, and not a low-contrast pair of brand colours. If you must tint it, keep the dark modules genuinely dark and the background genuinely light.",
        "Size follows scanning distance. A workable rule of thumb is that the code should be about a tenth of the distance it will be scanned from - so a code read from a metre away wants to be around ten centimetres across. On a restaurant table, three centimetres is fine. On a wall poster, three centimetres is decoration.",
      ],
    },
    {
      heading: "Which export format to use",
      body: [
        "SVG for anything that will be printed or resized. It is vector, so it stays razor sharp at any size, and the edges of the modules stay hard rather than blurring, which is exactly what decoders want.",
        "PNG for screens, emails and documents that will not accept SVG. It is lossless, so the module edges stay crisp.",
        "JPEG is available and you should almost never pick it. JPEG compression softens hard edges, which is the one property a QR code cannot afford to lose. At small sizes or aggressive compression it introduces exactly the kind of noise that causes intermittent scan failures - the worst kind, because the code works when you test it and fails for a fraction of your users.",
      ],
    },
  ],
  example: {
    title: "The same link at two error correction levels",
    input: 'Payload: https://utilbyte.app/utility-tools/qr-code\n47 characters, URL type\nExport: SVG',
    output: "Level M (~15% recovery)  -> 33 x 33 modules, sparse, scans from ~40 cm at 4 cm printed\nLevel H (~30% recovery)  -> 41 x 41 modules, dense, needs ~5 cm printed for the same distance\n\nWith a logo covering ~8% of the area:\n  Level M -> intermittent failures on older cameras\n  Level H -> reliable",
    note: "Going from M to H added eight modules in each direction for identical content. On a clean screen that is a downgrade - more to resolve, no benefit. The moment you punch a logo into the middle it becomes necessary. That is the whole trade: correction level should follow how much abuse the code will actually take, not be maxed out by default.",
  },
  limitations: [
    "The code is generated from what you type. If the URL is wrong, the code is wrong - test every one before printing.",
    "A logo is deliberate damage to the code. Keep it small, keep it centred, and test on several phones and not just yours.",
    "Wifi payloads contain the network password as plain text inside the image. Anyone who photographs the code has your password.",
    "These are static codes. The destination is baked in, so it cannot be changed later without reprinting - dynamic redirect codes need a service that keeps the redirect alive.",
    "JPEG export exists for compatibility but is a poor choice; compression artefacts on module edges cause intermittent scan failures.",
    "No bulk generation. One code at a time.",
  ],
};
