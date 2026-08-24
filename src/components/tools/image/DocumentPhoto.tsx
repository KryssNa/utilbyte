"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { documentPhotoArticle } from "@/content/tools/document-photo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  CUSTOM_PRESET_ID,
  DOCUMENT_PHOTO_PRESETS,
  type DocumentPhotoPreset,
} from "@/lib/document-photo-presets";
import { compressToTargetSize, loadImageFromFile } from "@/lib/image-target";
import { cn, formatFileSize } from "@/lib/utils";
import {
  AlertTriangle,
  BadgeCheck,
  Download,
  IdCard,
  Move,
  RotateCcw,
  ZoomIn,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const FRAME_WIDTH = 320;

interface Result {
  url: string;
  bytes: number;
  width: number;
  height: number;
  metTarget: boolean;
}

export default function DocumentPhoto() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [presetId, setPresetId] = useState<string>(DOCUMENT_PHOTO_PRESETS[0].id);
  const [customWidth, setCustomWidth] = useState(413);
  const [customHeight, setCustomHeight] = useState(531);
  const [customMaxKb, setCustomMaxKb] = useState<number | "">("");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState<Result | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  const releaseRef = useRef<(() => void) | null>(null);
  // Set whenever the framing should be recomputed from scratch — a new image or
  // a new specification — rather than nudged back into bounds.
  const needsCenterRef = useRef(true);

  const preset: DocumentPhotoPreset =
    presetId === CUSTOM_PRESET_ID
      ? {
          id: CUSTOM_PRESET_ID,
          label: "Custom size",
          region: "Your own spec",
          width: Math.max(1, customWidth),
          height: Math.max(1, customHeight),
          maxBytes: customMaxKb ? Number(customMaxKb) * 1024 : undefined,
          notes: [],
          verified: false,
        }
      : DOCUMENT_PHOTO_PRESETS.find((p) => p.id === presetId) ?? DOCUMENT_PHOTO_PRESETS[0];

  const aspect = preset.width / preset.height;
  const frameWidth = FRAME_WIDTH;
  const frameHeight = Math.round(FRAME_WIDTH / aspect);

  // "Cover" scale — the smallest scale at which the image still fills the frame.
  const baseScale = image
    ? Math.max(frameWidth / image.naturalWidth, frameHeight / image.naturalHeight)
    : 1;
  const scale = baseScale * zoom;
  const drawnWidth = image ? image.naturalWidth * scale : 0;
  const drawnHeight = image ? image.naturalHeight * scale : 0;

  const clamp = useCallback(
    (next: { x: number; y: number }) => ({
      x: Math.min(0, Math.max(frameWidth - drawnWidth, next.x)),
      y: Math.min(0, Math.max(frameHeight - drawnHeight, next.y)),
    }),
    [frameWidth, frameHeight, drawnWidth, drawnHeight]
  );

  // Centre on a new image or a new spec; otherwise just keep the user's framing
  // inside the frame as the zoom changes.
  useEffect(() => {
    if (!image) return;
    if (needsCenterRef.current) {
      needsCenterRef.current = false;
      setOffset({
        x: (frameWidth - drawnWidth) / 2,
        y: (frameHeight - drawnHeight) / 2,
      });
      return;
    }
    setOffset((prev) => ({
      x: Math.min(0, Math.max(frameWidth - drawnWidth, prev.x)),
      y: Math.min(0, Math.max(frameHeight - drawnHeight, prev.y)),
    }));
  }, [image, frameWidth, frameHeight, drawnWidth, drawnHeight]);

  useEffect(() => () => releaseRef.current?.(), []);

  const handleFileSelect = useCallback(async (files: File[]) => {
    const next = files[0];
    if (!next) return;
    try {
      releaseRef.current?.();
      const { image: loaded, release } = await loadImageFromFile(next);
      releaseRef.current = release;
      setFile(next);
      setImage(loaded);
      setZoom(1);
      needsCenterRef.current = true;
      setResult(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that image");
    }
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset(
      clamp({
        x: drag.ox + (e.clientX - drag.startX),
        y: drag.oy + (e.clientY - drag.startY),
      })
    );
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const generate = useCallback(async () => {
    if (!image) return;
    setIsWorking(true);

    try {
      // Map the visible frame back into source-image coordinates.
      const sourceX = -offset.x / scale;
      const sourceY = -offset.y / scale;
      const sourceWidth = frameWidth / scale;
      const sourceHeight = frameHeight / scale;

      const canvas = document.createElement("canvas");
      canvas.width = preset.width;
      canvas.height = preset.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        preset.width,
        preset.height
      );

      const raw = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Encoding failed"))),
          "image/jpeg",
          0.95
        )
      );

      let blob = raw;
      let metTarget = true;

      if (preset.maxBytes && raw.size > preset.maxBytes) {
        const compressed = await compressToTargetSize(raw, {
          targetBytes: preset.maxBytes,
          mimeType: "image/jpeg",
          // The pixel dimensions are the spec. Never trade them away for size.
          allowDownscale: false,
        });
        blob = compressed.blob;
        metTarget = compressed.metTarget;
      }

      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return {
          url: URL.createObjectURL(blob),
          bytes: blob.size,
          width: preset.width,
          height: preset.height,
          metTarget,
        };
      });

      if (metTarget) toast.success(`${preset.width} x ${preset.height}, ${formatFileSize(blob.size)}`);
      else toast.warning("Could not get under the size limit at these dimensions");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the photo");
    } finally {
      setIsWorking(false);
    }
  }, [image, offset, scale, frameWidth, frameHeight, preset]);

  const download = useCallback(() => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.url;
    link.download = `${preset.id}-${result.width}x${result.height}.jpg`;
    link.click();
  }, [result, preset.id]);

  const reset = () => {
    releaseRef.current?.();
    releaseRef.current = null;
    setFile(null);
    setImage(null);
    setResult((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  };

  const belowMinimum = Boolean(
    result && preset.minBytes && result.bytes < preset.minBytes
  );

  return (
    <ToolLayout
      article={documentPhotoArticle}
      title="Document & Passport Photo Maker"
      description="Crop and size a photo to a document specification, then get it under the file size limit. Nothing is uploaded."
      category="image"
      categoryLabel="Image"
      icon={IdCard}
      isWorking={Boolean(file)}
      relatedTools={[
        {
          title: "Compress to Size",
          description: "Hit an exact KB limit on any image",
          href: "/image-tools/compress-to-size",
          category: "image",
        },
        {
          title: "Crop Image",
          description: "Free-form cropping without a preset",
          href: "/image-tools/crop-image",
          category: "image",
        },
        {
          title: "Image to PDF",
          description: "Combine documents into one file to upload",
          href: "/pdf-tools/image-to-pdf",
          category: "pdf",
        },
      ]}
      faqs={[
        {
          question: "Will this photo be accepted?",
          answer:
            "This tool gets the dimensions and file size right. It cannot judge head position, expression, lighting, background or whether your photo is recent enough — those are the other half of every specification, and only the issuing authority decides.",
        },
        {
          question: "Where do the preset numbers come from?",
          answer:
            "Presets marked as verified were checked against the issuing authority's own published requirements and link to the source. The rest are widely-used standards that you should confirm against your own document's rules before submitting.",
        },
        {
          question: "Why is my file smaller than the stated minimum?",
          answer:
            "Some authorities set a lower bound as well as an upper one. If your crop is a plain, low-detail image it can encode below that floor. Use a larger pixel size or a less aggressive crop, and the tool will warn you when it happens.",
        },
        {
          question: "Does my photo get uploaded?",
          answer:
            "No. Cropping and compression run in your browser. You can load this page, go offline, and it still works — which matters more than usual when the file is a passport photo.",
        },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
          <p className="text-sm text-muted-foreground">
            This tool handles dimensions and file size. It does not check head position,
            background, expression or lighting, and specifications change. Always read the
            current requirements from the authority you are applying to before you submit.
          </p>
        </div>

        {!file ? (
          <FileDropZone onFilesSelected={handleFileSelect} accept="image/*" />
        ) : (
          <>
            <div>
              <Label className="text-sm font-semibold">Specification</Label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {DOCUMENT_PHOTO_PRESETS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setPresetId(option.id);
                      needsCenterRef.current = true;
                      setZoom(1);
                    }}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors",
                      presetId === option.id
                        ? "border-primary bg-primary/10"
                        : "border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]/40"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">{option.label}</span>
                      {option.verified && (
                        <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {option.width} × {option.height} px
                      {option.maxBytes ? ` · max ${Math.round(option.maxBytes / 1024)} KB` : ""}
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPresetId(CUSTOM_PRESET_ID);
                    needsCenterRef.current = true;
                    setZoom(1);
                  }}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    presetId === CUSTOM_PRESET_ID
                      ? "border-primary bg-primary/10"
                      : "border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]/40"
                  )}
                >
                  <div className="text-sm font-medium">Custom size</div>
                  <div className="text-[11px] text-muted-foreground">
                    Type the numbers your form asks for
                  </div>
                </button>
              </div>

              {presetId === CUSTOM_PRESET_ID ? (
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <div>
                    <Label className="text-xs">Width (px)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      className="mt-1 w-28"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Height (px)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      className="mt-1 w-28"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Max size (KB, optional)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={customMaxKb}
                      onChange={(e) =>
                        setCustomMaxKb(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      className="mt-1 w-36"
                    />
                  </div>
                </div>
              ) : (
                preset.notes.length > 0 && (
                  <div className="mt-4 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--muted))]/20 p-4">
                    <ul className="space-y-1.5">
                      {preset.notes.map((note) => (
                        <li key={note} className="text-sm text-muted-foreground">
                          {note}
                        </li>
                      ))}
                    </ul>
                    {preset.sourceUrl ? (
                      <a
                        href={preset.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-4"
                      >
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Official requirements
                      </a>
                    ) : (
                      <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
                        Common standard, not verified against a specific authority.
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            <div>
              <Label className="text-sm font-semibold">Position the face in the frame</Label>
              <div className="mt-3 flex flex-col items-center gap-4">
                <div
                  className="relative cursor-move touch-none overflow-hidden rounded-lg border-2 border-primary/40 bg-[rgb(var(--muted))]/30 select-none"
                  style={{ width: frameWidth, height: frameHeight }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.src}
                      alt="Source"
                      draggable={false}
                      className="pointer-events-none absolute max-w-none origin-top-left"
                      style={{
                        width: drawnWidth,
                        height: drawnHeight,
                        transform: `translate(${offset.x}px, ${offset.y}px)`,
                      }}
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 border border-white/40" />
                </div>

                <div className="flex w-full max-w-sm items-center gap-3">
                  <ZoomIn className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={1}
                    max={4}
                    step={0.02}
                  />
                  <span className="w-12 text-right text-xs text-muted-foreground">
                    {zoom.toFixed(2)}×
                  </span>
                </div>

                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Move className="h-3.5 w-3.5" />
                  Drag the image to reposition it
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={generate} disabled={isWorking} className="flex-1" size="lg">
                {isWorking ? "Working…" : `Create ${preset.width} × ${preset.height} photo`}
              </Button>
              <Button variant="outline" size="lg" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Start over
              </Button>
            </div>

            {result && (
              <div
                className={cn(
                  "rounded-xl border p-5",
                  result.metTarget && !belowMinimum
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-amber-500/30 bg-amber-500/5"
                )}
              >
                <div className="flex flex-col items-start gap-4 sm:flex-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.url}
                    alt="Document photo result"
                    className="w-32 rounded-lg border border-[rgb(var(--border))]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {result.width} × {result.height} px · {formatFileSize(result.bytes)}
                    </p>

                    {!result.metTarget && (
                      <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                        Could not get under {Math.round((preset.maxBytes ?? 0) / 1024)} KB at these
                        dimensions without shrinking the image, which would break the spec. Try a
                        tighter crop — less background means fewer bytes.
                      </p>
                    )}

                    {belowMinimum && (
                      <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                        This is below the {Math.round((preset.minBytes ?? 0) / 1024)} KB minimum this
                        specification sets. Some systems reject files that are too small. A larger
                        pixel size usually fixes it.
                      </p>
                    )}

                    <Button onClick={download} className="mt-4 gap-2" size="sm">
                      <Download className="h-4 w-4" />
                      Download JPEG
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
