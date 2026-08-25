import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const editPdfArticle: ToolArticleContent = {
  intro: [
    "You open the PDF, click into the middle of a sentence, and there is no cursor. The date is wrong, or the total needs a note beside it, or there is a signature line that somebody plans to print, sign and scan back in three days when you needed it this morning. Every other document on your computer can be edited by clicking on it. This one cannot.",
    "That reaction is reasonable and the format is genuinely working against you. This page gives you a canvas over your PDF where you can add text, draw freehand, highlight, box things in, place an image such as a signature, and export a new PDF with all of it burned in. PDF.js renders the pages and pdf-lib writes the finished file, both in your browser, with the document never leaving your machine.",
    "What it will not do is let you retype an existing sentence. That limit is not laziness on the part of this tool. It comes from how PDFs are built, and it is worth two minutes of explanation, because understanding it changes how you approach the job.",
  ],
  sections: [
    {
      heading: "Why editing a PDF is harder than editing a document",
      body: [
        "A Word file or a Google Doc stores meaning. It knows this run of characters is a paragraph, that the paragraph sits in a body style, and that text flows from one line to the next. Change a word and everything after it shifts along, because the layout is recalculated from that structure every time you open it.",
        "A PDF stores the finished result of that calculation, and by the time it exists the paragraphs are gone. What remains is a series of instructions: set this font, move to this coordinate, draw these glyphs, move again, draw the next ones. Single words are often split across several instructions with hand-tuned spacing between them, and the line breaks are frozen. There is no paragraph to reflow because there are no paragraphs.",
        "Fonts make it worse. PDFs usually embed subsets containing only the glyphs the document uses, so if the word Wednesday never appears the file may not carry a W, and typing one leaves nothing to draw it with. Acrobat papers over this by substituting fonts, and even Acrobat mismatches often enough that professionals go back to the source instead. Hence the practical rule: if you still have the original Word or InDesign file, edit that and export again. Everything here is for the case where you do not.",
      ],
    },
    {
      heading: "What this editor actually does",
      body: [
        "It works in layers. Your PDF is rendered to a canvas so you can see it, and everything you add is held separately as a list of marks, each with a page number and a position. Nothing touches the document while you work. On export, pdf-lib opens the original bytes fresh, draws each mark onto its page, and saves a new file called edited-yourfile.pdf. The content underneath is never modified, only covered.",
        "The text tool places a line of type in Helvetica at any size from 8 to 72 points, in one of eight colours. Draw is a freehand pen with an adjustable width, which is what most people sign with. Highlight paints a translucent rectangle at 25 percent opacity, the rectangle tool draws an outlined box, and Image places a PNG or JPEG, usually a scanned signature or a stamp.",
        "The eraser is worth reading carefully. It does not erase. It paints white strokes four times the width of the pen, which looks like erasing on a white page and like white paint on a coloured one or a scan with an off-white background. Undo removes the last mark on the current page, Clear removes all of them, neither reaches other pages, and there is no redo.",
        "An Info panel reads out the document metadata - title, author, creator, producer, dates, page count, page size - which is the quickest way to learn what produced a file, and therefore where the editable original might live.",
      ],
    },
    {
      heading: "The white box over the sensitive line is not redaction",
      body: [
        "This is the most important paragraph here. The common instinct is to cover a name, an account number or a salary with a black or white rectangle before sending the file on. It looks convincing. The information is still there.",
        "The rectangle is drawn on top. The text underneath stays in the page's content stream exactly as it was. Anyone can select the covered area and copy it, run a text extraction tool over the file, or read the value straight out of the drawing operations. Real redaction is destructive: the content is found, removed, and the file rewritten without it. Nothing that only draws shapes can manage that.",
        "Newspapers, courts and large companies have all published documents redacted this way and had the hidden text pulled out within hours. If something genuinely must not be read, the only reliable browser approach is to destroy the text layer: cover the area, export, run that page through the PDF to image tool, and rebuild from the picture. The words become pixels and there is nothing left to extract, at the cost of searchability for the whole page.",
      ],
    },
    {
      heading: "What it is genuinely good at",
      body: [
        "Signing and dating is the main one. Place a scanned signature image, type the date beside it, initial the pages that need it, export, send. That replaces the print-sign-scan loop and produces a cleaner file than a photograph of a printed page.",
        "Filling a flat form is the second. Plenty of PDFs look like forms but carry no interactive fields, so nothing is clickable. Typing into the boxes works fine, and matching the font size to the printed labels keeps it looking deliberate. Zoom in first, because positioning at 100 percent is guesswork and placement is fixed once you click.",
        "Then there is marking up someone else's work: highlighting the clause you object to, boxing a figure that looks wrong, writing a correction in red beside a bad number instead of trying to replace it. That last habit is worth keeping: a visible note saying this should be 4,820 tells the reader more than a silently altered number would.",
      ],
    },
  ],
  example: {
    title: "A worked example: returning a signed two page agreement",
    input:
      "service-agreement.pdf\n2 pages  -  A4  -  318 KB\nProducer: Microsoft Word\nNo interactive form fields\n\nMarks placed:\n  p1  text  \"M. Okonjo\"       14 pt black\n  p1  text  \"2026-08-25\"       14 pt black\n  p1  rect  around clause 4.2  red\n  p2  image signature.png      scan, 200 x 150\n  p2  text  \"initials MO\"      12 pt black\n  p2  draw  freehand tick      blue, width 3",
    output:
      "edited-service-agreement.pdf\n2 pages  -  341 KB\n\n6 marks flattened into the pages\nOriginal text untouched underneath\nNo form fields created\nNo signature certificate applied\n\nThe red box around 4.2 is a\ndrawn rectangle, not a comment\nthread, so the other side sees\nit but cannot reply to it",
    note: "The file grew by 23 KB, nearly all of it the embedded signature PNG. Everything you added is now part of the page drawing rather than a separate annotation layer, so the recipient cannot click your text to edit it, switch your highlight off, or reply to your marks in a comments panel. That is what you want on a returned agreement and not what you want on a draft under review. Worth saying too: this is a picture of a signature on a document, which is what most organisations mean by a signed PDF, but it is not a cryptographic signature and certifies nothing about the file.",
  },
  limitations: [
    "You cannot change text that is already in the document. There is no way to retype a word, move a paragraph or alter a number in place. The workaround is to cover the old value with a rectangle and type a new one beside or over it, which looks like an edit and is really a patch.",
    "New text is Helvetica only, at one weight, and will not match the document's typeface. Characters outside the standard Latin set, including Cyrillic, Greek, Chinese, Japanese and emoji, cannot be drawn with it, and including any of them makes the export fail rather than substituting something.",
    "Text boxes are a single line and do not wrap, so a long sentence runs on until it leaves the page. Placed text and images cannot be dragged or resized afterwards; images land at a fixed size and position, so adjusting anything means deleting it and placing it again.",
    "Covering something is not removing it. Any rectangle, white pen stroke or eraser mark leaves the original text intact and extractable underneath. Do not use this to hide personal or confidential information in a file you are sending out.",
    "There are no page operations: you cannot add, delete, reorder or rotate pages, or fill existing interactive form fields. Use the split, merge and rotate tools for those. Nothing is saved between sessions, so refreshing the tab loses every mark you have not exported. Encrypted PDFs will not open, and the upload limit is 100 MB.",
  ],
};
