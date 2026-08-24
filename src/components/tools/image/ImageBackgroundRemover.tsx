"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Download,
  Eye,
  FileImage,
  ImageIcon,
  Palette,
  Pipette,
  RefreshCw,
  Sparkles,
  TrendingDown,
  Type,
  Wand2,
  Zap,
  ZoomIn
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export default function ImageBackgroundRemover() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; } | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoverPreview, setHoverPreview] = useState<{ url: string; show: boolean; }>({ url: "", show: false });
  const [originalSize, setOriginalSize] = useState(0);

  // Background removal settings
  const [bgColor, setBgColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState(30);
  const [feathering, setFeathering] = useState(2);
  const [isPickingColor, setIsPickingColor] = useState(false);
  const [useFloodFill, setUseFloodFill] = useState(true);

  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImage(file);
      setOriginalSize(file.size);
      setProcessedImage(null);
      setProcessedSize(0);

      // Auto-detect background color from corners
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });

        // Sample corners to detect background color
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);

          // Sample from all 4 corners
          const corners = [
            ctx.getImageData(0, 0, 1, 1).data,
            ctx.getImageData(img.width - 1, 0, 1, 1).data,
            ctx.getImageData(0, img.height - 1, 1, 1).data,
            ctx.getImageData(img.width - 1, img.height - 1, 1, 1).data,
          ];

          // Find the most common corner color (likely background)
          const avgR = Math.round(corners.reduce((sum, c) => sum + c[0], 0) / 4);
          const avgG = Math.round(corners.reduce((sum, c) => sum + c[1], 0) / 4);
          const avgB = Math.round(corners.reduce((sum, c) => sum + c[2], 0) / 4);

          const detectedColor = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
          setBgColor(detectedColor);
          toast.info(`Background color auto-detected: ${detectedColor.toUpperCase()}`);
        }
      };
      img.src = url;
    }
  }, []);

  // Color picker function
  const pickColorFromImage = useCallback((event: React.MouseEvent<HTMLImageElement>) => {
    if (!isPickingColor || !imageRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) {
        toast.error('Canvas not supported for color picking');
        return;
      }

      const img = imageRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const rect = img.getBoundingClientRect();
      const scaleX = img.naturalWidth / rect.width;
      const scaleY = img.naturalHeight / rect.height;

      const x = Math.floor((event.clientX - rect.left) * scaleX);
      const y = Math.floor((event.clientY - rect.top) * scaleY);

      if (x < 0 || x >= img.naturalWidth || y < 0 || y >= img.naturalHeight) {
        toast.error('Clicked outside image bounds');
        return;
      }

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const color = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;

      setBgColor(color);
      setIsPickingColor(false);
      toast.success(`Background color selected: ${color.toUpperCase()}`);
    } catch (error) {
      console.error('Color picking failed:', error);
      toast.error('Failed to pick color. Please try again.');
    }
  }, [isPickingColor]);

  const handleRemoveBackground = useCallback(async () => {
    if (!imageUrl) return;
    setIsProcessing(true);

    try {
      toast.info("Removing background...");

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
          toast.error("Canvas not supported in this browser");
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Parse background color
        const bgR = parseInt(bgColor.slice(1, 3), 16);
        const bgG = parseInt(bgColor.slice(3, 5), 16);
        const bgB = parseInt(bgColor.slice(5, 7), 16);

        const threshold = (tolerance / 100) * 441.67; // Max distance is sqrt(255^2 * 3) ≈ 441.67

        // Create mask for background pixels
        const mask = new Float32Array(width * height);

        // Calculate color distance for each pixel
        for (let i = 0; i < width * height; i++) {
          const idx = i * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          const distance = Math.sqrt(
            Math.pow(r - bgR, 2) +
            Math.pow(g - bgG, 2) +
            Math.pow(b - bgB, 2)
          );

          // Soft edge based on distance
          if (distance <= threshold) {
            mask[i] = 1 - (distance / threshold) * 0.5; // 1 = fully background, 0.5 = edge
          } else {
            mask[i] = 0; // Not background
          }
        }

        // Flood fill from corners if enabled
        if (useFloodFill) {
          const visited = new Uint8Array(width * height);
          const queue: number[] = [];

          // Start from all 4 corners
          const startPoints = [
            0,
            width - 1,
            (height - 1) * width,
            (height - 1) * width + (width - 1)
          ];

          // Add edge pixels as starting points
          for (let x = 0; x < width; x++) {
            startPoints.push(x); // Top edge
            startPoints.push((height - 1) * width + x); // Bottom edge
          }
          for (let y = 0; y < height; y++) {
            startPoints.push(y * width); // Left edge
            startPoints.push(y * width + (width - 1)); // Right edge
          }

          startPoints.forEach(idx => {
            if (mask[idx] > 0 && !visited[idx]) {
              queue.push(idx);
              visited[idx] = 1;
            }
          });

          // BFS flood fill
          while (queue.length > 0) {
            const idx = queue.shift()!;
            const x = idx % width;
            const y = Math.floor(idx / width);

            // Check 4 neighbors
            const neighbors = [
              y > 0 ? idx - width : -1,
              y < height - 1 ? idx + width : -1,
              x > 0 ? idx - 1 : -1,
              x < width - 1 ? idx + 1 : -1,
            ];

            for (const nIdx of neighbors) {
              if (nIdx >= 0 && !visited[nIdx] && mask[nIdx] > 0) {
                visited[nIdx] = 1;
                queue.push(nIdx);
              }
            }
          }

          // Only keep background pixels that are connected to edges
          for (let i = 0; i < mask.length; i++) {
            if (!visited[i]) {
              mask[i] = 0;
            }
          }
        }

        // Apply feathering (blur the mask edges)
        if (feathering > 0) {
          const blurredMask = new Float32Array(width * height);
          const radius = feathering;

          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              let sum = 0;
              let count = 0;

              for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                  const nx = x + dx;
                  const ny = y + dy;
                  if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    sum += mask[ny * width + nx];
                    count++;
                  }
                }
              }

              blurredMask[y * width + x] = sum / count;
            }
          }

          // Apply blurred mask
          for (let i = 0; i < mask.length; i++) {
            mask[i] = blurredMask[i];
          }
        }

        // Apply mask to create transparency
        let pixelsModified = 0;
        for (let i = 0; i < width * height; i++) {
          if (mask[i] > 0) {
            const idx = i * 4;
            const newAlpha = Math.round((1 - mask[i]) * 255);
            if (newAlpha < data[idx + 3]) {
              data[idx + 3] = newAlpha;
              pixelsModified++;
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const resultUrl = canvas.toDataURL('image/png');

        setProcessedImage(resultUrl);
        const base64Data = resultUrl.split(',')[1];
        const fileSizeBytes = Math.round((base64Data.length * 3) / 4);
        setProcessedSize(fileSizeBytes);

        if (pixelsModified > 0) {
          toast.success(`Background removed from ${pixelsModified.toLocaleString()} pixels`);
        } else {
          toast.warning("No matching background found. Try adjusting the color or tolerance.");
        }

        setIsProcessing(false);
      };

      img.onerror = () => {
        toast.error("Failed to load image. Please try a different image.");
        setIsProcessing(false);
      };

      img.src = imageUrl;

    } catch (error) {
      console.error('Background removal error:', error);
      toast.error("An error occurred during processing. Please try again.");
      setIsProcessing(false);
    }
  }, [imageUrl, bgColor, tolerance, feathering, useFloodFill]);

  const handleDownload = useCallback(() => {
    if (!processedImage) return;
    const link = document.createElement("a");
    const baseName = image?.name?.replace(/\.[^/.]+$/, "") || "image";
    link.download = `${baseName}-no-bg.png`;
    link.href = processedImage;
    link.click();
    toast.success("Download started!");
  }, [processedImage, image?.name]);

  const handleReset = useCallback(() => {
    setImage(null);
    setImageUrl(null);
    setImageDimensions(null);
    setProcessedImage(null);
    setProcessedSize(0);
    setOriginalSize(0);
    setHoverPreview({ url: "", show: false });
    setBgColor("#ffffff");
  }, []);

  const faqs = [
    {
      question: "How does background removal work?",
      answer: "Our tool automatically detects the background color from image corners and removes connected pixels matching that color. It uses flood-fill to only remove the actual background, not similar colors inside the subject.",
    },
    {
      question: "What types of images work best?",
      answer: "Images with solid, uniform background colors work best. White, black, green screen, or any solid colored backgrounds on products, logos, and portraits produce excellent results.",
    },
    {
      question: "How do I get better results?",
      answer: "1) Use the pipette to pick the exact background color. 2) Adjust tolerance for more/less aggressive removal. 3) Enable 'Connected Only' to preserve similar colors inside the subject. 4) Increase feathering for smoother edges.",
    },
    {
      question: "Is my image uploaded to a server?",
      answer: "No. All processing happens in your browser using HTML5 Canvas. Your images never leave your device.",
    },
  ];

  return (
    <ToolLayout
      title="Background Remover"
      description="Remove solid color backgrounds from images with automatic detection and smart edge handling."
      category="image"
      categoryLabel="Image Tools"
      icon={Sparkles}
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
          title: "Image Cropper",
          description: "Crop images",
          href: "/image-tools/crop-image",
          icon: ImageIcon,
          category: "image",
        },
        {
          title: "Image Compressor",
          description: "Reduce file size",
          href: "/image-tools/compress-image",
          icon: TrendingDown,
          category: "image",
        },
        {
          title: "Format Converter",
          description: "Convert formats",
          href: "/image-tools/format-converter",
          icon: RefreshCw,
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
          /* Upload State */
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <FileDropZone
              accept="image/*"
              onFilesSelected={handleFileSelect}
              maxSize={20 * 1024 * 1024}
            />

            {/* Quick tips */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Wand2, label: "Auto Detect", desc: "Smart color detection" },
                { icon: Zap, label: "Instant", desc: "No upload needed" },
                { icon: TrendingDown, label: "Transparent", desc: "PNG with alpha" },
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
          /* Processing State */
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

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Image Preview */}
                <div className="space-y-4">
                  <div className="p-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
                    <div
                      className="relative rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center min-h-[350px] p-6 group cursor-zoom-in"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23333\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23333\'/%3E%3C/svg%3E")' }}
                      onMouseEnter={() => imageUrl && setHoverPreview({ url: processedImage || imageUrl, show: true })}
                      onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                    >
                      <img
                        ref={imageRef}
                        src={processedImage || imageUrl}
                        alt="Preview"
                        className={cn(
                          "max-w-full max-h-[320px] object-contain rounded-lg transition-transform group-hover:scale-[1.02]",
                          isPickingColor ? "cursor-crosshair" : ""
                        )}
                        onClick={pickColorFromImage}
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
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Controls Sidebar */}
                <div className="space-y-5">
                  {/* Background Color Picker */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                    <Label className="text-sm font-semibold">Background Color</Label>

                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm font-mono"
                        placeholder="#ffffff"
                      />
                      <Button
                        variant={isPickingColor ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsPickingColor(!isPickingColor)}
                        className="px-3"
                      >
                        <Pipette className="h-4 w-4" />
                      </Button>
                    </div>

                    {isPickingColor && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200">
                        <strong>Click on the image</strong> to pick a background color
                      </div>
                    )}

                    {/* Tolerance Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Tolerance</span>
                        <span className="text-xs font-mono">{tolerance}%</span>
                      </div>
                      <Slider
                        value={[tolerance]}
                        onValueChange={([v]) => setTolerance(v)}
                        min={5}
                        max={60}
                        step={1}
                        className="py-1"
                      />
                    </div>

                    {/* Feathering Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Edge Smoothing</span>
                        <span className="text-xs font-mono">{feathering}px</span>
                      </div>
                      <Slider
                        value={[feathering]}
                        onValueChange={([v]) => setFeathering(v)}
                        min={0}
                        max={5}
                        step={1}
                        className="py-1"
                      />
                    </div>

                    {/* Flood Fill Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useFloodFill}
                        onChange={(e) => setUseFloodFill(e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <div>
                        <span className="text-sm font-medium">Connected Only</span>
                        <p className="text-xs text-muted-foreground">Only remove background connected to edges</p>
                      </div>
                    </label>
                  </div>

                  {/* Remove Background Button */}
                  <Button
                    onClick={handleRemoveBackground}
                    className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Removing Background...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Remove Background
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
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10 border border-indigo-500/30 shadow-xl shadow-indigo-500/5">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-400 to-purple-500" />

                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30"
                        >
                          <Check className="h-6 w-6 text-indigo-400" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            Background Removed!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Your image is ready for download
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-card/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Original</div>
                          <div className="text-lg font-bold">{formatFileSize(originalSize)}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-card/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Processed</div>
                          <div className="text-lg font-bold text-indigo-500">
                            {formatFileSize(processedSize)}
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
                          className="w-full h-14 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:scale-[1.02]"
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Download PNG
                          <Sparkles className="h-4 w-4 ml-2" />
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

    </ToolLayout>
  );
}
