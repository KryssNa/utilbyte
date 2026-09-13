/**
 * Compress an image down to a target byte size, entirely in the browser.
 *
 * Upload forms almost never ask for a quality percentage. They ask for "under
 * 50 KB", and the person on the other end has no way to translate that into a
 * slider position. This module does the translation: binary-search the JPEG or
 * WebP quality parameter until the encoded result lands just under the target,
 * and if the smallest acceptable quality still overshoots, start reducing the
 * pixel dimensions as well.
 */

export type TargetMimeType = "image/jpeg" | "image/webp";

export interface CompressToTargetOptions {
  /** Hard upper bound for the output, in bytes. */
  targetBytes: number;
  /** Output encoding. PNG is deliberately excluded — it ignores the quality argument. */
  mimeType?: TargetMimeType;
  /** Lowest quality worth producing. Below this the result is usually unusable. */
  minQuality?: number;
  maxQuality?: number;
  /** Allow shrinking the pixel dimensions when quality alone cannot reach the target. */
  allowDownscale?: boolean;
  /** Never shrink below this fraction of the original dimensions. */
  minScale?: number;
  /** Binary-search steps per scale attempt. Eight gives ~0.4% precision on quality. */
  qualitySteps?: number;
  /** Background painted behind transparent pixels when encoding to JPEG. */
  backgroundColor?: string;
}

export interface CompressToTargetResult {
  blob: Blob;
  bytes: number;
  /** Final quality, 0-1. */
  quality: number;
  /** Final dimension scale, 1 = original size. */
  scale: number;
  width: number;
  height: number;
  /** Number of encode passes performed. Useful for a progress indicator. */
  attempts: number;
  /** False when even the most aggressive settings could not reach the target. */
  metTarget: boolean;
  /** True when the image had to be made physically smaller to fit. */
  downscaled: boolean;
}

const DEFAULTS = {
  mimeType: "image/jpeg" as TargetMimeType,
  minQuality: 0.25,
  maxQuality: 0.95,
  allowDownscale: true,
  minScale: 0.3,
  qualitySteps: 8,
  backgroundColor: "#ffffff",
};

/** Scale factors tried in order once quality alone has been exhausted. */
const SCALE_LADDER = [0.85, 0.7, 0.6, 0.5, 0.42, 0.35, 0.3];

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas encoding failed"))),
      mimeType,
      quality
    );
  });
}

/**
 * Load a File into an HTMLImageElement, resolving once decoding is complete.
 * The object URL is revoked by the caller via the returned `release`.
 */
export function loadImageFromFile(
  file: Blob
): Promise<{ image: HTMLImageElement; release: () => void }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    const release = () => URL.revokeObjectURL(url);

    image.onload = () => resolve({ image, release });
    image.onerror = () => {
      release();
      reject(new Error("That file could not be read as an image"));
    };
    image.src = url;
  });
}

