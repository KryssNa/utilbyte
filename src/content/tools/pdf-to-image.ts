import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const pdfToImageArticle: ToolArticleContent = {
  intro: [
    "Something on the other end will not take a PDF. A claim form asks for a photo of the receipt. A slide deck needs page 4 of the report dropped in as a picture. A support ticket, a marketplace listing, a forum post or a chat app will accept a JPEG and nothing else. Or you want a thumbnail of the cover for a page you are building, and what you have is a 40 page document.",
    "This page renders the pages you choose and hands back image files. It uses PDF.js, the same rendering engine Firefox uses to display PDFs, running inside your tab against a local worker file. Each selected page is drawn onto an HTML canvas at the scale you set, and then the canvas is encoded as PNG, JPEG or WebP. You get one image per page, named after the source with the page number appended, like report_page_4.png.",
    "Before you go any further, the thing worth saying plainly: this is a one way conversion. The text on the page stops being text. Everything else on this page is detail; that sentence is the part people wish they had read first.",
  ],
  sections: [
    {
      heading: "The text layer does not come with it",
      body: [
        "A normal PDF page holds two things at once. There are drawing instructions that put glyphs at coordinates, and there is the fact that those glyphs are characters with identities. That second part is what lets you select a paragraph, copy a reference number, press Ctrl+F and find a name, or have a screen reader read the page aloud.",
        "Rendering to an image keeps the first and throws away the second. The output is a grid of coloured pixels that happens to look like writing. Nothing in it can be selected, searched, copied or read by assistive software. Hyperlinks stop being clickable. Form fields become a picture of form fields. A 40 page contract converted to 40 PNGs is, as far as any computer is concerned, 40 photographs.",
        "Converting back does not undo it. Wrapping those images into a PDF again gives you a document that looks the same and is still unsearchable, which is a loop people fall into regularly. Recovering the text means OCR and whatever accuracy that gives you. Keep the original PDF.",
      ],
    },
    {
      heading: "Scale is resolution, and the ceiling is lower than you think",
      body: [
        "PDF pages are measured in points, and there are 72 points to an inch. That is the whole basis of the scale control. Scale 1.0 renders one pixel per point, which is 72 dpi. Scale 2.0, the default here, is 144 dpi. The slider stops at 3.0, which is 216 dpi.",
        "Put real page sizes through that and the numbers get concrete. An A4 page is 595 by 842 points. At scale 2.0 you get an image of 1190 by 1684 pixels. At the maximum of 3.0 you get 1785 by 2526. US Letter is 612 by 792 points and comes out slightly wider and shorter.",
        "So the honest answer about print is that you cannot get there from here. Commercial print work wants 300 dpi, which would need a scale of about 4.17, and this tool does not go that high. For a screen, a slide, a web page or an upload form, 144 to 216 dpi is comfortably enough and often more than enough. If you plan to run OCR on the result afterwards, push the scale up rather than down, because recognition accuracy depends on how many pixels tall the characters are and small print at 72 dpi is a lost cause.",
        "Cost rises with the square. Doubling the scale quadruples the pixel count and the memory the canvas needs, so a very large page such as an A0 plan at scale 3.0 can exceed what a browser will allocate and come back blank.",
      ],
    },
    {
      heading: "Picking a format, and the control that does nothing",
      body: [
        "PNG is lossless. Every pixel comes out exactly as rendered, so sharp black text on white stays crisp with no fuzz around the letterforms, and it compresses flat areas so well that a text page as PNG is often smaller than the same page as JPEG. Where it gets heavy is photographs.",
        "JPEG is the opposite. It is built for photographs and it is poor at hard edges, which is precisely what text is. At lower quality settings you will see grey speckle and faint ripples around the letters, an artefact worth zooming in to check before you send the file to anyone. It is the right choice for a page that is mostly a photograph or a scan, and the wrong default for a page of type.",
        "WebP usually gives the smallest file at a given visual quality and handles both text and photographs better than JPEG. Every current browser displays it, but some older upload forms and internal systems still reject anything that is not PNG or JPEG.",
        "One thing to know about the quality slider. It runs from 10 to 100 percent and it applies to JPEG and WebP only. PNG is a lossless format and the browser ignores the quality value entirely when encoding one, so dragging that slider while PNG is selected changes the label and nothing else. If you picked PNG and want a smaller file, lower the scale instead.",
      ],
    },
    {
      heading: "When an image is the right answer",
      body: [
        "Converting is right when the destination is visual and temporary. A form that wants a photo of a document, a slide that needs a figure from a report, a screenshot-style illustration in a help article, a preview thumbnail, a page you want to mark up in a photo editor, an old system that only accepts images. In all of those the text layer was never going to be used, so losing it costs nothing.",
        "It is the wrong answer when anything downstream needs to read the words. Contracts people will search, records you will pull figures out of later, anything an archive keeps, anything with an accessibility requirement, since an image of a document gives a screen reader nothing. If the real problem was file size or page count, splitting or compressing the PDF solves it and keeps the text.",
      ],
    },
  ],
  example: {
    title: "A worked example: three pages, three kinds of content",
    input:
      "product-spec.pdf\n3 pages  -  A4  -  1.8 MB\n\n  p1  cover, vector logo and headings\n  p2  text with a line chart\n  p3  full page product photograph\n\nPages:   All\nScale:   2.0x   (144 dpi, 1190 x 1684 px)\nFormat:  PNG\nQuality: 90%",
    output:
      "product-spec_page_1.png    186 KB\nproduct-spec_page_2.png    241 KB\nproduct-spec_page_3.png  3,140 KB\n\n3 images  -  3.5 MB total\n\nSame run as JPEG at 90%:\n  page 1   274 KB\n  page 2   318 KB\n  page 3   462 KB",
    note: "Look at how the two runs cross over. As PNG the two text pages are small and the photograph is enormous. As JPEG the photograph collapses to a seventh of the size while both text pages get bigger, because JPEG spends bits smoothing edges that PNG stored for free. The quality setting of 90% did nothing at all in the PNG run. If this were a real job, page 3 wants JPEG or WebP and pages 1 and 2 want PNG, which means two passes with different settings. Also note the total: 3.5 MB of images from a 1.8 MB PDF, and none of it searchable.",
  },
  limitations: [
    "The scale tops out at 3.0, which is 216 dpi. That is below the 300 dpi normally expected for print, and there is no way to raise the ceiling here. For print-resolution output you need a desktop tool.",
    "The quality slider has no effect when the format is PNG, because PNG is lossless and the browser ignores the value. It only changes anything for JPEG and WebP.",
    "Pages always come out in ascending order with duplicates removed. Entering 5,1,5 gives you page 1 then page 5. You cannot reorder pages or export the same page twice in one run.",
    "Download All triggers a separate download per image rather than a ZIP, so converting a 30 page document means 30 downloads and most browsers will ask for permission partway through.",
    "Very large pages at a high scale can exceed the browser canvas limit and come back blank or fail, and encrypted or password-protected PDFs will not open at all. The upload limit is 50 MB and one file at a time.",
  ],
};
