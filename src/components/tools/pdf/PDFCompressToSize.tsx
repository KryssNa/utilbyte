"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { compressPdfToSizeArticle } from "@/content/tools/compress-pdf-to-size";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  compressPdfToTarget,
  PDF_SIZE_PRESETS,
  type PdfCompressionStrategy,
} from "@/lib/pdf-target";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Download, FileDown, Gauge, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface Outcome {
  url: string;
  bytes: number;
  metTarget: boolean;
  textLayerLost: boolean;
  strategy: PdfCompressionStrategy;
  pageCount: number;
  quality?: number;
}

const STRATEGIES: Array<{
  value: PdfCompressionStrategy;
  label: string;
  summary: string;
  cost: string;
}> = [
  {
    value: "restructure",
    label: "Keep the text",
    summary: "Rebuilds the file and strips metadata and revision history.",
    cost: "Lossless. Text stays selectable and searchable — but on a scanned PDF this may barely shrink it.",
  },
  {
    value: "rasterise",
    label: "Rasterise pages",
    summary: "Renders each page to an image and rebuilds the PDF from those.",
    cost: "Hits almost any target, and destroys the text layer. The result is pictures, not a document: no search, no selection, no screen reader.",
  },
];

const DPI_CHOICES = [
  { value: 96, label: "96 dpi", note: "Screen reading" },
  { value: 144, label: "144 dpi", note: "Balanced" },
  { value: 200, label: "200 dpi", note: "Readable print" },
  { value: 300, label: "300 dpi", note: "Print quality" },
];

