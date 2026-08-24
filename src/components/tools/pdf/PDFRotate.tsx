"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  RotateCcw,
  RotateCw,
  Sparkles,
  Upload,
  X
} from "lucide-react";
import { PDFDocument, Rotation } from "pdf-lib";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type RotationAngle = 90 | 180 | 270;
type RotationMode = 'all' | 'specific' | 'range';

export default function PDFRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [rotationAngle, setRotationAngle] = useState<RotationAngle>(90);
  const [rotationMode, setRotationMode] = useState<RotationMode>('all');
  const [pageRange, setPageRange] = useState<string>("1,2,3");
  const [rotatedPdf, setRotatedPdf] = useState<string | null>(null);
  const [rotatedSize, setRotatedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileSelect = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    const selectedFile = newFiles[0];
    setFile(selectedFile);
    setRotatedPdf(null);
    setRotatedSize(0);
  }, []);

  const parsePageSelection = (mode: RotationMode, range: string, totalPages: number): number[] => {
    const pages: number[] = [];

    switch (mode) {
      case 'all':
        for (let i = 0; i < totalPages; i++) {
          pages.push(i); // 0-based indexing for internal use
        }
        break;
      case 'specific':
        const specificPages = range.split(',').map(s => parseInt(s.trim()) - 1).filter(p => !isNaN(p) && p >= 0 && p < totalPages);
        pages.push(...specificPages);
        break;
      case 'range':
        const parts = range.split(',').map(s => s.trim());
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(s => parseInt(s.trim()) - 1);
            if (!isNaN(start) && !isNaN(end) && start <= end) {
              for (let i = start; i <= end && i < totalPages; i++) {
                pages.push(i);
              }
            }
          } else {
            const page = parseInt(part.trim()) - 1;
            if (!isNaN(page) && page >= 0 && page < totalPages) {
              pages.push(page);
            }
          }
        }
        break;
    }

    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const handleRotate = useCallback(async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      const pagesToRotate = parsePageSelection(rotationMode, pageRange, totalPages);

      if (pagesToRotate.length === 0) {
        toast.error("No valid pages selected for rotation");
        return;
      }

      // Rotate the specified pages
      for (const pageIndex of pagesToRotate) {
        const page = pdf.getPage(pageIndex);
        page.setRotation((page.getRotation().angle + rotationAngle) as unknown as Rotation);
      }

      const pdfBytes = await pdf.save();
      // Convert Uint8Array to regular ArrayBuffer for Blob compatibility
      const arrayBuffers = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength);
      const blob = new Blob([arrayBuffers as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setRotatedPdf(url);
      setRotatedSize(blob.size);

      const angleText = rotationAngle === 180 ? '180°' : `${rotationAngle}° clockwise`;
      toast.success(`Rotated ${pagesToRotate.length} pages by ${angleText}!`);

    } catch (error) {
      console.error('Rotation error:', error);
      toast.error("Failed to rotate PDF pages");
    } finally {
      setIsProcessing(false);
    }
  }, [file, rotationAngle, rotationMode, pageRange]);

  const handleDownload = useCallback(() => {
    if (!rotatedPdf) return;
    const link = document.createElement("a");
    link.download = `${file!.name.replace('.pdf', '')}_rotated.pdf`;
    link.href = rotatedPdf;
    link.click();
    toast.success("Download started!");
  }, [rotatedPdf, file]);

  const handleReset = useCallback(() => {
    setFile(null);
    setRotatedPdf(null);
    setRotatedSize(0);
  }, []);

  const rotationOptions = [
    { value: 90, label: '90° Clockwise', icon: RotateCw },
    { value: 180, label: '180° (Upside Down)', icon: RotateCw },
    { value: 270, label: '90° Counter-Clockwise', icon: RotateCcw },
  ];

  const modeOptions = [
    { value: 'all', label: 'All Pages', desc: 'Rotate every page' },
    { value: 'range', label: 'Page Ranges', desc: 'e.g., 1-3,5-7' },
    { value: 'specific', label: 'Specific Pages', desc: 'e.g., 1,3,5' },
  ];

  const faqs = [
    {
      question: "Can I rotate different pages by different amounts?",
      answer: "No, all selected pages are rotated by the same angle. You can run the tool multiple times for different rotations.",
    },
    {
      question: "What happens to rotated pages?",
      answer: "Pages are rotated in place. The page size remains the same, but the content orientation changes.",
    },
    {
      question: "Can I undo a rotation?",
      answer: "Yes! Just run the tool again with the opposite rotation angle (e.g., 270° to undo 90° rotation).",
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No. All processing happens in your browser using pdf-lib. Your files never leave your device.",
    },
  ];

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate PDF pages by 90°, 180°, or 270°. Choose which pages to rotate and by how much."
      category="pdf"
      categoryLabel="PDF Tools"
      icon={RotateCw}
      faqs={faqs}
      relatedTools={[
        { title: "Split PDF", description: "Separate pages", href: "/pdf-tools/split-pdf", icon: Sparkles, category: "pdf" },
        { title: "Compress PDF", description: "Reduce size", href: "/pdf-tools/compress-pdf", icon: Download, category: "pdf" },
        { title: "Merge PDF", description: "Combine files", href: "/pdf-tools/merge-pdf", icon: FileText, category: "pdf" },
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
            className="max-w-5xl mx-auto"
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
                { icon: RotateCw, label: "Multiple Angles", desc: "90°, 180°, 270°" },
                { icon: Sparkles, label: "Page Selection", desc: "Choose specific pages" },
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
                <span className="text-muted-foreground">Rotation: {rotationOptions.find(opt => opt.value === rotationAngle)?.label}</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* File Info & Controls */}
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

                  {/* Rotation Settings */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Rotation Angle */}
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                      <Label className="text-sm font-semibold">Rotation Angle</Label>
                      <Select value={rotationAngle.toString()} onValueChange={(value: string) => setRotationAngle(parseInt(value) as RotationAngle)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {rotationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              <div className="flex items-center gap-2">
                                <option.icon className="h-4 w-4" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Page Selection */}
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                      <Label className="text-sm font-semibold">Pages to Rotate</Label>
                      <Select value={rotationMode} onValueChange={(value: RotationMode) => setRotationMode(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {modeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-muted-foreground">{option.desc}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {(rotationMode === 'range' || rotationMode === 'specific') && (
                        <Input
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder={rotationMode === 'range' ? "1-3,5-7" : "1,3,5"}
                          className="font-mono text-sm"
                        />
                      )}
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
                  {/* Rotation Preview */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">Rotation Preview</Label>
                    <div className="flex justify-center">
                      <div className={cn(
                        "w-16 h-16 border-2 border-indigo-500/30 rounded-lg flex items-center justify-center transition-transform duration-300",
                        rotationAngle === 90 && "rotate-90",
                        rotationAngle === 180 && "rotate-180",
                        rotationAngle === 270 && "-rotate-90"
                      )}>
                        <FileText className="h-6 w-6 text-indigo-500" />
                      </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Preview of {rotationOptions.find(opt => opt.value === rotationAngle)?.label.toLowerCase()}
                    </p>
                  </div>

                  {/* Rotation Stats */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">Rotation Summary</Label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Angle:</span>
                        <span className="font-medium">{rotationOptions.find(opt => opt.value === rotationAngle)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mode:</span>
                        <span className="font-medium">{modeOptions.find(opt => opt.value === rotationMode)?.label}</span>
                      </div>
                      {rotationMode !== 'all' && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pages:</span>
                          <span className="font-medium">{pageRange}</span>
                        </div>
                      )}
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
                      <p>• Choose rotation angle</p>
                      <p>• Select which pages to rotate</p>
                      <p>• Use 1-indexed page numbers</p>
                      <p>• Preview shows the effect</p>
                    </div>
                  </div>

                  {/* Rotate Button */}
                  <Button
                    onClick={handleRotate}
                    className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                    size="lg"
                    disabled={isProcessing || !file}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Rotating PDF...
                      </span>
                    ) : (
                      <>
                        <RotateCw className="h-5 w-5 mr-2" />
                        Rotate PDF Pages
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {rotatedPdf && (
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
                            Rotation Complete!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            PDF rotated by {rotationOptions.find(opt => opt.value === rotationAngle)?.label.toLowerCase()} • {formatFileSize(rotatedSize)} final size
                          </p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-card/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Original Size</div>
                          <div className="text-lg font-bold">{formatFileSize(file.size)}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-card/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Rotated Size</div>
                          <div className="text-lg font-bold text-indigo-500">
                            {formatFileSize(rotatedSize)}
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
                          Download Rotated PDF
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
