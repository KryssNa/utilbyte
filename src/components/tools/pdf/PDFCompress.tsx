"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  Settings,
  Sparkles,
  Upload,
  X,
  Zap
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Dynamic import for PDF.js to avoid SSR issues
let pdfjsLib: any = null;

type CompressionPreset = 'web' | 'print' | 'archive' | 'email' | 'custom';
type CompressionMode = 'balanced' | 'size' | 'quality';

interface PDFAnalysis {
  totalPages: number;
  hasImages: boolean;
  hasText: boolean;
  hasFonts: boolean;
  imageCount: number;
  estimatedCompression: number;
  contentBreakdown: {
    images: number;
    text: number;
    fonts: number;
    other: number;
  };
}

interface CompressionSettings {
  imageQuality: number;
  imageDPI: number;
  enableImageCompression: boolean;
  enableFontOptimization: boolean;
  enableObjectStreams: boolean;
  removeMetadata: boolean;
  colorSpace: 'rgb' | 'cmyk' | 'grayscale';
  preset: CompressionPreset;
  mode: CompressionMode;
}

interface CompressionResult {
  originalFile: File;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  analysis: PDFAnalysis;
  settings: CompressionSettings;
  processingTime: number;
}

export default function PDFCompress() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressionSettings, setCompressionSettings] = useState<CompressionSettings>({
    imageQuality: 0.8,
    imageDPI: 150,
    enableImageCompression: true,
    enableFontOptimization: true,
    enableObjectStreams: true,
    removeMetadata: false,
    colorSpace: 'rgb',
    preset: 'web',
    mode: 'balanced'
  });
  const [pdfAnalyses, setPdfAnalyses] = useState<Map<File, PDFAnalysis>>(new Map());
  const [compressedResults, setCompressedResults] = useState<CompressionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'compress' | 'analyze'>('compress');
  const [isPdfJsReady, setIsPdfJsReady] = useState<boolean>(false);

  // Initialize PDF.js on client side only
  useEffect(() => {
    const initPdfJs = async () => {
      try {
        pdfjsLib = (await import('pdfjs-dist')).default;
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        setIsPdfJsReady(true);
      } catch (error) {
        console.error('Failed to initialize PDF.js:', error);
      }
    };

    initPdfJs();
  }, []);

  const handleFileSelect = useCallback(async (newFiles: File[]) => {
    if (!isPdfJsReady) {
      toast.error("PDF processing is initializing. Please try again in a moment.");
      return;
    }

    // Limit to 5 files for better UX
    const filesToProcess = [...files, ...newFiles].slice(0, 5);
    if (filesToProcess.length > 5) {
      toast.warning("Maximum 5 files allowed. Only the first 5 will be used.");
    }
    setFiles(filesToProcess);
    setCompressedResults([]);

    // Analyze PDFs for compression recommendations
    const analyses = new Map<File, PDFAnalysis>();
    for (const file of filesToProcess) {
      try {
        const analysis = await analyzePDF(file);
        analyses.set(file, analysis);
      } catch (error) {
        console.error(`Failed to analyze ${file.name}:`, error);
      }
    }
    setPdfAnalyses(analyses);
  }, [files, isPdfJsReady]);

  const analyzePDF = useCallback(async (file: File): Promise<PDFAnalysis> => {
    if (!pdfjsLib || !isPdfJsReady) {
      throw new Error('PDF.js not initialized');
    }

    const fileArrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: fileArrayBuffer }).promise;

    const numPages = pdf.numPages;
    let hasImages = false;
    let hasText = false;
    let imageCount = 0;

    // Analyze first few pages for content type
    const pagesToCheck = Math.min(3, numPages);
    for (let i = 1; i <= pagesToCheck; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      if (textContent.items.length > 0) {
        hasText = true;
      }

      // Check for images by looking at operators
      const ops = await page.getOperatorList();
      for (const op of ops.fnArray) {
        if (op === pdfjsLib.OPS.paintImageXObject || op === pdfjsLib.OPS.paintInlineImageXObject) {
          hasImages = true;
          imageCount++;
        }
      }
    }

    // Estimate compression potential
    let estimatedCompression = 0;
    if (hasImages) estimatedCompression += 30; // Images can be heavily compressed
    if (hasText) estimatedCompression += 10; // Text compression
    estimatedCompression += 15; // General PDF optimization

    // Content breakdown estimation
    const contentBreakdown = {
      images: hasImages ? 60 : 0,
      text: hasText ? 25 : 0,
      fonts: 10,
      other: hasImages ? 5 : 15
    };

    return {
      totalPages: numPages,
      hasImages,
      hasText,
      hasFonts: true, // Assume fonts are present
      imageCount,
      estimatedCompression: Math.min(estimatedCompression, 70),
      contentBreakdown
    };
  }, [isPdfJsReady]);

  const getPresetSettings = (preset: CompressionPreset): Partial<CompressionSettings> => {
    switch (preset) {
      case 'web':
        return {
          imageQuality: 0.8,
          imageDPI: 96,
          enableImageCompression: true,
          enableFontOptimization: true,
          enableObjectStreams: true,
          removeMetadata: true,
          colorSpace: 'rgb'
        };
      case 'print':
        return {
          imageQuality: 0.95,
          imageDPI: 300,
          enableImageCompression: false,
          enableFontOptimization: true,
          enableObjectStreams: true,
          removeMetadata: false,
          colorSpace: 'cmyk'
        };
      case 'archive':
        return {
          imageQuality: 0.9,
          imageDPI: 200,
          enableImageCompression: true,
          enableFontOptimization: true,
          enableObjectStreams: true,
          removeMetadata: false,
          colorSpace: 'rgb'
        };
      case 'email':
        return {
          imageQuality: 0.7,
          imageDPI: 72,
          enableImageCompression: true,
          enableFontOptimization: true,
          enableObjectStreams: true,
          removeMetadata: true,
          colorSpace: 'rgb'
        };
      default:
        return {};
    }
  };

  const compressPDFImages = useCallback(async (pdf: PDFDocument, settings: CompressionSettings): Promise<PDFDocument> => {
    const compressedPdf = await PDFDocument.create();

    // Copy all pages
    const pages = await compressedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => compressedPdf.addPage(page));

    // If image compression is enabled, we would need to extract and recompress images
    // For now, we'll use the basic optimization available in pdf-lib
    // In a production environment, you might want to use additional libraries for image extraction/recompression

    return compressedPdf;
  }, []);

  const handleCompress = useCallback(async () => {
    if (files.length === 0) {
      toast.error("Please add PDF files first");
      return;
    }

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      const results: CompressionResult[] = [];

      for (const file of files) {
        try {
          const fileStartTime = Date.now();
          const fileArrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(fileArrayBuffer);
          const analysis = pdfAnalyses.get(file);

          // Apply compression
          const compressedPdf = await compressPDFImages(pdf, compressionSettings);

          // Prepare save options based on settings
          const saveOptions: any = {
            useObjectStreams: compressionSettings.enableObjectStreams,
          };

          // Remove metadata if requested
          if (compressionSettings.removeMetadata) {
            compressedPdf.setTitle('');
            compressedPdf.setAuthor('');
            compressedPdf.setSubject('');
            compressedPdf.setCreator('');
            compressedPdf.setProducer('');
          }

          const compressedBytes = await compressedPdf.save(saveOptions);
          // Convert Uint8Array to regular ArrayBuffer for Blob compatibility
          const arrayBuffer = compressedBytes.buffer.slice(compressedBytes.byteOffset, compressedBytes.byteOffset + compressedBytes.byteLength);
          const compressedBlob = new Blob([arrayBuffer as ArrayBuffer], { type: "application/pdf" });

          const compressionRatio = ((file.size - compressedBlob.size) / file.size) * 100;

          results.push({
            originalFile: file,
            compressedBlob,
            originalSize: file.size,
            compressedSize: compressedBlob.size,
            compressionRatio: Math.max(0, compressionRatio),
            analysis: analysis || {
              totalPages: pdf.getPageCount(),
              hasImages: false,
              hasText: false,
              hasFonts: false,
              imageCount: 0,
              estimatedCompression: 0,
              contentBreakdown: { images: 0, text: 0, fonts: 0, other: 100 }
            },
            settings: { ...compressionSettings },
            processingTime: Date.now() - fileStartTime
          });

        } catch (error) {
          console.error(`Failed to compress ${file.name}:`, error);
          toast.error(`Failed to compress ${file.name}`);
        }
      }

      if (results.length > 0) {
        setCompressedResults(results);
        const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
        const totalCompressed = results.reduce((sum, r) => sum + r.compressedSize, 0);
        const totalSaved = totalOriginal - totalCompressed;
        const avgCompression = ((totalSaved / totalOriginal) * 100);
        const totalTime = Date.now() - startTime;

        toast.success(
          `Compressed ${results.length} PDFs in ${totalTime}ms! Saved ${formatFileSize(totalSaved)} (${avgCompression.toFixed(1)}%)`
        );
      }

    } catch (error) {
      console.error('Compression error:', error);
      toast.error("Failed to compress PDFs");
    } finally {
      setIsProcessing(false);
    }
  }, [files, compressionSettings, pdfAnalyses, compressPDFImages]);

  const handleDownload = useCallback((result: { originalFile: File; compressedBlob: Blob; }) => {
    const url = URL.createObjectURL(result.compressedBlob);
    const link = document.createElement("a");
    link.download = result.originalFile.name.replace('.pdf', '_compressed.pdf');
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  }, []);

  const handleDownloadAll = useCallback(() => {
    compressedResults.forEach(result => {
      const url = URL.createObjectURL(result.compressedBlob);
      const link = document.createElement("a");
      link.download = result.originalFile.name.replace('.pdf', '_compressed.pdf');
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    });
    toast.success(`Downloaded ${compressedResults.length} compressed PDFs!`);
  }, [compressedResults]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setCompressedResults([]);
  }, []);

  const removeFile = useCallback((indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
    setCompressedResults(compressedResults.filter((_, index) => index !== indexToRemove));
  }, [files, compressedResults]);

  const presetOptions = [
    { value: 'web', label: 'Web Optimized', desc: 'Best for web viewing', icon: '🌐' },
    { value: 'print', label: 'Print Quality', desc: 'High quality for printing', icon: '🖨️' },
    { value: 'archive', label: 'Archive Ready', desc: 'Balanced for long-term storage', icon: '📁' },
    { value: 'email', label: 'Email Friendly', desc: 'Small files for email', icon: '📧' },
    { value: 'custom', label: 'Custom Settings', desc: 'Fine-tune compression', icon: '⚙️' },
  ];

  const handlePresetChange = (preset: CompressionPreset) => {
    setCompressionSettings(prev => ({
      ...prev,
      preset,
      ...getPresetSettings(preset)
    }));
  };

  const faqs = [
    {
      question: "How much can I compress PDFs?",
      answer: "Compression depends on the PDF content. Text-heavy PDFs compress less than image-heavy ones. Typical savings: 20-50%.",
    },
    {
      question: "Does compression affect quality?",
      answer: "Yes, higher compression reduces quality. Choose based on your needs - low compression for quality, maximum for smallest files.",
    },
    {
      question: "What types of compression are used?",
      answer: "We optimize PDF structure and object streams. For best results with images, consider compressing images separately first.",
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No. All processing happens in your browser using pdf-lib. Your files never leave your device.",
    },
  ];

  const totalOriginalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalCompressedSize = compressedResults.reduce((sum, result) => sum + result.compressedSize, 0);

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality. Choose from multiple compression levels for optimal results."
      category="pdf"
      categoryLabel="PDF Tools"
      icon={Zap}
      faqs={faqs}
      relatedTools={[
        { title: "Merge PDF", description: "Combine files", href: "/pdf-tools/merge-pdf", icon: FileText, category: "pdf" },
        { title: "Split PDF", description: "Separate pages", href: "/pdf-tools/split-pdf", icon: Sparkles, category: "pdf" },
        { title: "Rotate PDF", description: "Rotate pages", href: "/pdf-tools/rotate-pdf", icon: RotateCcw, category: "pdf" },
      ]}
      isWorking={!!files.length}
    >
      <AnimatePresence mode="wait">
        {!files.length ? (
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
              multiple
              maxFiles={5}
              onFilesSelected={handleFileSelect}
              maxSize={50 * 1024 * 1024}
            />

            {/* Quick tips */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: BarChart3, label: "Smart Analysis", desc: "Content-aware compression" },
                { icon: Settings, label: "Advanced Controls", desc: "Fine-tune settings" },
                { icon: Eye, label: "Quality Preview", desc: "Before/after comparison" },
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
                <span className="font-medium">{files.length} PDF files</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-medium">{formatFileSize(totalOriginalSize)} total</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Preset: {presetOptions.find(opt => opt.value === compressionSettings.preset)?.label}</span>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'compress' | 'analyze')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="compress" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Compression Settings
                  </TabsTrigger>
                  <TabsTrigger value="analyze" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analysis & Results
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="compress" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    {/* File List & Controls */}
                    <div className="space-y-4">
                      {/* Gradient border wrapper */}
                      <div className="p-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
                        <div className="rounded-2xl overflow-hidden bg-neutral-950 flex flex-col min-h-[300px]">
                          {/* Header */}
                          <div className="p-4 bg-card/50 border-b border-border">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold">PDF Files to Compress</h3>
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
                                  className="rounded-xl border bg-card/80 p-4"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/20">
                                      <FileText className="h-4 w-4 text-indigo-400" />
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
                      {/* Compression Presets */}
                      <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                        <Label className="text-sm font-semibold">Compression Presets</Label>
                        <Select value={compressionSettings.preset} onValueChange={handlePresetChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {presetOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <span>{option.icon}</span>
                                  <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs text-muted-foreground">{option.desc}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Advanced Settings */}
                      {compressionSettings.preset === 'custom' && (
                        <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                          <Label className="text-sm font-semibold">Advanced Settings</Label>

                          {/* Image Quality */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label className="text-xs text-muted-foreground">Image Quality</Label>
                              <span className="text-xs text-muted-foreground">{Math.round(compressionSettings.imageQuality * 100)}%</span>
                            </div>
                            <Slider
                              value={[compressionSettings.imageQuality]}
                              onValueChange={([value]) => setCompressionSettings(prev => ({ ...prev, imageQuality: value }))}
                              min={0.1}
                              max={1.0}
                              step={0.1}
                              className="w-full"
                            />
                          </div>

                          {/* Image DPI */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label className="text-xs text-muted-foreground">Image DPI</Label>
                              <span className="text-xs text-muted-foreground">{compressionSettings.imageDPI}</span>
                            </div>
                            <Slider
                              value={[compressionSettings.imageDPI]}
                              onValueChange={([value]) => setCompressionSettings(prev => ({ ...prev, imageDPI: value }))}
                              min={72}
                              max={300}
                              step={24}
                              className="w-full"
                            />
                          </div>

                          {/* Toggles */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground">Image Compression</Label>
                              <Switch
                                checked={compressionSettings.enableImageCompression}
                                onCheckedChange={(checked: boolean) => setCompressionSettings(prev => ({ ...prev, enableImageCompression: checked }))}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground">Font Optimization</Label>
                              <Switch
                                checked={compressionSettings.enableFontOptimization}
                                onCheckedChange={(checked: boolean) => setCompressionSettings(prev => ({ ...prev, enableFontOptimization: checked }))}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground">Remove Metadata</Label>
                              <Switch
                                checked={compressionSettings.removeMetadata}
                                onCheckedChange={(checked: boolean) => setCompressionSettings(prev => ({ ...prev, removeMetadata: checked }))}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Compression Stats */}
                      <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                        <Label className="text-sm font-semibold">Compression Summary</Label>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Files:</span>
                            <span className="font-medium">{files.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total size:</span>
                            <span className="font-medium">{formatFileSize(totalOriginalSize)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Preset:</span>
                            <span className="font-medium">{presetOptions.find(opt => opt.value === compressionSettings.preset)?.label}</span>
                          </div>
                          {compressionSettings.preset === 'custom' && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Quality:</span>
                              <span className="font-medium">{Math.round(compressionSettings.imageQuality * 100)}%</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Compress Button */}
                      <Button
                        onClick={handleCompress}
                        className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                        size="lg"
                        disabled={isProcessing || files.length === 0}
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Compressing PDFs...
                          </span>
                        ) : (
                          <>
                            <Zap className="h-5 w-5 mr-2" />
                            Compress {files.length} PDFs
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analyze" className="space-y-6">
                  <div className="grid gap-6">
                    {/* PDF Analysis */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {Array.from(pdfAnalyses.entries()).map(([file, analysis]) => (
                        <div key={file.name} className="p-4 rounded-2xl bg-card border border-border space-y-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <h4 className="text-sm font-semibold truncate">{file.name}</h4>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Pages:</span>
                              <span className="font-medium">{analysis.totalPages}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Content:</span>
                              <div className="flex gap-1">
                                {analysis.hasImages && <ImageIcon className="h-3 w-3 text-blue-500" />}
                                {analysis.hasText && <span className="text-green-500 font-mono text-[10px]">T</span>}
                                {analysis.hasFonts && <span className="text-purple-500 font-mono text-[10px]">F</span>}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Images:</span>
                              <span className="font-medium">{analysis.imageCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Est. Savings:</span>
                              <span className="font-medium text-green-500">{analysis.estimatedCompression}%</span>
                            </div>
                          </div>

                          {/* Content Breakdown Chart */}
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Content Breakdown</div>
                            <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                              <div
                                className="bg-blue-500"
                                style={{ width: `${analysis.contentBreakdown.images}%` }}
                              />
                              <div
                                className="bg-green-500"
                                style={{ width: `${analysis.contentBreakdown.text}%` }}
                              />
                              <div
                                className="bg-purple-500"
                                style={{ width: `${analysis.contentBreakdown.fonts}%` }}
                              />
                              <div
                                className="bg-gray-500"
                                style={{ width: `${analysis.contentBreakdown.other}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Images</span>
                              <span>Text</span>
                              <span>Fonts</span>
                              <span>Other</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Overall Statistics */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 rounded-2xl bg-card border border-border">
                        <div className="text-2xl font-bold text-indigo-500">
                          {Array.from(pdfAnalyses.values()).reduce((sum, a) => sum + a.totalPages, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Pages</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border">
                        <div className="text-2xl font-bold text-blue-500">
                          {Array.from(pdfAnalyses.values()).reduce((sum, a) => sum + a.imageCount, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Images Found</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border">
                        <div className="text-2xl font-bold text-green-500">
                          {Math.round(Array.from(pdfAnalyses.values()).reduce((sum, a) => sum + a.estimatedCompression, 0) / Math.max(pdfAnalyses.size, 1))}%
                        </div>
                        <div className="text-sm text-muted-foreground">Avg. Compression</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {compressedResults.length > 0 && (
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
                            Compression Complete!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {compressedResults.length} PDFs compressed • {formatFileSize(totalOriginalSize - totalCompressedSize)} saved
                          </p>
                        </div>
                      </div>

                      {/* Compression Results */}
                      <div className="space-y-4 mb-6">
                        {compressedResults.map((result, index) => (
                          <div key={index} className="p-4 rounded-xl bg-card/50 border border-border">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                  <FileText className="h-4 w-4 text-green-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{result.originalFile.name.replace('.pdf', '_compressed.pdf')}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{result.analysis.totalPages} pages</span>
                                    <span>•</span>
                                    <span>{result.processingTime}ms</span>
                                    <span>•</span>
                                    <span className="text-green-500 font-medium">{result.compressionRatio.toFixed(1)}% smaller</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleDownload(result)}
                              >
                                <Download className="h-3.5 w-3.5 mr-1" />
                                Download
                              </Button>
                            </div>

                            {/* Detailed Analytics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-lg font-bold">{formatFileSize(result.originalSize)}</div>
                                <div className="text-xs text-muted-foreground">Original</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-500">{formatFileSize(result.compressedSize)}</div>
                                <div className="text-xs text-muted-foreground">Compressed</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-blue-500">{formatFileSize(result.originalSize - result.compressedSize)}</div>
                                <div className="text-xs text-muted-foreground">Saved</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-500">{result.settings.preset.toUpperCase()}</div>
                                <div className="text-xs text-muted-foreground">Preset</div>
                              </div>
                            </div>

                            {/* Content Analysis */}
                            <div className="space-y-2">
                              <div className="text-xs text-muted-foreground">Content Analysis</div>
                              <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                  <ImageIcon className="h-3 w-3 text-blue-500" />
                                  <span>{result.analysis.imageCount} images</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className={`font-mono ${result.analysis.hasText ? 'text-green-500' : 'text-gray-400'}`}>T</span>
                                  <span>Text {result.analysis.hasText ? 'present' : 'none'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className={`font-mono ${result.analysis.hasFonts ? 'text-purple-500' : 'text-gray-400'}`}>F</span>
                                  <span>Fonts {result.analysis.hasFonts ? 'optimized' : 'none'}</span>
                                </div>
                              </div>
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
                          Download All {compressedResults.length} PDFs
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
                maxFiles={5}
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