export default function PDFCompressToSize() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState<number>(1024);
  const [strategy, setStrategy] = useState<PdfCompressionStrategy>("restructure");
  const [dpi, setDpi] = useState<number>(144);
  const [isWorking, setIsWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const reset = useCallback(() => {
    setFile(null);
    setOutcome((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
    setProgress(0);
  }, []);

  const handleFileSelect = useCallback((files: File[]) => {
    const next = files[0];
    if (!next) return;
    setFile(next);
    setOutcome((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const run = useCallback(async () => {
    if (!file) return;
    if (!Number.isFinite(targetKb) || targetKb <= 0) {
      toast.error("Enter a target size");
      return;
    }

    setIsWorking(true);
    setProgress(0);
    try {
      const result = await compressPdfToTarget(file, {
        targetBytes: Math.round(targetKb * 1024),
        strategy,
        dpi,
        onProgress: setProgress,
      });

      setOutcome((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return {
          url: URL.createObjectURL(result.blob),
          bytes: result.bytes,
          metTarget: result.metTarget,
          textLayerLost: result.textLayerLost,
          strategy: result.strategy,
          pageCount: result.pageCount,
          quality: result.quality,
        };
      });

      if (result.metTarget) toast.success(`Landed at ${formatFileSize(result.bytes)}`);
      else toast.warning("Could not reach that target — see the note below");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not process that PDF");
    } finally {
      setIsWorking(false);
      setProgress(0);
    }
  }, [file, targetKb, strategy, dpi]);

  const download = useCallback(() => {
    if (!outcome || !file) return;
    const base = file.name.replace(/\.pdf$/i, "");
    const link = document.createElement("a");
    link.href = outcome.url;
    link.download = `${base}-${Math.round(outcome.bytes / 1024)}kb.pdf`;
    link.click();
  }, [outcome, file]);

  return (
    <ToolLayout
      article={compressPdfToSizeArticle}
      title="Compress PDF to a Target Size"
      description="Give it a size limit and choose what you are willing to trade for it. Everything runs in your browser."
      category="pdf"
      categoryLabel="PDF"
      icon={Gauge}
      isWorking={Boolean(file)}
      relatedTools={[
        {
          title: "Compress PDF",
          description: "Set the compression level yourself",
          href: "/pdf-tools/compress-pdf",
          category: "pdf",
        },
        {
          title: "Compress Image to Size",
          description: "The same idea, for images",
          href: "/image-tools/compress-to-size",
          category: "image",
        },
        {
          title: "Split PDF",
          description: "Sometimes the fix is fewer pages, not smaller ones",
          href: "/pdf-tools/split-pdf",
          category: "pdf",
        },
      ]}
      faqs={[
        {
          question: "Why did the lossless option barely shrink my file?",
          answer:
            "Because the bytes are in embedded images. Rebuilding the document strips metadata and unused objects, which helps a text-heavy PDF considerably and a scanned one hardly at all. Scanned pages are pictures, and only re-encoding those pictures makes them smaller.",
        },
        {
          question: "What exactly does rasterising cost me?",
          answer:
            "The text layer. After rasterising, the pages are images: you cannot select or search the text, a screen reader cannot read it, and the change is not reversible. Use it when a portal will reject the file otherwise, and keep your original.",
        },
        {
          question: "Which DPI should I choose?",
          answer:
            "144 is a reasonable default for something that will be read on screen. Drop to 96 if the target is tight and the document is mostly text. Use 200 or 300 only if it will be printed, and expect a much larger file.",
        },
        {
          question: "Is my document uploaded?",
          answer:
            "No. Both strategies run in your browser using pdf-lib and PDF.js. Load the page, disconnect from the network, and it still works.",
        },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {!file ? (
          <FileDropZone
            onFilesSelected={handleFileSelect}
            accept="application/pdf,.pdf"
            maxSize={100 * 1024 * 1024}
          />
        ) : (
          <>
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
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
                  {PDF_SIZE_PRESETS.map((preset) => {
                    const kb = preset.bytes / 1024;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        title={preset.note}
                        onClick={() => setTargetKb(kb)}
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
                <Label className="text-sm font-semibold">What are you willing to trade?</Label>
                <div className="mt-3 space-y-2">
                  {STRATEGIES.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStrategy(option.value)}
                      className={cn(
                        "w-full rounded-lg border p-4 text-left transition-colors",
                        strategy === option.value
                          ? "border-primary bg-primary/10"
                          : "border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]/40"
                      )}
                    >
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{option.summary}</div>
                      <div
                        className={cn(
                          "mt-1.5 text-xs",
                          option.value === "rasterise"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground"
                        )}
                      >
                        {option.cost}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {strategy === "rasterise" && (
                <div>
                  <Label className="text-sm font-semibold">Render resolution</Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {DPI_CHOICES.map((choice) => (
                      <button
                        key={choice.value}
                        type="button"
                        title={choice.note}
                        onClick={() => setDpi(choice.value)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-xs transition-colors",
                          dpi === choice.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]/40"
                        )}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={run} disabled={isWorking} className="w-full gap-2" size="lg">
                <FileDown className="h-4 w-4" />
                {isWorking
                  ? progress > 0
                    ? `Rendering pages… ${Math.round(progress * 100)}%`
                    : "Working…"
                  : `Compress to ${targetKb || "?"} KB`}
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
                    outcome.metTarget && !outcome.textLayerLost
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
                          from {formatFileSize(file.size)} · {outcome.pageCount}{" "}
                          {outcome.pageCount === 1 ? "page" : "pages"}
                          {outcome.quality !== undefined
                            ? ` · JPEG quality ${Math.round(outcome.quality * 100)}%`
                            : ""}
                        </span>
                      </p>

                      {outcome.textLayerLost && (
                        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                          The text layer is gone. These pages are now images — nothing in this file
                          can be selected, searched or read aloud. Keep your original.
                        </p>
                      )}

                      {!outcome.metTarget && outcome.strategy === "restructure" && (
                        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                          Lossless restructuring could not reach {targetKb} KB. That almost always
                          means the size is in embedded images. Rasterising will get there, at the
                          cost of the text layer — or split the document and upload it in parts.
                        </p>
                      )}

                      {!outcome.metTarget && outcome.strategy === "rasterise" && (
                        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                          Even at the lowest quality this document did not fit {targetKb} KB. Try a
                          lower render resolution, or split it into fewer pages per file.
                        </p>
                      )}

                      <Button onClick={download} className="mt-4 gap-2" size="sm">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
