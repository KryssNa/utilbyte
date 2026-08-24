"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Crop,
  Download,
  Eye,
  FileImage,
  FlipHorizontal,
  FlipVertical,
  Grid3X3,
  ImageIcon,
  Info,
  Link2,
  Link2Off,
  Maximize2,
  Minus,
  MousePointer2,
  Move,
  Plus,
  RotateCcw,
  RotateCw,
  Sparkles,
  Type,
  Undo2,
  ZoomIn
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { toast } from "sonner";

// Types
interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageDimensions {
  naturalWidth: number;
  naturalHeight: number;
}

type ResizeHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "move" | null;

const ASPECT_RATIOS = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "2:3", value: 2 / 3 },
];

const SIZE_PRESETS = [
  { label: "Profile", desc: "400×400", width: 400, height: 400 },
  { label: "Cover", desc: "1200×630", width: 1200, height: 630 },
  { label: "Story", desc: "1080×1920", width: 1080, height: 1920 },
  { label: "Post", desc: "1080×1080", width: 1080, height: 1080 },
  { label: "Banner", desc: "1500×500", width: 1500, height: 500 },
  { label: "Thumbnail", desc: "1280×720", width: 1280, height: 720 },
];

const OUTPUT_FORMATS = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
  { value: "svg", label: "SVG" },
];

