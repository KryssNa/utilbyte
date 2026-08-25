import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const splitPdfArticle: ToolArticleContent = {
  intro: [
    "Two situations bring people here. The first is a bundle: someone fed a stack of paper through an office scanner in one pass and got back a single 48 page PDF containing six unrelated documents, and now a portal wants the lease, the ID and the bank letter uploaded as three separate files. The second is narrower. A 180 page manual exists, the person you are emailing needs pages 44 to 51, and sending the whole thing is either rude or over the attachment limit.",
    "This tool handles both with the same mechanism. You give it a list of page ranges, and for each range it creates a new empty PDF, copies those pages into it with pdf-lib, and saves it out as its own file. Ranges are comma separated and pages are counted from 1, so 1-12,13-20,21-48 gives you three documents. A number on its own means a single page, so 3,9,17 gives you three one page files. Each output is named after the source file with the range appended, which is why you get things like scan-batch_pages-13-to-20.pdf and scan-batch_page-9.pdf in your downloads folder.",
    "Nothing is uploaded. The file is read into the tab, the pieces are built in memory, and the downloads come from local blob URLs. That matters more than usual here, because the documents people split tend to be exactly the ones they were asked to prove something with.",
  ],
  sections: [
    {
      heading: "The ranges decide everything, including what disappears",
      body: [
        "The most important behaviour to understand is that ranges are an inclusion list, not a set of cut points. The tool does not slice the document at boundaries and hand you every piece. It builds only the pieces you named, and any page you did not name is simply not in the output. Split a 48 page file with 1-12,21-48 and pages 13 to 20 are gone. There is no leftovers file and no warning.",
        "That is useful when you only want an extract, and it is a quiet trap when you meant to divide the whole thing. Add up your ranges before you run it. If the last number in your list is not the last page of the document, you have made a decision, and it is worth checking that you meant to.",
      ],
      bullets: [
        "Ranges may overlap. 1-5,4-9 is accepted and pages 4 and 5 appear in both outputs, which is occasionally what you want for a shared cover sheet.",
        "A range must ascend. Typing 9-4 gets you nothing at all from that entry, silently, while the rest of your list still runs.",
        "An end page past the last page is clamped, so 40-99 on a 48 page file gives you pages 40 to 48. A start page past the end produces no file for that entry.",
        "Single pages come out in the order you list them. 5,1 gives you the page 5 file first, but each file still contains the page it says it does.",
      ],
    },
    {
      heading: "Finding the boundaries in a scanned bundle",
      body: [
        "Splitting a bundle is mostly a reading job rather than a software job, and this tool does not help with it. There are no page thumbnails on this page. You get the page count after loading and nothing else, so you need to know where each document starts before you type anything.",
        "The quickest way is to open the file in whatever PDF viewer you already have, scroll through in a thumbnail or grid view, and write down the first page number of each document. Those first pages become your range starts, and each range ends one page before the next start. If document two begins on page 13 and document three begins on page 21, your middle range is 13-20. Doing that arithmetic wrong by one is the single most common mistake, and it shows up as a stray cover sheet at the end of the previous file.",
        "Watch for blank backs. A duplex scanner set to scan both sides will insert a blank page after every single sided sheet, so a six sheet document occupies twelve pages. Those blanks are real pages and they count.",
      ],
    },
    {
      heading: "What travels into each piece and what stays behind",
      body: [
        "Copying a page carries its content stream, its embedded fonts, its images, its page size and its stored rotation. Visually the pieces are identical to the pages they came from, and nothing is re-encoded, so a scan does not get worse by being extracted.",
        "Anything that lived above the page level does not come across, and split has its own version of that problem. Internal links and named destinations point at pages by reference, so a cross reference on page 45 that pointed to page 3 now points at a page that is not in the file, and a table of contents extracted on its own becomes a menu where nothing responds. Bookmarks are gone for the same reason. If a filled interactive form gets split, the form definition does not survive and the values you typed can go with it, so flatten or print to PDF first if the entries matter.",
        "Size behaves in a way that surprises people. Split a document into three parts and the three parts often add up to more than the original, sometimes noticeably more. Shared resources such as an embedded font or a logo used throughout the document have to be copied into every piece that references them, so a 60 KB font family that appeared once now appears three times.",
      ],
    },
    {
      heading: "Extracting pages as a way to repair a file",
      body: [
        "There is a side use for this that is worth knowing about. A PDF that one viewer opens and another refuses, or that throws an error halfway through printing, often has a damaged cross reference table or leftover junk from an incremental save rather than damaged pages. Extracting the pages builds a brand new document around them, with a freshly written object graph, and the problem frequently goes away.",
        "Split the file into a single range covering every page, download it, and try that copy. If the whole document fails to load here, split it in halves instead and see which half fails. Two or three rounds of that narrows the problem to one page, and once you know which page it is you can extract everything except that page and rebuild.",
      ],
    },
  ],
  example: {
    title: "A worked example: one scanner pass, three uploads",
    input:
      "scan-batch.pdf\n48 pages  -  22.4 MB  -  200 dpi grayscale\n\nContents, read off the thumbnails:\n  p1-p12   tenancy agreement\n  p13-p20  passport and visa scans\n  p21-p48  twelve months of statements\n\nRanges entered:  1-12,13-20,21-48",
    output:
      "scan-batch_pages-1-to-12.pdf\n  12 pages  -  5.6 MB\n\nscan-batch_pages-13-to-20.pdf\n  8 pages  -  3.8 MB\n\nscan-batch_pages-21-to-48.pdf\n  28 pages  -  13.2 MB\n\n3 files  -  48 pages  -  22.6 MB",
    note: "The three files come to 22.6 MB against an original of 22.4 MB. Nothing was recompressed and no page grew; the extra 200 KB is shared structure that now exists in triplicate. Note also that these pages are photographs of paper, so the statements file is not searchable and never was. If the portal caps each upload at 10 MB, the statements file is the one that fails, and the fix is to split it again by quarter rather than to look for a compressor.",
  },
  limitations: [
    "There are no page previews. The tool reports how many pages the file has and nothing more, so you have to identify your boundaries in another viewer first and trust your own arithmetic.",
    "Pages you do not include in a range are dropped without comment, and a reversed range such as 9-4 is ignored in the same silent way. Check the page counts on the results before you close the tab.",
    "Download All fires one download per file rather than producing a ZIP. Browsers commonly block or prompt on the second and subsequent downloads from a page, so a split into fifteen pieces may need permission or several clicks.",
    "Anything held above page level is lost when pages are copied into a fresh document: outlines, link targets, the interactive layer of a form, and any digital signature. Flatten a filled form before splitting it, and treat a signed PDF as unsplittable if the signature has to stay valid.",
    "One file at a time, up to 50 MB, and the source document plus every piece it produces all sit in browser memory at once. A large scan cut into many parts can run a modest device out of room.",
  ],
};
