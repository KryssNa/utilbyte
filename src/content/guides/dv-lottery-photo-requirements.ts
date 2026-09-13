import type { Guide } from "@/content/guides/types";

export const dvLotteryPhotoRequirementsGuide: Guide = {
  slug: "dv-lottery-photo-requirements",
  title: "US visa and Diversity Visa photos: check the right specification",
  metaTitle: "DV Photo Requirements: Dimensions, Format and Limits",
  metaDescription: "Distinguish the DV entry photo from general US visa image requirements. Check the official photo rules, file limits and composition before submitting.",
  keywords: ["dv lottery photo requirements", "us visa photo size", "600x600 photo 240kb", "diversity visa photo"],
  published: "2026-08-24",
  updated: "2026-09-12",
  readingMinutes: 5,
  summary: "The Diversity Visa entry instructions specify a 600 by 600 pixel image. The general US visa digital-image page gives a wider range. Use the requirements for your actual application, then check composition as well as the file.",
  intro: [
    "A photo can have the right number of pixels and still be unsuitable for an application. File dimensions, format and size are only part of the task; how the photograph was taken and whether it reflects your appearance also matter.",
    "This guide is a photo-preparation reference, not an eligibility assessment or a submission service. UtilByte can help with image dimensions and file size. It cannot certify that an authority will accept a photograph.",
  ],
  sections: [
    {
      heading: "Use the application-specific photo instructions",
      body: [
        "The State Department’s Diversity Visa entry section specifies a square 600 × 600 pixel JPEG no larger than 240 kB. Its separate general digital-image page permits square images from 600 × 600 through 1200 × 1200. The general range does not replace the more specific DV entry requirement.",
        "Official DV photo section: https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html",
        "General digital-image requirements: https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/digital-image-requirements.html",
        "Open the official page and the instructions for the program year and application form you are using before editing your file. Requirements for an entry, a visa application and an interview need not be identical.",
      ],
    },
    {
      heading: "Dimensions and file size measure different things",
      body: [
        "Pixel dimensions describe the image grid; file size measures the encoded file. A square crop changes the composition. Resizing changes the number of pixels. JPEG quality changes the encoding and may discard detail. Renaming a file does not convert its format.",
        "Use the original photograph as your source and edit a copy. Do not stretch a rectangular image into a square, or assume that enlarging a small image will restore missing facial detail. If the source is soft, obstructed or poorly lit, retaking it is more useful than repeated compression.",
        "The general digital-image requirements specify 24-bit sRGB color and a compression ratio no greater than 20:1. Check those instructions together with the application-specific requirements; a file below the maximum size is not automatically suitable.",
      ],
      callout: {
        tone: "warning",
        text: "There is no official minimum JPEG byte count established by this guide. Dividing an assumed uncompressed RGB buffer size by 20 is an illustrative calculation, not a documented description of an application checker. Do not pad a small file or treat a particular KB range as proof of compliance.",
      },
    },
    {
      heading: "Check the photograph before adjusting the file",
      body: [
        "The State Department specifies a recent photo against white or off-white, a neutral expression and both eyes open. Its composition rules and examples cover head position, clothing, glasses and exceptions. Review them directly rather than applying passport advice from another country.",
        "A converter cannot establish that a face is unobstructed, that the background is acceptable, or that the image is recent. Avoid filters or edits that change appearance. Keep the original so you can compare it with the exported copy.",
        "Photo requirements and composition references: https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html",
      ],
    },
    {
      heading: "Prepare a copy and inspect the final export",
      body: [
        "Read the applicable instructions first. Where cropping is permitted, set the shape while preserving the required head position, then set the specified pixel dimensions. Export a genuine JPEG and inspect both the image and the file properties.",
        "If the file exceeds the stated limit, reduce JPEG quality gradually and compare the result. Stop if detail becomes visibly degraded; reaching a small byte count is not more important than an acceptable photograph. A target-size tool may change dimensions if allowed by its settings, so check the final pixel dimensions again.",
        "UtilByte’s Document Photo preset is a starting setting, not an official validation result. Confirm the output dimensions, file size and appearance yourself. Browser encoding behavior and the receiving portal’s validation remain separate from the tool’s preview.",
      ],
    },
    {
      heading: "Check program dates and fees separately",
      body: [
        "Photo preparation does not establish that a DV entry period is open. The Department publishes registration instructions for each program year. Use its current notices and the official entry site for dates, eligibility, documentation and any applicable payment instructions; this guide does not publish a live program-status claim.",
        "Entry instructions: https://travel.state.gov/content/travel/en/us-visas/immigrate/diversity-visa-program-entry/diversity-visa-submit-entry1.html",
        "Official entry site: https://dvprogram.state.gov/",
        "A notice’s publication or effective date is not necessarily an entry-opening or selection-results date. Do not infer a deadline from a previous year’s calendar.",
      ],
    },
  ],
  relatedTools: [
    { label: "Document Photo", href: "/image-tools/document-photo", description: "Prepare a copy using preset or custom dimensions, then verify the exported file." },
    { label: "Resize Image", href: "/image-tools/resize-image", description: "Set pixel dimensions where resizing is permitted by your application instructions." },
    { label: "Compress Image", href: "/image-tools/compress-image", description: "Adjust JPEG quality gradually and compare the actual result." },
  ],
  relatedGuides: ["document-photo-sizes", "compress-photo-to-20kb"],
  faqs: [
    { question: "Can I use the general US visa pixel range for a DV entry?", answer: "Follow the DV-specific dimensions rather than substituting the general visa range. Check the official photo section and the instructions for the program year before submitting." },
    { question: "Is a file under 240 kB automatically acceptable?", answer: "No. Dimensions, format, color, composition and other applicable requirements still matter. A small file or a successful tool export is not an approval decision." },
    { question: "When does the next DV entry period open?", answer: "This photo guide does not maintain a live registration calendar. Check the State Department’s current entry instructions and dvprogram.state.gov; do not infer dates from earlier years or a rule’s publication date." },
    { question: "Can UtilByte certify my visa photo?", answer: "No. The tool prepares an image file but does not determine eligibility, assess all composition requirements or guarantee acceptance." },
  ],
};
