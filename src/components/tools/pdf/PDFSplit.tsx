"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  Eye,
  FileText,
  RotateCcw,
  Scissors,
  Sparkles,
  Upload,
  X
} from "lucide-react";
import { PDFDocument, PDFPage } from "pdf-lib";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function PDFSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<Array<{ pageIndex: number; pageData: any; }>>([]);
  const [splitRanges, setSplitRanges] = useState<string>("1-3,4-6,7-10");
  const [splitResult, setSplitResult] = useState<Array<{ name: string; blob: Blob; size: number; }>>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isExtractingPages, setIsExtractingPages] = useState(false);

  const handleFileSelect = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const selectedFile = newFiles[0];
    setFile(selectedFile);
    setSplitResult([]);
    setPdfPages([]);

    // Extract pages from PDF
    await extractPagesFromFile(selectedFile);
  }, []);

  const extractPagesFromFile = useCallback(async (pdfFile: File) => {
    setIsExtractingPages(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();

      const pages = [];
      for (let i = 0; i < pageCount; i++) {
        pages.push({
          pageIndex: i,
          pageData: null // We'll generate preview data later if needed
        });
      }

      setPdfPages(pages);
      toast.success(`Extracted ${pageCount} pages from PDF`);

    } catch (error) {
      console.error('Failed to extract pages:', error);
      toast.error('Failed to process PDF. It may be corrupted.');
    } finally {
      setIsExtractingPages(false);
    }
  }, []);

  const parseRanges = (rangeString: string): number[][] => {
    const ranges: number[][] = [];
    const parts = rangeString.split(',').map(s => s.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim()) - 1); // Convert to 0-based
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          ranges.push([start, end]);
        }
      } else {
        const page = parseInt(part.trim()) - 1; // Convert to 0-based
        if (!isNaN(page)) {
          ranges.push([page, page]);
        }
      }
    }

    return ranges;
  };

  const handleSplit = useCallback(async () => {
    if (!file || pdfPages.length === 0) {
      toast.error("Please select a PDF file first");
      return;
    }

    const ranges = parseRanges(splitRanges);
    if (ranges.length === 0) {
      toast.error("Please enter valid page ranges");
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);

      const results: Array<{ name: string; blob: Blob; size: number; }> = [];

      for (let i = 0; i < ranges.length; i++) {
        const [startPage, endPage] = ranges[i];
        const newPdf = await PDFDocument.create();

        // Copy pages in range
        const pagesToCopy = [];
        for (let j = startPage; j <= endPage && j < pdfPages.length; j++) {
          pagesToCopy.push(j);
        }

        if (pagesToCopy.length > 0) {
          const copiedPages = await newPdf.copyPages(originalPdf, pagesToCopy);
          copiedPages.forEach((page: PDFPage) => newPdf.addPage(page));

          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" });

          const rangeName = startPage === endPage
            ? `page-${startPage + 1}`
            : `pages-${startPage + 1}-to-${endPage + 1}`;

          results.push({
            name: `${file.name.replace('.pdf', '')}_${rangeName}.pdf`,
            blob,
            size: blob.size
          });
        }
      }

      if (results.length === 0) {
        toast.error("No valid pages found in the specified ranges");
        return;
      }

      setSplitResult(results);
      toast.success(`Successfully split PDF into ${results.length} parts!`);

    } catch (error) {
      console.error('Split error:', error);
      toast.error("Failed to split PDF. Please check your page ranges.");
    } finally {
      setIsProcessing(false);
    }
  }, [file, pdfPages, splitRanges]);

  const handleDownload = useCallback((result: { name: string; blob: Blob; }) => {
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement("a");
    link.download = result.name;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  }, []);

  const handleDownloadAll = useCallback(() => {
    splitResult.forEach(result => {
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement("a");
      link.download = result.name;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    });
    toast.success(`Downloaded ${splitResult.length} PDF files!`);
  }, [splitResult]);

  const handleReset = useCallback(() => {
    setFile(null);
    setPdfPages([]);
    setSplitResult([]);
    setSplitRanges("1-3,4-6,7-10");
  }, []);

  const faqs = [
    {
      question: "How do I specify page ranges?",
      answer: "Use comma-separated ranges like '1-3,4-6,7-10' or single pages like '1,3,5'. Pages are 1-indexed.",
    },
    {
      question: "What happens to pages not in any range?",
      answer: "Pages not included in your ranges will be excluded from the split PDFs.",
    },
    {
      question: "Can I split by individual pages?",
      answer: "Yes! Use single page numbers like '1,3,5,7' to create separate PDFs for each page.",
    },
    {
      question: "Is my file uploaded to a server?",
      answer: "No. All processing happens in your browser using pdf-lib. Your files never leave your device.",
    },
  ];

  return (
    <ToolLayout
      title="Split PDF"
      description="Split PDF files into multiple documents. Specify page ranges to create separate PDFs from different sections."
      category="pdf"
      categoryLabel="PDF Tools"
      icon={Scissors}
      faqs={faqs}
      relatedTools={[
        { title: "Merge PDF", description: "Combine files", href: "/pdf-tools/merge-pdf", icon: FileText, category: "pdf" },
        { title: "Compress PDF", description: "Reduce size", href: "/pdf-tools/compress-pdf", icon: Download, category: "pdf" },
        { title: "Rotate PDF", description: "Rotate pages", href: "/pdf-tools/rotate-pdf", icon: Sparkles, category: "pdf" },
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
                { icon: Scissors, label: "Split by Ranges", desc: "Custom page ranges" },
                { icon: Upload, label: "Single File", desc: "Process one PDF" },
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
                <span className="font-medium">{file.name} • {pdfPages.length} pages</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-medium">{formatFileSize(file.size)} total</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* File Info & Controls */}
                <div className="space-y-4">
                  {/* File Card */}
                  <div className="p-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
                    <div className="rounded-2xl overflow-hidden bg-neutral-950 flex flex-col">
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
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)} • {pdfPages.length} pages
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Split Configuration */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                    <Label className="text-sm font-semibold">Split Configuration</Label>
                    <div className="space-y-2">
                      <Label htmlFor="ranges" className="text-xs text-muted-foreground">
                        Page Ranges (e.g., "1-3,4-6,7-10" or "1,3,5")
                      </Label>
                      <Input
                        id="ranges"
                        value={splitRanges}
                        onChange={(e) => setSplitRanges(e.target.value)}
                        placeholder="1-5,6-10,11-15"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use comma-separated ranges or individual pages (1-indexed)
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
                  {/* Split Stats */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">Split Summary</Label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Input file:</span>
                        <span className="font-medium">{file.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total pages:</span>
                        <span className="font-medium">{pdfPages.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ranges:</span>
                        <span className="font-medium">{splitRanges.split(',').length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">How to Use</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Enter page ranges separated by commas</p>
                      <p>• Use "1-5" for page ranges</p>
                      <p>• Use "3" for single pages</p>
                      <p>• Pages are 1-indexed</p>
                    </div>
                  </div>

                  {/* Split Button */}
                  <Button
                    onClick={handleSplit}
                    className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                    size="lg"
                    disabled={isProcessing || !file}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Splitting PDF...
                      </span>
                    ) : (
                      <>
                        <Scissors className="h-5 w-5 mr-2" />
                        Split PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {splitResult.length > 0 && (
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
                            Split Complete!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Created {splitResult.length} PDF files
                          </p>
                        </div>
                      </div>

                      {/* Split Results */}
                      <div className="space-y-3 mb-6">
                        {splitResult.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-indigo-500/20">
                                <FileText className="h-4 w-4 text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium truncate max-w-xs">{result.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(result.size)}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleDownload(result)}
                              className="shrink-0"
                            >
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Download
                            </Button>
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
                          Download All {splitResult.length} PDFs
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
