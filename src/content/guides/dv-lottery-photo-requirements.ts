import type { Guide } from "@/content/guides/types";

export const dvLotteryPhotoRequirementsGuide: Guide = {
  slug: "dv-lottery-photo-requirements",
  title: "The US visa and Diversity Visa photo specification, explained",
  metaTitle: "DV Lottery Photo Requirements, Explained",
  metaDescription:
    "The US visa and DV entry photo spec line by line: square, 600 to 1200 pixels, JPEG, 240 KB, 24-bit sRGB, 20:1 compression. What each number does, and why entries fail.",
  keywords: [
    "dv lottery photo requirements",
    "us visa photo size",
    "600x600 photo 240kb",
    "diversity visa photo",
    "2x2 inch visa photo",
    "dv photo rejected",
    "visa photo compression ratio",
  ],
  published: "2026-08-24",
  summary:
    "The State Department states its photo rules as numbers rather than a diagram: square, 600 to 1200 pixels, JPEG only, 240 KB or less, 24-bit colour in sRGB, compressed no harder than 20:1. This walks through what each line is actually testing, the one interaction between two of the limits that catches people out, and where the Diversity Visa program stands as of August 2026.",
  readingMinutes: 8,
  intro: [
    "Most photo requirements around the world are a diagram with arrows on it. The US State Department publishes a list of numbers instead: an aspect ratio, a pixel range, a file format, a byte ceiling, a colour depth and a compression ratio. Software checks every one of them before a human being ever looks at your face.",
    "That is good news, up to a point. A rule written as a number can be met exactly, with no argument about whether your chin is in the right place. The trap is that the numbers are not independent. Two of them push against each other, and the combination that seems safest is the one that leaves you almost no room.",
    "The same specification covers immigrant and non-immigrant visa photos and the Diversity Visa entry photo. The DV entry is where it hurts most, because a non-compliant photo can disqualify the entry outright. There is no stage at which somebody emails you asking for a better one. Before the numbers, though, the state of the program, because much of what is written about it is now wrong.",
  ],
  sections: [
    {
      heading: "Where the Diversity Visa program stands in August 2026",
      body: [
        "The rhythm people remember is an entry window opening in early October, results the following spring. That is not what happened in the last cycle. The State Department deferred the DV-2027 entry period rather than opening it on the traditional schedule, and DV-2027 selection opened on 11 March 2026.",
        "Separately, requirements that took effect on 10 April 2026 changed what submitting an entry involves. Entrants are required to upload the biographic page of a valid passport, and to pay a fee of one US dollar which is not waivable. Any walkthrough written before April 2026 describes a form that no longer matches the one you will be filling in.",
        "As of late August 2026, no DV-2028 entry window has been announced. That is the complete and honest answer. Nobody outside the State Department knows when the next one opens, and any site that publishes a date is either guessing or trying to sell you something. Check travel.state.gov and dvprogram.state.gov, and treat every other source on timing as noise.",
        "None of this touches the photo specification, which has been stable throughout. Preparing a compliant photo now is not wasted effort. It is the same photo an actual visa application will need later.",
      ],
      callout: {
        tone: "warning",
        text: "As of late August 2026 no DV-2028 entry window has been announced. The DV-2027 entry period was deferred rather than opened on the traditional schedule, DV-2027 selection opened on 11 March 2026, and requirements effective 10 April 2026 added a passport biographic-page upload and a non-waivable one dollar fee. Confirm dates and status only at travel.state.gov and dvprogram.state.gov. Sites that name a future opening date, or offer to submit an entry on your behalf for a fee, should not be trusted.",
      },
    },
    {
      heading: "The specification, line by line",
      body: [
        "Here is the whole digital image requirement, with what each line is actually testing. If anything below ever drifts out of date, the version that counts is the one the State Department publishes on its digital image requirements page:",
        "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/digital-image-requirements.html",
      ],
      table: {
        columns: ["Requirement", "The rule", "What it is testing"],
        rows: [
          [
            "Aspect ratio",
            "Square: the height must equal the width",
            "A crop, not a resize. A 4:3 phone photo squashed into a square will pass the arithmetic and fail on how you look.",
          ],
          [
            "Minimum dimensions",
            "600 x 600 pixels",
            "That there is enough real detail to identify a face. Enlarging a smaller image adds pixels but no information.",
          ],
          [
            "Maximum dimensions",
            "1200 x 1200 pixels",
            "An upper bound on storage. It is a ceiling, not a target.",
          ],
          [
            "File format",
            "JPEG only",
            "The file must actually be a JPEG. Renaming a PNG or a HEIC to .jpg changes the label, not the bytes.",
          ],
          [
            "File size",
            "240 KB or less",
            "A hard byte ceiling, checked on the file as uploaded.",
          ],
          [
            "Colour",
            "Colour at 24 bits per pixel, in the sRGB colour space",
            "Eight bits each for red, green and blue. Greyscale scans and images tagged with a wider profile than sRGB are both a risk.",
          ],
          [
            "Compression",
            "A compression ratio of 20:1 or lower",
            "A floor on quality. This is the line almost nobody reads, and it is the one that quietly fails over-compressed files.",
          ],
          [
            "Scanned prints",
            "2 x 2 inches (51 x 51 mm) scanned at 300 pixels per inch",
            "The paper route into the same digital spec. Two inches at 300 ppi is exactly 600 pixels.",
          ],
        ],
        caption:
          "The full digital image requirement as published by the US Department of State. Verify against the official page before you submit anything.",
      },
    },
    {
      heading: "The interaction nobody mentions: bigger is not safer",
      body: [
        "Read the list quickly and you conclude that the maximum size is the safe choice. More pixels, better photo, and 1200 x 1200 is explicitly allowed. That instinct is backwards, and the reason is the compression ratio.",
        "A compression ratio compares the size of the finished file against the size the same image would occupy with no compression at all. At 24 bits per pixel, every pixel costs three bytes uncompressed. So an image of 600 x 600 is 360,000 pixels, or 1,080,000 bytes raw. A ratio of 20:1 means the JPEG may not be smaller than a twentieth of that, which is 54,000 bytes, or roughly 54 KB.",
        "In other words the specification has a floor as well as a ceiling. Your file has to be under 240 KB and above the number your chosen dimensions imply. Run that arithmetic across the permitted range and the shape of the problem becomes obvious:",
      ],
      bullets: [
        "600 x 600 - raw size 1,080,000 bytes, so the file must be roughly 54 KB or larger, and 240 KB or smaller. A window nearly 190 KB wide.",
        "900 x 900 - raw size 2,430,000 bytes, so a floor of about 122 KB against the same 240 KB ceiling. Still comfortable.",
        "1200 x 1200 - raw size 4,320,000 bytes, so a floor of about 216 KB against a ceiling of 240 KB. Roughly 24 KB of room.",
      ],
      callout: {
        tone: "warning",
        text: "The 20:1 limit means a very small file can fail even though it is well under 240 KB. If you have squeezed a 600 x 600 photo down to 30 or 40 KB to be safe, you have gone too far in the other direction. Aim comfortably inside both bounds rather than as low as the compressor will go.",
      },
    },
    {
      heading: "Which is why 600 x 600 is the sensible choice",
      body: [
        "At the maximum dimensions the two limits nearly meet. You are trying to land a JPEG in a band about twenty-odd kilobytes wide, and the exact width of that band depends on whether the checker treats 240 KB as 240,000 bytes or 245,760. That is a needlessly tight target to hit by hand.",
        "At 600 x 600 the same photo has a window of well over a hundred kilobytes, and a normally exported JPEG of a head-and-shoulders portrait lands inside it without any effort at all. The face is not meaningfully better identified at 1200 pixels than at 600. Nothing rewards you for using the top of the range.",
        "So the default worth adopting is: crop square, resize to exactly 600 x 600, export as JPEG at a good quality setting, and check that the result is somewhere between about 60 KB and 240 KB. If it comes out at 300 KB, reduce quality slightly rather than reaching for the smallest file you can make.",
      ],
    },
    {
      heading: "The paper route, and the thing you must not do",
      body: [
        "The specification also accepts a scanned print, and states the terms precisely: a photo of 2 x 2 inches, which is 51 x 51 mm, scanned at 300 pixels per inch. Multiply it out and two inches at 300 ppi gives exactly 600 pixels, so a correctly scanned print lands precisely on the minimum digital size. The two halves of the rule are the same rule.",
        "That also means scanning a 2 x 2 print at 150 ppi gives you 300 x 300, which is below the minimum and cannot be rescued. Set the scanner to 300 ppi or higher, scan in colour, and save as JPEG rather than PDF or TIFF.",
        "What you must not do is enlarge a small image to reach 600 x 600. Upscaling invents pixels by averaging the ones already there. The file passes the dimension check and looks soft and smeared to anyone examining it, which is a slower and more frustrating way to fail. If the original is 400 x 400, the answer is a new photograph, not a resize.",
      ],
      callout: {
        tone: "info",
        text: "iPhones tag captured photos with a wider colour profile than sRGB by default. A photo straight off the phone can be a perfectly good picture and still not match the sRGB requirement, so convert or export to sRGB rather than assuming.",
      },
    },
    {
      heading: "Why entries actually get rejected",
      body: [
        "Failures split into two groups. The technical ones are the ones you can verify yourself in under a minute, and they are the more common cause of an entry being thrown out because they are invisible to the person submitting.",
      ],
      bullets: [
        "Not square. A phone photo is 4:3 or 3:2 and has to be cropped, not stretched.",
        "Under 600 x 600, or over 1200 x 1200.",
        "Not really a JPEG - typically a PNG, a HEIC from an iPhone, or a screenshot renamed.",
        "Over 240 KB, which is easy with a modern phone camera and no processing at all.",
        "Over-compressed past the 20:1 floor, usually by somebody who read the 240 KB limit and aimed far lower.",
        "Not in colour, or not in sRGB.",
      ],
    },
    {
      heading: "Composition, and where to get the rules",
      body: [
        "The second group is everything about the photograph itself: how large your head appears in the frame and where it sits, your expression, the background behind you, whether you are wearing glasses, and the narrow circumstances in which a head covering is acceptable. These are real requirements and they reject plenty of entries.",
        "I am not going to put numbers on any of them here, because guides that do are frequently wrong and the consequence of following a wrong number is losing an entry. The State Department publishes the composition rules alongside worked examples of acceptable and unacceptable photos, and that page is the only version worth trusting. Read it before you take the picture rather than after.",
        "In general terms, the photo should be recent and should look like you do now, taken against a plain, light, unpatterned background with even lighting and no strong shadow behind your head. Face the camera squarely with a neutral expression or a natural smile, with both eyes open and your whole face visible. Glasses are generally not acceptable. Head coverings are accepted only for religious reasons and must not obscure the face. No filters, no beauty smoothing, no retouching, and no cropping somebody else out of a group photo.",
      ],
      callout: {
        tone: "warning",
        text: "There is no correction step. Unlike a passport renewal, where a clerk hands the photo back, a Diversity Visa entry with a non-compliant photo is simply disqualified, and you may never be told that is what happened. Check the file yourself before you submit it.",
      },
    },
    {
      heading: "A workflow that lands inside every limit",
      body: [
        "Take the photo in daylight against a plain wall, with the camera at eye level and roughly an arm and a half away rather than at arm's length, which distorts faces. Have somebody else hold the camera if you can. Then work in this order, because the steps interfere with each other if you do not.",
        "Crop to a square first, framing the head and shoulders as the official examples show. Resize that square to 600 x 600. Convert to sRGB if the source was a phone. Export as JPEG. Look at the resulting byte count and confirm it sits between roughly 60 KB and 240 KB, and only then adjust quality if it does not.",
        "Doing it in that order matters. If you compress to hit 240 KB and then resize, the resize changes the file size and you have to start again. If you compress before cropping, you spend bytes on background you are about to delete anyway. Crop, resize, convert, export, check.",
      ],
    },
  ],
  relatedTools: [
    {
      label: "Document Photo",
      href: "/image-tools/document-photo",
      description:
        "Crop to a square and produce a 600 x 600 JPEG at the sizes visa and passport forms ask for.",
    },
    {
      label: "Resize Image",
      href: "/image-tools/resize-image",
      description:
        "Set exact pixel dimensions when you need to land on 600 x 600 rather than near it.",
    },
    {
      label: "Compress to Size",
      href: "/image-tools/compress-to-size",
      description:
        "Bring a file under the 240 KB ceiling when a phone photo comes out far too large.",
    },
    {
      label: "Compress Image",
      href: "/image-tools/compress-image",
      description:
        "Adjust quality by hand when you want to stay well clear of the 20:1 compression floor.",
    },
  ],
  relatedGuides: ["document-photo-sizes", "compress-photo-to-20kb"],
  faqs: [
    {
      question: "What size does a DV lottery photo have to be?",
      answer:
        "Square, with height equal to width, at least 600 x 600 pixels and no more than 1200 x 1200. It must be a JPEG of 240 KB or less, in colour at 24 bits per pixel in the sRGB colour space, compressed no harder than 20:1. A scanned print must be 2 x 2 inches, or 51 x 51 mm, scanned at 300 pixels per inch.",
    },
    {
      question: "When does DV-2028 open?",
      answer:
        "No DV-2028 entry window has been announced as of late August 2026. The previous cycle did not follow the traditional schedule either: the DV-2027 entry period was deferred, and DV-2027 selection opened on 11 March 2026. Check travel.state.gov and dvprogram.state.gov for the current position, and do not rely on any third-party site that claims to know a date.",
    },
    {
      question: "My photo is only 35 KB. Is that safely under the limit?",
      answer:
        "It is under the 240 KB ceiling but it may be below the floor set by the 20:1 compression limit. At 600 x 600 the uncompressed image is 1,080,000 bytes, so a twentieth of that is about 54 KB. A 35 KB file is compressed harder than 20:1 and can be rejected for it. Re-export at a higher quality setting.",
    },
    {
      question: "Can I use a photo taken on my phone?",
      answer:
        "Yes, if you process it. A phone photo is the wrong aspect ratio, far too many pixels, often several megabytes, and on an iPhone may be a HEIC file tagged with a wider colour profile than sRGB. Crop it square, resize to 600 x 600, convert to sRGB, and export as JPEG. Composition matters more than the camera did.",
    },
    {
      question: "Can I enlarge a small photo to reach 600 x 600?",
      answer:
        "You can, and you should not. Upscaling creates pixels by averaging existing ones, so the file satisfies the dimension check while looking visibly soft. The minimum exists to guarantee real detail, not a particular number in the file header. Take a new photograph instead.",
    },
  ],
};
