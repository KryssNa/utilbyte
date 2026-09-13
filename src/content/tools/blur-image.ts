import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const blurImageArticle: ToolArticleContent = {
  intro: [
    "Two quite different reasons bring people to a blur tool. One is aesthetic: you want a soft background for a slide, a header image that text will sit on top of, a thumbnail that hints at a photo without showing it. The other is redaction: there is a face, a number plate, a home address or an account number in the picture and it needs to stop being readable before you send it anywhere.",
    "The second reason is the serious one, and it is worth saying up front that this page applies its effect to the whole image, not to a selected rectangle. If you only want to obscure one part of a photo, the honest workflow is to crop the sensitive region out into its own file, blur that, and rebuild - or use an editor with a region tool. Blurring the entire image and hoping nobody notices the important bit is a common mistake.",
    "What the tool does do is give you two genuinely different ways of destroying detail, at whatever strength you choose, without your file leaving the browser.",
  ],
  sections: [
    {
      heading: "Gaussian blur and pixelation are not the same operation",
      body: [
        "Gaussian blur averages each pixel with its neighbours, weighted by distance. The result is smooth and continuous. Detail is spread outward rather than removed in discrete chunks, which is why a lightly blurred photo still reads as the same scene - your eye reconstructs a lot from the remaining gradients.",
        "Pixelation does something cruder. The image is scaled down to a fraction of its size and then scaled back up with smoothing turned off, so each output block is a flat average of everything that was inside it. Detail inside a block is genuinely gone, replaced by one colour.",
        "For redaction, pixelation at a large block size is the more predictable of the two, because you can reason about it: if a character of text was six pixels wide and your block size is forty, that character contributed a fraction of one block's average colour and nothing about its shape survives. Gaussian blur has no equivalent guarantee - a weak blur leaves a surprising amount of structure behind.",
      ],
      bullets: [
        "Gaussian: smooth, natural-looking, good for backgrounds and aesthetic softening.",
        "Pixelate: blocky and obvious, easier to reason about, better for hiding text and faces.",
        "Both work on the whole image here. Crop first if you only need part of it obscured.",
      ],
    },
    {
      heading: "How strong is strong enough to be irreversible",
      body: [
        "This matters more than most people realise. Light pixelation of text has been reversed before - if an attacker knows the font, the possible characters and the block grid, they can render every candidate string, apply the same pixelation, and match the output. The technique is well documented and it works on short, predictable strings like account numbers and street names.",
        "The defence is to make the operation destroy far more information than the attacker needs. As a rule of thumb, a block should be large enough that several characters fall inside a single block, not several blocks per character. If the text in your image is about twenty pixels tall, a block size of five is decoration and a block size of forty is redaction.",
        "For faces, the same logic applies at a larger scale. A face that occupies two hundred pixels needs blocks in the tens of pixels before identification becomes genuinely hard.",
        "If the information is sensitive enough that you are worried about a determined attacker rather than a casual viewer, do not blur it at all. Draw a solid block over it, or crop it out of the file entirely. Removing pixels beats obscuring them.",
      ],
    },
    {
      heading: "The trap: blur in an image versus blur in a document",
      body: [
        "This is where people get genuinely burned, and it is worth understanding even though it is not about this tool.",
        "When you blur or pixelate an image, the operation rewrites the pixels. The original values are gone from the output file - there is nothing underneath to recover, because a raster image has no layers by default.",
        "Drawing a blur or a black rectangle over text in a PDF, a Word document or a design file is a completely different thing. Those formats store content as objects. A shape placed on top is another object. The text underneath is still in the file, still selectable, still extractable by anyone who opens it with the right tool. Newspapers, law firms and government departments have all published documents redacted this way and had the text pulled straight back out.",
        "So: if the sensitive thing is in a document, either use a proper redaction feature that removes the content, or export the page to an image, blur the image, and rebuild the document from that. The second route is clumsy but it is safe, because the export step flattens everything to pixels.",
      ],
    },
    {
      heading: "The aesthetic case",
      body: [
        "For backgrounds and overlays the calculus is different - nothing is being hidden, you just want less visual competition with text on top.",
        "Gaussian is almost always the right mode here, and the strength is usually lower than people expect. Somewhere between five and fifteen pixels of blur is enough to stop a background fighting with foreground text, while still leaving enough colour and shape to look intentional. Past about thirty pixels most images become an abstract colour wash, which is sometimes what you want and often reads as a mistake.",
        "One practical side effect: blurring makes an image much more compressible. Compression spends most of its bits on high-frequency detail, and a blur removes exactly that. A blurred background image is often a fraction of the size of the original at the same quality setting, which is a real win for page load.",
      ],
    },
  ],
  example: {
    title: "Pixelating a screenshot before sharing it",
    input: "screenshot-invoice.png\n1920 x 1080 px, 412 KB\nAccount number rendered at roughly 18 px tall\nMode: pixelate",
    output: "Block size 8   -> characters still partly legible, shapes recoverable\nBlock size 20  -> unreadable to the eye, but only ~1 block per character\nBlock size 48  -> several characters per block, structure gone\n\nChosen: 48 px blocks\nOutput: 1920 x 1080 px, 61 KB",
    note: "Two things worth noticing. The block size that looks unreadable to you is not the same as the block size that is unrecoverable - 20 px passed the eye test and still preserved roughly one block per character, which is the situation where reconstruction attacks work. And the file got seven times smaller, because pixelation removed almost all the high-frequency detail that PNG was spending its bytes on.",
  },
  limitations: [
    "The effect applies to the entire image. There is no region selection, so blurring one face in a group photo is not something this page can do - crop the region out first, or use an editor with a selection tool.",
    "Blur is destructive and cannot be undone once the file is downloaded. Keep your original.",
    "Pixelation at a small block size is not secure redaction. If the content genuinely matters, crop it out or cover it with a solid block instead.",
    "Blurring an image inside a PDF or a document viewer is not the same thing and does not protect anything. That is a property of those formats, not of this tool.",
    "Very large images are limited by browser memory and by the maximum canvas size, which varies by device. A very high resolution photo may fail on a phone.",
    "One file at a time. There is no batch mode.",
  ],
};
