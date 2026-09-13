import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const compressPdfToSizeArticle: ToolArticleContent = {
  intro: [
    "A portal says 2 MB and your file is 9. A mail server bounces the attachment. A court filing system, a visa application, a university submission form - they all have a cap, none of them tell you what to do about it, and the file you have is the file you have.",
    "Most PDF compressors give you a quality slider and leave you to guess. This one takes the number and makes you choose the one thing that actually matters: whether you are willing to lose the text.",
    "That choice is the whole point of this page, and it is worth two minutes of your attention before you make it.",
  ],
  sections: [
    {
      heading: "Where the megabytes actually are",
      body: [
        "A PDF is a container. Understanding what is inside yours tells you immediately how much room there is to move.",
        "In a document produced by a word processor or a LaTeX build, the content is text drawing instructions plus embedded font subsets. It is already compact. There is usually metadata, sometimes a full set of embedded fonts where a subset would do, and often accumulated revision history if the file has been saved repeatedly - PDFs append changes rather than rewriting, so a heavily edited document can be carrying several older versions of itself.",
        "In a scanned document, essentially the entire file is images. One page scanned at 300 dpi in colour is a few megabytes on its own. The text you see is not text at all - it is a picture of text.",
        "Those two cases behave completely differently under compression, which is why a single quality slider is the wrong interface.",
      ],
    },
    {
      heading: "The lossless option, and its ceiling",
      body: [
        "The first strategy rebuilds the document from its page tree, discards metadata, and drops anything the pages no longer reference - including that revision history. It writes the result using object streams, which packs the internal structure more tightly.",
        "Nothing is degraded. Text stays text: selectable, searchable, readable by a screen reader, and still text when the recipient opens it.",
        "On a text-heavy PDF with a history of edits this can be a substantial saving. On a clean single-save text document it will be modest. On a scan it will be almost nothing, and that is not a limitation worth apologising for - it is arithmetic. The bytes are in the images, and re-encoding embedded images is something a browser library cannot do. Ghostscript can, which is why server-side compressors reach numbers this cannot.",
        "So if you pick this option and the file barely moves, the tool has not failed. It has told you something useful: your document is images.",
      ],
      bullets: [
        "Text-heavy PDF with edit history: often a real saving.",
        "Clean text-only PDF: modest, sometimes nothing left to remove.",
        "Scanned document: expect almost no change.",
        "In every case the text layer survives intact.",
      ],
    },
    {
      heading: "Rasterising, and exactly what it costs",
      body: [
        "The second strategy renders every page to a bitmap and builds a new PDF from those images, searching JPEG quality across the whole document until the total fits your target. It will reach almost any size you ask for.",
        "What you give up is the text layer, and it is worth being concrete about that rather than describing it as a quality trade-off. After rasterising: nobody can select or copy text from the document. It cannot be searched, by you or by anyone you send it to. A screen reader has nothing to read, so the document becomes inaccessible to a blind recipient. Any form fields, links, bookmarks and annotations are gone. And it is not reversible - running OCR afterwards produces a guess, not the original.",
        "For a scanned document that had no text layer to begin with, you lose almost nothing. For a contract, a CV, a thesis or anything a person or a system will need to read properly, you have converted a document into a stack of pictures.",
        "That is why this tool never rasterises on its own. A compressor that silently turns your contract into images to hit a number has done real damage and not mentioned it.",
      ],
    },
    {
      heading: "What to try before either of them",
      body: [
        "Two things frequently solve the problem without any compression at all.",
        "Re-export rather than compress. If you still have the source - the Word file, the design file, the LaTeX - exporting again with a smaller image resolution or a screen-quality preset gives a far better result than squeezing an already-flattened PDF. Every compressor is working with what the exporter left behind.",
        "Split it. Many portals cap each file rather than the total, and a 9 MB document as three 3 MB files may be entirely acceptable. This is also the fix when even rasterising cannot reach the target, which happens with long documents.",
        "And check the units before you do anything at all. Portals state limits carelessly, and a surprising number say MB when they mean MiB, or state a limit their upload widget does not actually enforce.",
      ],
    },
  ],
  example: {
    title: "The same target, two very different documents",
    input: "A) thesis-draft.pdf   -  6.2 MB, 84 pages, text with a few charts\nB) scanned-deed.pdf   -  9.4 MB, 12 pages, 300 dpi colour scan\n\nTarget for both: 2 MB",
    output: "A) Keep the text\n   6.2 MB -> 1.7 MB   met target, text intact\n   (most of the saving was revision history from repeated saves)\n\nB) Keep the text\n   9.4 MB -> 9.1 MB   did NOT meet target\n\nB) Rasterise, 144 dpi\n   9.4 MB -> 1.8 MB   met target, JPEG quality 61%\n   text layer: there was none to lose",
    note: "Both outcomes are correct. The thesis had accumulated several older versions of itself inside the file and rebuilding threw them away, so lossless was enough. The deed is a photograph of paper, so nothing but re-encoding the photographs was ever going to work - and since a scan has no text layer, rasterising cost it nothing. Had B been a digitally-generated contract rather than a scan, that same operation would have destroyed something worth keeping.",
  },
  limitations: [
    "The lossless strategy cannot re-encode embedded images. On a scanned document it will barely change the file size, and no setting alters that - it is what a browser PDF library can and cannot do.",
    "Rasterising destroys the text layer permanently. Selection, search, screen-reader access, links, bookmarks and form fields all go with it. Keep your original.",
    "Rendering is slow and memory-hungry. Long documents and high resolutions can take a while or exhaust the browser, particularly on a phone.",
    "Encrypted or password-protected PDFs cannot be processed. Remove the protection first.",
    "Very long documents may not reach a tight target even rasterised. Splitting into several files is the answer there.",
    "One file at a time.",
  ],
};
