"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  GripVertical,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Upload,
  X
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type PageSize = 'a4' | 'letter' | 'a3' | 'custom';
type Orientation = 'portrait' | 'landscape';

interface ImageFile {
  file: File;
  preview: string;
  dimensions?: { width: number; height: number; };
}

export default function ImageToPDF() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [customWidth, setCustomWidth] = useState<number>(210);
  const [customHeight, setCustomHeight] = useState<number>(297);
  const [margin, setMargin] = useState<number>(10);
  const [fitMode, setFitMode] = useState<'fit' | 'fill' | 'stretch'>('fit');
  const [mergedPdf, setMergedPdf] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleFileSelect = useCallback(async (newFiles: File[]) => {
    // Allow duplicates - process all new files
    const allFiles = [...images.map(img => img.file), ...newFiles];

    if (allFiles.length > 50) {
      toast.warning("Maximum 50 images allowed. Only the first 50 will be used.");
    }

    const filesToProcess = allFiles.slice(0, 50);
    const newFilesToAdd = filesToProcess.slice(images.length);

    if (newFilesToAdd.length === 0) return; // No new files to add

    // Process new images and get dimensions
    const processedImages: ImageFile[] = [...images]; // Start with existing images

    for (const file of newFilesToAdd) {
      try {
        const preview = URL.createObjectURL(file);

        // Get image dimensions
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = preview;
        });

        processedImages.push({
          file,
          preview,
          dimensions: { width: img.naturalWidth, height: img.naturalHeight }
        });
      } catch (error) {
        console.error(`Failed to process image ${file.name}:`, error);
        // Still add the image even if we can't get dimensions
        processedImages.push({
          file,
          preview: URL.createObjectURL(file)
        });
      }
    }

    setImages(processedImages);
    setMergedPdf(null);
    setMergedSize(0);
  }, [images]);

  const getPageDimensions = (size: PageSize, orientation: Orientation) => {
    const dimensions = {
      a4: { width: 595.28, height: 841.89 }, // A4 in points (72 DPI)
      letter: { width: 612, height: 792 }, // Letter in points
      a3: { width: 841.89, height: 1190.55 }, // A3 in points
      custom: { width: customWidth * 2.83465, height: customHeight * 2.83465 } // Convert mm to points
    };

    const dim = dimensions[size];
    return orientation === 'landscape'
      ? { width: dim.height, height: dim.width }
      : { width: dim.width, height: dim.height };
  };

  const handleConvert = useCallback(async () => {
    if (images.length === 0) {
      toast.error("Please add image files first");
      return;
    }

    setIsProcessing(true);

    try {
      const pdf = await PDFDocument.create();
      const pageDims = getPageDimensions(pageSize, orientation);
      const marginPoints = margin * 2.83465; // Convert mm to points

      for (const imageFile of images) {
        try {
          const page = pdf.addPage([pageDims.width, pageDims.height]);

          // Load image
          const imageBytes = await imageFile.file.arrayBuffer();
          let pdfImage;

          if (imageFile.file.type === 'image/jpeg' || imageFile.file.type === 'image/jpg') {
            pdfImage = await pdf.embedJpg(imageBytes);
          } else if (imageFile.file.type === 'image/png') {
            pdfImage = await pdf.embedPng(imageBytes);
          } else {
            // Convert other formats to PNG (simplified approach)
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            await new Promise((resolve) => {
              img.onload = resolve;
              img.src = imageFile.preview;
            });

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);

            const pngDataUrl = canvas.toDataURL('image/png');
            const pngResponse = await fetch(pngDataUrl);
            const pngBytes = await pngResponse.arrayBuffer();
            pdfImage = await pdf.embedPng(pngBytes);
          }

          // Calculate image dimensions and position
          const imageAspectRatio = pdfImage.width / pdfImage.height;
          const pageWidth = pageDims.width - (marginPoints * 2);
          const pageHeight = pageDims.height - (marginPoints * 2);

          let drawWidth, drawHeight, x, y;

          switch (fitMode) {
            case 'fit':
              // Fit image maintaining aspect ratio
              if (imageAspectRatio > pageWidth / pageHeight) {
                drawWidth = pageWidth;
                drawHeight = pageWidth / imageAspectRatio;
              } else {
                drawHeight = pageHeight;
                drawWidth = pageHeight * imageAspectRatio;
              }
              x = marginPoints + (pageWidth - drawWidth) / 2;
              y = marginPoints + (pageHeight - drawHeight) / 2;
              break;

            case 'fill':
              // Fill page maintaining aspect ratio (may crop)
              if (imageAspectRatio > pageWidth / pageHeight) {
                drawHeight = pageHeight;
                drawWidth = pageHeight * imageAspectRatio;
              } else {
                drawWidth = pageWidth;
                drawHeight = pageWidth / imageAspectRatio;
              }
              x = marginPoints + (pageWidth - drawWidth) / 2;
              y = marginPoints + (pageHeight - drawHeight) / 2;
              break;

            case 'stretch':
              // Stretch to fill page
              drawWidth = pageWidth;
              drawHeight = pageHeight;
              x = marginPoints;
              y = marginPoints;
              break;
          }

          // Draw image on page
          page.drawImage(pdfImage, {
            x,
            y,
            width: drawWidth,
            height: drawHeight,
          });

        } catch (error) {
          console.error(`Failed to add image ${imageFile.file.name} to PDF:`, error);
          toast.error(`Failed to process ${imageFile.file.name}`);
        }
      }

      const pdfBytes = await pdf.save();
      const uint8Array = new Uint8Array(pdfBytes);
      const blob = new Blob([uint8Array], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setMergedPdf(url);
      setMergedSize(blob.size);

      toast.success(`Successfully created PDF with ${images.length} pages!`);
    } catch (error) {
      console.error('PDF creation error:', error);
      toast.error("Failed to create PDF from images");
    } finally {
      setIsProcessing(false);
    }
  }, [images, pageSize, orientation, customWidth, customHeight, margin, fitMode]);

  const handleDownload = useCallback(() => {
    if (!mergedPdf) return;
    const link = document.createElement("a");
    link.download = `images-to-pdf-${images.length}-pages.pdf`;
    link.href = mergedPdf;
    link.click();
    toast.success("Download started!");
  }, [mergedPdf, images.length]);

  const handleReset = useCallback(() => {
    setImages([]);
    setMergedPdf(null);
    setMergedSize(0);
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, []);

  const removeImage = useCallback((indexToRemove: number) => {
    const imageToRemove = images[indexToRemove];
    URL.revokeObjectURL(imageToRemove.preview);

    // Update drag indices if they are affected by the removal
    setDraggedIndex(prev => prev !== null && prev > indexToRemove ? prev - 1 : prev === indexToRemove ? null : prev);
    setDropTargetIndex(prev => prev !== null && prev > indexToRemove ? prev - 1 : prev === indexToRemove ? null : prev);

    // Clear merged PDF when images are removed
    if (mergedPdf) {
      URL.revokeObjectURL(mergedPdf);
      setMergedPdf(null);
      setMergedSize(0);
    }

    setImages(images.filter((_, index) => index !== indexToRemove));
  }, [images, mergedPdf]);

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    setImages(newImages);

    // Clear drag states after successful move
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, [images]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());

    // Set a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.5';
    dragImage.style.transform = 'scale(0.95)';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetIndex(index);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear drop target if we're actually leaving the element
    // and not moving to a child element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropTargetIndex(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveImage(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, [draggedIndex, moveImage]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, []);

  const pageSizeOptions = [
    { value: 'a4', label: 'A4 (210×297mm)', desc: 'Standard paper size' },
    { value: 'letter', label: 'Letter (8.5×11")', desc: 'US paper size' },
    { value: 'a3', label: 'A3 (297×420mm)', desc: 'Large paper size' },
    { value: 'custom', label: 'Custom Size', desc: 'Define your own' },
  ];

  const orientationOptions = [
    { value: 'portrait', label: 'Portrait', desc: 'Tall orientation' },
    { value: 'landscape', label: 'Landscape', desc: 'Wide orientation' },
  ];

  const fitModeOptions = [
    { value: 'fit', label: 'Fit', desc: 'Maintain aspect ratio, fit within page' },
    { value: 'fill', label: 'Fill', desc: 'Maintain aspect ratio, fill page (may crop)' },
    { value: 'stretch', label: 'Stretch', desc: 'Stretch to fill page' },
  ];

  const faqs = [
    {
      question: "What image formats are supported?",
      answer: "JPEG, PNG, and other common formats. Images are automatically converted to PDF-compatible formats.",
    },
    {
      question: "Can I reorder the images?",
      answer: "Yes! Drag and drop the images to change their order in the PDF. The order shown determines the page order.",
    },
    {
      question: "How does the fit mode work?",
      answer: "Fit maintains aspect ratio within margins, Fill fills the page (may crop), Stretch distorts to fill exactly.",
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No. All processing happens in your browser using pdf-lib. Your files never leave your device.",
    },
  ];

  const totalSize = images.reduce((sum, img) => sum + img.file.size, 0);

  return (
    <ToolLayout
      title="Image to PDF"
      description="Convert multiple images into a single PDF document. Supports up to 50 images with custom page sizes and positioning."
      category="pdf"
      categoryLabel="PDF Tools"
      icon={ImageIcon}
      faqs={faqs}
      relatedTools={[
        { title: "PDF to Image", description: "Convert pages", href: "/pdf-tools/pdf-to-image", icon: Sparkles, category: "pdf" },
        { title: "Merge PDF", description: "Combine files", href: "/pdf-tools/merge-pdf", icon: Upload, category: "pdf" },
        { title: "Compress PDF", description: "Reduce size", href: "/pdf-tools/compress-pdf", icon: Download, category: "pdf" },
      ]}
      isWorking={!!images.length}
    >
      <AnimatePresence mode="wait">
        {!images.length ? (
          /* Upload State */
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
              multiple
              maxFiles={50}
              onFilesSelected={handleFileSelect}
              maxSize={50 * 1024 * 1024}
            />

            {/* Quick tips */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: ImageIcon, label: "Multiple Images", desc: "Up to 50 images" },
                { icon: Sparkles, label: "Custom Layout", desc: "Size & margins" },
                { icon: Upload, label: "Client-side", desc: "No uploads" },
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
            {/* File Summary Bar */}
            <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-muted/50 border border-border text-sm max-w-4xl mx-auto">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{images.length} images • {formatFileSize(totalSize)} total</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-medium">{pageSizeOptions.find(opt => opt.value === pageSize)?.label}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Drag to reorder images</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Images List & Controls */}
                <div className="space-y-4">
                  {/* Gradient border wrapper */}
                  <div className="p-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
                    <div className="rounded-2xl overflow-hidden bg-neutral-950 flex flex-col min-h-[600px]">
                      {/* Header */}
                      <div className="p-4 bg-card/50 border-b border-border">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">Images to Convert</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="h-8 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Clear All
                          </Button>
                        </div>
                      </div>

                      {/* Images Grid */}
                      <div className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-wrap gap-2 justify-start">
                          {images.map((image, index) => (
                            <div
                              key={`${image.file.name}-${index}`}
                              className={cn(
                                "relative rounded-xl border bg-card/80 overflow-hidden cursor-move transition-all group w-32 h-32",
                                draggedIndex === index && "opacity-50 scale-95",
                                dropTargetIndex === index && "ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-background",
                                "hover:shadow-indigo-500/10"
                              )}
                              draggable
                              onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, index)}
                              onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e, index)}
                              onDragLeave={(e: React.DragEvent<HTMLDivElement>) => handleDragLeave(e)}
                              onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, index)}
                              onDragEnd={handleDragEnd}
                            >
                              {/* Drop indicator overlay */}
                              {dropTargetIndex === index && draggedIndex !== null && (
                                <div className="absolute inset-0 bg-indigo-500/10 border-2 border-dashed border-indigo-500/50 z-10" />
                              )}

                              <div className="relative w-full h-full">
                                <img
                                  src={image.preview}
                                  alt={image.file.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                                {/* Drag handle */}
                                <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <GripVertical className="h-3 w-3 text-white" />
                                </div>

                                {/* Page number */}
                                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
                                  #{index + 1}
                                </div>

                                {/* Remove button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                  className="absolute bottom-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="p-3">
                                <p className="text-xs font-medium truncate">{image.file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(image.file.size)}
                                  {image.dimensions && ` • ${image.dimensions.width}×${image.dimensions.height}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Empty state hint */}
                        {images.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Drop images here to add them</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Start Over
                    </Button>
                  </div>
                </div>

                {/* Controls Sidebar */}
                <div className="space-y-4">
                  {/* Page Settings */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                    <Label className="text-sm font-semibold">Page Settings</Label>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Page Size</Label>
                        <Select value={pageSize} onValueChange={(value: PageSize) => setPageSize(value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {pageSizeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.desc}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {pageSize === 'custom' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Width (mm)</Label>
                            <input
                              type="number"
                              value={customWidth}
                              onChange={(e) => setCustomWidth(Number(e.target.value))}
                              className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-md"
                              min="50"
                              max="1000"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Height (mm)</Label>
                            <input
                              type="number"
                              value={customHeight}
                              onChange={(e) => setCustomHeight(Number(e.target.value))}
                              className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-md"
                              min="50"
                              max="1000"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <Label className="text-xs text-muted-foreground">Orientation</Label>
                        <Select value={orientation} onValueChange={(value: Orientation) => setOrientation(value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {orientationOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.desc}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Fit Mode</Label>
                        <Select value={fitMode} onValueChange={(value: 'fit' | 'fill' | 'stretch') => setFitMode(value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fitModeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.desc}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Margin (mm)</Label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={margin}
                          onChange={(e) => setMargin(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                        <div className="text-center text-xs text-muted-foreground mt-1">
                          {margin}mm
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conversion Stats */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">Conversion Summary</Label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Images:</span>
                        <span className="font-medium">{images.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Page size:</span>
                        <span className="font-medium">{pageSizeOptions.find(opt => opt.value === pageSize)?.label.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Orientation:</span>
                        <span className="font-medium capitalize">{orientation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fit mode:</span>
                        <span className="font-medium capitalize">{fitMode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Convert Button */}
                  <Button
                    onClick={handleConvert}
                    className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                    size="lg"
                    disabled={isProcessing || images.length === 0}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating PDF...
                      </span>
                    ) : (
                      <>
                        <ImageIcon className="h-5 w-5 mr-2" />
                        Create PDF ({images.length} pages)
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {mergedPdf && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10 border border-indigo-500/30 shadow-xl shadow-indigo-500/5">
                    <div className="p-6 sm:p-8">
                      {/* Success Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30"
                        >
                          <Check className="h-6 w-6 text-indigo-400" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            PDF Created!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {images.length} images combined • {formatFileSize(mergedSize)} final size
                          </p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-card/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Input Images</div>
                          <div className="text-lg font-bold">{images.length}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-card/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Output Size</div>
                          <div className="text-lg font-bold text-indigo-500">
                            {formatFileSize(mergedSize)}
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
                          Download PDF
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
                multiple
                maxFiles={20}
                onFilesSelected={handleFileSelect}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}
