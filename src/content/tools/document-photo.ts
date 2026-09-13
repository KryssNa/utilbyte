import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const documentPhotoArticle: ToolArticleContent = {
  intro: [
    "Almost every application that matters - a passport, a visa, a competitive exam, a driving licence, a job portal - wants a photograph of your face at an exact size, and gives you three or four numbers to hit at once. So many pixels wide. So many tall. Under this many kilobytes, and sometimes over that many. Plain background. Head this proportion of the frame.",
    "The photo studio down the road will do it for you, and if your application is important you should probably let them. What this tool is for is the other case: you already have a usable photograph, the studio is closed, the deadline is tonight, and the portal has rejected your upload twice for reasons it will not explain.",
    "It does one narrow job well. You crop your face into the required shape, it produces the file at exactly the required pixel dimensions, and if there is a size cap it compresses down to fit without touching the dimensions - because on these forms the dimensions are the specification and the file size is just plumbing.",
  ],
  sections: [
    {
      heading: "What this tool can and cannot judge",
      body: [
        "It gets two things right: dimensions and file size. Those are the two constraints that are purely mechanical, and they are also the two that cause most automated rejections, because a portal can check them instantly and bounce you without a human ever looking.",
        "It cannot tell you whether your photo will be accepted. Head height as a proportion of the frame, eye line position, whether your expression is neutral enough, whether the background is uniform enough, whether you are wearing glasses that catch the light, whether the photo is recent enough - all of that is judged by a person or a biometric checker at the other end, and none of it is something a cropping tool can assess.",
        "Any site that tells you your photo is guaranteed to be accepted is selling you something. Check the exported dimensions and byte size, and read the actual requirements for the actual document. They are usually one page long and worth the five minutes.",
      ],
    },
    {
      heading: "Where the preset numbers come from",
      body: [
        "The US presets link to the relevant Department of State guidance. A checked source confirms the listed specification, not the acceptability of your exported photo. Read the instructions for your specific application before choosing a preset.",
        "Diversity Visa entry photos must be exactly 600 x 600 pixels, JPEG, and no larger than 240 kB. The broader US visa digital-image guidance allows square images from 600 x 600 to 1200 x 1200 pixels. The 1200-pixel preset is not a DV entry preset. Pixel dimensions and file size alone do not check composition, color space, compression ratio or acceptance.",
        "The rest are widely-used standards rather than verified specifications. The 35 x 45 mm print size is derived from the ICAO travel document standard and is used by most passport authorities outside the United States, which is why it appears here at both 300 and 600 dpi. The exam portal presets reflect what South Asian competitive exam systems commonly ask for. Both are marked as unverified on purpose, because they vary by country, by exam, and sometimes between sessions of the same exam.",
      ],
      bullets: [
        "Verified presets link to the authority's own page. Read it.",
        "Unverified presets are a sensible default, not a rule.",
        "When your form states its own numbers, use the custom option and type them in.",
      ],
    },
    {
      heading: "UK digital passport photos: use the official upload workflow",
      body: [
        "GOV.UK says a photo taken on your own device should include your head, shoulders and upper body, and should not be cropped: the passport application handles that. It also requires the image to be unaltered by computer software. This cropping tool therefore has no UK digital passport preset.",
        "Follow the current GOV.UK digital passport photo instructions and submit the original through the official application, or use a photo code from a photo booth or shop. Do not crop an image here and assume that matching a pixel size makes it compliant.",
      ],
    },
    {
      heading: "The two-constraint problem, and how to get out of it",
      body: [
        "The awkward part of these specifications is that they pull in opposite directions. A minimum pixel size pushes the file up. A maximum file size pushes it down. When both are tight - 600 x 600 pixels and under 240 KB, say - you can end up unable to satisfy both by fiddling with quality.",
        "The tool never resolves that by shrinking your image, because the dimensions are the thing being checked. Instead it compresses as far as it sensibly can and, if that is not enough, tells you.",
        "When you hit that, the lever that actually works is the crop. File size tracks how much detail is in the picture, and background is detail. A head-and-shoulders crop encodes far smaller than the same face with a metre of wall around it - and most document specifications want the tight crop anyway. Cropping in is usually both the correct composition and the fix for the size limit.",
        "Some systems also set a minimum file size. The tool flags a result below the configured floor. Only choose larger pixel dimensions when the application permits them; a DV entry still requires exactly 600 x 600 pixels.",
      ],
    },
    {
      heading: "Getting a usable source photo",
      body: [
        "The tool can only work with what you give it. A few things make the difference between a crop that looks like a document photo and one that obviously started life as a holiday snap.",
        "Stand about two metres from a plain, light, evenly lit wall, and have someone photograph you from a couple of metres away rather than at arm's length - a phone held close distorts the nose and cheeks noticeably, which is exactly what biometric checks look at. Face a window if you can, so the light comes from in front rather than above. Avoid a flash, which produces hard shadows behind the head and red-eye.",
        "Shoot in landscape or portrait, whichever gives you room to crop, and do not zoom in with the camera. Fill the frame in the crop step here instead - you keep more pixels that way and you can adjust the composition without retaking anything.",
      ],
    },
    {
      heading: "Why this runs in your browser",
      body: [
        "A passport photo is a biometric identifier of a specific named person, usually being prepared alongside a passport number, a date of birth and an address. It is close to the worst category of file to upload to a free website you found through a search result.",
        "Everything here happens in the page. The crop is drawn to a canvas in your own browser, the compression runs on your own processor, and the download comes from memory. There is no server copy because there is no server involved.",
        "As with the rest of this site, you do not need to trust that. Load the page, turn off your network, and use it. If it still works, nothing was being sent anywhere.",
      ],
    },
  ],
  example: {
    title: "A phone photo turned into a US Diversity Visa entry photo",
    input: "IMG_0912.jpg\n3024 x 4032 px, 3.6 MB\nTaken indoors against a cream wall\nSpec: exactly 600 x 600 px, JPEG, max 240 kB",
    output: "Crop: 1:1 frame, zoomed to 1.35x, head and shoulders\nRendered at 600 x 600 px\nFirst encode at quality 95: 121 KB\n\nResult: 600 x 600 px, 121 KB\nUnder the 240 KB cap, no compression pass needed",
    note: "This is an illustrative outcome, not a predicted file size or acceptance result. DV entry dimensions stay at exactly 600 x 600 pixels; do not choose the 1200-pixel general visa preset. Review composition and the current application instructions as well as the exported file.",
  },
  limitations: [
    "It checks dimensions and file size. It cannot assess head position, background uniformity, expression, lighting or glasses glare, and it cannot predict whether an application will be accepted.",
    "US presets link to official sources, but the tool does not verify every photo requirement. Other presets are unverified examples and may not match your document, exam or country.",
    "Specifications change without notice, sometimes between sessions of the same exam. Read the current requirements before submitting; do not rely on a number cached in a tool.",
    "Output is JPEG with a white background behind any transparency. There is no PNG option, because almost no document system accepts one.",
    "There is no background removal or replacement. If your background is patterned or dark, retake the photo — editing it is the kind of alteration most authorities explicitly prohibit.",
    "One photo at a time, and no printed sheet layout. If you need six copies on a 4x6 print, that is a different job.",
  ],
};
