import type { Guide } from "@/content/guides/types";

export const compressPhotoTo20kbGuide: Guide = {
  slug: "compress-photo-to-20kb",
  title: "How to get a photo under 20 KB without wrecking it",
  metaTitle: "Compress a Photo to 20 KB, 50 KB or 100 KB",
  metaDescription:
    "A phone photo is two hundred times the size a 20 KB form field allows. Crop, then resize, then compress - and watch for the forms that reject a file for being too small.",
  keywords: [
    "compress photo to 20kb",
    "reduce image size to 50kb",
    "compress image to 100kb",
    "how to reduce photo size in kb",
    "photo under 20kb for form upload",
    "resize photo for online form",
  ],
  published: "2026-08-24",
  summary:
    "Twenty kilobytes is roughly a two-hundredth of what a phone camera produces, and the forms that ask for it do not negotiate. This guide covers the order of operations that works at 20 KB, 50 KB and 100 KB, what each of those sizes looks like on a face, and the published specifications where compressing too hard is itself a rejection.",
  readingMinutes: 7,
  intro: [
    "Twenty kilobytes is not a size anyone chose on purpose. It is a number left in a database schema from a time when a scanned photograph was 640 pixels across, and it survives because nobody has a reason to change it. The forms carrying it - exam registrations, government job portals, older visa systems - do not negotiate, and the file coming off your phone is somewhere between one and eight megabytes.",
    "The instinct is to open a compressor and drag the quality slider to the floor. On a full-resolution camera file that gives you something smeared and blocky which is still over the limit, so people drag it further, and now the photo is unusable and the form still says no. The slider is the last step, not the first.",
    "What follows is the order that works, at 20 KB and at the friendlier 50 KB and 100 KB caps, plus two published specifications where compressing too hard fails on its own terms.",
  ],
  sections: [
    {
      heading: "Work out how much room you actually have",
      body: [
        "File size in a JPEG is spread across pixels, so the number worth knowing is bits per pixel: the byte target times eight, divided by the pixel count. A photograph most people would call sharp sits between half a bit and a bit and a half. Below about a quarter of a bit it starts to look damaged, and below a tenth it stops reading as a photograph.",
        "Run that on a 12 megapixel phone file, 4032 by 3024, and the answer is blunt. Twenty kilobytes across 12.2 million pixels is about 0.013 bits each, a fortieth of what the picture needs. Fifty kilobytes gets you 0.033, a hundred kilobytes 0.066. All three are hopeless for the same reason: far too many pixels sharing one budget.",
        "Change the pixel count and the same targets turn reasonable. At 413 by 531, a 35 by 45 mm print at 300 dpi, 20 KB is about 0.73 bits per pixel, which is a working budget. At 600 by 600, 50 KB gives you roughly 1.1. The target was never the problem.",
      ],
      bullets: [
        "20 KB: keep the long edge somewhere under about 500 pixels.",
        "50 KB: roughly 600 to 800 pixels on the long edge.",
        "100 KB: roughly 1000 to 1200 pixels on the long edge.",
        "Those are starting points for a head-and-shoulders photo on a plain wall. A busy background can cost several times more at the same dimensions.",
      ],
      callout: {
        tone: "info",
        text: "Forms rarely say whether 20 KB means 20,000 bytes or 20,480. Land a few percent under the stated number and the question stops mattering.",
      },
    },
    {
      heading: "Crop first, because file size follows detail",
      body: [
        "A lossy encoder spends bytes where neighbouring pixels disagree. A plain wall costs almost nothing. A bookshelf, a patterned curtain, leaves, a striped shirt - that is where the file goes. Two images at identical dimensions and quality settings can differ fivefold on content alone.",
        "That makes the crop the highest-value edit available. Cutting the room out of a portrait removes the most expensive part of the frame and keeps the only part anyone will look at, and document forms want head and shoulders anyway.",
        "It also explains why advice phrased as a quality percentage never holds up. Quality 60 is 40 KB on one photo and 300 KB on another. The setting is not a size but a threshold for how much error the encoder will accept, and how many bytes that saves depends on the picture.",
      ],
    },
    {
      heading: "Resize second, compress last, and always work from the original",
      body: [
        "Once the crop is right, set the pixel dimensions, then compress. Doing those two in the other order wastes both. Compressing to a byte target and then resizing re-encodes from scratch, so the size you carefully hit moves again, usually upward, and the second pass treats the first pass's blocking as detail worth preserving.",
        "Every save of a JPEG is a fresh lossy encode. Five rounds of tweak-and-save leaves damage that has nothing to do with the quality setting you ended on. When an attempt overshoots, go back to the original rather than compressing the compressed copy.",
      ],
      callout: {
        tone: "warning",
        text: "Keep the untouched original somewhere you will not overwrite it. Once the only copy you have is the 20 KB one, no amount of later work brings the detail back.",
      },
    },
    {
      heading: "Some forms have a floor, and squeezing too hard fails them",
      body: [
        "A stated cap is not always the only constraint on file size, and that is where the habit of compressing as hard as possible turns into a rejection. Two published specifications make the point.",
        "The UK passport service asks for a digital photo at least 600 pixels wide and 750 pixels tall, with the file between 50 KB and 10 MB, in colour, in focus, unaltered, against a plain light-coloured background. Fifty kilobytes is a minimum. Push a 600 by 750 photo down to 30 KB and you have a tidy small file that does not meet the requirement. The page https://www.gov.uk/photos-for-passports carries the full list.",
        "The US visa and Diversity Visa digital photo caps the file at 240 KB, with a square shape between 600 by 600 and 1200 by 1200 pixels, JPEG only, in colour at 24 bits per pixel in sRGB. It also specifies a compression ratio of 20:1 or lower, which limits how hard the image may be squeezed - in effect an indirect floor, since the more pixels you send the more bytes the photo is expected to carry. A scanned photo takes the print route instead, at 2 by 2 inches (51 by 51 mm) at 300 ppi. The page https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/digital-image-requirements.html carries the requirements in full.",
        "Read every other limit the same way, on the authority's own site rather than in somebody's summary of it. Before aiming for the smallest file your tool can produce, check whether the stated range has a bottom, and whether anything is said about resolution or compression alongside the byte figure.",
      ],
      callout: {
        tone: "warning",
        text: "A size requirement written as a range is enforced at both ends. A file under the minimum gets rejected as quickly as one over the maximum, and the error message is often the same unhelpful line either way.",
      },
    },
    {
      heading: "What 20 KB, 50 KB and 100 KB look like on a face",
      body: [
        "At 100 KB, on a photo cropped to head and shoulders and resized to something sensible, most people cannot tell. Skin keeps its texture and flat areas stay flat. At 50 KB the first signs show up if you go looking: eyelashes soften, the hairline loses definition, and there is faint stepping where dark hair meets a light wall. At the size anyone will actually view it, it still passes.",
        "At 20 KB three things go, in order. Flat areas break into 8 by 8 squares, the grid JPEG works on, and the forehead and the background are where you notice it. Colour edges spread past brightness edges, so dark hair against a pale wall picks up a coloured rim and a red collar bleeds. Then skin texture flattens into something waxy, which is usually what people mean when a photo looks wrong and they cannot point at the reason.",
        "What survives is overall shape, broad colour and the position of the eyes, nose and mouth, which is most of what a clerk or an automated face check works from. A 20 KB photo can look poor and still do its job, so judge it against the purpose rather than the original.",
      ],
      bullets: [
        "Open the exported file at full size before you submit it. A thumbnail hides every one of these problems.",
        "Look along the hairline and the jaw for a coloured rim.",
        "Look at the forehead and the background for square patches.",
        "Look at the eyes. Irises gone to flat discs means you went one step too far.",
      ],
    },
    {
      heading: "Most of the damage is decided before the shutter",
      body: [
        "The cheapest photo to compress is one with nothing expensive in it. A plain, evenly lit wall behind the head is worth more than any setting in any tool, because a flat surface costs the encoder almost nothing to describe.",
        "Light matters for a reason that is not obvious. A dim room forces the camera to raise its sensitivity, and that adds noise - random speckle through the shadows and flat areas. You will not see it at normal viewing size, but the encoder still has to store it, and random variation is the most expensive content there is. Daylight from a window gives you a smaller file at the same quality with nothing edited at all. The same logic rules out sharpening, argues against patterned clothing, and makes greyscale a smaller saving than people expect.",
      ],
    },
    {
      heading: "When the number is genuinely out of reach",
      body: [
        "You have reached the end when the image is already at the dimensions the form asks for, the quality is as low as your tool will go, and the file either still overshoots or is unusable at the size that fits. At that point the input is the problem, not the settings.",
        "Format is the one lever left, and it is usually blocked. WebP reaches a given file size at better quality than JPEG, sometimes by a wide margin at very small sizes, and the portals imposing 20 KB caps are the least likely to accept it. Renaming a .webp to .jpg converts nothing: the good outcome is rejection at upload, the bad one is a file that uploads and will not open for whoever reviews it a month later. PNG is no help for photographs either, being lossless with no quality control at all.",
        "So go back a step instead. Retake the photograph against a plain wall in daylight, crop tighter than you think you need to, or take the lower end of the range if the form gives you one. For a passport or a visa, where a rejection costs weeks, a studio will hand you a file already inside the specification.",
      ],
      bullets: [
        "Check you have not applied the photograph's limit to the signature field or the other way round. It happens constantly.",
        "Check the units. Some portals write KB and mean KiB, and a few write MB where they meant KB.",
        "Check whether the stated dimensions are a minimum, a maximum, or exact. A range gives you room that a fixed size does not.",
        "Check the source photo has not already been through a messaging app, which will have compressed it once already.",
      ],
    },
  ],
  relatedTools: [
    {
      label: "Compress to Size",
      href: "/image-tools/compress-to-size",
      description:
        "State the limit in kilobytes and it searches for the highest quality that fits underneath, then tells you what it landed on. If your target is impossible it says so instead of quietly handing back an oversized file.",
    },
    {
      label: "Crop Image",
      href: "/image-tools/crop-image",
      description:
        "Cut the background out before you compress anything. On a busy photograph this saves more bytes than several steps of quality do.",
    },
    {
      label: "Resize Image",
      href: "/image-tools/resize-image",
      description:
        "Set the exact pixel dimensions the form asks for. This is the step between cropping and compressing, not after them.",
    },
    {
      label: "Document Photo Maker",
      href: "/image-tools/document-photo",
      description:
        "Crop to a required document shape, produce the file at exact dimensions, and compress to a cap without changing the pixel size.",
    },
    {
      label: "Image Compressor",
      href: "/image-tools/compress-image",
      description:
        "A plain quality slider with a live size estimate, for when you would rather see the trade-off yourself than have it solved for you.",
    },
  ],
  relatedGuides: ["document-photo-sizes"],
  faqs: [
    {
      question: "How do I compress a photo to 20 KB without losing quality?",
      answer:
        "At full camera resolution you cannot - 20 KB across 12 million pixels leaves about a hundredth of a bit per pixel, and the loss has to go somewhere. What you can do is make the loss invisible by cutting the pixel count first. Crop to the subject, resize to the dimensions the form asks for, then compress. At 400 by 500 pixels a 20 KB JPEG has a comfortable budget and looks fine.",
    },
    {
      question: "Why is my photo blocky after compressing it to 20 KB?",
      answer:
        "Almost always because the pixel dimensions were left at full size, so the encoder had to strip detail from several million pixels and flattened each 8 by 8 block toward a single colour. Resize down to the required dimensions first, then compress again starting from the original file rather than from the blocky version you just made.",
    },
    {
      question: "Can a file be rejected for being too small?",
      answer:
        "Yes, and it catches people out. The UK passport service requires a digital photo between 50 KB and 10 MB, so a heavily compressed file fails even though it looks tidy. The US visa and Diversity Visa specification caps the file at 240 KB and also states a compression ratio of 20:1 or lower, which limits how hard the image may be squeezed. Read the whole requirement before you aim for the smallest possible file.",
    },
    {
      question: "Should I use WebP to hit a 20 KB limit?",
      answer:
        "Only if the instructions list WebP as an accepted format. It genuinely helps at very small sizes, but the portals with the tightest caps tend to check the extension against a list written years ago, and some read the file header too, so a renamed file gets caught. Send JPEG unless the form says otherwise.",
    },
    {
      question: "Does the order really matter, or can I just compress and be done?",
      answer:
        "It matters when the form specifies both dimensions and a byte cap, which is the common case. Compressing first and resizing afterwards re-encodes the file, moves the size off your target, and bakes the first pass's artefacts in as detail the second pass tries to preserve. Crop, resize, compress, in that order, from the original each time.",
    },
  ],
};
