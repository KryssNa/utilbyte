import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const rotatePdfArticle: ToolArticleContent = {
  intro: [
    "The sheets went into the feeder the wrong way round and now half the document is upside down. Or a wide table was scanned in landscape and sits on its side inside an otherwise portrait report, so reading it means tilting your head or tilting your laptop. Or, the annoying one, the file looks perfectly upright on your machine and the person you sent it to says every page is rotated ninety degrees.",
    "This tool fixes all three by changing one number per page. You pick an angle, pick which pages it applies to, and it writes out a corrected copy with pdf-lib. Pages can be selected as all of them, as ranges like 2-8,14-20, or as a specific list like 3,7,11, counting from 1 in every case. The output arrives as yourfile_rotated.pdf.",
    "Rotation is the one PDF operation that costs nothing. Nothing is redrawn, no image is re-encoded, no text is touched. That is worth understanding properly, because it explains both why this is safe to do repeatedly and why the same page can look correct in one program and wrong in another.",
  ],
  sections: [
    {
      heading: "Visual rotation and stored rotation are different things",
      body: [
        "Inside a PDF, the content of a page is drawn into a fixed coordinate system that has an origin, a width and a height, and none of that changes when you rotate. What changes is a separate entry on the page object called Rotate, which holds a single integer: 0, 90, 180 or 270. It is an instruction to the viewer, saying turn this clockwise by that many degrees before you show it to anyone.",
        "So a page can be sideways in two different senses. The pixels of a scan can be physically sideways, in which case the file is honestly recording a sideways picture and Rotate is 0. Or the content can be upright with Rotate set to 90, and any viewer that reads the entry presents it turned. Both look identical on screen, and only the second changes when you use this tool, because all it does is add to that integer and save again.",
        "That is why rotating is lossless. There is no decode and re-encode step, no resampling, no quality setting, because the bytes describing the page are copied across untouched. The output file comes back within a few hundred bytes of the input, and applying the opposite angle later returns you exactly to where you started.",
      ],
    },
    {
      heading: "Why it looks right on your screen and wrong on theirs",
      body: [
        "This is the complaint that sends most people looking for a rotate tool, and there are three causes worth telling apart.",
        "The first is that you rotated it in a viewer and never saved. Most readers have a rotate button, and in several of them that is a temporary display setting for your window only. Close the file, reopen it, and it is sideways again. Nothing was written to the document, so the copy you emailed never had the fix.",
        "The second is that the fix was saved but the recipient's software ignores it. Compliant viewers honour Rotate, but plenty of things that consume PDFs are not viewers: older print servers, document management systems and some server-side rendering libraries read the raw page and never look at the entry. To those, a page with upright content and Rotate 270 is simply an upright page. If a portal keeps showing your page the wrong way after you fixed it here, this is usually why, and the only real cure is to re-render the page as an image and rebuild.",
        "The third is double rotation. Some scanners detect orientation, turn the captured image, and set the Rotate entry as well, as if they had not. The page then looks correct in a forgiving viewer and ninety degrees off in a strict one. Rare, but worth suspecting when a document is inconsistent across programs rather than uniformly wrong.",
      ],
    },
    {
      heading: "Angles add rather than replace",
      body: [
        "The tool reads each selected page's current angle and adds yours to it. That is deliberate and mostly what you want, since it means a rotation behaves like turning a sheet of paper on a desk rather than snapping it to an absolute orientation.",
        "It has one consequence to watch. If the selected pages do not all start at the same angle, one pass will not level them. Say pages 2 and 5 came in at 90 and page 9 at 180. Apply 270 to all three and pages 2 and 5 land upright while page 9 ends up on its side. An inconsistent document needs a pass per group, which is why specific-pages mode exists.",
        "Undoing is addition too. To reverse a 90 clockwise, apply 270; to reverse a 180, apply another 180. Every pass is lossless, so experimenting is cheap. Reload the output into the tool to keep going rather than starting from the source again.",
        "Rotation also leaves the recorded page size alone. A portrait page turned to landscape still carries portrait dimensions with an instruction attached, and the viewer swaps the presented width and height. That matters occasionally at the printer, where the driver decides which way to feed the paper, so check the print preview rather than the thumbnail.",
      ],
    },
    {
      heading: "Working out which pages actually need it",
      body: [
        "There are no page thumbnails here. The preview box shows a generic icon turning to illustrate the angle, not your document, so identify the wrong pages somewhere else first. Open the file in any viewer, switch to a grid or thumbnail view, and the sideways ones stand out at a glance. Write the numbers down and type them into the specific-pages field.",
        "Two patterns cover most scanning jobs. If a duplex feeder took the backs of the sheets the wrong way up, the damage is every even numbered page, and it is almost always 180 rather than 90 because the sheet was flipped along the wrong edge. If a few landscape pages were scanned in a portrait batch, they usually all need the same direction, and the choice comes down to which way the text runs: bottom to top wants 90 clockwise, top to bottom wants 270.",
      ],
    },
  ],
  example: {
    title: "A worked example: a duplex scan with two landscape tables",
    input:
      "site-survey.pdf\n24 pages  -  11.7 MB  -  300 dpi colour\n\nWhat the thumbnails showed:\n  all even pages upside down\n  p7 and p18 sideways, text\n  reading bottom to top\n\nPass 1  angle 180, specific pages\n        2,4,6,8,10,12,14,16,18,20,22,24\nPass 2  angle 90, specific pages\n        7,18   (run on the pass 1 output)",
    output:
      "site-survey_rotated.pdf\n  24 pages  -  11.7 MB\n  12 pages rotated by 180\n\nsite-survey_rotated_rotated.pdf\n  24 pages  -  11.7 MB\n  2 pages rotated by 90 clockwise\n\nOriginal 11.7 MB  ->  final 11.7 MB\n(difference: 214 bytes)",
    note: "Two passes because one angle applies to every page you select, and these pages needed different treatment. Page 18 appears in both lists on purpose: it was upside down and sideways, so it took 180 in the first pass and another 90 in the second, ending at 270 from where it started. The size barely moves, and that is the point. A 300 dpi colour scan re-rendered by any tool that actually redraws pages would come back visibly different and probably larger. Here the images are the same bytes they always were.",
  },
  limitations: [
    "One angle per run, applied to every page you select. Documents with pages wrong in different directions need a separate pass for each group, feeding the previous output back in.",
    "There is no preview of your actual pages. The rotation preview is a generic icon showing the angle, so you have to find the offending page numbers in another viewer before you start.",
    "Angles are added to whatever each page already had rather than set to an absolute value. If the selected pages did not all start at the same orientation, a single pass will not make them consistent.",
    "Only 90, 180 and 270 are available. A scan that came out three degrees crooked cannot be straightened here, because deskewing means re-rendering the page rather than setting a flag.",
    "Some downstream software ignores the rotation entry entirely, so a page fixed here can still appear sideways in an older print server, an imaging pipeline or a strict upload portal. Encrypted PDFs will not load, and the limit is one file of up to 50 MB.",
  ],
};
