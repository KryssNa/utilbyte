import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const removeBackgroundArticle: ToolArticleContent = {
  intro: [
    "You have a product shot on a white sweep, or a logo someone sent as a JPEG with a solid colour behind it, and you need it on a transparent background so it can sit on a coloured page or a slide.",
    "It is worth being precise about what this tool is, because the category is full of overclaiming. This is colour-based background removal, not a trained segmentation model. It looks at the four corners of your image, works out the background colour from them, and then makes every pixel within a tolerance of that colour transparent. You can override the detected colour by clicking the exact shade you want removed, and you can widen or narrow the tolerance.",
    "That approach is very good at one specific job and genuinely bad at everything else. Knowing which situation you are in before you start will save you a lot of time.",
  ],
  sections: [
    {
      heading: "How colour keying works, and what tolerance actually controls",
      body: [
        "Every pixel has a red, green and blue value. The tool treats those three numbers as a position in space and measures the straight-line distance from each pixel to the background colour. If that distance is under the threshold, the pixel becomes transparent. If it is over, the pixel stays.",
        "The tolerance slider is that threshold, expressed as a percentage of the maximum possible distance between two colours. Low tolerance removes only shades very close to the sampled colour. High tolerance removes a wider band.",
        "This is why the setting is so sensitive on real photographs. A white studio background is never actually one colour - it is a gradient from bright white near the light to light grey in the corners, with a soft shadow under the subject. Too low a tolerance leaves a grey halo. Too high and it starts eating the white of a shirt or the highlight on a product.",
        "The practical method is to start low and increase until the background is gone, then stop. If you reach the point where parts of the subject start disappearing before the background is fully clear, the tolerance approach has hit its limit on that image and no setting will fix it.",
      ],
    },
    {
      heading: "Where this works well",
      body: [
        "Anything shot deliberately against a plain, evenly lit background. E-commerce product photography on a white sweep is the canonical case, and it is the reason white sweeps exist.",
        "Flat graphics: logos, icons, illustrations, screenshots of a UI element on a solid panel. These have hard edges and genuinely uniform backgrounds, so the mask comes out clean with almost no tuning.",
        "Anything shot against a green or blue screen, which is the same technique the film industry has used for decades and works for exactly the reason described above - the background colour is deliberately chosen to be nowhere near any colour in the subject.",
      ],
      bullets: [
        "Product on a white or grey sweep: usually clean.",
        "Logo or icon on solid colour: usually perfect.",
        "Green or blue screen: what the technique was designed for.",
        "Screenshot of a UI element on a flat panel: usually perfect.",
      ],
    },
    {
      heading: "Where it fails, and why no slider will save it",
      body: [
        "Hair and fur are the hardest case. A strand of hair is thinner than a pixel in places, so the pixel is part hair and part background - a blend. There is no threshold that classifies a blended pixel correctly, so you either lose the hair or keep a fringe of background colour around it. This is the specific problem that trained segmentation models exist to solve, and colour keying cannot.",
        "Anything transparent or reflective: glass, bottles, jewellery, spectacle lenses, water. The background shows through the subject, so removing the background colour also punches holes in the object.",
        "Low contrast between subject and background. A white mug on a white sweep, a black jacket on a dark grey backdrop. If the subject contains colours close to the background, they will be removed too.",
        "Busy or outdoor backgrounds. A photo taken in a room or a street has hundreds of background colours and no dominant one. The corner-sampling step will pick something arbitrary and the result will be nonsense.",
        "Uneven lighting on a plain background, which is the one that surprises people, because the background looks plain to the eye. A gradient across a wall spans a wide enough range of values that no single threshold covers all of it without also taking part of the subject.",
      ],
    },
    {
      heading: "One case where you should not use this at all",
      body: [
        "Document and passport photographs. Visa, passport and exam authorities generally require a plain background, and people reasonably conclude that editing one in is the solution.",
        "It is not. Those specifications almost always also prohibit digital alteration of the photograph, and the checks are looking for exactly this - a subject cut out and pasted onto a flat colour has telltale edges that both a person and an automated checker can spot. A rejected application costs weeks.",
        "The correct fix is to retake the photo against a real plain wall in even light. If you need help with the dimensions and file size afterwards, that is what the document photo tool is for.",
      ],
    },
  ],
  example: {
    title: "A product shot on a studio sweep",
    input: "sneaker-white-bg.jpg\n2000 x 2000 px, 1.1 MB\nStudio white sweep, soft shadow under the shoe\nCorners sampled: #FAFAFA",
    output: "Tolerance 12  -> grey halo remains where the sweep falls off toward the corners\nTolerance 22  -> background clean, shadow partly removed\nTolerance 34  -> white midsole stripe starts disappearing\n\nChosen: 22\nOutput: PNG with alpha, 2000 x 2000 px, 840 KB",
    note: "The useful range on this image was about ten points wide, and the upper bound was set by the shoe containing white, not by the background. That is the normal situation: tolerance is bounded above by the lightest part of your subject. Note also that the soft shadow went with the background - colour keying cannot distinguish a shadow on the sweep from the sweep itself, so if you want a shadow you have to add one back afterwards.",
  },
  limitations: [
    "This is colour-distance keying, not a trained segmentation model. It cannot separate a subject from a busy or outdoor background, and no tolerance setting changes that.",
    "Hair, fur, glass and anything semi-transparent will not come out cleanly. Blended edge pixels have no correct answer under a threshold.",
    "The background colour is guessed from the four corners. If your subject reaches into a corner, or the corners differ, use the colour picker to set it manually.",
    "Shadows are removed along with the background, because they are the background colour at a different brightness.",
    "Do not use this for passport or visa photographs. Most authorities prohibit digitally altered backgrounds and the edit is detectable.",
    "There is no edge refinement, feathering or manual brush. What the threshold produces is what you get - anything important will need touching up in a real editor.",
    "Files are limited to 20 MB, and one image at a time.",
  ],
};
