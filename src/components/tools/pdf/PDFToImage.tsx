"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Upload
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// PDF.js will be imported dynamically on the client side only
let pdfjsLib: any = null;

type ImageFormat = 'png' | 'jpeg' | 'webp';
type PageSelection = 'all' | 'range' | 'specific';

export default function PDFToImage() {
  const [file, setFile] = useState<File | null>(null);

  // Dynamically import PDF.js only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('pdfjs-dist').then((pdfjs) => {
        pdfjsLib = pdfjs;
        // Set up PDF.js worker - use local worker file for reliability
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      }).catch((error) => {
        console.error('Failed to load PDF.js:', error);
      });
    }
  }, []);
  const [imageFormat, setImageFormat] = useState<ImageFormat>('png');
  const [pageSelection, setPageSelection] = useState<PageSelection>('all');
  const [pageRange, setPageRange] = useState<string>("1-3");
  const [quality, setQuality] = useState<number>(0.9);
  const [scale, setScale] = useState<number>(2.0);
  const [convertedImages, setConvertedImages] = useState<Array<{
    pageNumber: number;
    blob: Blob;
    url: string;
    size: number;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileSelect = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    const selectedFile = newFiles[0];
    setFile(selectedFile);
    setConvertedImages([]);
  }, []);

  const parsePageSelection = (selection: PageSelection, range: string, totalPages: number): number[] => {
    const pages: number[] = [];

    switch (selection) {
      case 'all':
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        break;
      case 'range':
        const parts = range.split(',').map(s => s.trim());
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(s => parseInt(s.trim()));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
              for (let i = start; i <= end && i <= totalPages; i++) {
                pages.push(i);
              }
            }
          } else {
            const page = parseInt(part.trim());
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
              pages.push(page);
            }
          }
        }
        break;
      case 'specific':
        const specificPages = range.split(',').map(s => parseInt(s.trim())).filter(p => !isNaN(p) && p >= 1 && p <= totalPages);
        pages.push(...specificPages);
        break;
    }

    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const handleConvert = useCallback(async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    if (!pdfjsLib) {
      toast.error("PDF processing library is not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF with standard options
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        disableStream: true,
        disableAutoFetch: true
      }).promise;

      const numPages = pdf.numPages;

      const selectedPages = parsePageSelection(pageSelection, pageRange, numPages);

      if (selectedPages.length === 0) {
        toast.error("No valid pages selected");
        return;
      }

      const images: Array<{
        pageNumber: number;
        blob: Blob;
        url: string;
        size: number;
      }> = [];

      for (const pageNum of selectedPages) {
        try {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale });

          // Create canvas
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d')!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render page to canvas
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          // Convert canvas to blob
          const mimeType = imageFormat === 'jpeg' ? 'image/jpeg' : imageFormat === 'webp' ? 'image/webp' : 'image/png';
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob!);
            }, mimeType, quality);
          });

          const url = URL.createObjectURL(blob);

          images.push({
            pageNumber: pageNum,
            blob,
            url,
            size: blob.size
          });

        } catch (error) {
          console.error(`Failed to convert page ${pageNum}:`, error);
          toast.error(`Failed to convert page ${pageNum}`);
        }
      }

      if (images.length > 0) {
        setConvertedImages(images);
        const totalSize = images.reduce((sum, img) => sum + img.size, 0);
        toast.success(`Converted ${images.length} pages to ${imageFormat.toUpperCase()} images!`);
      }

    } catch (error) {
      console.error('Conversion error:', error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('worker')) {
          toast.error("PDF processing failed. Please try again or use a different PDF file.");
        } else if (error.message.includes('InvalidPDFException')) {
          toast.error("Invalid or corrupted PDF file. Please try a different file.");
        } else {
          toast.error(`Conversion failed: ${error.message}`);
        }
      } else {
        toast.error("Failed to convert PDF to images. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  }, [file, imageFormat, pageSelection, pageRange, quality, scale]);

  const handleDownload = useCallback((image: { pageNumber: number; blob: Blob; }) => {
    const url = URL.createObjectURL(image.blob);
    const link = document.createElement("a");
    link.download = `${file!.name.replace('.pdf', '')}_page_${image.pageNumber}.${imageFormat}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  }, [file, imageFormat]);

  const handleDownloadAll = useCallback(() => {
    convertedImages.forEach(image => {
      const url = URL.createObjectURL(image.blob);
      const link = document.createElement("a");
      link.download = `${file!.name.replace('.pdf', '')}_page_${image.pageNumber}.${imageFormat}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    });
    toast.success(`Downloaded ${convertedImages.length} images!`);
  }, [convertedImages, file, imageFormat]);

  const handleReset = useCallback(() => {
    setFile(null);
    setConvertedImages([]);
  }, []);

  const formatOptions = [
    { value: 'png', label: 'PNG', desc: 'Lossless, supports transparency' },
    { value: 'jpeg', label: 'JPEG', desc: 'Smaller files, no transparency' },
    { value: 'webp', label: 'WebP', desc: 'Modern format, best compression' },
  ];

  const pageSelectionOptions = [
    { value: 'all', label: 'All Pages', desc: 'Convert every page' },
    { value: 'range', label: 'Page Ranges', desc: 'e.g., 1-3,5-7' },
    { value: 'specific', label: 'Specific Pages', desc: 'e.g., 1,3,5' },
  ];

  const faqs = [
    {
      question: "What image formats are supported?",
      answer: "PNG (lossless with transparency), JPEG (smaller files), and WebP (modern format with best compression).",
    },
    {
      question: "How does scale affect the output?",
      answer: "Higher scale values create larger, higher quality images. Scale 2.0 = 200% size, good for printing.",
    },
    {
      question: "Can I convert specific pages only?",
      answer: "Yes! Choose 'Specific Pages' or 'Page Ranges' and enter page numbers (1-indexed).",
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No. All processing happens in your browser using PDF.js. Your files never leave your device.",
    },
  ];

  const totalSize = convertedImages.reduce((sum, img) => sum + img.size, 0);

  return (
    <ToolLayout
      title="PDF to Image"
      description="Convert PDF pages to high-quality images. Choose format, quality, and scale for optimal results."
      category="pdf"
      categoryLabel="PDF Tools"
      icon={ImageIcon}
      faqs={faqs}
      relatedTools={[
        { title: "Image to PDF", description: "Create PDF", href: "/pdf-tools/image-to-pdf", icon: FileText, category: "pdf" },
        { title: "Compress PDF", description: "Reduce size", href: "/pdf-tools/compress-pdf", icon: Download, category: "pdf" },
        { title: "Split PDF", description: "Separate pages", href: "/pdf-tools/split-pdf", icon: Sparkles, category: "pdf" },
      ]}
      isWorking={!!file}
    >
      <AnimatePresence mode="wait">
        {!file ? (
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
              accept=".pdf,application/pdf"
              maxFiles={1}
              onFilesSelected={handleFileSelect}
              maxSize={50 * 1024 * 1024}
            />

            {/* Quick tips */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: ImageIcon, label: "High Quality", desc: "PNG, JPEG, WebP" },
                { icon: Sparkles, label: "Custom Scale", desc: "Adjust resolution" },
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
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{file.name}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-medium">{formatFileSize(file.size)}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Format: {imageFormat.toUpperCase()}</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* File Info & Preview */}
                <div className="space-y-4">
                  {/* File Card */}
                  <div className="p-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
                    <div className="rounded-2xl overflow-hidden bg-neutral-950">
                      <div className="p-4 bg-card/50 border-b border-border">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">PDF File</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="h-8 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Change File
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-500/20">
                            <FileText className="h-4 w-4 text-indigo-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conversion Settings */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Image Format */}
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                      <Label className="text-sm font-semibold">Image Format</Label>
                      <Select value={imageFormat} onValueChange={(value: ImageFormat) => setImageFormat(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {formatOptions.map((option) => (
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

                    {/* Page Selection */}
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                      <Label className="text-sm font-semibold">Pages to Convert</Label>
                      <Select value={pageSelection} onValueChange={(value: PageSelection) => setPageSelection(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {pageSelectionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-muted-foreground">{option.desc}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {(pageSelection === 'range' || pageSelection === 'specific') && (
                        <Input
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder={pageSelection === 'range' ? "1-3,5-7" : "1,3,5"}
                          className="font-mono text-sm"
                        />
                      )}
                    </div>
                  </div>

                  {/* Quality Settings */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                      <Label className="text-sm font-semibold">Quality ({Math.round(quality * 100)}%)</Label>
                      <Input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Higher quality = larger files
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                      <Label className="text-sm font-semibold">Scale ({scale}x)</Label>
                      <Input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Higher scale = better quality
                      </p>
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
                  {/* Conversion Stats */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">Conversion Summary</Label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="font-medium">{imageFormat.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quality:</span>
                        <span className="font-medium">{Math.round(quality * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Scale:</span>
                        <span className="font-medium">{scale}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pages:</span>
                        <span className="font-medium">{pageSelection === 'all' ? 'All' : pageRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">How to Use</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Choose image format and quality</p>
                      <p>• Select pages to convert</p>
                      <p>• Adjust scale for resolution</p>
                      <p>• Higher scale = sharper images</p>
                    </div>
                  </div>

                  {/* Convert Button */}
                  <Button
                    onClick={handleConvert}
                    className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                    size="lg"
                    disabled={isProcessing || !file}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Converting to Images...
                      </span>
                    ) : (
                      <>
                        <ImageIcon className="h-5 w-5 mr-2" />
                        Convert to {imageFormat.toUpperCase()}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {convertedImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-6xl mx-auto"
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
                            Conversion Complete!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {convertedImages.length} pages converted • {formatFileSize(totalSize)} total
                          </p>
                        </div>
                      </div>

                      {/* Image Gallery */}
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                        {convertedImages.map((image, index) => (
                          <div key={index} className="group relative">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted border border-border">
                              <img
                                src={image.url}
                                alt={`Page ${image.pageNumber}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                              <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
                                Page {image.pageNumber}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleDownload(image)}
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="mt-2 text-center">
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(image.size)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Download All Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Button
                          onClick={handleDownloadAll}
                          size="lg"
                          className="w-full h-14 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:scale-[1.02]"
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Download All {convertedImages.length} Images
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
                accept=".pdf,application/pdf"
                maxFiles={1}
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
