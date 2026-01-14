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
  EyeOff,
  FileDown,
  FileImage,
  Grid3X3,
  ImageIcon,
  RotateCcw,
  Sparkles,
  Type,
  ZoomIn
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type BlurMode = "gaussian" | "pixelate";

export default function BlurImage() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; } | null>(null);
  const [blurMode, setBlurMode] = useState<BlurMode>("gaussian");
  const [blurAmount, setBlurAmount] = useState(10);
  const [pixelSize, setPixelSize] = useState(10);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoverPreview, setHoverPreview] = useState<{ url: string; show: boolean; }>({ url: "", show: false });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImage(file);
      setProcessedImage(null);
      setProcessedSize(0);
      setPreviewUrl(null);

      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
    }
  }, []);

  // Generate live preview
  useEffect(() => {
    if (!imageUrl || !imageDimensions) return;

    const img = new window.Image();
    img.onload = () => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      // Use smaller preview size for performance
      const maxSize = 400;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) {
        toast.error("Failed to process image");
        setIsProcessing(false);
        return;
      }


      if (blurMode === "gaussian") {
        ctx.filter = `blur(${blurAmount * scale}px)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none";
      } else {
        // Pixelate effect
        const size = Math.max(1, Math.floor(pixelSize * scale));

        // Draw small
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        tempCanvas.width = Math.ceil(canvas.width / size);
        tempCanvas.height = Math.ceil(canvas.height / size);

        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
      }

      setPreviewUrl(canvas.toDataURL("image/png"));
    };
    img.src = imageUrl;
  }, [imageUrl, imageDimensions, blurMode, blurAmount, pixelSize]);

  const handleProcess = useCallback(async () => {
    if (!imageUrl || !imageDimensions) return;
    setIsProcessing(true);

    try {
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          setIsProcessing(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          toast.error("Failed to process image");
          setIsProcessing(false);
          return;
        }

        if (blurMode === "gaussian") {
          ctx.filter = `blur(${blurAmount}px)`;
          ctx.drawImage(img, 0, 0);
          ctx.filter = "none";
        } else {
          // Pixelate effect at full resolution
          const size = Math.max(1, pixelSize);

          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d", { alpha: true });
          if (!tempCtx) {
            toast.error("Failed to process image");
            setIsProcessing(false);
            return;
          }

          tempCanvas.width = Math.ceil(img.width / size);
          tempCanvas.height = Math.ceil(img.height / size);

          tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const processedUrl = URL.createObjectURL(blob);
              setProcessedImage(processedUrl);
              setProcessedSize(blob.size);
              toast.success("Image processed successfully!");
            }
            setIsProcessing(false);
          },
          "image/png",
          1
        );
      };
      img.src = imageUrl;
    } catch {
      toast.error("Failed to process image");
      setIsProcessing(false);
    }
  }, [imageUrl, imageDimensions, blurMode, blurAmount, pixelSize]);

  const handleDownload = useCallback(() => {
    if (!processedImage) return;
    const link = document.createElement("a");
    const baseName = image?.name?.replace(/\.[^/.]+$/, "") || "image";
    const suffix = blurMode === "gaussian" ? "blurred" : "pixelated";
    link.download = `${baseName}-${suffix}.png`;
    link.href = processedImage;
    link.click();
    toast.success("Download started!");
  }, [processedImage, image?.name, blurMode]);

  const handleReset = useCallback(() => {
    setImage(null);
    setImageUrl(null);
    setImageDimensions(null);
    setProcessedImage(null);
    setProcessedSize(0);
    setPreviewUrl(null);
    setBlurAmount(10);
    setPixelSize(10);
    setHoverPreview({ url: "", show: false });
  }, []);

  const faqs = [
    {
      question: "What's the difference between blur and pixelate?",
      answer: "Blur creates a smooth, out-of-focus effect. Pixelate creates a blocky, mosaic-like effect often used for censoring.",
    },
    {
      question: "Can I blur just part of the image?",
      answer: "Currently this tool applies the effect to the entire image. Use the Image Cropper first if you need to blur a specific area.",
    },
    {
      question: "Are my images uploaded anywhere?",
      answer: "No. All processing happens in your browser using HTML5 Canvas. Your images never leave your device.",
    },
  ];

  return (
    <ToolLayout
      title="Blur Image"
      description="Apply blur or pixelate effects to your images. Perfect for privacy, artistic effects, or background creation."
      category="image"
      categoryLabel="Image Tools"
      icon={EyeOff}
      faqs={faqs}
      relatedTools={[
        { title: "Image to Text (OCR)", description: "Extract text", href: "/image-tools/ocr", icon: Type, category: "image" },
        { title: "Background Remover", description: "Remove backgrounds", href: "/image-tools/remove-background", icon: Sparkles, category: "image" },
        { title: "Image Cropper", description: "Crop images", href: "/image-tools/crop-image", icon: Crop, category: "image" },
        { title: "Image Compressor", description: "Reduce file size", href: "/image-tools/compress-image", icon: FileDown, category: "image" },
      ]}
      isWorking={!!imageUrl}
    >
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={previewCanvasRef} className="hidden" />

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
                { icon: EyeOff, label: "Gaussian Blur", desc: "Smooth blur effect" },
                { icon: Grid3X3, label: "Pixelate", desc: "Mosaic effect" },
                { icon: ImageIcon, label: "Live Preview", desc: "See changes instantly" },
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
                  <span className="font-medium">{formatFileSize(image?.size || 0)}</span>
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
                      onMouseEnter={() => previewUrl && setHoverPreview({ url: previewUrl, show: true })}
                      onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-full max-h-[350px] object-contain rounded-lg transition-transform group-hover:scale-[1.02]"
                        />
                      ) : (
                        <img
                          src={imageUrl}
                          alt="Original"
                          className="max-w-full max-h-[350px] object-contain rounded-lg"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                          <ZoomIn className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      {/* Effect badge */}
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white font-medium">
                        {blurMode === "gaussian" ? `Blur: ${blurAmount}px` : `Pixel: ${pixelSize}px`}
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
                  {/* Effect Mode */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                    <Label className="text-sm font-semibold">Effect Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setBlurMode("gaussian")}
                        className={cn(
                          "flex flex-col items-center gap-2 px-4 py-4 rounded-xl transition-all",
                          blurMode === "gaussian"
                            ? "bg-primary/20 border border-primary/30"
                            : "bg-muted hover:bg-muted/80 border border-transparent"
                        )}
                      >
                        <EyeOff className={cn("h-5 w-5", blurMode === "gaussian" ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-sm font-medium">Blur</span>
                      </button>
                      <button
                        onClick={() => setBlurMode("pixelate")}
                        className={cn(
                          "flex flex-col items-center gap-2 px-4 py-4 rounded-xl transition-all",
                          blurMode === "pixelate"
                            ? "bg-primary/20 border border-primary/30"
                            : "bg-muted hover:bg-muted/80 border border-transparent"
                        )}
                      >
                        <Grid3X3 className={cn("h-5 w-5", blurMode === "pixelate" ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-sm font-medium">Pixelate</span>
                      </button>
                    </div>
                  </div>

                  {/* Intensity Control */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">
                        {blurMode === "gaussian" ? "Blur Amount" : "Pixel Size"}
                      </Label>
                      <span className="text-xl font-bold text-primary">
                        {blurMode === "gaussian" ? `${blurAmount}px` : `${pixelSize}px`}
                      </span>
                    </div>
                    {blurMode === "gaussian" ? (
                      <Slider
                        value={[blurAmount]}
                        onValueChange={([v]) => setBlurAmount(v)}
                        min={1}
                        max={50}
                        step={1}
                        className="py-2"
                      />
                    ) : (
                      <Slider
                        value={[pixelSize]}
                        onValueChange={([v]) => setPixelSize(v)}
                        min={2}
                        max={50}
                        step={1}
                        className="py-2"
                      />
                    )}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Subtle</span>
                      <span>Strong</span>
                    </div>

                    {/* Quick presets */}
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {(blurMode === "gaussian" ? [5, 10, 20, 35] : [5, 10, 20, 40]).map((val) => (
                        <button
                          key={val}
                          onClick={() => blurMode === "gaussian" ? setBlurAmount(val) : setPixelSize(val)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                            (blurMode === "gaussian" ? blurAmount : pixelSize) === val
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {val}px
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Button onClick={handleProcess} className="w-full h-11" size="lg" disabled={isProcessing}>
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        {blurMode === "gaussian" ? <EyeOff className="h-4 w-4 mr-2" /> : <Grid3X3 className="h-4 w-4 mr-2" />}
                        Apply {blurMode === "gaussian" ? "Blur" : "Pixelate"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {processedImage && (
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
                            {blurMode === "gaussian" ? "Blurred" : "Pixelated"} Successfully!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {blurMode === "gaussian" ? `${blurAmount}px blur` : `${pixelSize}px pixels`} • {formatFileSize(processedSize)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6">
                        <div
                          className="relative group cursor-zoom-in"
                          onMouseEnter={() => setHoverPreview({ url: processedImage, show: true })}
                          onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                        >
                          <div className="rounded-xl border border-white/10 overflow-hidden bg-neutral-950/50 p-3 transition-all group-hover:border-emerald-500/40">
                            <img src={processedImage} alt="Processed" className="max-w-[220px] max-h-[160px] object-contain rounded-lg transition-transform group-hover:scale-[1.02]" />
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
                                {blurMode === "gaussian" ? <EyeOff className="h-3.5 w-3.5 text-emerald-400" /> : <Grid3X3 className="h-3.5 w-3.5 text-emerald-400" />}
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Effect</span>
                              </div>
                              <p className="text-sm font-semibold capitalize">{blurMode}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <FileImage className="h-3.5 w-3.5 text-cyan-400" />
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">File Size</span>
                              </div>
                              <p className="text-sm font-mono font-semibold">{formatFileSize(processedSize)}</p>
                            </div>
                          </div>

                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Button
                              onClick={handleDownload}
                              size="lg"
                              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:scale-[1.02]"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Image
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

