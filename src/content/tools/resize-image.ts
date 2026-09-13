import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const resizeImageArticle: ToolArticleContent = {
  intro: [
    "Resizing sounds like the simplest thing you can do to an image, and it mostly is, right up until something asks for a specific number and you have no idea which number it means. A visa portal wants 600 by 600 pixels. A print shop wants 300 DPI. A marketplace listing wants 1200 pixels on the long edge. Those are three different kinds of instruction and only one of them is actually about the image file.",
    "The tool on this page changes the pixel dimensions of an image and nothing else. You give it a width and a height, it redraws the picture at that size using the browser canvas, and you get the new file back. There are presets for the sizes people ask for most often, and an aspect ratio lock so the second number follows the first.",
    "The rest of this page is the context that makes those numbers make sense, because picking the wrong one is a much more common problem than the resize itself failing.",
  ],
  sections: [
    {
      heading: "Pixels are the only dimension a file really has",
      body: [
        "An image file stores a grid of pixels. A 1920 by 1080 photo has 2,073,600 of them and that is the whole truth of its size. Everything else - inches, centimetres, DPI - is a note about how you would like those pixels printed, and a screen ignores it completely.",
        "This is why DPI causes so much confusion. A file tagged 72 DPI and the same file tagged 300 DPI look identical in a browser, on a phone, in an email. The tag only matters at the moment something physically prints. If a form asks for a 3.5 by 4.5 cm photo at 300 DPI, what it is really asking for is roughly 413 by 531 pixels, and if you send exactly that, the DPI tag is a formality.",
        "So when you are given a measurement in inches or centimetres, multiply by the DPI to get pixels, set those pixels here, and stop worrying about the tag.",
      ],
      bullets: [
        "Screen work: think in pixels only. DPI is noise.",
        "Print work: pixels = physical size x DPI. A 4x6 inch print at 300 DPI needs 1200x1800 px.",
        "Document photos: the pixel count is what gets validated, not the DPI field.",
      ],
    },
    {
      heading: "The aspect ratio lock, and what happens when you break it",
      body: [
        "With the lock on, typing a width sets the height to match the original proportions. Nothing is distorted and nothing is lost except overall size. This is what you want almost always.",
        "Turn it off and you can type any two numbers, but the picture gets stretched to fit them. A face resized from 4:3 into a square gets visibly wider. People do this by accident constantly, usually because a form specified a square and the photo was not one.",
        "When the required shape does not match what you have, resizing is the wrong tool. Crop first to get the right proportions, then resize the cropped result to the exact pixel count. Crop decides what is in the frame, resize decides how many pixels the frame is made of. Doing it in that order is the difference between a photo that gets accepted and one that comes back rejected for looking wrong.",
      ],
    },
    {
      heading: "Upscaling cannot invent detail",
      body: [
        "Making an image smaller throws pixels away, and it does that gracefully. Averaging four pixels into one is a reasonable thing to do and downscaled images usually look fine, sometimes better than the original because noise gets averaged out too.",
        "Going the other way is guesswork. Asking for 2000 pixels from an 800 pixel original means the browser has to invent 1200 pixels of information it was never given. Canvas interpolation does this by smoothly blending neighbours, which produces a larger file that is softer than the original and no more detailed. Text gets mushy, edges get a faint halo.",
        "There is no setting here that fixes that, because it is not a settings problem. If you need a genuinely larger image, the answer is a larger source. Rescan at a higher resolution, re-export from the original, or take the photo again closer. An upscale is worth doing when a system demands minimum dimensions and will reject a smaller file outright, and it is worth avoiding in every other case.",
      ],
    },
    {
      heading: "The sizes people actually need",
      body: [
        "The presets cover the common screen and social cases, and they exist mostly so you do not have to look up numbers you will forget again by next week.",
        "Document and identity photos are the ones worth knowing properly, because they are validated strictly and a rejection costs you a week. Those specs come as a pixel range plus a file size cap, and the two constraints fight each other: hitting the pixel minimum makes the file bigger, hitting the size cap means compressing harder. Resize first to land inside the allowed dimensions, then compress to get under the byte limit.",
      ],
      bullets: [
        "HD 1280x720, Full HD 1920x1080, 4K 3840x2160 - video frames and desktop wallpaper.",
        "Instagram 1080x1080 square, Facebook 1200x630, Twitter 1200x675 - link previews and feed posts.",
        "Thumbnail 150x150 and Icon 64x64 - avatars, favicons, list rows.",
        "US visa and DV photos are square, minimum 600x600 and maximum 1200x1200 pixels.",
        "Indian and Nepali exam portals commonly ask for a passport photo around 200x230 px and a signature strip around 140x60 px, each under a stated KB limit.",
      ],
    },
  ],
  example: {
    title: "A phone photo cut down for a marketplace listing",
    input: "IMG_4471.jpg\n4032 x 3024 px (4:3)\n3.8 MB",
    output: "Aspect lock: on\nWidth set to 1200 -> height follows to 900\n1200 x 900 px\n412 KB",
    note: "Only the width was typed. The height followed the original 4:3 proportion, so nothing was stretched. The file dropped to about a tenth of its size purely from having fewer pixels to store - no quality setting was touched. Had the listing demanded a square, the right move would have been to crop to 1:1 first and then resize to 1200x1200.",
  },
  limitations: [
    "Resizing changes dimensions, not compression. If you need to hit a specific KB limit, resize here and then run the result through the image compressor - the two jobs are separate on purpose.",
    "Upscaling produces a bigger, softer image and never recovers detail that was not in the source. No interpolation setting changes that.",
    "There is no crop here. If the target shape differs from your original, use the crop tool first or the picture will be stretched.",
    "Very large images are limited by browser memory and by the maximum canvas size, which varies by browser and device. A 100 megapixel file may fail on a phone and succeed on a desktop.",
    "Files are handled one at a time. There is no batch mode for resizing a folder of images to the same dimensions.",
  ],
};
