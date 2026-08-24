"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compressToTargetSize, SIZE_PRESETS, type TargetMimeType } from "@/lib/image-target";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Download, FileDown, RotateCcw, Target } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { compressToSizeArticle } from "@/content/tools/compress-to-size";

interface Outcome {
  url: string;
  bytes: number;
  width: number;
  height: number;
  quality: number;
  metTarget: boolean;
  downscaled: boolean;
  attempts: number;
}

const DEFAULT_TARGET_KB = 100;

export default function CompressToSize({
  initialTargetKb = DEFAULT_TARGET_KB,
  headline,
  subheadline,
}: {
  /** Lets the KB-specific landing pages open with their own target preselected. */
  initialTargetKb?: number;
  headline?: string;
  subheadline?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetKb, setTargetKb] = useState<number>(initialTargetKb);
  const [format, setFormat] = useState<TargetMimeType>("image/jpeg");
  const [isWorking, setIsWorking] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const reset = useCallback(() => {
    setFile(null);
    setPreviewUrl((url) => {
      if (url) URL.revokeObjectURL(url);
      return null;
    });
    setOutcome((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const handleFileSelect = useCallback((files: File[]) => {
    const next = files[0];
    if (!next) return;
    setFile(next);
    setPreviewUrl((url) => {
      if (url) URL.revokeObjectURL(url);
      return URL.createObjectURL(next);
    });
    setOutcome((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const handleCompress = useCallback(async () => {
    if (!file) return;
    if (!Number.isFinite(targetKb) || targetKb <= 0) {
      toast.error("Enter a target size in KB");
      return;
    }

    setIsWorking(true);
    try {
      const result = await compressToTargetSize(file, {
        targetBytes: Math.round(targetKb * 1024),
        mimeType: format,
      });

      setOutcome((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return {
          url: URL.createObjectURL(result.blob),
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          quality: result.quality,
          metTarget: result.metTarget,
          downscaled: result.downscaled,
          attempts: result.attempts,
        };
      });

      if (result.metTarget) {
        toast.success(`Landed at ${formatFileSize(result.bytes)}`);
      } else {
        toast.warning("Could not reach that target — see the note below");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Compression failed");
    } finally {
      setIsWorking(false);
    }
  }, [file, targetKb, format]);

  const download = useCallback(() => {
    if (!outcome || !file) return;
    const extension = format === "image/webp" ? "webp" : "jpg";
    const base = file.name.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");
    link.href = outcome.url;
    link.download = `${base}-${Math.round(outcome.bytes / 1024)}kb.${extension}`;
    link.click();
  }, [outcome, file, format]);

  return (
    <ToolLayout
      article={compressToSizeArticle}
      title={headline ?? "Compress Image to a Target Size"}
      description={
        subheadline ??
        "Give it a KB limit and it finds the highest quality that fits. Everything runs in your browser."
      }
      category="image"
      categoryLabel="Image"
      icon={Target}
      isWorking={Boolean(file)}
      relatedTools={[
        {
          title: "Image Compressor",
          description: "Set the quality yourself with a slider",
          href: "/image-tools/compress-image",
          category: "image",
        },
        {
          title: "Resize Image",
          description: "Change pixel dimensions before compressing",
          href: "/image-tools/resize-image",
          category: "image",
        },
        {
          title: "Compress PDF",
          description: "Same idea, for documents",
          href: "/pdf-tools/compress-pdf",
          category: "pdf",
        },
      ]}
      faqs={[
        {
          question: "How does it hit an exact size?",
          answer:
            "It encodes the image repeatedly, searching for the highest quality setting whose output still fits under your limit. If quality alone is not enough, it starts reducing the pixel dimensions too.",
        },
        {
          question: "Why is the output JPEG or WebP and not PNG?",
          answer:
            "PNG is lossless and ignores a quality setting, so there is no dial to turn. Targeting a byte size requires a lossy format. WebP usually reaches a given size at better quality than JPEG, but a few older systems still reject it.",
        },
        {
          question: "What if it cannot reach my target?",
          answer:
            "It tells you, and gives you the smallest result it managed. Very small targets on large or detailed images are sometimes genuinely impossible without cropping first.",
        },
        {
          question: "Are my images uploaded?",
          answer:
            "No. The compression runs in your browser using canvas. Load the page, disconnect from the network, and it still works.",
        },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {!file ? (
          <FileDropZone
            onFilesSelected={handleFileSelect}
            accept="image/*"
            maxSize={50 * 1024 * 1024}
          />
        ) : (
          <>
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Change
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 space-y-5">
              <div>
                <Label className="text-sm font-semibold">Target size</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SIZE_PRESETS.map((preset) => {
                    const kb = preset.bytes / 1024;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setTargetKb(kb)}
                        title={preset.note}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-xs transition-colors",
                          targetKb === kb
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]/40"
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={Number.isFinite(targetKb) ? targetKb : ""}
                    onChange={(e) => setTargetKb(Number(e.target.value))}
                    className="w-32"
                    aria-label="Target size in kilobytes"
                  />
                  <span className="text-sm text-muted-foreground">KB</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Output format</Label>
                <div className="mt-3 flex gap-2">
                  {(
                    [
                      { value: "image/jpeg", label: "JPEG", note: "Accepted everywhere" },
                      { value: "image/webp", label: "WebP", note: "Smaller at the same quality" },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormat(option.value)}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2.5 text-left transition-colors",
                        format === option.value
                          ? "border-primary bg-primary/10"
                          : "border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]/40"
                      )}
                    >
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-[11px] text-muted-foreground">{option.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleCompress}
                disabled={isWorking}
                className="w-full gap-2"
                size="lg"
              >
                <FileDown className="h-4 w-4" />
                {isWorking ? "Working…" : `Compress to ${targetKb || "?"} KB`}
              </Button>
            </div>

            <AnimatePresence>
              {outcome && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "rounded-xl border p-5",
                    outcome.metTarget
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-amber-500/30 bg-amber-500/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {outcome.metTarget ? (
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {formatFileSize(outcome.bytes)}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          from {formatFileSize(file.size)}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {outcome.width} × {outcome.height} px · quality{" "}
                        {Math.round(outcome.quality * 100)}% · {outcome.attempts}{" "}
                        {outcome.attempts === 1 ? "pass" : "passes"}
                      </p>

                      {outcome.downscaled && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Quality alone could not reach {targetKb} KB, so the image was made
                          physically smaller as well. If the form has a minimum pixel size, check
                          the result still meets it.
                        </p>
                      )}

                      {!outcome.metTarget && (
                        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                          {targetKb} KB was out of reach for this image. This is the smallest usable
                          result. Cropping away background first, or accepting a slightly larger
                          limit, is usually the fix.
                        </p>
                      )}

                      <Button onClick={download} className="mt-4 gap-2" size="sm">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {previewUrl && (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <figure>
                        <figcaption className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                          Original
                        </figcaption>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Original"
                          className="w-full rounded-lg border border-[rgb(var(--border))]"
                        />
                      </figure>
                      <figure>
                        <figcaption className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                          Compressed
                        </figcaption>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={outcome.url}
                          alt="Compressed result"
                          className="w-full rounded-lg border border-[rgb(var(--border))]"
                        />
                      </figure>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
