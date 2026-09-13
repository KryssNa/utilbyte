/**
 * Reduce a PDF to a target file size, in the browser.
 *
 * There are two genuinely different strategies here and the difference matters
 * enough that the caller has to choose:
 *
 *  - RESTRUCTURE is lossless. The document is rebuilt, metadata is dropped and
 *    unreferenced objects and revision history go with it. Text stays text,
 *    selectable and searchable. It is the right first attempt, and on a
 *    text-heavy PDF it can be the only one needed. On a scanned document it
 *    will barely move the needle, because the bytes are in embedded images and
 *    pdf-lib cannot re-encode those.
 *
 *  - RASTERISE renders each page to a bitmap and rebuilds the document from
 *    those images, searching JPEG quality until the whole file fits. It will
 *    hit almost any target. It also destroys the text layer completely: the
 *    result is a stack of pictures, not a document, so it cannot be searched,
 *    selected, or read by a screen reader.
 *
 * Rasterising is never applied silently. A tool that quietly turns someone's
 * contract into images to hit a number has done real damage without telling
 * them.
 */

import { PDFDocument } from "pdf-lib";

export type PdfCompressionStrategy = "restructure" | "rasterise";

export interface PdfTargetOptions {
  targetBytes: number;
  strategy: PdfCompressionStrategy;
  /** Render resolution for the rasterise path. Higher is sharper and larger. */
  dpi?: number;
  /** Called with 0-1 progress during the rasterise path, which is slow. */
  onProgress?: (fraction: number) => void;
}

export interface PdfTargetResult {
  blob: Blob;
  bytes: number;
  strategy: PdfCompressionStrategy;
  metTarget: boolean;
  pageCount: number;
  /** Set on the rasterise path: the JPEG quality that was settled on. */
  quality?: number;
  /** True when the text layer no longer exists. */
  textLayerLost: boolean;
}

const DEFAULT_DPI = 144;
const PDF_USER_UNIT = 72; // points per inch

/**
 * Lossless pass: rebuild the document, discarding metadata and anything the
 * page tree no longer references.
 */
export async function restructurePdf(
  file: Blob,
): Promise<{ blob: Blob; pageCount: number }> {
  const source = await PDFDocument.load(await file.arrayBuffer(), {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  const rebuilt = await PDFDocument.create();
  const pages = await rebuilt.copyPages(source, source.getPageIndices());
  for (const page of pages) rebuilt.addPage(page);

  // Blank rather than inherit — producer strings and XMP packets are dead weight.
  rebuilt.setTitle("");
  rebuilt.setAuthor("");
  rebuilt.setSubject("");
  rebuilt.setKeywords([]);
  rebuilt.setProducer("");
  rebuilt.setCreator("");

  const bytes = await rebuilt.save({ useObjectStreams: true });
  return {
    blob: new Blob([bytes as unknown as BlobPart], { type: "application/pdf" }),
    pageCount: rebuilt.getPageCount(),
  };
}

type PdfJsModule = typeof import("pdfjs-dist");
let pdfjs: PdfJsModule | null = null;

async function loadPdfJs(): Promise<PdfJsModule> {
  if (pdfjs) return pdfjs;
  const mod = await import("pdfjs-dist");
  mod.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  pdfjs = mod;
  return mod;
}

/** Render every page to a canvas once, at the requested resolution. */
async function renderPages(
  file: Blob,
  dpi: number,
  onProgress?: (fraction: number) => void,
): Promise<HTMLCanvasElement[]> {
  const lib = await loadPdfJs();
  const doc = await lib.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    disableStream: true,
    disableAutoFetch: true,
  }).promise;
  const scale = dpi / PDF_USER_UNIT;
  const canvases: HTMLCanvasElement[] = [];

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context unavailable");

    // Scanned pages often have no background of their own.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: context, viewport, canvas }).promise;
    canvases.push(canvas);
    onProgress?.(pageNumber / doc.numPages);
  }

  return canvases;
}

function canvasToJpeg(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Page encoding failed")),
      "image/jpeg",
      quality,
    );
  });
}

/** Assemble already-encoded page images into a PDF at their natural size. */
async function buildPdfFromJpegs(pages: Blob[]): Promise<Blob> {
  const doc = await PDFDocument.create();

  for (const jpeg of pages) {
    const embedded = await doc.embedJpg(await jpeg.arrayBuffer());
    const page = doc.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width: embedded.width,
      height: embedded.height,
    });
  }

  const bytes = await doc.save({ useObjectStreams: true });
  return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
}

/**
 * Compress `file` to at most `targetBytes`.
 *
 * The restructure strategy makes one lossless attempt and reports honestly
 * whether it was enough. The rasterise strategy renders the pages once, then
 * binary-searches JPEG quality over the whole document — encoding every page at
 * each step, since the constraint is the total size rather than any one page.
 */
export async function compressPdfToTarget(
  file: Blob,
  options: PdfTargetOptions,
): Promise<PdfTargetResult> {
  const { targetBytes, strategy, dpi = DEFAULT_DPI, onProgress } = options;
  if (targetBytes <= 0)
    throw new Error("Target size must be greater than zero");

  if (strategy === "restructure") {
    const { blob, pageCount } = await restructurePdf(file);
    // Rebuilding can occasionally add bytes; never hand back something worse.
    const best = blob.size < file.size ? blob : file;
    return {
      blob: best,
      bytes: best.size,
      strategy,
      metTarget: best.size <= targetBytes,
      pageCount,
      textLayerLost: false,
    };
  }

  const canvases = await renderPages(file, dpi, onProgress);

  let low = 0.25;
  let high = 0.92;
  let best: { blob: Blob; quality: number } | null = null;
  let smallest: { blob: Blob; quality: number } | null = null;

  for (let step = 0; step < 7; step++) {
    const quality = (low + high) / 2;
    const jpegs = await Promise.all(
      canvases.map((canvas) => canvasToJpeg(canvas, quality)),
    );
    const candidate = await buildPdfFromJpegs(jpegs);

    if (!smallest || candidate.size < smallest.blob.size) {
      smallest = { blob: candidate, quality };
    }

    if (candidate.size <= targetBytes) {
      best = { blob: candidate, quality };
      low = quality;
    } else {
      high = quality;
    }
  }

  const chosen = best ?? smallest;
  if (!chosen) throw new Error("Compression produced no output");

  return {
    blob: chosen.blob,
    bytes: chosen.blob.size,
    strategy,
    metTarget: Boolean(best),
    pageCount: canvases.length,
    quality: chosen.quality,
    textLayerLost: true,
  };
}

/** Common PDF upload caps, in bytes. */
export const PDF_SIZE_PRESETS: Array<{
  label: string;
  bytes: number;
  note: string;
}> = [
  { label: "500 KB", bytes: 500 * 1024, note: "Strict portals and exam forms" },
  { label: "1 MB", bytes: 1024 * 1024, note: "Common government upload cap" },
  {
    label: "2 MB",
    bytes: 2 * 1024 * 1024,
    note: "University and job applications",
  },
  { label: "5 MB", bytes: 5 * 1024 * 1024, note: "General web forms" },
  { label: "10 MB", bytes: 10 * 1024 * 1024, note: "Email attachment limits" },
  {
    label: "25 MB",
    bytes: 25 * 1024 * 1024,
    note: "Gmail's attachment ceiling",
  },
];
