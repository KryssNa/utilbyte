"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  Eye,
  FileText,
  GripVertical,
  Merge,
  RotateCcw,
  Sparkles,
  Upload,
  X
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function PDFMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [pdfPages, setPdfPages] = useState<Array<{ file: File, pageIndex: number, pageData: any; }>>([]);
  const [mergedPdf, setMergedPdf] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [hoverPreview, setHoverPreview] = useState<{ url: string; show: boolean; }>({ url: "", show: false });
  const [uploadMode, setUploadMode] = useState<'replace' | 'add'>('replace');
  const [isExtractingPages, setIsExtractingPages] = useState(false);


  const handleFileSelect = useCallback(async (newFiles: File[]) => {
    if (uploadMode === 'add' && files.length === 0) {
      setUploadMode('replace');
    }

    const filesToProcess = uploadMode === 'add' ? [...files, ...newFiles] : newFiles;

    // Limit to 10 files for better UX
    const limitedFiles = filesToProcess.slice(0, 10);
    if (filesToProcess.length > 10) {
      toast.warning("Maximum 10 files allowed. Only the first 10 will be used.");
    }

    setFiles(limitedFiles);
    setMergedPdf(null);
    setMergedSize(0);

    // Extract pages from all PDFs
    await extractPagesFromFiles(limitedFiles);
  }, [files, uploadMode]);

  const extractPagesFromFiles = useCallback(async (pdfFiles: File[]) => {
    setIsExtractingPages(true);

    try {
      const allPages: Array<{ file: File, pageIndex: number, pageData: any; }> = [];

      for (const file of pdfFiles) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const pageCount = pdf.getPageCount();

          for (let i = 0; i < pageCount; i++) {
            allPages.push({
              file,
              pageIndex: i,
              pageData: null // We'll generate preview data later if needed
            });
          }
        } catch (error) {
          console.error(`Failed to extract pages from ${file.name}:`, error);
          toast.error(`Failed to process ${file.name}. It may be corrupted.`);
        }
      }

      setPdfPages(allPages);
      toast.success(`Extracted ${allPages.length} pages from ${pdfFiles.length} PDF(s)`);

    } catch (error) {
      console.error('Failed to extract pages:', error);
      toast.error('Failed to extract pages from PDFs');
    } finally {
      setIsExtractingPages(false);
    }
  }, []);

  const handleMerge = useCallback(async () => {
    if (pdfPages.length < 1) {
      toast.error("Please add PDF files first");
      return;
    }
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();
      let processedPages = 0;

      // Group pages by file to avoid reloading the same PDF multiple times
      const pagesByFile = new Map<File, number[]>();

      for (const page of pdfPages) {
        if (!pagesByFile.has(page.file)) {
          pagesByFile.set(page.file, []);
        }
        pagesByFile.get(page.file)!.push(page.pageIndex);
      }

      // Process each file and copy the required pages
      for (const [file, pageIndices] of pagesByFile.entries()) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        processedPages += pageIndices.length;
      }

      const pdfBytes = await mergedPdf.save();
      const uint8Array = new Uint8Array(pdfBytes);
      const blob = new Blob([uint8Array], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setMergedPdf(url);
      setMergedSize(blob.size);

      toast.success(`Successfully merged ${pdfPages.length} pages into one PDF!`);
    } catch (error) {
      console.error('Merge error:', error);
      toast.error("Failed to merge PDFs. Please ensure all files are valid PDFs.");
    } finally {
      setIsProcessing(false);
    }
  }, [pdfPages]);

  const handleDownload = useCallback(() => {
    if (!mergedPdf) return;
    const link = document.createElement("a");
    link.download = `merged-${files.length}-pdfs.pdf`;
    link.href = mergedPdf;
    link.click();
    toast.success("Download started!");
  }, [mergedPdf, files.length]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setPdfPages([]);
    setMergedPdf(null);
    setMergedSize(0);
    setHoverPreview({ url: "", show: false });
    setUploadMode('replace');
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, []);

  const removeFile = useCallback((indexToRemove: number) => {
    const fileToRemove = files[indexToRemove];
    setFiles(files.filter((_, index) => index !== indexToRemove));
    // Also remove all pages from this file
    setPdfPages(pdfPages.filter(page => page.file !== fileToRemove));
  }, [files, pdfPages]);

  const moveFile = useCallback((fromIndex: number, toIndex: number) => {
    // Move file in files array
    const newFiles = [...files];
    const [removedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, removedFile);
    setFiles(newFiles);

    // Rebuild pdfPages array based on new file order
    const newPages: Array<{ file: File, pageIndex: number, pageData: any; }> = [];
    for (const file of newFiles) {
      const filePages = pdfPages.filter(page => page.file === file);
      newPages.push(...filePages);
    }
    setPdfPages(newPages);
  }, [files, pdfPages]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString()); // Required for Firefox
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetIndex(index);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear drop target if we're actually leaving the element
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
      moveFile(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, [draggedIndex, moveFile]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, []);

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  const faqs = [
    {
      question: "How many PDFs can I merge?",
      answer: "You can merge up to 10 PDF files at once. For larger merges, consider doing it in batches for better performance.",
    },
    {
      question: "Will the merged PDF maintain quality?",
      answer: "Yes! We use pdf-lib which preserves 100% of the original quality. No compression or quality loss occurs during merging.",
    },
    {
      question: "Can I reorder the PDFs before merging?",
      answer: "Absolutely! Drag and drop the files to change their order. The merge order determines the final page sequence.",
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No. All processing happens in your browser using pdf-lib. Your files never leave your device.",
    },
  ];

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Drag to reorder pages, then merge instantly. No upload required."
      category="pdf"
      categoryLabel="PDF Tools"
      icon={Merge}
      faqs={faqs}
      relatedTools={[
        { title: "Split PDF", description: "Split PDF files", href: "/pdf-tools/split-pdf", icon: FileText, category: "pdf" },
        { title: "Compress PDF", description: "Reduce file size", href: "/pdf-tools/compress-pdf", icon: Download, category: "pdf" },
        { title: "Crop PDF", description: "Crop PDF pages", href: "/pdf-tools/crop-pdf", icon: Sparkles, category: "pdf" },
      ]}
      isWorking={!!files.length}
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
        {!files.length ? (
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
              accept=".pdf,application/pdf"
              multiple
              maxFiles={10}
              onFilesSelected={handleFileSelect}
              maxSize={50 * 1024 * 1024}
            />

            {/* Quick tips */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Merge, label: "Instant Merge", desc: "No quality loss" },
                { icon: Upload, label: "Drag & Drop", desc: "Reorder easily" },
                { icon: Sparkles, label: "Client-side", desc: "No uploads" },
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
                <span className="font-medium">{files.length} PDF files • {pdfPages.length} pages</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-medium">{formatFileSize(totalSize)} total</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Drag to reorder pages</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* File List & Controls */}
                <div className="space-y-4">
                  {/* Gradient border wrapper */}
                  <div className="p-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
                    <div className="rounded-2xl overflow-hidden bg-neutral-950 flex flex-col min-h-[400px]">
                      {/* Header */}
                      <div className="p-4 bg-card/50 border-b border-border">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">PDF Files to Merge</h3>
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

                      {/* File List */}
                      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                        <AnimatePresence>
                          {files.map((file, index) => (
                            <motion.div
                              key={`${file.name}-${index}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              transition={{ duration: 0.2 }}
                              className={cn(
                                "relative rounded-xl border bg-card/80 p-4 cursor-grab active:cursor-grabbing transition-all hover:bg-card hover:shadow-lg hover:border-indigo-500/30 group",
                                draggedIndex === index && "opacity-50 scale-95 cursor-grabbing",
                                dropTargetIndex === index && "ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-background",
                                "hover:shadow-indigo-500/10"
                              )}
                            >
                              {/* Drop indicator overlay */}
                              {dropTargetIndex === index && draggedIndex !== null && (
                                <div className="absolute inset-0 rounded-xl bg-indigo-500/10 border-2 border-dashed border-indigo-500/50 pointer-events-none z-10" />
                              )}

                              <div
                                draggable
                                onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, index)}
                                onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className="flex items-center gap-3 relative z-20"
                              >
                                <div className="flex items-center gap-2">
                                  <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 transition-colors" />
                                  <div className="p-2 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                                    <FileText className="h-4 w-4 text-indigo-400" />
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[10px] font-medium text-indigo-300">
                                      #{index + 1}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {/* Empty state hint */}
                        {files.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Drop PDF files here to add them</p>
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
                  {/* Merge Stats */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">Merge Summary</Label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Files:</span>
                        <span className="font-medium">{files.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total size:</span>
                        <span className="font-medium">{formatFileSize(totalSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium text-green-500">Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">How to Use</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Drag files to reorder merge sequence</p>
                      <p>• Click × to remove unwanted files</p>
                      <p>• Files merge in the order shown</p>
                      <p>• No quality loss or compression</p>
                    </div>
                  </div>

                  {/* Merge Button */}
                  <Button
                    onClick={handleMerge}
                    className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                    size="lg"
                    disabled={isProcessing || files.length < 2}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Merging PDFs...
                      </span>
                    ) : (
                      <>
                        <Merge className="h-5 w-5 mr-2" />
                        Merge {files.length} PDFs
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
                    {/* Success banner */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-400 to-purple-500" />

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
                            Merge Complete!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {files.length} PDFs combined • {formatFileSize(mergedSize)} final size
                          </p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-card/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Input Files</div>
                          <div className="text-lg font-bold">{files.length}</div>
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
                          Download Merged PDF
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
                multiple
                maxFiles={10}
                onFilesSelected={handleFileSelect}
                maxSize={50 * 1024 * 1024}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}
