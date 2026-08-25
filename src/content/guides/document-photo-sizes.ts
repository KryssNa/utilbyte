import type { Guide } from "@/content/guides/types";

export const documentPhotoSizesGuide: Guide = {
  slug: "document-photo-sizes",
  title: "Document photo sizes, and how to read a specification",
  metaTitle: "Passport, Visa and Exam Photo Sizes Explained",
  metaDescription:
    "What the numbers in a passport or visa photo spec mean, two specifications quoted from the issuing authority, and the arithmetic that turns millimetres into pixels.",
  keywords: [
    "passport photo size",
    "visa photo size in pixels",
    "35x45 mm in pixels",
    "document photo requirements",
    "exam photo size 200x230",
    "mm to pixels 300 dpi",
  ],
  published: "2026-08-24",
  summary:
    "A reference for document photo specifications and, more usefully, a method for reading one you have never seen before. Two specifications here are quoted from the issuing authority and linked. Everything else is either arithmetic, which is safe anywhere, or a convention that you have to confirm before you rely on it.",
  readingMinutes: 7,
  intro: [
    "Search for your country's passport photo size and you get a dozen tables, all confident, most uncited, several out of date. Some are copies of each other. At least one is copying a rule that changed years ago. The genre exists because the query is popular and the honest answer is dull: the size is whatever the authority issuing your document currently says it is.",
    "That does not make the numbers useless, but it changes what a page like this can honestly offer. The table below carries a status column, and only two rows in it were checked against the issuing authority's own published page. The rest are conventions worth knowing as a starting point, not as an answer.",
    "The more durable thing is understanding what each number in a specification is doing - which ones a machine checks the second you press upload, which ones a person checks a week later, and which ones describe paper rather than pixels. That transfers to any form, including the one you meet next year when this page is stale.",
  ],
  sections: [
    {
      heading: "The two specifications on this page that were checked at source",
      body: [
        "The US visa and Diversity Visa digital photo is square. It must be at least 600 by 600 pixels and no more than 1200 by 1200. It must be JPEG, 240 KB or less, in colour at 24 bits per pixel in sRGB, with a compression ratio of 20:1 or lower. If you are scanning a printed photo instead, the print is 2 by 2 inches, which is 51 by 51 mm, scanned at 300 ppi. The page is at https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/digital-image-requirements.html, and it carries example images no amount of text substitutes for.",
        "The UK passport digital photo must be at least 600 pixels wide and 750 pixels tall, with the file between 50 KB and 10 MB. It must be in colour, in focus, against a plain light-coloured background, and not altered in any way. Those requirements are published at https://www.gov.uk/photos-for-passports, and that page is the only version of them that counts.",
        "Two things are worth pulling out. Neither is the 35 by 45 mm rectangle people expect a passport photo to be: the US is square, and the UK digital rule is expressed as pixel minimums and never mentions millimetres. And both specify more than a size - a format, a colour instruction, and a file size range with a bottom as well as a top.",
      ],
    },
    {
      heading: "A size reference, with its provenance attached",
      body: [
        "The table separates what was verified from what is merely common. Treat the last four rows as a description of what tends to be asked for, not as a rule you can submit against.",
      ],
      table: {
        columns: ["Photo", "Stated size", "Other stated constraints", "Status"],
        rows: [
          [
            "US visa and Diversity Visa, digital",
            "Square, 600 x 600 px minimum, 1200 x 1200 px maximum",
            "JPEG only, 240 KB or less, colour at 24 bits per pixel in sRGB, compression ratio 20:1 or lower",
            "Verified at travel.state.gov",
          ],
          [
            "US visa photo, scanned from a print",
            "2 x 2 in (51 x 51 mm) at 300 ppi",
            "Gives 600 x 600 px, the digital minimum",
            "Verified at travel.state.gov",
          ],
          [
            "UK passport, digital application",
            "At least 600 px wide by 750 px tall",
            "File between 50 KB and 10 MB, colour, in focus, plain light background, unaltered",
            "Verified at gov.uk",
          ],
          [
            "35 x 45 mm at 300 dpi",
            "413 x 531 px",
            "Nothing implied about file size or format",
            "Common standard - confirm with the issuing authority",
          ],
          [
            "35 x 45 mm at 600 dpi",
            "827 x 1063 px",
            "Same rectangle, more detail, larger file",
            "Common standard - confirm with the issuing authority",
          ],
          [
            "Exam portal photograph",
            "Often around 200 x 230 px",
            "Often a file size window in the region of 20 KB to 50 KB",
            "Varies by portal and by session - confirm",
          ],
          [
            "Exam portal signature strip",
            "Often around 140 x 60 px",
            "Often a window in the region of 10 KB to 20 KB",
            "Varies by portal and by session - confirm",
          ],
        ],
        caption:
          "Only the rows marked verified were checked against the issuing authority's own published page. The rest are conventions in wide use that change without notice.",
      },
      callout: {
        tone: "warning",
        text: "Before you submit anything, open your own authority's requirements page - the government domain, not the first search result - and check its numbers against the file you are about to upload. Any figure here not attributed to travel.state.gov or gov.uk is a convention, and conventions get people rejected. Where your form states its own numbers, those numbers win.",
      },
    },
    {
      heading: "The 35 by 45 mm rectangle, and why no country is named beside it",
      body: [
        "The 35 by 45 mm print size derives from the ICAO travel document standard and is the size most often quoted outside the United States - Schengen visa applications, Indian and Nepali documents and a long list of others are commonly described as using it. At 300 dpi it is 413 by 531 pixels.",
        "It is not, though, any particular country's rule. Authorities that share a print size still differ on background colour, on how much of the frame the head must fill, and on what their online system wants, which is often nothing like the print size.",
        "The UK is the clean illustration. A printed UK passport photo is usually given as the familiar 35 by 45 mm rectangle, while the digital application asks for at least 600 by 750 pixels and a file between 50 KB and 10 MB. Assume the print size is the requirement and produce 413 by 531, and you are under the digital minimum on both axes.",
      ],
    },
    {
      heading: "Millimetres, inches and pixels are three different things",
      body: [
        "A print size describes ink on paper. A digital image has no physical size at all - it has a pixel count, and a pixel has no width until something decides to print it. The bridge between them is a resolution figure in dots or pixels per inch.",
        "The conversion is one line. There are 25.4 millimetres in an inch, so pixels equals millimetres divided by 25.4, times the dpi. For 35 by 45 mm at 300 dpi: 35 divided by 25.4 is 1.378 inches, times 300 is 413.4, so 413 pixels wide. The height comes out at 531.5, so 531 tall. At 600 dpi the same rectangle is 827 by 1063.",
        "Two notes on rounding. Fractional pixels do not exist, so round to the nearest whole one - but where a form states a minimum, round up, because 413.4 rounded down is short. And two inches is 50.8 mm, not 51. Specifications quoting 51 mm are rounding for convenience, harmless on paper and 602 pixels if you convert it literally.",
      ],
    },
    {
      heading: "What the dpi tag inside the file is doing",
      body: [
        "JPEG files carry a density field, a note saying print me at 300 per inch. Photo editors display it, EXIF viewers display it, and specifications that say 300 dpi minimum have taught a lot of people to worry about it.",
        "On a web upload it is almost always irrelevant. Changing that field from 72 to 300 adds no pixels and moves the file by a few bytes. Anything checking for detail counts pixels, because the pixels are the detail.",
        "So when a specification says 413 by 531 at 300 dpi, read the pixel figure as the requirement and the dpi as an explanation of where it came from. Relabelling a 200 by 250 photo as 300 dpi complies with nothing, and a tool offering to raise your dpi without changing dimensions is selling you a metadata edit.",
        "Two exceptions. If the photo will be printed, the tag tells the printer what physical size to make, so a wrong value puts the right pixels on the wrong-sized paper. And a few older systems built around scanners do read the field. If your form says so in writing, set it.",
      ],
    },
    {
      heading: "The rest of the numbers, and which of them a machine checks",
      body: [
        "A photo specification answers a short list of questions, and it helps to know which answers are checked automatically and which by a person. The automatic ones are pass or fail in the second after you press upload. The human ones come back days later with a rejection letter.",
        "The first group is mechanical, and software can produce it exactly. The second is photography, decided before the shutter. A cropping tool cannot see whether the wall behind you is evenly lit.",
        "One pairing causes most of the failures: a minimum pixel size together with a maximum file size. They pull in opposite directions, and the obvious response - shrinking the image to get under the byte cap - fails the check that runs first. Crop the background out instead, since file size follows detail, then compress.",
      ],
      bullets: [
        "Checked by code: pixel dimensions, aspect ratio, file format, file size against a maximum and sometimes a minimum, colour depth and colour space.",
        "Checked by code on some systems: compression ratio, embedded resolution, whether the file is actually the format its extension claims.",
        "Checked by a person: background colour and evenness, head position and size in the frame, expression, glasses, head covering, shadows, whether the photo is recent.",
        "Stated in words rather than numbers, and still enforced: plain background, in focus, unaltered, taken within the last six months.",
      ],
      callout: {
        tone: "info",
        text: "Aspect ratio is the constraint people miss. A form asking for exact pixel dimensions is also asking for a particular shape, and a square crop scaled to fit those numbers will either be rejected or silently stretched. Set the crop shape first, then the pixel numbers.",
      },
    },
    {
      heading: "Head height and background, the parts a tool cannot fix",
      body: [
        "Head height rules get quoted wrongly more often than any other number here, partly because authorities express them in incompatible ways. Some give a millimetre range from chin to crown, some a percentage of the frame height, and some publish a diagram with two arrows and no numbers in the text.",
        "Read that requirement on your own authority's page and compose to it when the photo is taken. It is the one thing you cannot fix afterwards. If the head was too small in the frame, cropping in throws away resolution you may need for a pixel minimum, and cropping out is impossible once the top of the head is at the edge.",
        "Background is the same kind of problem. Plain and light-coloured is a photography instruction, not an editing one - replacing a background digitally is what unaltered rules exist to exclude, and the result tends to be detectable at the hairline. Stand a metre or so from a plain wall so your shadow falls behind you.",
      ],
    },
    {
      heading: "Confirming your own specification in about ten minutes",
      body: [
        "The routine is short. Find the requirements page on the issuing authority's own domain, not an aggregator and not a photo shop. Read it in full rather than skimming for the size, because format, colour and file size rules sit in separate sentences from the dimensions. Then check your file against every constraint, including the ones that are words rather than numbers.",
        "Where the authority publishes example photos, look at them. They resolve questions the text leaves open - how much shoulder to include, how close is too close - faster than any written description.",
        "If a specification is genuinely ambiguous, take the stricter reading. A photo at the higher end of an allowed pixel range and comfortably inside a file size window passes either way. One sitting exactly on both boundaries passes only if your interpretation matches theirs.",
      ],
      callout: {
        tone: "warning",
        text: "Screenshot the requirements page with the date visible before you submit. Specifications change mid-cycle, and if an application comes back rejected it is useful to have the version of the rules you actually complied with.",
      },
    },
  ],
  relatedTools: [
    {
      label: "Document Photo Maker",
      href: "/image-tools/document-photo",
      description:
        "Crop to a required document shape and produce the file at exact pixel dimensions, compressing to a stated cap without changing the size. Carries the two verified specifications above as presets.",
    },
    {
      label: "Resize Image",
      href: "/image-tools/resize-image",
      description:
        "For when the crop is already right and you only need different pixel dimensions - the millimetre conversions above, for instance.",
    },
    {
      label: "Crop Image",
      href: "/image-tools/crop-image",
      description:
        "Set the aspect ratio the specification asks for before you touch the pixel numbers. Square for a US visa photo, portrait for a UK digital passport photo.",
    },
    {
      label: "Compress to Size",
      href: "/image-tools/compress-to-size",
      description:
        "State the byte limit and it finds the highest quality that fits under it, which is the second half of the minimum-pixels-against-maximum-kilobytes problem.",
    },
    {
      label: "Image Compressor",
      href: "/image-tools/compress-image",
      description:
        "A quality slider with a live size estimate, for working inside a file size window that has a floor as well as a ceiling.",
    },
  ],
  relatedGuides: ["compress-photo-to-20kb", "dv-lottery-photo-requirements"],
  faqs: [
    {
      question: "What size is a 35 by 45 mm photo in pixels?",
      answer:
        "413 by 531 pixels at 300 dpi, or 827 by 1063 at 600 dpi. The arithmetic is millimetres divided by 25.4, times the dpi. That conversion is reliable, but the 35 by 45 mm print size itself is a widely used convention rather than a universal rule, so confirm the size on your own authority's requirements page before you produce the file.",
    },
    {
      question: "Is the US visa photo really square?",
      answer:
        "Yes. The digital image must be square, at least 600 by 600 pixels and no more than 1200 by 1200, JPEG, 240 KB or less, in colour at 24 bits per pixel in sRGB, with a compression ratio of 20:1 or lower. A scanned photo comes from a 2 by 2 inch print at 300 ppi. The requirements are published at travel.state.gov.",
    },
    {
      question: "Why does my photo fail when the dimensions are correct?",
      answer:
        "Usually because a constraint other than the size was missed. Common causes are the wrong format, a file over the maximum or under the minimum, a photo saved in greyscale where colour was required, or an aspect ratio that does not match. Read the whole specification rather than the size line, and note whether the file size requirement is a range rather than a cap.",
    },
    {
      question: "Do I need to set my photo to 300 dpi?",
      answer:
        "Only if the form says so in writing, or if the photo will be printed. On a web upload the dpi field is metadata that changes nothing about the image. What matters is the pixel count, so produce the pixel dimensions the specification asks for and the dpi value takes care of itself.",
    },
    {
      question: "Can I trust a photo size table I find online?",
      answer:
        "Treat one as a starting point and nothing more, including this one. Requirements change, portals get rebuilt, and most published tables are uncited copies of each other. The only source that counts is the page belonging to the authority issuing your document, read on the day you submit.",
    },
  ],
};
