import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const mergePdfArticle: ToolArticleContent = {
  intro: [
    "The usual situation is that a document exists in pieces. A signed contract came back as three separate emails. The lease is one file, the scanned signature page is another, and the landlord wants one attachment. A grant application asks for a single PDF containing a cover letter, a CV, two reference letters and a budget spreadsheet that someone exported on their own. The pieces are fine. The requirement is that they arrive as one file, in a stated order.",
    "This tool does that in the browser. Each PDF you add is parsed with pdf-lib, its pages are copied into a new empty document in the order the files appear in the list, and the result is saved out for download as merged-N-pdfs.pdf. Copying pages carries the page content, its embedded fonts and its images across unchanged, so nothing is re-encoded and nothing loses quality. You can drag files up and down to change the sequence before merging, and you need at least two files for the merge button to become active.",
    "Merging is simpler than compressing, which means the interesting parts are the things that are easy to get wrong: the order, the pieces of a PDF that do not survive being copied, and who else ends up with a copy of your documents.",
  ],
  sections: [
    {
      heading: "Order is most of the job",
      body: [
        "Files merge in the order shown in the list, top to bottom, and each file contributes all of its pages in their existing sequence. That sounds obvious until you hit one of the ways it goes wrong in practice.",
        "The most common one is filename sorting. If you select twelve files at once, your operating system hands them over in its own order, and that order is often alphabetical rather than numeric: page1, page10, page11, page2. Check the numbered badges in the list before merging rather than after.",
      ],
      bullets: [
        "Duplex scanners that write fronts to one file and backs to another produce two files that need interleaving, not appending. This tool appends, so odds-then-evens is what you would get. Split the two files into pages first, or rescan.",
        "Cover letters, appendices and exhibits usually have a required order set by whoever is receiving the file. Read the submission instructions before merging, not after you have named the output.",
        "If a document has a table of contents with printed page numbers, appending anything in front of it silently makes every one of those numbers wrong.",
        "Reordering here moves whole files. To move a single page, split that file first and add the pages back as separate documents.",
      ],
    },
    {
      heading: "What survives the merge, and what quietly does not",
      body: [
        "Copying pages copies what is drawn on the page and the resources needed to draw it: text, embedded and subsetted fonts, images, vector artwork, page size, and page rotation. That part is reliable, and it is why the output is visually identical to the inputs.",
        "Document-level structure is a different story, because it lives outside the pages. Bookmarks and outlines are stored in a document catalogue that a new document does not inherit, so a merged file generally arrives without them. Named destinations go the same way, which means internal cross-reference links can end up pointing at nothing. Interactive form fields are the one that catches people out most often: the widgets may still be drawn on the page while the form definition that made them fillable is gone, so what looks like a form is no longer one.",
        "Two practical consequences follow from that. If you have a filled-in form, print or flatten it to a static PDF before merging, so the values become part of the page rather than form state. And if a document needs a digital signature, sign after merging. A signature covers a specific byte range of a specific file; rebuilding that file invalidates it, every time.",
      ],
    },
    {
      heading: "Mixed page sizes, orientations, and scans next to digital pages",
      body: [
        "Each page keeps its own dimensions and rotation. Nothing is scaled, cropped or normalised to a common size. Merge a US Letter cover letter with an A4 CV and a landscape budget sheet and you get exactly that: a fifteen page document whose pages are three different shapes. On screen it scrolls unevenly. In print, most drivers will offer to fit each page to the paper, which usually works but can shave margins on the pages that were not designed for that paper size. If a uniform document matters, resize the odd ones out in their original applications before merging.",
        "Mixing a scanned page into a digital document has a second effect, on size. Digital pages are usually tens of kilobytes; a colour scan is usually one to two megabytes. One scanned signature page can easily be most of the finished file. It also stays an image. Merging does not run OCR, so that page will not be searchable or selectable even though the pages around it are, and a reader searching the merged document for a name that appears only on the scan will find nothing.",
      ],
    },
    {
      heading: "Why merging in particular is a bad time to upload",
      body: [
        "Look at what people actually merge. Signed contracts. Three months of bank statements for a mortgage application. Medical records for a second opinion. Passport and visa scans. Payslips for a rental reference. Divorce paperwork. The reason someone needs a merge tool at all is usually that an institution asked them for a complete file about themselves, and the merge is the last step before they hand over a document that identifies them thoroughly.",
        "Most online merge tools take that document, post it to a server, process it there and return a download link. Whether the file is deleted afterwards, how long the link stays live, who can reach the storage bucket and which country it sits in are all things you are asked to take on trust from a page that says the files are deleted after an hour.",
        "Nothing is uploaded here. The merge runs in your tab, pdf-lib is a JavaScript library that works on an ArrayBuffer in memory, and the download is generated locally from a blob URL. You do not have to take that on faith either: open your browser developer tools, watch the network panel while you merge, and confirm nothing leaves. Once the page has loaded you can go offline and it will still work.",
      ],
    },
  ],
  example: {
    title: "A worked example: assembling a signed offer package",
    input:
      "1  offer-letter.pdf          3 pages    214 KB   digital export\n2  signature-page-scan.pdf   1 page     1.9 MB   300 dpi colour scan\n3  appendix-a.pdf           11 pages    486 KB   digital export\n\n3 files  -  15 pages  -  2.6 MB total",
    output:
      "merged-3-pdfs.pdf\n15 pages  -  2.6 MB\n\nPages  1-3    from offer-letter.pdf\nPage   4      from signature-page-scan.pdf\nPages  5-15   from appendix-a.pdf",
    note: "The output is roughly the sum of the inputs because nothing is recompressed, which is what you want when the content matters. Note where the weight sits: the single scanned page is about 73 percent of the finished file. If the recipient has a size cap, that page is the thing to fix, and rescanning it at 200 dpi grayscale will do more than any compression step applied afterwards. Page 4 also stays an image, so a search for the signatory's name across the merged document will not match it.",
  },
  limitations: [
    "Reordering works at file level, not page level. Dragging moves an entire document and its pages travel with it. To place an individual page somewhere specific, split its source file first and add the pieces as separate files.",
    "Password-protected and encrypted PDFs are rejected when they are loaded, with an error saying the file could not be processed. Open the document in the application that owns it, save a copy without the password, then merge that copy.",
    "There are no page thumbnails. The list shows filenames, sizes and position numbers, so you are trusting your own naming. Open the merged file and check the sequence before you send it anywhere that matters.",
    "Bookmarks, outlines, named destinations, interactive form fields and existing digital signatures do not survive the merge. Flatten filled forms first and sign afterwards.",
    "The limits are 10 files at up to 50 MB each, and everything is held in browser memory. Each source file is also read a second time during the merge itself. A batch adding up to several hundred megabytes can exhaust a tab, particularly on a phone, so merge in stages if you are working at that size.",
  ],
};