export default function ImageCropper() {
  // Image state
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // Crop state
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [lockAspectRatio, setLockAspectRatio] = useState(false);

  // Transform state
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // UI state
  const [showGrid, setShowGrid] = useState(true);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedImageSize, setCroppedImageSize] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg" | "webp" | "svg">("png");
  const [quality, setQuality] = useState(92);
  const [history, setHistory] = useState<CropArea[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hoverPreview, setHoverPreview] = useState<{ url: string; show: boolean; }>({ url: "", show: false });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFileName(file.name);
      setCroppedImage(null);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setZoom(1);
      setHistory([]);
      setImageLoaded(false);

      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({
          naturalWidth: img.width,
          naturalHeight: img.height,
        });

        const cropSize = Math.min(img.width, img.height) * 0.7;
        const initialCrop = {
          x: (img.width - cropSize) / 2,
          y: (img.height - cropSize) / 2,
          width: cropSize,
          height: cropSize,
        };
        setCropArea(initialCrop);
        setHistory([initialCrop]);
      };
      img.src = url;
    }
  }, []);

  // Get cursor style
  const getCursor = (handle: ResizeHandle): string => {
    const cursors: Record<string, string> = {
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      nw: "nwse-resize",
      se: "nwse-resize",
      move: "move",
    };
    return cursors[handle || ""] || "default";
  };

  // Get display scale factor
  const getScale = useCallback(() => {
    if (!imageRef.current || !imageDimensions) return 1;
    return imageRef.current.clientWidth / imageDimensions.naturalWidth;
  }, [imageDimensions]);

  // Handle mouse down
  const handleMouseDown = (e: MouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveHandle(handle);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      cropX: cropArea.x,
      cropY: cropArea.y,
      cropW: cropArea.width,
      cropH: cropArea.height,
    });
  };

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!activeHandle || !imageDimensions) return;

      const scale = getScale();
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      const minSize = 30;

      let newCrop = { ...cropArea };

      if (activeHandle === "move") {
        newCrop.x = Math.max(0, Math.min(dragStart.cropX + dx, imageDimensions.naturalWidth - cropArea.width));
        newCrop.y = Math.max(0, Math.min(dragStart.cropY + dy, imageDimensions.naturalHeight - cropArea.height));
      } else {
        const maintainAspect = lockAspectRatio && aspectRatio;

        switch (activeHandle) {
          case "e":
            newCrop.width = Math.max(minSize, dragStart.cropW + dx);
            if (maintainAspect) newCrop.height = newCrop.width / aspectRatio;
            break;
          case "w":
            const newWW = Math.max(minSize, dragStart.cropW - dx);
            newCrop.x = dragStart.cropX + dragStart.cropW - newWW;
            newCrop.width = newWW;
            if (maintainAspect) newCrop.height = newCrop.width / aspectRatio;
            break;
          case "s":
            newCrop.height = Math.max(minSize, dragStart.cropH + dy);
            if (maintainAspect) newCrop.width = newCrop.height * aspectRatio;
            break;
          case "n":
            const newHN = Math.max(minSize, dragStart.cropH - dy);
            newCrop.y = dragStart.cropY + dragStart.cropH - newHN;
            newCrop.height = newHN;
            if (maintainAspect) newCrop.width = newCrop.height * aspectRatio;
            break;
          case "se":
            newCrop.width = Math.max(minSize, dragStart.cropW + dx);
            newCrop.height = maintainAspect ? newCrop.width / aspectRatio : Math.max(minSize, dragStart.cropH + dy);
            break;
          case "sw":
            newCrop.width = Math.max(minSize, dragStart.cropW - dx);
            newCrop.x = dragStart.cropX + dragStart.cropW - newCrop.width;
            newCrop.height = maintainAspect ? newCrop.width / aspectRatio : Math.max(minSize, dragStart.cropH + dy);
            break;
          case "ne":
            newCrop.width = Math.max(minSize, dragStart.cropW + dx);
            if (maintainAspect) {
              newCrop.height = newCrop.width / aspectRatio;
              newCrop.y = dragStart.cropY + dragStart.cropH - newCrop.height;
            } else {
              const newHNE = Math.max(minSize, dragStart.cropH - dy);
              newCrop.y = dragStart.cropY + dragStart.cropH - newHNE;
              newCrop.height = newHNE;
            }
            break;
          case "nw":
            newCrop.width = Math.max(minSize, dragStart.cropW - dx);
            newCrop.x = dragStart.cropX + dragStart.cropW - newCrop.width;
            if (maintainAspect) {
              newCrop.height = newCrop.width / aspectRatio;
              newCrop.y = dragStart.cropY + dragStart.cropH - newCrop.height;
            } else {
              const newHNW = Math.max(minSize, dragStart.cropH - dy);
              newCrop.y = dragStart.cropY + dragStart.cropH - newHNW;
              newCrop.height = newHNW;
            }
            break;
        }

        newCrop.x = Math.max(0, Math.min(newCrop.x, imageDimensions.naturalWidth - minSize));
        newCrop.y = Math.max(0, Math.min(newCrop.y, imageDimensions.naturalHeight - minSize));
        newCrop.width = Math.min(newCrop.width, imageDimensions.naturalWidth - newCrop.x);
        newCrop.height = Math.min(newCrop.height, imageDimensions.naturalHeight - newCrop.y);
      }

      setCropArea(newCrop);
    },
    [activeHandle, aspectRatio, cropArea, dragStart, getScale, imageDimensions, lockAspectRatio]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (activeHandle) {
      setHistory((prev) => [...prev, cropArea]);
    }
    setActiveHandle(null);
  }, [activeHandle, cropArea]);

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(3, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.25));

  // Apply aspect ratio
  const applyAspectRatio = useCallback(
    (ratio: number | null) => {
      setAspectRatio(ratio);
      if (ratio && imageDimensions) {
        let newWidth = cropArea.width;
        let newHeight = cropArea.width / ratio;

        if (newHeight > cropArea.height) {
          newHeight = cropArea.height;
          newWidth = newHeight * ratio;
        }

        const dx = (cropArea.width - newWidth) / 2;
        const dy = (cropArea.height - newHeight) / 2;

        setCropArea({
          x: Math.max(0, cropArea.x + dx),
          y: Math.max(0, cropArea.y + dy),
          width: Math.min(newWidth, imageDimensions.naturalWidth),
          height: Math.min(newHeight, imageDimensions.naturalHeight),
        });
        setLockAspectRatio(true);
      } else {
        setLockAspectRatio(false);
      }
    },
    [cropArea, imageDimensions]
  );

  // Apply size preset
  const applySizePreset = useCallback(
    (preset: (typeof SIZE_PRESETS)[0]) => {
      if (!imageDimensions) return;

      const ratio = preset.width / preset.height;
      setAspectRatio(ratio);
      setLockAspectRatio(true);

      let newWidth = imageDimensions.naturalWidth * 0.9;
      let newHeight = newWidth / ratio;

      if (newHeight > imageDimensions.naturalHeight * 0.9) {
        newHeight = imageDimensions.naturalHeight * 0.9;
        newWidth = newHeight * ratio;
      }

      setCropArea({
        x: (imageDimensions.naturalWidth - newWidth) / 2,
        y: (imageDimensions.naturalHeight - newHeight) / 2,
        width: newWidth,
        height: newHeight,
      });
    },
    [imageDimensions]
  );

  // Undo
  const handleUndo = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCropArea(newHistory[newHistory.length - 1]);
    }
  }, [history]);

  // Generate real-time preview
  useEffect(() => {
    if (!imageUrl || !imageDimensions) return;

    const img = new window.Image();
    img.onload = () => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      const maxPreviewSize = 200;
      const aspectRatio = cropArea.width / cropArea.height;
      let previewW, previewH;

      if (aspectRatio > 1) {
        previewW = maxPreviewSize;
        previewH = maxPreviewSize / aspectRatio;
      } else {
        previewH = maxPreviewSize;
        previewW = maxPreviewSize * aspectRatio;
      }

      canvas.width = previewW;
      canvas.height = previewH;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.drawImage(img, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, canvas.width, canvas.height);

      ctx.restore();

      setPreviewUrl(canvas.toDataURL("image/png"));
    };
    img.src = imageUrl;
  }, [imageUrl, imageDimensions, cropArea, rotation, flipH, flipV]);

  // Perform crop
  const handleCrop = useCallback(() => {
    if (!imageUrl || !imageDimensions) return;

    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.drawImage(img, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, canvas.width, canvas.height);

      ctx.restore();

      if (outputFormat === "svg") {
        // Convert canvas to PNG first, then wrap in SVG
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image width="${canvas.width}" height="${canvas.height}" xlink:href="${base64}"/>
</svg>`;
              const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
              const svgUrl = URL.createObjectURL(svgBlob);

              // Calculate SVG file size
              const fileSizeBytes = svgBlob.size;
              setCroppedImageSize(fileSizeBytes);

              setCroppedImage(svgUrl);
              toast.success("Image cropped successfully!");
            };
            reader.readAsDataURL(blob);
          }
        }, "image/png");
      } else {
        const mimeType = `image/${outputFormat}`;
        const exportQuality = outputFormat === "png" ? undefined : quality / 100;
        const croppedUrl = canvas.toDataURL(mimeType, exportQuality);

        // Calculate file size from base64 data URL
        const base64Length = croppedUrl.split(",")[1]?.length || 0;
        const fileSizeBytes = Math.round((base64Length * 3) / 4);
        setCroppedImageSize(fileSizeBytes);

        setCroppedImage(croppedUrl);
        toast.success("Image cropped successfully!");
      }
    };
    img.src = imageUrl;
  }, [cropArea, flipH, flipV, imageDimensions, imageUrl, outputFormat, quality, rotation]);

  // Download
  const handleDownload = useCallback(() => {
    if (!croppedImage) return;
    const link = document.createElement("a");
    const baseName = fileName.replace(/\.[^/.]+$/, "") || "image";
    const extension = outputFormat === "jpeg" ? "jpg" : outputFormat === "svg" ? "svg" : outputFormat;
    link.download = `${baseName}-cropped.${extension}`;
    link.href = croppedImage;
    link.click();
    toast.success("Download started!");
  }, [croppedImage, fileName, outputFormat]);

  // Format file size helper
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Reset
  const handleReset = useCallback(() => {
    setImageUrl(null);
    setCroppedImage(null);
    setCroppedImageSize(0);
    setImageDimensions(null);
    setCropArea({ x: 50, y: 50, width: 200, height: 200 });
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspectRatio(null);
    setLockAspectRatio(false);
    setHistory([]);
    setPreviewUrl(null);
    setFileName("");
    setHoverPreview({ url: "", show: false });
    setImageLoaded(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!imageUrl) return;

      if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleUndo();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        handleCrop();
      }
      if (e.key === "g") {
        setShowGrid((prev) => !prev);
      }
      if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      }
      if (e.key === "-") {
        handleZoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCrop, handleUndo, imageUrl]);

  const faqs = [
    {
      question: "How does the image cropper work?",
      answer: "Upload an image, drag the crop area or use handles to resize. Real-time preview shows exactly what you'll get.",
    },
    {
      question: "What keyboard shortcuts are available?",
      answer: "G = toggle grid, +/- = zoom, Ctrl+Z = undo, Enter = crop.",
    },
    {
      question: "Is my image uploaded to a server?",
      answer: "No, everything happens in your browser. Your images never leave your device.",
    },
  ];

  const scale = getScale();

  return (
    <ToolLayout
      title="Image Cropper"
      description="Crop images with precision. Drag handles, use aspect ratios, and see real-time preview."
      category="image"
      categoryLabel="Image Tools"
      icon={Crop}
      faqs={faqs}
      relatedTools={[
        { title: "Image to Text (OCR)", description: "Extract text", href: "/image-tools/ocr", icon: Type, category: "image" },
        { title: "Background Remover", description: "Remove backgrounds", href: "/image-tools/remove-background", icon: Sparkles, category: "image" },
        { title: "Image Compressor", description: "Reduce file size", href: "/image-tools/compress-image", icon: ImageIcon, category: "image" },
        { title: "Image Resizer", description: "Resize dimensions", href: "/image-tools/resize-image", icon: Maximize2, category: "image" },
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
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Preview container */}
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
              {/* Label */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-white/10">
                <Eye className="h-3.5 w-3.5 text-emerald-400" />
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
            className="max-w-5xl mx-auto"
          >
            <FileDropZone accept="image/*" onFilesSelected={handleFileSelect} maxSize={20 * 1024 * 1024} />

            {/* Quick tips */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: MousePointer2, label: "Drag & Resize", desc: "Use handles to adjust" },
                { icon: Move, label: "Move Freely", desc: "Drag to reposition" },
                { icon: Sparkles, label: "Live Preview", desc: "See changes instantly" },
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
          /* Cropping State */
          <motion.div
            key="cropping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Image Info Bar */}
            {imageDimensions && (
              <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-muted/50 border border-border text-sm max-w-5xl mx-auto">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Original:</span>
                  <span className="text-muted-foreground">
                    {imageDimensions.naturalWidth} × {imageDimensions.naturalHeight} px
                  </span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="font-medium">Crop:</span>
                  <span className="text-muted-foreground font-mono">
                    {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
                  </span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="font-medium">Zoom:</span>
                  <span className="text-muted-foreground">{Math.round(zoom * 100)}%</span>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="grid gap-6 xl:grid-cols-[1fr_340px] max-w-5xl mx-auto">
              {/* Cropping Area */}
              <div className="space-y-4">
                {/* Gradient border wrapper */}
                <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
                  <div
                    ref={containerRef}
                    className="relative overflow-hidden rounded-2xl bg-neutral-950 select-none"
                    style={{ cursor: activeHandle ? getCursor(activeHandle) : "crosshair" }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <div className="relative flex items-center justify-center" style={{ minHeight: "420px", padding: "1.5rem" }}>
                      <div
                        className="relative"
                        style={{
                          transform: `scale(${zoom})`,
                          transformOrigin: "center center",
                          transition: "transform 0.2s ease-out",
                        }}
                      >
                        <img
                          ref={imageRef}
                          src={imageUrl}
                          alt="Preview"
                          className="max-w-full max-h-[380px] object-contain block"
                          style={{
                            transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                          }}
                          draggable={false}
                          onLoad={() => setImageLoaded(true)}
                        />

                        {imageDimensions && imageLoaded && imageRef.current && (
                          <div
                            className="absolute border-2 border-white"
                            style={{
                              left: cropArea.x * scale,
                              top: cropArea.y * scale,
                              width: cropArea.width * scale,
                              height: cropArea.height * scale,
                              cursor: "move",
                              boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
                            }}
                            onMouseDown={(e) => handleMouseDown(e, "move")}
                          >
                            {showGrid && (
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50" />
                                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50" />
                                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50" />
                                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50" />
                              </div>
                            )}

                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-violet-600 text-white text-xs font-mono whitespace-nowrap shadow-lg">
                              {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
                            </div>

                            {["nw", "ne", "sw", "se"].map((h) => (
                              <div
                                key={h}
                                className={cn(
                                  "absolute w-3.5 h-3.5 bg-white border-2 border-violet-500 rounded-sm shadow-lg z-20 hover:scale-125 transition-transform",
                                  h.includes("n") ? "-top-1.5" : "-bottom-1.5",
                                  h.includes("w") ? "-left-1.5" : "-right-1.5"
                                )}
                                style={{ cursor: getCursor(h as ResizeHandle) }}
                                onMouseDown={(e) => handleMouseDown(e, h as ResizeHandle)}
                              />
                            ))}

                            {["n", "s", "e", "w"].map((h) => (
                              <div
                                key={h}
                                className={cn(
                                  "absolute bg-white border border-violet-500 rounded shadow z-20 hover:scale-110 transition-transform",
                                  (h === "n" || h === "s") && "w-8 h-1.5 left-1/2 -translate-x-1/2",
                                  (h === "e" || h === "w") && "h-8 w-1.5 top-1/2 -translate-y-1/2",
                                  h === "n" && "-top-0.5",
                                  h === "s" && "-bottom-0.5",
                                  h === "w" && "-left-0.5",
                                  h === "e" && "-right-0.5"
                                )}
                                style={{ cursor: getCursor(h as ResizeHandle) }}
                                onMouseDown={(e) => handleMouseDown(e, h as ResizeHandle)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut} disabled={zoom <= 0.5}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-11 text-center text-xs font-mono">{Math.round(zoom * 100)}%</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn} disabled={zoom >= 3}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="w-px h-5 bg-border" />

                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRotation((r) => r - 90)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRotation((r) => r + 90)}>
                    <RotateCw className="h-4 w-4" />
                  </Button>

                  <div className="w-px h-5 bg-border" />

                  <Button variant="ghost" size="icon" className={cn("h-8 w-8", flipH && "bg-primary/20")} onClick={() => setFlipH(!flipH)}>
                    <FlipHorizontal className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className={cn("h-8 w-8", flipV && "bg-primary/20")} onClick={() => setFlipV(!flipV)}>
                    <FlipVertical className="h-4 w-4" />
                  </Button>

                  <div className="w-px h-5 bg-border" />

                  <Button variant="ghost" size="icon" className={cn("h-8 w-8", showGrid && "bg-primary/20")} onClick={() => setShowGrid(!showGrid)}>
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleUndo} disabled={history.length <= 1}>
                    <Undo2 className="h-4 w-4" />
                  </Button>

                  <div className="flex-1" />

                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Reset
                  </Button>

                </div>
                {/* Aspect Ratio */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Aspect Ratio</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLockAspectRatio(!lockAspectRatio)}
                      className={cn("h-7 px-2", lockAspectRatio && "bg-primary/20 text-primary")}
                    >
                      {lockAspectRatio ? <Link2 className="h-3.5 w-3.5" /> : <Link2Off className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {ASPECT_RATIOS.map((r) => (
                      <button
                        key={r.label}
                        onClick={() => applyAspectRatio(r.value)}
                        className={cn(
                          "px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                          aspectRatio === r.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Preview */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Preview</Label>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Hover to enlarge
                    </span>
                  </div>
                  <div
                    className="relative flex items-center justify-center p-4 rounded-xl bg-neutral-950/80 min-h-[140px] group cursor-zoom-in"
                    onMouseEnter={() => previewUrl && setHoverPreview({ url: previewUrl, show: true })}
                    onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="max-w-full max-h-[120px] object-contain rounded-lg border border-white/10 transition-all group-hover:opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                            <ZoomIn className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    )}
                  </div>
                </div>
                {/* Quick Presets */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                  <Label className="text-sm font-semibold">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {SIZE_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => applySizePreset(p)}
                        className="flex flex-col items-start px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-left"
                      >
                        <span className="text-xs font-medium">{p.label}</span>
                        <span className="text-[10px] text-muted-foreground">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Format */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                  <Label className="text-sm font-semibold">Output</Label>
                  <div className="flex gap-2">
                    {OUTPUT_FORMATS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setOutputFormat(f.value as typeof outputFormat)}
                        className={cn(
                          "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                          outputFormat === f.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  {(outputFormat !== "png" && outputFormat !== "svg") && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Quality</span>
                        <span className="font-mono">{quality}%</span>
                      </div>
                      <Slider value={[quality]} onValueChange={([v]) => setQuality(v)} min={10} max={100} step={1} />
                    </div>
                  )}

                  {outputFormat === "svg" && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-amber-200/80 bg-amber-500/10 p-2 rounded-lg">
                        <strong className="text-amber-400">Note:</strong> Creates SVG with embedded raster image. For true vectorization, use dedicated tracing software.
                      </div>
                    </div>
                  )}
                </div>

                {/* Crop Button */}
                <Button onClick={handleCrop} className="w-full h-11" size="lg">
                  <Crop className="h-4 w-4 mr-2" />
                  Crop Image
                </Button>
              </div>
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {croppedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-5xl mx-auto"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-blue-500/10 border border-emerald-500/30 shadow-xl shadow-emerald-500/5">
                    {/* Success banner */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500" />

                    <div className="p-6 sm:p-8">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30"
                        >
                          <Check className="h-6 w-6 text-emerald-400" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Cropped Successfully!
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your image is ready for download
                          </p>
                        </div>
                      </div>

                      {/* Content grid */}
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Image preview with hover */}
                        <div
                          className="relative group cursor-zoom-in"
                          onMouseEnter={() => setHoverPreview({ url: croppedImage, show: true })}
                          onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                        >
                          <div className="rounded-xl border border-white/10 overflow-hidden bg-neutral-950/50 p-3 transition-all group-hover:border-emerald-500/40 group-hover:shadow-lg group-hover:shadow-emerald-500/10">
                            <img
                              src={croppedImage}
                              alt="Cropped"
                              className="max-w-[220px] max-h-[160px] object-contain rounded-lg transition-transform group-hover:scale-[1.02]"
                            />
                          </div>
                          {/* Hover indicator */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                            <div className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                              <ZoomIn className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          {/* Click to view label */}
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-neutral-900 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-white/70">Hover to enlarge</span>
                          </div>
                        </div>

                        {/* Details and action */}
                        <div className="flex-1 flex flex-col justify-between gap-4">
                          {/* Stats grid */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <Maximize2 className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Dimensions</span>
                              </div>
                              <p className="text-sm font-mono font-semibold">
                                {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
                                <span className="text-muted-foreground ml-1">px</span>
                              </p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <FileImage className="h-3.5 w-3.5 text-cyan-400" />
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">File Size</span>
                              </div>
                              <p className="text-sm font-mono font-semibold">
                                {formatFileSize(croppedImageSize)}
                              </p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <ImageIcon className="h-3.5 w-3.5 text-violet-400" />
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Format</span>
                              </div>
                              <p className="text-sm font-semibold uppercase">
                                {outputFormat}
                              </p>
                            </div>
                            {outputFormat !== "png" && (
                              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Quality</span>
                                </div>
                                <p className="text-sm font-mono font-semibold">
                                  {quality}%
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Download button */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
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

            {/* Additional File Drop */}
            <div className="max-w-5xl mx-auto">
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
