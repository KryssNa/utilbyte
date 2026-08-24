/**
 * Document photo specifications.
 *
 * Accuracy matters more here than coverage. A wrong number on this page means
 * somebody's visa application gets rejected, so every preset carries its
 * provenance: `verified` presets were checked against the issuing authority's
 * own published page and link to it. Everything else is marked as a widely-used
 * standard that the user must confirm before relying on it.
 *
 * If you add a preset, add its source. An unsourced preset does not belong here.
 */

export interface DocumentPhotoPreset {
  id: string;
  label: string;
  region: string;
  /** Output width in pixels. */
  width: number;
  /** Output height in pixels. */
  height: number;
  /** Upper bound on the encoded file, in bytes. Undefined means no stated cap. */
  maxBytes?: number;
  /** Lower bound some authorities impose. */
  minBytes?: number;
  /** Printed equivalent, where the authority states one. */
  printSize?: string;
  notes: string[];
  /** True only when checked against the issuing authority's own published spec. */
  verified: boolean;
  sourceUrl?: string;
}

export const DOCUMENT_PHOTO_PRESETS: DocumentPhotoPreset[] = [
  {
    id: "us-visa-dv",
    label: "US visa / Diversity Visa",
    region: "United States",
    width: 600,
    height: 600,
    maxBytes: 240 * 1024,
    printSize: "2 x 2 in (51 x 51 mm) if scanned at 300 ppi",
    notes: [
      "Square. Minimum 600 x 600 px, maximum 1200 x 1200 px.",
      "JPEG only, 240 KB or less, colour at 24 bits per pixel in sRGB.",
      "Compression ratio must be 20:1 or lower.",
    ],
    verified: true,
    sourceUrl:
      "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/digital-image-requirements.html",
  },
  {
    id: "us-visa-dv-max",
    label: "US visa / DV (maximum resolution)",
    region: "United States",
    width: 1200,
    height: 1200,
    maxBytes: 240 * 1024,
    notes: [
      "The largest size the US system accepts. Use this when your source photo is sharp enough to justify it.",
      "Still capped at 240 KB, so the extra pixels cost quality. If the result looks worse than the 600 x 600 version, use that instead.",
    ],
    verified: true,
    sourceUrl:
      "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/digital-image-requirements.html",
  },
  {
    id: "uk-passport",
    label: "UK passport (digital)",
    region: "United Kingdom",
    width: 900,
    height: 1125,
    maxBytes: 10 * 1024 * 1024,
    minBytes: 50 * 1024,
    notes: [
      "At least 600 px wide and 750 px tall. This preset uses 900 x 1125, the same 4:5 shape with more detail.",
      "File must be between 50 KB and 10 MB.",
      "Plain light-coloured background, in focus, in colour, not edited.",
    ],
    verified: true,
    sourceUrl: "https://www.gov.uk/photos-for-passports",
  },
  {
    id: "iso-35x45-300dpi",
    label: "35 x 45 mm at 300 dpi",
    region: "Common international standard",
    width: 413,
    height: 531,
    notes: [
      "The ICAO-derived 35 x 45 mm print size used by most passport and visa authorities outside the US, including the Schengen area, the UK in print, India, Nepal and Australia.",
      "413 x 531 px is that size at 300 dpi.",
      "Widely used, but not verified against any single authority — check the exact rules for your document before submitting.",
    ],
    printSize: "35 x 45 mm",
    verified: false,
  },
  {
    id: "iso-35x45-600dpi",
    label: "35 x 45 mm at 600 dpi",
    region: "Common international standard",
    width: 827,
    height: 1063,
    notes: [
      "The same 35 x 45 mm shape at double the resolution, for authorities that ask for a higher-resolution scan.",
      "Not verified against any single authority — confirm before submitting.",
    ],
    printSize: "35 x 45 mm",
    verified: false,
  },
  {
    id: "square-2x2-300dpi",
    label: "2 x 2 in at 300 dpi",
    region: "United States (print)",
    width: 600,
    height: 600,
    notes: [
      "The printed US passport photo size, 51 x 51 mm, at 300 dpi.",
      "Identical pixel dimensions to the US digital minimum, which is not a coincidence.",
    ],
    printSize: "2 x 2 in (51 x 51 mm)",
    verified: false,
  },
  {
    id: "exam-photo",
    label: "Exam portal photo",
    region: "South Asia (typical)",
    width: 200,
    height: 230,
    maxBytes: 50 * 1024,
    minBytes: 20 * 1024,
    notes: [
      "The shape most Indian and Nepali competitive exam portals ask for, usually with a 20-50 KB size window.",
      "Portals differ and change between sessions. Read the notification for your exam - this preset is a common default, not a rule.",
    ],
    verified: false,
  },
  {
    id: "exam-signature",
    label: "Exam portal signature",
    region: "South Asia (typical)",
    width: 140,
    height: 60,
    maxBytes: 20 * 1024,
    minBytes: 10 * 1024,
    notes: [
      "The signature strip that usually accompanies the photo above.",
      "Sign on white paper in black or blue ink, photograph it straight on, then crop to this shape.",
      "Portals differ - confirm against your exam notification.",
    ],
    verified: false,
  },
];

export const CUSTOM_PRESET_ID = "custom";
