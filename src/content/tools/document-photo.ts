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
        "Any site that tells you your photo is guaranteed to be accepted is selling you something. Treat the mechanical part as solved here, and read the actual requirements for the actual document. They are usually one page long and worth the five minutes.",
      ],
    },
    {
      heading: "Where the preset numbers come from",
      body: [
        "Two of the presets are marked as verified. Those were checked against the issuing authority's own published specification and link straight to it, so you can read the source rather than trusting a badge.",
        "The US visa and Diversity Visa spec is unusually precise and unusually strict: square, between 600 x 600 and 1200 x 1200 pixels, JPEG, 240 kilobytes or less, colour at 24 bits per pixel in sRGB, with a compression ratio no worse than 20:1. The UK passport service asks for at least 600 pixels wide by 750 tall, and a file between 50 KB and 10 MB - note the floor as well as the ceiling, which catches people out.",
        "The rest are widely-used standards rather than verified specifications. The 35 x 45 mm print size is derived from the ICAO travel document standard and is used by most passport authorities outside the United States, which is why it appears here at both 300 and 600 dpi. The exam portal presets reflect what South Asian competitive exam systems commonly ask for. Both are marked as unverified on purpose, because they vary by country, by exam, and sometimes between sessions of the same exam.",
      ],
      bullets: [
        "Verified presets link to the authority's own page. Read it.",
        "Unverified presets are a sensible default, not a rule.",
        "When your form states its own numbers, use the custom option and type them in.",
      ],
    },
    {
      heading: "The two-constraint problem, and how to get out of it",
      body: [
        "The awkward part of these specifications is that they pull in opposite directions. A minimum pixel size pushes the file up. A maximum file size pushes it down. When both are tight - 600 x 600 pixels and under 240 KB, say - you can end up unable to satisfy both by fiddling with quality.",
        "The tool never resolves that by shrinking your image, because the dimensions are the thing being checked. Instead it compresses as far as it sensibly can and, if that is not enough, tells you.",
        "When you hit that, the lever that actually works is the crop. File size tracks how much detail is in the picture, and background is detail. A head-and-shoulders crop encodes far smaller than the same face with a metre of wall around it - and most document specifications want the tight crop anyway. Cropping in is usually both the correct composition and the fix for the size limit.",
        "The opposite problem is rarer but real. Some systems set a minimum file size, on the theory that a very small file means a very low quality scan. If your crop is plain enough to fall under that floor, the tool flags it, and a larger pixel preset is the usual answer.",
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
    input: "IMG_0912.jpg\n3024 x 4032 px, 3.6 MB\nTaken indoors against a cream wall\nSpec: square, 600-1200 px, JPEG, max 240 KB",
    output: "Crop: 1:1 frame, zoomed to 1.35x, head and shoulders\nRendered at 600 x 600 px\nFirst encode at quality 95: 121 KB\n\nResult: 600 x 600 px, 121 KB\nUnder the 240 KB cap, no compression pass needed",
    note: "The interesting part is that no compression was necessary. A tight 600 x 600 crop of a face simply does not contain enough detail to reach 240 KB at high quality. People run into the size limit when they submit a wide shot at 1200 x 1200 - the extra pixels and the extra background are what push it over. If you are fighting the cap, crop tighter before you reduce quality.",
  },
  limitations: [
    "It checks dimensions and file size. It cannot assess head position, background uniformity, expression, lighting or glasses glare, and it cannot predict whether an application will be accepted.",
    "Only two presets are verified against an issuing authority. The others are common standards and may not match your specific document, exam or country.",
    "Specifications change without notice, sometimes between sessions of the same exam. Read the current requirements before submitting; do not rely on a number cached in a tool.",
    "Output is JPEG with a white background behind any transparency. There is no PNG option, because almost no document system accepts one.",
    "There is no background removal or replacement. If your background is patterned or dark, retake the photo — editing it is the kind of alteration most authorities explicitly prohibit.",
    "One photo at a time, and no printed sheet layout. If you need six copies on a 4x6 print, that is a different job.",
  ],
};
