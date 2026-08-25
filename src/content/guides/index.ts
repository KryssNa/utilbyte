import type { Guide } from "./types";

import { browserVsUploadPrivacyGuide } from "./browser-vs-upload-privacy";
import { compressPhotoTo20kbGuide } from "./compress-photo-to-20kb";
import { documentPhotoSizesGuide } from "./document-photo-sizes";
import { documentsForOnlineFormsGuide } from "./documents-for-online-forms";
import { dvLotteryPhotoRequirementsGuide } from "./dv-lottery-photo-requirements";
import { heicExplainedGuide } from "./heic-explained";
import { imageFormatsComparedGuide } from "./image-formats-compared";
import { pdfCompressionExplainedGuide } from "./pdf-compression-explained";

export type { Guide } from "./types";

/**
 * Every published guide, newest first.
 *
 * Order here is the order on /guides. Add a new guide by importing it and
 * putting it at the top — nothing else needs touching, because the index page,
 * the [slug] route and the sitemap all read from this array.
 */
export const GUIDES: Guide[] = [
  documentPhotoSizesGuide,
  dvLotteryPhotoRequirementsGuide,
  compressPhotoTo20kbGuide,
  documentsForOnlineFormsGuide,
  pdfCompressionExplainedGuide,
  imageFormatsComparedGuide,
  heicExplainedGuide,
  browserVsUploadPrivacyGuide,
];

const BY_SLUG = new Map(GUIDES.map((guide) => [guide.slug, guide]));

export function getGuide(slug: string): Guide | undefined {
  return BY_SLUG.get(slug);
}

export function getGuideSlugs(): string[] {
  return GUIDES.map((guide) => guide.slug);
}

/** Guides that link to a given tool route, for "further reading" on tool pages. */
export function getGuidesForTool(href: string): Guide[] {
  return GUIDES.filter((guide) => guide.relatedTools.some((tool) => tool.href === href));
}
