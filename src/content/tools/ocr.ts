import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const ocrArticle: ToolArticleContent = {
  intro: [
    "You have text trapped in a picture. A screenshot of an error message you want to search for, a photo of a page from a book, a scanned payslip whose figures you need in a spreadsheet, a receipt you would rather not retype. The words are right there and you cannot select any of them.",
    "Optical character recognition is the process of turning those pixels back into characters. This page runs Tesseract, a long-established open-source OCR engine, compiled to run inside your browser. It loads a language model the first time you use it, looks at the shapes in your image, and returns its best guess at the text along with a confidence score.",
    "Best guess is the operative phrase, and this page is going to be more honest with you about that than most OCR pages are. OCR is pattern matching under uncertainty. On a clean scan of printed text it is very good. On a phone photo of a crumpled receipt in bad light it will produce something that needs proofreading. Knowing which situation you are in before you paste the output somewhere important is most of the skill.",
  ],
  sections: [
    {
      heading: "What the engine is actually doing",
      body: [
        "Tesseract works in stages. It converts the image to black and white, finds regions that look like text, breaks those regions into lines, lines into words, words into character-shaped blobs. Then it matches each blob against the shapes it learned for the language you selected and picks the most likely character, using a dictionary to break ties between visually similar candidates.",
        "That last part explains the errors you will see. The engine is not reading the way you read. It has no idea what the document means. So it confuses characters that look alike and it does so confidently: 0 and O, 1 and l and I, 5 and S, rn rendered as m, a comma read as a full stop. On a phone number or an account number, where the dictionary cannot help because any digit is as plausible as any other, this is exactly where mistakes cluster.",
        "The confidence score reported alongside the result is the engine's own estimate of how sure it is, averaged across the page. Treat it as a rough signal. High confidence on a clean scan generally means the text is right. A low score is a reliable warning; a high score is not a guarantee.",
      ],
    },
    {
      heading: "Image quality decides the outcome, not the engine",
      body: [
        "Almost every disappointing OCR result traces back to the picture rather than the software. Resolution is the biggest single factor. Tesseract wants characters that are around 20 to 30 pixels tall. Below roughly 10 pixels the shapes stop being distinguishable and accuracy falls off a cliff, which is why a screenshot of small text taken on a low-resolution display often reads worse than a photo of a printed page.",
        "Contrast is next. Dark text on a light background is what the engine expects. Light grey on white, white on a photograph, or text over a watermark all reduce the separation the binarisation step depends on.",
        "Then geometry. A page photographed at an angle produces trapezoidal text that the line-finder struggles with, and a few degrees of rotation is enough to hurt. Shadows across the page split it into regions with different brightness. Camera flash creates a bright spot that blows out whatever is under it.",
      ],
      bullets: [
        "Photograph documents flat, from directly above, in even indirect light.",
        "Fill the frame with the page. Cropping away the desk before running OCR usually helps.",
        "Straighten before you scan - a rotated line costs more accuracy than slightly soft focus.",
        "Prefer an actual scan or a PDF export over a photo when either exists.",
        "If a screenshot reads badly, retake it at a larger zoom level rather than upscaling it.",
      ],
    },
    {
      heading: "Printed text, handwriting, and layout",
      body: [
        "Printed text in a common typeface is what Tesseract was built for and where it performs well. Unusual display fonts, heavy italics, condensed type and stylised logos are noticeably harder.",
        "Handwriting is a different problem and this engine is not designed for it. Neat block capitals sometimes come through. Ordinary joined-up handwriting generally does not, and no amount of image improvement will change that. If you need handwriting recognised, this is the wrong tool and you should know that before spending an afternoon on it.",
        "Layout is the other thing that does not survive. The output is a stream of text. A two-column article tends to come back with lines interleaved from both columns. A table loses its grid: you get the cell contents in reading order with the column relationship gone. An invoice with a header block, a line-item table and a totals box returns as one continuous run of text. For anything where structure carries meaning, expect to reassemble it yourself.",
      ],
    },
    {
      heading: "Why running it in the browser matters here",
      body: [
        "The documents people run through OCR are unusually sensitive. Passports, payslips, bank statements, medical letters, tenancy agreements, exam certificates. It is close to the worst possible category of file to hand to a free web service whose business model you have not read.",
        "Everything on this page happens inside your browser tab. The language model downloads once and is cached; after that the recognition runs on your own CPU. Your image is never uploaded, so there is no server-side copy to be retained, breached, or used for training.",
        "You do not have to take that on trust. Load the tool, disconnect from the network, and run it. It still works. That is a ten-second test and it is the only kind of privacy claim worth anything.",
        "The trade-off is honest: it is slower than a server farm, the first run pays a download cost while the language data arrives, and very large images can take a while or time out on a modest device.",
      ],
    },
  ],
  example: {
    title: "A phone photo of a printed receipt",
    input: "Photo, 2048 x 1536, taken at a slight angle\nThermal receipt paper, some glare\nLanguage: English",
    output: "GRAND MART SUPERMARKET\nBill No: 20l4-8837\nDate: 12/08/2026   Time: l8:47\n\nRice 5kg          1,250.OO\nCooking oil 1L      380.00\nTea 200g            215.OO\n\nSubtotal          1,845.00\nVAT 13%             239.85\nTOTAL             2,O84.85\n\nConfidence: 78%",
    note: "Look closely at the digits. The bill number came back as 20l4 with a lowercase L, the time as l8:47, and several amounts ending in .OO with capital O instead of zero. The words are all correct; the numbers are where it slipped. That is the characteristic failure mode - the dictionary rescues real words and has nothing to offer on digits. A 78% confidence score on a glossy angled receipt is about what you should expect, and it is telling you to check the figures before you use them.",
  },
  limitations: [
    "Handwriting is largely out of scope. Neat block capitals may partly work; ordinary cursive will not.",
    "Layout is not preserved. Tables lose their structure and multi-column pages often come back interleaved.",
    "Accuracy on digits is weaker than on words, because the dictionary that corrects real words cannot help with numbers. Always verify amounts, dates, phone numbers and reference codes by eye.",
    "The first run downloads a language model, so it is slow. Large or complex images can hit the built-in one-minute timeout, particularly on phones or a slow connection.",
    "One image at a time, and images only. A multi-page PDF has to be converted to images first, which you can do with the PDF to image tool.",
    "Recognition quality is bounded by the picture. A blurred, low-contrast or badly lit source cannot be rescued by any setting on this page.",
  ],
};
