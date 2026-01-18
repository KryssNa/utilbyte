"use client";

import ContentCluster from "@/components/shared/ContentCluster";
import FileDropZone from "@/components/shared/FileDropZone";
import RelatedTools from "@/components/shared/RelatedTools";
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
  RotateCcw,
  Sparkles,
  TrendingDown,
  Type,
  Zap,
  ZoomIn
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ImageCompressor() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [estimatedSize, setEstimatedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isEstimating, setIsEstimating] = useState<boolean>(false);
  const [hoverPreview, setHoverPreview] = useState<{ url: string; show: boolean; }>({ url: "", show: false });
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; } | null>(null);

  const estimateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImage(file);
      setOriginalSize(file.size);
      setCompressedImage(null);
      setCompressedSize(0);
      setEstimatedSize(0);

      // Preload and store image for estimation
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        loadedImageRef.current = img;
      };
      img.src = url;
    }
  }, []);

  // Real-time compression size estimation
  useEffect(() => {
    if (!imageUrl || !loadedImageRef.current) return;

    // Debounce the estimation
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

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) {
        setIsEstimating(false);
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setEstimatedSize(blob.size);
          }
          setIsEstimating(false);
        },
        "image/jpeg",
        quality / 100
      );
    }, 150); // 150ms debounce

    return () => {
      if (estimateTimeoutRef.current) {
        clearTimeout(estimateTimeoutRef.current);
      }
    };
  }, [imageUrl, quality]);

  const handleCompress = useCallback(async () => {
    if (!imageUrl) return;
    setIsProcessing(true);

    try {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          toast.error("Failed to compress image");
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedUrl = URL.createObjectURL(blob);
              setCompressedImage(compressedUrl);
              setCompressedSize(blob.size);
              toast.success("Image compressed successfully!");
            }
            setIsProcessing(false);
          },
          "image/jpeg",
          quality / 100
        );
      };
      img.src = imageUrl;
    } catch (error) {
      toast.error("Failed to compress image");
      setIsProcessing(false);
    }
  }, [imageUrl, quality]);

  const handleDownload = () => {
    if (!compressedImage) return;
    const link = document.createElement("a");
    link.download = `compressed-${image?.name || "image"}.jpg`;
    link.href = compressedImage;
    link.click();
    toast.success("Download started!");
  };

  const handleReset = () => {
    setImage(null);
    setImageUrl(null);
    setCompressedImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setEstimatedSize(0);
    setQuality(80);
    setImageDimensions(null);
    setHoverPreview({ url: "", show: false });
    loadedImageRef.current = null;
  };

  const compressionRatio =
    compressedSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  const savedBytes = originalSize - compressedSize;

  const faqs = [
    {
      question: "How does image compression work?",
      answer:
        "Our tool uses lossy compression to reduce file size by adjusting the quality level. Lower quality = smaller file size, but with some visual degradation.",
    },
    {
      question: "What's the best quality setting?",
      answer:
        "For most uses, 70-80% quality provides a good balance. For web images, 60-70% often works well. For archival purposes, use 90%+.",
    },
    {
      question: "Are my images uploaded anywhere?",
      answer:
        "No. All compression happens in your browser using HTML5 Canvas. Your images never leave your device.",
    },
  ];

  return (
    <ToolLayout
      title="Image Compressor"
      description="Reduce image file size without losing quality. Adjust compression level and download optimized images instantly."
      category="image"
      categoryLabel="Image Tools"
      icon={FileDown}
      faqs={faqs}
      relatedTools={[
        {
          title: "Image to Text (OCR)",
          description: "Extract text",
          href: "/image-tools/ocr",
          icon: Type,
          category: "image",
        },
        {
          title: "Background Remover",
          description: "Remove backgrounds",
          href: "/image-tools/remove-background",
          icon: Sparkles,
          category: "image",
        },
        {
          title: "Image Cropper",
          description: "Crop images",
          href: "/image-tools/crop-image",
          icon: Crop,
          category: "image",
        },
        {
          title: "Format Converter",
          description: "Convert formats",
          href: "/image-tools/format-converter",
          icon: ImageIcon,
          category: "image",
        },
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
                <img
                  src={hoverPreview.url}
                  alt="Preview"
                  className="max-w-[80vw] max-h-[70vh] object-contain rounded-xl"
                />
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
          /* Upload State - Centered */
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <FileDropZone
              accept="image/*"
              onFilesSelected={handleFileSelect}
              maxSize={20 * 1024 * 1024}
            />

            {/* Quick tips */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Zap, label: "Instant", desc: "No upload needed" },
                { icon: TrendingDown, label: "Up to 90%", desc: "Size reduction" },
                { icon: Sparkles, label: "Smart", desc: "Quality preserved" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/30"
                >
                  <item.icon className="h-5 w-5 text-primary mb-2" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Processing State - Centered Layout */
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
                  <span className="text-muted-foreground">
                    {imageDimensions.width} × {imageDimensions.height} px
                  </span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatFileSize(originalSize)}</span>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto">
              {/* Image Preview & Controls */}
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Image Preview */}
                <div className="space-y-4">
                  {/* Gradient border wrapper */}
                  <div className="p-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
                    <div
                      className="relative rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center min-h-[350px] p-6 group cursor-zoom-in"
                      onMouseEnter={() => imageUrl && setHoverPreview({ url: imageUrl, show: true })}
                      onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                    >
                      <img
                        src={imageUrl}
                        alt="Original"
                        className="max-w-full max-h-[320px] object-contain rounded-lg transition-transform group-hover:scale-[1.02]"
                      />
                      {/* Hover indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                          <ZoomIn className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls Sidebar */}
                <div className="space-y-5">
                  {/* Quality Control */}
                  <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Quality</Label>
                      <span className="text-2xl font-bold text-primary">{quality}%</span>
                    </div>
                    <Slider
                      value={[quality]}
                      onValueChange={([value]) => setQuality(value)}
                      min={10}
                      max={100}
                      step={5}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Smaller file</span>
                      <span>Better quality</span>
                    </div>

                    {/* Quick presets */}
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {[
                        { label: "Low", value: 40 },
                        { label: "Med", value: 60 },
                        { label: "High", value: 80 },
                        { label: "Max", value: 95 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setQuality(preset.value)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                            quality === preset.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Real-time Size Estimation */}
                  {estimatedSize > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Estimated Result
                        </span>
                        {isEstimating && (
                          <span className="h-3 w-3 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                        )}
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-indigo-400">
                            {formatFileSize(estimatedSize)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            from {formatFileSize(originalSize)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "text-lg font-bold",
                            estimatedSize < originalSize ? "text-emerald-400" : "text-amber-400"
                          )}>
                            {estimatedSize < originalSize ? "-" : "+"}
                            {Math.abs(Math.round((1 - estimatedSize / originalSize) * 100))}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {estimatedSize < originalSize ? "smaller" : "larger"}
                          </div>
                        </div>
                      </div>
                      {/* Progress bar visualization */}
                      <div className="mt-3 h-2 bg-black/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (estimatedSize / originalSize) * 100)}%` }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "h-full rounded-full",
                            estimatedSize < originalSize
                              ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
                              : "bg-gradient-to-r from-amber-500 to-orange-500"
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleCompress}
                      className="w-full h-12 text-base"
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Compressing...
                        </span>
                      ) : (
                        <>
                          <FileDown className="h-5 w-5 mr-2" />
                          Compress Image
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Start Over
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Section - Full Width Below */}
            <AnimatePresence>
              {compressedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-blue-500/10 border border-emerald-500/30 shadow-xl shadow-emerald-500/5">
                    {/* Success banner */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500" />

                    <div className="p-6 sm:p-8">
                      {/* Success Header */}
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
                            Compression Complete!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Your image is ready for download
                          </p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-card/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Original</div>
                          <div className="text-lg font-bold">{formatFileSize(originalSize)}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-card/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Compressed</div>
                          <div className="text-lg font-bold text-emerald-500">
                            {formatFileSize(compressedSize)}
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <div className="text-xs text-muted-foreground mb-1">Saved</div>
                          <div className="text-lg font-bold text-emerald-500">
                            {formatFileSize(savedBytes)}
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                          <div className="text-xs text-muted-foreground mb-1">Reduction</div>
                          <div className="text-lg font-bold text-primary">{compressionRatio}%</div>
                        </div>
                      </div>

                      {/* Before/After Comparison */}
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Before
                          </div>
                          <div
                            className="rounded-xl border border-border overflow-hidden bg-neutral-950/30 p-4 flex items-center justify-center min-h-[160px] group cursor-zoom-in transition-all hover:border-white/20"
                            onMouseEnter={() => imageUrl && setHoverPreview({ url: imageUrl, show: true })}
                            onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                          >
                            <img
                              src={imageUrl}
                              alt="Original"
                              className="max-w-full max-h-[140px] object-contain rounded-lg transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <div className="p-2 rounded-full bg-black/60 backdrop-blur-sm">
                                <ZoomIn className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                            After
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px]">
                              -{compressionRatio}%
                            </span>
                          </div>
                          <div
                            className="rounded-xl border border-emerald-500/30 overflow-hidden bg-neutral-950/30 p-4 flex items-center justify-center min-h-[160px] group cursor-zoom-in transition-all hover:border-emerald-500/50"
                            onMouseEnter={() => compressedImage && setHoverPreview({ url: compressedImage, show: true })}
                            onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                          >
                            <img
                              src={compressedImage}
                              alt="Compressed"
                              className="max-w-full max-h-[140px] object-contain rounded-lg transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <div className="p-2 rounded-full bg-black/60 backdrop-blur-sm">
                                <ZoomIn className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Download Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Button
                          onClick={handleDownload}
                          size="lg"
                          className="w-full h-14 text-base bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:scale-[1.02]"
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Download Compressed Image
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add another file option */}
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

      <ContentCluster
        category="image"
        title="Complete Image Processing Suite"
        description="Everything you need to optimize, edit, and transform your images. From compression to advanced editing, our image tools handle all your visual content needs."
        mainTool={{
          title: "Advanced Image Compressor",
          href: "/image-tools/compress-image",
          description: "Reduce image file sizes by up to 90% while maintaining quality. Perfect for web optimization and faster loading times."
        }}
        topics={[
          {
            title: "Image Resizer",
            description: "Change image dimensions and aspect ratios with precision",
            href: "/image-tools/resize-image",
            type: "tool",
            category: "Image Tools"
          },
          {
            title: "Format Converter",
            description: "Convert between JPG, PNG, WebP, GIF formats instantly",
            href: "/image-tools/format-converter",
            type: "tool",
            category: "Image Tools"
          },
          {
            title: "Image Cropper",
            description: "Crop images to perfect dimensions with precision tools",
            href: "/image-tools/crop-image",
            type: "tool",
            category: "Image Tools"
          },
          {
            title: "Background Remover",
            description: "Remove image backgrounds automatically with AI technology",
            href: "/image-tools/remove-background",
            type: "tool",
            category: "Image Tools"
          },
          {
            title: "Image Blur Tool",
            description: "Apply gaussian blur, motion blur, and pixelate effects",
            href: "/image-tools/blur-image",
            type: "tool",
            category: "Image Tools"
          },
          {
            title: "OCR - Image to Text",
            description: "Extract text from images using advanced OCR technology",
            href: "/image-tools/ocr",
            type: "tool",
            category: "Image Tools"
          }
        ]}
      />

      <RelatedTools
        currentTool="Image Compressor"
        tools={[
          {
            title: "Compress PDF",
            description: "Reduce PDF file sizes efficiently",
            href: "/pdf-tools/compress-pdf",
            category: "PDF Tools"
          },
          {
            title: "JSON Formatter",
            description: "Format and validate JSON data",
            href: "/dev-tools/json-formatter",
            category: "Developer Tools"
          }
        ]}
      />
    </ToolLayout>
  );
}
