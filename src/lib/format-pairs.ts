/**
 * Configuration for the single-purpose format conversion pages.
 *
 * These exist because "heic to jpg" is what people actually search for, while
 * "format converter" is not. They are deliberately one component with three
 * configs rather than three copied components — and, more importantly, each
 * page carries its own editorial content. Three pages differing only by a
 * filename would be a doorway-page pattern, which is exactly the thing a site
 * recovering from a content rejection should not be shipping.
 */

export type TargetMime = "image/jpeg" | "image/png" | "image/webp";

export interface FormatPair {
  slug: string;
  /** Short label, e.g. "HEIC to JPG". */
  label: string;
  sourceLabel: string;
  targetLabel: string;
  /** Accept attribute for the file picker. */
  accept: string;
  targetMime: TargetMime;
  targetExtension: string;
  /** Whether the output format has a meaningful quality setting. */
  hasQuality: boolean;
  /** Shown above the drop zone. One or two sentences, specific to this pair. */
  intro: string;
  /**
   * Set when browser support for decoding the source is genuinely patchy, so
   * the tool can explain a failure instead of just reporting one.
   */
  decodeWarning?: string;
  /** Practical advice shown when decoding fails. */
  decodeFailureHelp?: string[];
}

export const FORMAT_PAIRS: Record<string, FormatPair> = {
  "heic-to-jpg": {
    slug: "heic-to-jpg",
    label: "HEIC to JPG",
    sourceLabel: "HEIC",
    targetLabel: "JPG",
    accept: ".heic,.heif,image/heic,image/heif",
    targetMime: "image/jpeg",
    targetExtension: "jpg",
    hasQuality: true,
    intro:
      "iPhones save photos as HEIC by default. Windows, most upload forms and a lot of software will not open them. This converts to JPG, which everything accepts.",
    decodeWarning:
      "HEIC decoding depends on your browser. Safari can do it; Chrome, Firefox and Edge generally cannot, because the format is patent-encumbered and they have not licensed a decoder. If conversion fails here, that is why — and the fix below is better than any converter.",
    decodeFailureHelp: [
      "Your browser could not decode this HEIC file. That is a browser limitation, not a problem with your photo.",
      "The best fix is on the phone: Settings, Camera, Formats, Most Compatible. From then on the camera captures JPEG directly and this problem stops happening.",
      "For photos you already have: emailing or sharing them from an iPhone usually converts them to JPEG automatically. AirDrop and a cable transfer preserve HEIC.",
      "Or open this page in Safari, which can decode HEIC natively.",
    ],
  },
  "webp-to-png": {
    slug: "webp-to-png",
    label: "WebP to PNG",
    sourceLabel: "WebP",
    targetLabel: "PNG",
    accept: ".webp,image/webp",
    targetMime: "image/png",
    targetExtension: "png",
    hasQuality: false,
    intro:
      "WebP is what a lot of sites serve now, and plenty of older software still refuses it. PNG is lossless and universally accepted, and it keeps transparency.",
  },
  "avif-to-jpg": {
    slug: "avif-to-jpg",
    label: "AVIF to JPG",
    sourceLabel: "AVIF",
    targetLabel: "JPG",
    accept: ".avif,image/avif",
    targetMime: "image/jpeg",
    targetExtension: "jpg",
    hasQuality: true,
    intro:
      "AVIF produces very small files and is increasingly what sites serve. Support outside modern browsers is still thin, so anything you need to hand to other software usually has to become a JPG first.",
    decodeWarning:
      "AVIF decoding needs a reasonably current browser. Chrome, Firefox, Safari and Edge have supported it for a while now, but an older version will fail.",
    decodeFailureHelp: [
      "Your browser could not decode this AVIF file, which usually means it is an older version.",
      "Updating the browser is the fix. AVIF decoding is supported in current Chrome, Firefox, Safari and Edge.",
    ],
  },
};

export const FORMAT_PAIR_SLUGS = Object.keys(FORMAT_PAIRS);