function drawAtScale(
  image: HTMLImageElement,
  scale: number,
  mimeType: TargetMimeType,
  backgroundColor: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // JPEG has no alpha channel. Without this, transparent regions encode as
  // black, which is a nasty surprise on a logo or a signature cut-out.
  if (mimeType === "image/jpeg") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

interface QualitySearchResult {
  blob: Blob | null;
  quality: number;
  attempts: number;
  smallest: { blob: Blob; quality: number } | null;
}

/**
 * Binary-search quality at a fixed scale for the largest quality whose encoded
 * size still fits within `targetBytes`.
 */
async function searchQuality(
  canvas: HTMLCanvasElement,
  mimeType: TargetMimeType,
  targetBytes: number,
  minQuality: number,
  maxQuality: number,
  steps: number
): Promise<QualitySearchResult> {
  let low = minQuality;
  let high = maxQuality;
  let best: { blob: Blob; quality: number } | null = null;
  let smallest: { blob: Blob; quality: number } | null = null;
  let attempts = 0;

  // If the best quality already fits there is nothing to search for, and
  // seven further encodes would only produce a worse image.
  const top = await canvasToBlob(canvas, mimeType, maxQuality);
  attempts++;
  smallest = { blob: top, quality: maxQuality };
  if (top.size <= targetBytes) {
    return { blob: top, quality: maxQuality, attempts, smallest };
  }

  for (let i = 0; i < steps; i++) {
    const quality = (low + high) / 2;
    const blob = await canvasToBlob(canvas, mimeType, quality);
    attempts++;

    if (!smallest || blob.size < smallest.blob.size) {
      smallest = { blob, quality };
    }

    if (blob.size <= targetBytes) {
      best = { blob, quality };
      low = quality; // room to spare — try for better quality
    } else {
      high = quality;
    }
  }

  return {
    blob: best?.blob ?? null,
    quality: best?.quality ?? minQuality,
    attempts,
    smallest,
  };
}

/**
 * Compress `file` to at most `targetBytes`.
 *
 * Tries quality alone first. Only if that fails does it start reducing pixel
 * dimensions, stepping down the scale ladder until the target is met or
 * `minScale` is reached. If nothing fits, the smallest result produced is
 * returned with `metTarget: false` rather than throwing — the caller can then
 * tell the user honestly that the target is out of reach for this image.
 */
export async function compressToTargetSize(
  file: Blob,
  options: CompressToTargetOptions
): Promise<CompressToTargetResult> {
  const {
    targetBytes,
    mimeType = DEFAULTS.mimeType,
    minQuality = DEFAULTS.minQuality,
    maxQuality = DEFAULTS.maxQuality,
    allowDownscale = DEFAULTS.allowDownscale,
    minScale = DEFAULTS.minScale,
    qualitySteps = DEFAULTS.qualitySteps,
    backgroundColor = DEFAULTS.backgroundColor,
  } = options;

  if (targetBytes <= 0) throw new Error("Target size must be greater than zero");

  const { image, release } = await loadImageFromFile(file);

  // Re-encoding a JPEG always costs quality. If the original already fits and
  // is already in the requested format, the right answer is to leave it alone.
  if (file.size <= targetBytes && file.type === mimeType) {
    try {
      return {
        blob: file,
        bytes: file.size,
        quality: 1,
        scale: 1,
        width: image.naturalWidth,
        height: image.naturalHeight,
        attempts: 0,
        metTarget: true,
        downscaled: false,
      };
    } finally {
      release();
    }
  }

  try {
    let totalAttempts = 0;
    let fallback: { blob: Blob; quality: number; scale: number } | null = null;

    const ladder = SCALE_LADDER.filter((s) => s >= minScale);
    let scales = allowDownscale ? [1, ...ladder] : [1];

    for (let index = 0; index < scales.length; index++) {
      const scale = scales[index];
      const canvas = drawAtScale(image, scale, mimeType, backgroundColor);
      const result = await searchQuality(
        canvas,
        mimeType,
        targetBytes,
        minQuality,
        maxQuality,
        qualitySteps
      );
      totalAttempts += result.attempts;

      if (result.smallest && (!fallback || result.smallest.blob.size < fallback.blob.size)) {
        fallback = { ...result.smallest, scale };
      }

      // Walking the ladder one rung at a time can mean dozens of encodes on a
      // 12 MP photo aiming at 20 KB. File size scales roughly with pixel count,
      // so use the overshoot ratio to skip straight to a plausible rung.
      if (!result.blob && index === 0 && allowDownscale && result.smallest) {
        const ratio = Math.sqrt(targetBytes / result.smallest.blob.size);
        const startAt = ladder.findIndex((s) => s <= ratio * 1.15);
        if (startAt > 0) scales = [1, ...ladder.slice(startAt)];
      }

      if (result.blob) {
        return {
          blob: result.blob,
          bytes: result.blob.size,
          quality: result.quality,
          scale,
          width: canvas.width,
          height: canvas.height,
          attempts: totalAttempts,
          metTarget: true,
          downscaled: scale < 1,
        };
      }
    }

    // Nothing fit. Hand back the smallest thing produced and say so.
    if (!fallback) throw new Error("Compression produced no output");

    return {
      blob: fallback.blob,
      bytes: fallback.blob.size,
      quality: fallback.quality,
      scale: fallback.scale,
      width: Math.round(image.naturalWidth * fallback.scale),
      height: Math.round(image.naturalHeight * fallback.scale),
      attempts: totalAttempts,
      metTarget: false,
      downscaled: fallback.scale < 1,
    };
  } finally {
    release();
  }
}

/** Common upload caps, in bytes. */
export const SIZE_PRESETS: Array<{ label: string; bytes: number; note: string }> = [
  { label: "20 KB", bytes: 20 * 1024, note: "Signature strips, strict exam portals" },
  { label: "50 KB", bytes: 50 * 1024, note: "Most Indian and Nepali form photos" },
  { label: "100 KB", bytes: 100 * 1024, note: "Common government upload cap" },
  { label: "200 KB", bytes: 200 * 1024, note: "University and job applications" },
  { label: "240 KB", bytes: 240 * 1024, note: "US visa and DV photo limit" },
  { label: "500 KB", bytes: 500 * 1024, note: "General web and email use" },
  { label: "1 MB", bytes: 1024 * 1024, note: "Relaxed portals, print-ish quality" },
];
