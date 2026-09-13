"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import type { ToolArticleContent } from "@/components/shared/ToolArticle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { FormatPair } from "@/lib/format-pairs";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Download, Info, RefreshCw, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface Converted {
  url: string;
  bytes: number;
  width: number;
  height: number;
}

interface FormatPairConverterProps {
  pair: FormatPair;
  article: ToolArticleContent;
  relatedTools: Array<{
    title: string;
    description: string;
    href: string;
    category?: "image" | "pdf" | "text" | "dev" | "utility" | "video";
  }>;
  faqs: Array<{ question: string; answer: string }>;
}

export default function FormatPairConverter({
  pair,
  article,
  relatedTools,
  faqs,
}: FormatPairConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(90);
  const [isWorking, setIsWorking] = useState(false);
  const [decodeFailed, setDecodeFailed] = useState(false);
  const [converted, setConverted] = useState<Converted | null>(null);

  const reset = useCallback(() => {
    setFile(null);
    setDecodeFailed(false);
    setConverted((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const handleFileSelect = useCallback((files: File[]) => {
    const next = files[0];
    if (!next) return;
    setFile(next);
    setDecodeFailed(false);
    setConverted((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setIsWorking(true);
    setDecodeFailed(false);

    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        // A decode failure is the expected outcome for HEIC outside Safari, so
        // it is handled as a documented case rather than a generic error.
        img.onerror = () => reject(new Error("decode-failed"));
        img.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context unavailable");

      // JPEG has no alpha channel; without this, transparency encodes as black.
      if (pair.targetMime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(image, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (result) => (result ? resolve(result) : reject(new Error("Encoding failed"))),
          pair.targetMime,
          pair.hasQuality ? quality / 100 : undefined
        )
      );

      setConverted((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return {
          url: URL.createObjectURL(blob),
          bytes: blob.size,
          width: canvas.width,
          height: canvas.height,
        };
      });
      toast.success(`Converted to ${pair.targetLabel}`);
    } catch (error) {
      if (error instanceof Error && error.message === "decode-failed") {
        setDecodeFailed(true);
        toast.error(`Your browser could not read this ${pair.sourceLabel} file`);
      } else {
        toast.error(error instanceof Error ? error.message : "Conversion failed");
      }
    } finally {
      URL.revokeObjectURL(objectUrl);
      setIsWorking(false);
    }
  }, [file, pair, quality]);

  const download = useCallback(() => {
    if (!converted || !file) return;
    const base = file.name.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");
    link.href = converted.url;
    link.download = `${base}.${pair.targetExtension}`;
    link.click();
  }, [converted, file, pair.targetExtension]);

  return (
    <ToolLayout
      article={article}
      title={`Convert ${pair.label}`}
      description={pair.intro}
      category="image"
      categoryLabel="Image"
      icon={RefreshCw}
      isWorking={Boolean(file)}
      relatedTools={relatedTools}
      faqs={faqs}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {pair.decodeWarning && (
          <div className="flex items-start gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--muted))]/20 p-4">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">{pair.decodeWarning}</p>
          </div>
        )}

        {!file ? (
          <FileDropZone
            onFilesSelected={handleFileSelect}
            accept={pair.accept}
            maxSize={50 * 1024 * 1024}
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

            {pair.hasQuality && (
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Quality</Label>
                  <span className="text-sm text-muted-foreground">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={([value]) => setQuality(value)}
                  min={40}
                  max={100}
                  step={1}
                  className="mt-4"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  90% is a sensible default for photographs. Below about 70% the artefacts start to
                  show on skin and in smooth gradients.
                </p>
              </div>
            )}

            <Button onClick={convert} disabled={isWorking} className="w-full gap-2" size="lg">
              <RefreshCw className={cn("h-4 w-4", isWorking && "animate-spin")} />
              {isWorking ? "Converting…" : `Convert to ${pair.targetLabel}`}
            </Button>

            <AnimatePresence>
              {decodeFailed && pair.decodeFailureHelp && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                    <div className="space-y-2">
                      {pair.decodeFailureHelp.map((line, i) => (
                        <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {converted && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5"
                >
                  <p className="font-semibold">
                    {formatFileSize(converted.bytes)}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      from {formatFileSize(file.size)} · {converted.width} × {converted.height} px
                    </span>
                  </p>
                  <Button onClick={download} className="mt-4 gap-2" size="sm">
                    <Download className="h-4 w-4" />
                    Download {pair.targetLabel}
                  </Button>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={converted.url}
                    alt="Converted result"
                    className="mt-5 w-full rounded-lg border border-[rgb(var(--border))]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
