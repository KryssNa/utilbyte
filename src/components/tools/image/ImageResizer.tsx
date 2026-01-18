"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Link2,
  Link2Off,
  Maximize2,
  RotateCcw,
  Sparkles,
  Type,
  ZoomIn,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const PRESET_SIZES = [
  { label: "HD", width: 1280, height: 720 },
  { label: "Full HD", width: 1920, height: 1080 },
  { label: "4K", width: 3840, height: 2160 },
  { label: "Instagram", width: 1080, height: 1080 },
  { label: "Twitter", width: 1200, height: 675 },
  { label: "Facebook", width: 1200, height: 630 },
  { label: "Thumbnail", width: 150, height: 150 },
  { label: "Icon", width: 64, height: 64 },
];

export default function ImageResizer() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number; } | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoverPreview, setHoverPreview] = useState<{ url: string; show: boolean; }>({ url: "", show: false });

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImage(file);
      setResizedImage(null);
      setResizedSize(0);

      const img = new window.Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
      };
      img.src = url;
    }
  }, []);

  const handleWidthChange = useCallback((newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && aspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  }, [maintainAspectRatio, aspectRatio]);

  const handleHeightChange = useCallback((newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && aspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  }, [maintainAspectRatio, aspectRatio]);

  const applyPreset = useCallback((preset: typeof PRESET_SIZES[0]) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setMaintainAspectRatio(false);
  }, []);

  const handleResize = useCallback(async () => {
    if (!imageUrl || !width || !height) return;
    setIsProcessing(true);

    try {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          toast.error("Failed to resize image");
          setIsProcessing(false);
          return;
        }

        // Use high-quality image scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedUrl = URL.createObjectURL(blob);
              setResizedImage(resizedUrl);
              setResizedSize(blob.size);
              toast.success("Image resized successfully!");
            }
            setIsProcessing(false);
          },
          "image/png",
          1
        );
      };
      img.src = imageUrl;
    } catch {
      toast.error("Failed to resize image");
      setIsProcessing(false);
    }
  }, [imageUrl, width, height]);

  const handleDownload = useCallback(() => {
    if (!resizedImage) return;
    const link = document.createElement("a");
    const baseName = image?.name?.replace(/\.[^/.]+$/, "") || "image";
    link.download = `${baseName}-${width}x${height}.png`;
    link.href = resizedImage;
    link.click();
    toast.success("Download started!");
  }, [resizedImage, image?.name, width, height]);

  const handleReset = useCallback(() => {
    setImage(null);
    setImageUrl(null);
    setOriginalDimensions(null);
    setWidth(0);
    setHeight(0);
    setResizedImage(null);
    setResizedSize(0);
    setMaintainAspectRatio(true);
    setHoverPreview({ url: "", show: false });
  }, []);

  const scalePercentage = originalDimensions
    ? Math.round((width * height) / (originalDimensions.width * originalDimensions.height) * 100)
    : 100;

  const faqs = [
    {
      question: "How does image resizing work?",
      answer: "Our tool uses high-quality canvas scaling to resize images while maintaining sharpness. You can resize to any custom dimensions or use preset sizes.",
    },
    {
      question: "Will resizing affect image quality?",
      answer: "Downscaling typically maintains quality well. Upscaling may introduce some softness, but we use the highest quality interpolation available.",
    },
    {
      question: "Are my images uploaded anywhere?",
      answer: "No. All processing happens in your browser using HTML5 Canvas. Your images never leave your device.",
    },
  ];

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize images to any dimension. Maintain aspect ratio or use preset sizes for social media and web."
      category="image"
      categoryLabel="Image Tools"
      icon={Maximize2}
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
            className="max-w-5xl mx-auto"
          >
            <FileDropZone accept="image/*" onFilesSelected={handleFileSelect} maxSize={20 * 1024 * 1024} />

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Maximize2, label: "Any Size", desc: "Custom dimensions" },
                { icon: Link2, label: "Aspect Ratio", desc: "Keep proportions" },
                { icon: ImageIcon, label: "Presets", desc: "Social & web sizes" },
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
            {originalDimensions && (
              <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-muted/50 border border-border text-sm max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium truncate max-w-[200px]">{image?.name}</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Original:</span>
                  <span className="font-mono">{originalDimensions.width} × {originalDimensions.height} px</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">New:</span>
                  <span className="font-mono text-primary">{width} × {height} px</span>
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

                  {/* Toolbar */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Scale:</span>
                      <span className={cn("font-mono font-medium", scalePercentage > 100 ? "text-amber-500" : "text-emerald-500")}>
                        {scalePercentage}%
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Controls Sidebar */}
                <div className="space-y-4">
                  {/* Dimensions */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Dimensions</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                        className={cn("h-7 px-2 gap-1.5", maintainAspectRatio && "bg-primary/20 text-primary")}
                      >
                        {maintainAspectRatio ? <Link2 className="h-3.5 w-3.5" /> : <Link2Off className="h-3.5 w-3.5" />}
                        <span className="text-xs">{maintainAspectRatio ? "Locked" : "Free"}</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Width (px)</Label>
                        <Input
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className="h-10 font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Height (px)</Label>
                        <Input
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          className="h-10 font-mono"
                        />
                      </div>
                    </div>

                    {/* Quick scale buttons */}
                    <div className="flex gap-2">
                      {[25, 50, 75, 100, 150, 200].map((scale) => (
                        <button
                          key={scale}
                          onClick={() => {
                            if (originalDimensions) {
                              const newWidth = Math.round(originalDimensions.width * scale / 100);
                              const newHeight = Math.round(originalDimensions.height * scale / 100);
                              setWidth(newWidth);
                              setHeight(newHeight);
                              setMaintainAspectRatio(true);
                            }
                          }}
                          className={cn(
                            "flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                            scalePercentage === scale ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {scale}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">Presets</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_SIZES.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => applyPreset(preset)}
                          className={cn(
                            "flex flex-col items-start px-3 py-2 rounded-lg transition-colors text-left",
                            width === preset.width && height === preset.height
                              ? "bg-primary/20 border border-primary/30"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          <span className="text-xs font-medium">{preset.label}</span>
                          <span className="text-[10px] text-muted-foreground">{preset.width}×{preset.height}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resize Button */}
                  <Button onClick={handleResize} className="w-full h-11" size="lg" disabled={isProcessing || !width || !height}>
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Resizing...
                      </span>
                    ) : (
                      <>
                        <Maximize2 className="h-4 w-4 mr-2" />
                        Resize Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {resizedImage && (
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
                            Resized Successfully!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {width} × {height} px • {formatFileSize(resizedSize)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6">
                        <div
                          className="relative group cursor-zoom-in"
                          onMouseEnter={() => setHoverPreview({ url: resizedImage, show: true })}
                          onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                        >
                          <div className="rounded-xl border border-white/10 overflow-hidden bg-neutral-950/50 p-3 transition-all group-hover:border-emerald-500/40">
                            <img src={resizedImage} alt="Resized" className="max-w-[220px] max-h-[160px] object-contain rounded-lg transition-transform group-hover:scale-[1.02]" />
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
                                <Maximize2 className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">New Size</span>
                              </div>
                              <p className="text-sm font-mono font-semibold">{width} × {height} px</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <FileImage className="h-3.5 w-3.5 text-cyan-400" />
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">File Size</span>
                              </div>
                              <p className="text-sm font-mono font-semibold">{formatFileSize(resizedSize)}</p>
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

