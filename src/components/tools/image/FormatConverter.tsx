"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Crop,
  Download,
  Eye,
  FileDown,
  FileImage,
  ImageIcon,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Type,
  ZoomIn
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const OUTPUT_FORMATS = [
  { value: "png", label: "PNG", desc: "Lossless, transparency", mime: "image/png" },
  { value: "jpeg", label: "JPEG", desc: "Smaller size, photos", mime: "image/jpeg" },
  { value: "webp", label: "WebP", desc: "Modern, best compression", mime: "image/webp" },
  { value: "gif", label: "GIF", desc: "Simple graphics", mime: "image/gif" },
  { value: "bmp", label: "BMP", desc: "Uncompressed", mime: "image/bmp" },
  { value: "svg", label: "SVG", desc: "Vector wrapper, scalable", mime: "image/svg+xml" },
];

export default function FormatConverter() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; } | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const [quality, setQuality] = useState(90);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState(0);
  const [estimatedSize, setEstimatedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [hoverPreview, setHoverPreview] = useState<{ url: string; show: boolean; }>({ url: "", show: false });

  const estimateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImage(file);
      setConvertedImage(null);
      setConvertedSize(0);
      setEstimatedSize(0);

      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        loadedImageRef.current = img;
      };
      img.src = url;
    }
  }, []);

  // Real-time size estimation
  useEffect(() => {
    if (!imageUrl || !loadedImageRef.current) return;

    if (estimateTimeoutRef.current) {
      clearTimeout(estimateTimeoutRef.current);
    }

    setIsEstimating(true);

    estimateTimeoutRef.current = setTimeout(() => {
      const img = loadedImageRef.current;
      if (!img) return;

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsEstimating(false);
        return;
      }

      // Fill with white for JPEG
      if (outputFormat === "jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      // For SVG, estimate based on base64 encoding
      if (outputFormat === "svg") {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64 = reader.result as string;
                // SVG wrapper overhead + base64 image
                const svgSize = 200 + base64.length; // approximate SVG wrapper size
                setEstimatedSize(svgSize);
                setIsEstimating(false);
              };
              reader.readAsDataURL(blob);
            } else {
              setIsEstimating(false);
            }
          },
          "image/png"
        );
        return;
      }

      const format = OUTPUT_FORMATS.find(f => f.value === outputFormat);
      const mimeType = format?.mime || "image/png";
      const exportQuality = outputFormat === "png" || outputFormat === "gif" || outputFormat === "bmp"
        ? undefined
        : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setEstimatedSize(blob.size);
          }
          setIsEstimating(false);
        },
        mimeType,
        exportQuality
      );
    }, 150);

    return () => {
      if (estimateTimeoutRef.current) {
        clearTimeout(estimateTimeoutRef.current);
      }
    };
  }, [imageUrl, outputFormat, quality]);

  const getSourceFormat = () => {
    if (!image) return "unknown";
    const ext = image.name.split(".").pop()?.toLowerCase();
    return ext || "unknown";
  };

  const handleConvert = useCallback(async () => {
    if (!imageUrl) return;
    setIsProcessing(true);

    try {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          toast.error("Failed to convert image");
          setIsProcessing(false);
          return;
        }

        // For JPEG, fill with white background (no transparency)
        if (outputFormat === "jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        // Handle SVG conversion (embed as base64)
        if (outputFormat === "svg") {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64 = reader.result as string;
                  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">
  <image width="${img.width}" height="${img.height}" xlink:href="${base64}"/>
</svg>`;
                  const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
                  const svgUrl = URL.createObjectURL(svgBlob);
                  setConvertedImage(svgUrl);
                  setConvertedSize(svgBlob.size);
                  toast.success("Converted to SVG successfully!");
                  setIsProcessing(false);
                };
                reader.readAsDataURL(blob);
              } else {
                setIsProcessing(false);
              }
            },
            "image/png"
          );
          return;
        }

        const format = OUTPUT_FORMATS.find(f => f.value === outputFormat);
        const mimeType = format?.mime || "image/png";
        const exportQuality = outputFormat === "png" || outputFormat === "gif" || outputFormat === "bmp"
          ? undefined
          : quality / 100;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const convertedUrl = URL.createObjectURL(blob);
              setConvertedImage(convertedUrl);
              setConvertedSize(blob.size);
              toast.success(`Converted to ${outputFormat.toUpperCase()} successfully!`);
            }
            setIsProcessing(false);
          },
          mimeType,
          exportQuality
        );
      };
      img.src = imageUrl;
    } catch {
      toast.error("Failed to convert image");
      setIsProcessing(false);
    }
  }, [imageUrl, outputFormat, quality]);

  const handleDownload = useCallback(() => {
    if (!convertedImage) return;
    const link = document.createElement("a");
    const baseName = image?.name?.replace(/\.[^/.]+$/, "") || "image";
    const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
    link.download = `${baseName}.${ext}`;
    link.href = convertedImage;
    link.click();
    toast.success("Download started!");
  }, [convertedImage, image?.name, outputFormat]);

  const handleReset = useCallback(() => {
    setImage(null);
    setImageUrl(null);
    setImageDimensions(null);
    setConvertedImage(null);
    setConvertedSize(0);
    setEstimatedSize(0);
    setOutputFormat("png");
    setQuality(90);
    setHoverPreview({ url: "", show: false });
    loadedImageRef.current = null;
  }, []);

  const originalSize = image?.size || 0;
  const sizeDiff = convertedSize > 0 ? ((convertedSize - originalSize) / originalSize * 100).toFixed(1) : 0;

  const faqs = [
    {
      question: "Which format should I choose?",
      answer: "PNG for transparency and screenshots, JPEG for photos, WebP for web (best compression), GIF for simple graphics.",
    },
    {
      question: "Does converting affect quality?",
      answer: "PNG and GIF are lossless. JPEG and WebP use compression - higher quality = larger file size.",
    },
    {
      question: "Are my images uploaded anywhere?",
      answer: "No. All conversion happens in your browser using HTML5 Canvas. Your images never leave your device.",
    },
  ];

  return (
    <ToolLayout
      title="Format Converter"
      description="Convert images between PNG, JPEG, WebP, GIF, and BMP formats. Adjust quality and download instantly."
      category="image"
      categoryLabel="Image Tools"
      icon={RefreshCw}
      faqs={faqs}
      relatedTools={[
        { title: "Image to Text (OCR)", description: "Extract text", href: "/image-tools/ocr", icon: Type, category: "image" },
        { title: "Background Remover", description: "Remove backgrounds", href: "/image-tools/remove-background", icon: Sparkles, category: "image" },
        { title: "Image Cropper", description: "Crop images", href: "/image-tools/crop-image", icon: Crop, category: "image" },
        { title: "Image Compressor", description: "Reduce file size", href: "/image-tools/compress-image", icon: FileDown, category: "image" },
      ]}
      isWorking={!!imageUrl}
    >
      {/* Hover Preview Modal */}
      <AnimatePresence>
        {hoverPreview.show && hoverPreview.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="p-2 rounded-2xl bg-neutral-900/90 border border-white/20 shadow-2xl">
                <img src={hoverPreview.url} alt="Preview" className="max-w-[80vw] max-h-[70vh] object-contain rounded-xl" />
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-white/10">
                <Eye className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-xs text-white/80">Preview • Move mouse away to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!imageUrl ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <FileDropZone accept="image/*" onFilesSelected={handleFileSelect} maxSize={20 * 1024 * 1024} />

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: RefreshCw, label: "Any Format", desc: "PNG, JPG, WebP, GIF" },
                { icon: FileImage, label: "Quality Control", desc: "Adjust compression" },
                { icon: ImageIcon, label: "Instant", desc: "No upload needed" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/30">
                  <item.icon className="h-5 w-5 text-primary mb-2" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Image Info Bar */}
            {imageDimensions && (
              <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-muted/50 border border-border text-sm max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium truncate max-w-[200px]">{image?.name}</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{imageDimensions.width} × {imageDimensions.height} px</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatFileSize(originalSize)}</span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] uppercase font-medium">
                    {getSourceFormat()}
                  </span>
                </div>
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                {/* Image Preview */}
                <div className="space-y-4">
                  <div className="p-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
                    <div
                      className="relative rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center min-h-[380px] p-6 group cursor-zoom-in"
                      onMouseEnter={() => imageUrl && setHoverPreview({ url: imageUrl, show: true })}
                      onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                    >
                      <img
                        src={imageUrl}
                        alt="Original"
                        className="max-w-full max-h-[350px] object-contain rounded-lg transition-transform group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                          <ZoomIn className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Controls Sidebar */}
                <div className="space-y-4">
                  {/* Output Format */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Convert To</Label>
                      <span className="text-xs text-muted-foreground">
                        From: {getSourceFormat().toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {OUTPUT_FORMATS.map((format) => (
                        <button
                          key={format.value}
                          onClick={() => setOutputFormat(format.value)}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left",
                            outputFormat === format.value
                              ? "bg-primary/20 border border-primary/30"
                              : "bg-muted hover:bg-muted/80 border border-transparent"
                          )}
                        >
                          <div>
                            <span className="font-medium text-sm">{format.label}</span>
                            <p className="text-[11px] text-muted-foreground">{format.desc}</p>
                          </div>
                          {outputFormat === format.value && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality (for lossy formats) */}
                  {(outputFormat === "jpeg" || outputFormat === "webp") && (
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Quality</Label>
                        <span className="text-xl font-bold text-primary">{quality}%</span>
                      </div>
                      <Slider
                        value={[quality]}
                        onValueChange={([v]) => setQuality(v)}
                        min={10}
                        max={100}
                        step={5}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Smaller file</span>
                        <span>Better quality</span>
                      </div>
                    </div>
                  )}

                  {/* Real-time Size Estimation */}
                  {estimatedSize > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3.5 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-violet-500/20">
                            <FileDown className="h-3.5 w-3.5 text-violet-400" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                              Est. Size
                            </div>
                            <div className="text-sm font-bold text-violet-300">
                              {formatFileSize(estimatedSize)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {isEstimating ? (
                            <span className="h-4 w-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin inline-block" />
                          ) : (
                            <div className={cn(
                              "text-sm font-bold",
                              estimatedSize < originalSize ? "text-emerald-400" : "text-amber-400"
                            )}>
                              {estimatedSize < originalSize ? "-" : "+"}
                              {Math.abs(Math.round((1 - estimatedSize / originalSize) * 100))}%
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SVG Note */}
                  {outputFormat === "svg" && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/80">
                      <strong className="text-amber-400">Note:</strong> Creates an SVG with embedded raster image. For true vectorization, use dedicated vector tracing software.
                    </div>
                  )}

                  {/* Convert Button */}
                  <Button onClick={handleConvert} className="w-full h-11" size="lg" disabled={isProcessing}>
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Converting...
                      </span>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Convert to {outputFormat.toUpperCase()}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {convertedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-blue-500/10 border border-emerald-500/30 shadow-xl shadow-emerald-500/5">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500" />

                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30"
                        >
                          <Check className="h-6 w-6 text-emerald-400" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Converted Successfully!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {getSourceFormat().toUpperCase()} → {outputFormat.toUpperCase()} • {formatFileSize(convertedSize)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6">
                        <div
                          className="relative group cursor-zoom-in"
                          onMouseEnter={() => setHoverPreview({ url: convertedImage, show: true })}
                          onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                        >
                          <div className="rounded-xl border border-white/10 overflow-hidden bg-neutral-950/50 p-3 transition-all group-hover:border-emerald-500/40">
                            <img src={convertedImage} alt="Converted" className="max-w-[220px] max-h-[160px] object-contain rounded-lg transition-transform group-hover:scale-[1.02]" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                            <div className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                              <ZoomIn className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between gap-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <FileImage className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Original</span>
                              </div>
                              <p className="text-sm font-mono font-semibold">{formatFileSize(originalSize)}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Converted</span>
                              </div>
                              <p className="text-sm font-mono font-semibold">{formatFileSize(convertedSize)}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <ImageIcon className="h-3.5 w-3.5 text-violet-400" />
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Format</span>
                              </div>
                              <p className="text-sm font-semibold uppercase">{outputFormat}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <FileDown className="h-3.5 w-3.5 text-cyan-400" />
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Size Change</span>
                              </div>
                              <p className={cn("text-sm font-mono font-semibold", Number(sizeDiff) < 0 ? "text-emerald-400" : "text-amber-400")}>
                                {Number(sizeDiff) > 0 ? "+" : ""}{sizeDiff}%
                              </p>
                            </div>
                          </div>

                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Button
                              onClick={handleDownload}
                              size="lg"
                              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:scale-[1.02]"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download {outputFormat.toUpperCase()}
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add another file */}
            <div className="max-w-4xl mx-auto">
              <FileDropZone
                accept="image/*"
                onFilesSelected={handleFileSelect}
                maxSize={20 * 1024 * 1024}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}

