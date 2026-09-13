import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const compressImageArticle: ToolArticleContent = {
  intro: [
    "Most people arrive at a page like this because a number somewhere refuses to move. A government form that will not accept a photo over 100 KB. A mail server that bounces the attachment at 25 MB. A product page that takes eight seconds to load on a phone because someone dropped a 6 MB camera file straight into it. The limit is fixed and your photo is not.",
    "This tool takes one image, draws it onto a canvas inside your browser, and re-encodes it as a JPEG at whatever quality you choose between 10 and 100. Nothing is uploaded. The estimate under the slider runs that same encode about a sixth of a second after you stop dragging, so you can see what the file will weigh before you commit to it.",
    "One thing to know before you start: this tool does not touch pixel dimensions. A 4032 x 3024 photo comes back 4032 x 3024. Only the number of bytes spent describing each pixel changes. If the thing you are fighting also has a dimension rule, resize first and compress second.",
  ],
  sections: [
    {
      heading: "What the quality slider is actually doing",
      body: [
        "JPEG cuts the image into small blocks, describes each block as a set of frequency coefficients, then divides those coefficients by a table of numbers and rounds the result. The quality setting scales that table. Round coarsely and most of the coefficients collapse to zero, which is why the file gets smaller. What you lose is the finest variation inside each block, which is the part your eye checks last.",
        "That is why the loss is not spread evenly across a picture. Broad shapes and colour survive a long way down. The first things to break are hard edges sitting against flat areas, which means text, logos and thin lines, and smooth gradients like a clear sky or a studio backdrop, which start to show banding and a faint halo around contrast edges.",
        "The mapping from quality to file size is not linear either. Going from 100 to 90 costs almost nothing you can see and often removes half the file. Going from 60 to 50 saves much less and shows much more. The four presets in the sidebar are stops along that curve: 40, 60, 80 and 95. It is also worth knowing that Chrome, Firefox and Safari each ship their own JPEG encoder, so the same quality number can produce slightly different file sizes depending on where you run it.",
      ],
    },
    {
      heading: "Getting under a hard limit for a form upload",
      body: [
        "Exam boards, visa applications, university admission portals and government job sites tend to cap uploads at 20 KB, 50 KB, 100 KB or 200 KB, and they reject the file rather than shrinking it for you. There is no target box here where you type 50 KB and let the tool solve for quality. You drag, read the estimate, and adjust. The slider moves in steps of 5 and stops at 10.",
        "If you are a long way from the target, though, quality is the wrong lever to pull. Squeezing a 12 megapixel photo into 50 KB leaves the encoder about a thirtieth of a byte per pixel, and it has no choice but to wreck the picture. Cut the pixel dimensions first, then compress. A 600 x 800 photo saved at quality 70 will look far better than the same shot at 4032 x 3024 forced down to the same 50 KB, and portals that cap size in kilobytes almost always specify dimensions too.",
      ],
      bullets: [
        "Read the portal instructions for pixel dimensions, not just the KB cap.",
        "Resize to those dimensions first, then come back here.",
        "Start at 80 and drag down until the estimate sits just under the limit.",
        "Leave some headroom. A 50 KB cap means under 50 KB, and the final file can land a little either side of the estimate.",
        "Open the downloaded file and look at it at full size before you submit it.",
      ],
    },
    {
      heading: "Why saving a JPEG again always costs you something",
      body: [
        "When you feed an existing JPEG in here, the browser decodes it back to pixels and this tool encodes it again from scratch. The second encode has no idea which detail the first one already discarded. It just quantises whatever it is given, including the block edges and ringing left behind by the earlier save, which then get baked in as if they were real content. Photographers call this generation loss, and it accumulates.",
        "The practical effect is that compressing the same picture five times at quality 90 leaves you with a worse image than compressing the original once at 70, and usually a bigger file as well. Keep the original somewhere and work from it each time rather than from your last export.",
        "The same reasoning explains an odd result you may see here. Set quality to 95 on a photo your phone already compressed and the estimate can come out larger than the file you started with. The tool marks it in amber when that happens. Those extra bytes are not extra detail. They are the encoder faithfully describing the previous encoder's mistakes.",
      ],
    },
    {
      heading: "When JPEG is the wrong wrapper for the job",
      body: [
        "This tool writes JPEG, whatever you put in. For photographs that is the correct default and there is not much to think about. For other kinds of image it is a bad trade, and no quality setting rescues it. JPEG also has no alpha channel, so a PNG with a transparent background comes out of here opaque, with black where the transparency used to be.",
        "If you are optimising images for a site you control rather than satisfying an upload form, format is usually a bigger lever than quality. WebP typically lands 25 to 35 percent below JPEG at the same visual quality and it keeps transparency. This tool will not produce it. Our format converter handles that side of the job.",
      ],
      bullets: [
        "Photographs and camera output: JPEG is right, and this is the tool.",
        "Screenshots, charts, line drawings, logos, anything with flat colour and hard edges: PNG is usually both smaller and exact.",
        "Anything that needs a transparent background: not JPEG at all.",
        "Images for a website you control: consider WebP before you consider a lower quality number.",
      ],
    },
  ],
  example: {
    title: "A 12 megapixel phone photo at five quality settings",
    input: "IMG_4471.JPG\n4032 x 3024 px\n4.2 MB, JPEG straight off the phone",
    output:
      "Quality 95  ->  4.9 MB   (+17%)\nQuality 80  ->  1.4 MB   (-67%)\nQuality 60  ->  812 KB   (-81%)\nQuality 40  ->  514 KB   (-88%)\nQuality 20  ->  286 KB   (-93%)\n\nDownloaded file: compressed-IMG_4471.JPG.jpg\nStill 4032 x 3024 px",
    note:
      "Three things are visible in those numbers. The jump from 95 to 80 removes two thirds of the file and is very hard to see on a photograph. Below about 60 the savings flatten out while the damage does not, so each further step buys less and costs more. And quality 95 produced a bigger file than the camera did, because the phone had already compressed this shot once. Note also that the dimensions never moved, and the download name is the original filename with .jpg added on the end.",
  },
  limitations: [
    "The output is always JPEG. A PNG, a WebP or a screenshot all come back as .jpg, and the download is named by adding .jpg to the original filename, so you can end up with something like compressed-shot.png.jpg.",
    "Transparency is discarded. JPEG has no alpha channel, so transparent areas are filled in during encoding and come back solid black.",
    "The loss cannot be undone. Compressing at 40 and then re-compressing that file at 95 does not bring detail back, it only makes a larger file. Keep your original.",
    "There is no target size field and no batch mode. You cannot ask for 50 KB and have the quality solved for you, and you work on one image at a time. Dropping a new file replaces the one you were working on.",
    "Everything runs in the tab, on a 20 MB per file limit, and a browser canvas holds four bytes per pixel while it works. Very large images can be slow or can fail outright on a phone. The re-encode also drops EXIF metadata, so capture date, camera model and any GPS coordinates are gone from the file you download.",
  ],
};
