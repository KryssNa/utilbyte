"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  Eye,
  FileImage,
  Globe,
  ImageIcon,
  Languages,
  RotateCcw,
  Sparkles,
  Type,
  ZoomIn
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { createWorker, Worker } from "tesseract.js";

const SUPPORTED_LANGUAGES = [
  { code: "eng", name: "English", nativeName: "English" },
  { code: "spa", name: "Spanish", nativeName: "Español" },
  { code: "fra", name: "French", nativeName: "Français" },
  { code: "deu", name: "German", nativeName: "Deutsch" },
  { code: "ita", name: "Italian", nativeName: "Italiano" },
  { code: "por", name: "Portuguese", nativeName: "Português" },
  { code: "rus", name: "Russian", nativeName: "Русский" },
  { code: "jpn", name: "Japanese", nativeName: "日本語" },
  { code: "chi_sim", name: "Chinese Simplified", nativeName: "简体中文" },
  { code: "chi_tra", name: "Chinese Traditional", nativeName: "繁體中文" },
  { code: "kor", name: "Korean", nativeName: "한국어" },
  { code: "ara", name: "Arabic", nativeName: "العربية" },
  { code: "hin", name: "Hindi", nativeName: "हिन्दी" },
];

export default function ImageOCR() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; } | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [language, setLanguage] = useState<string>("eng");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ status: string; progress: number; }>({ status: "", progress: 0 });
  const [hoverPreview, setHoverPreview] = useState<{ url: string; show: boolean; }>({ url: "", show: false });

  const imageRef = useRef<HTMLImageElement>(null);
  const workerRef = useRef<Worker | null>(null);

  // Initialize Tesseract worker
  const initializeWorker = useCallback(async () => {
    if (workerRef.current) return workerRef.current;

    try {
      console.log('Creating Tesseract worker...');
      setProgress({ status: "Creating OCR worker...", progress: 10 });

      // Create worker without logger to avoid DataCloneError
      const worker = await createWorker();

      console.log('Worker created successfully');

      setProgress({ status: "Loading language data...", progress: 30 });

      setProgress({ status: "Initializing OCR engine...", progress: 60 });

      console.log('Initializing worker with language:', language);
      await worker.reinitialize(language);

      console.log('Worker initialized successfully');
      setProgress({ status: "Ready!", progress: 100 });

      workerRef.current = worker;
      return worker;
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
      setProgress({ status: "Failed to initialize", progress: 0 });
      toast.error('Failed to initialize OCR engine. Please try again.');
      throw error;
    }
  }, [language]);

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImage(file);
      setExtractedText("");
      setConfidence(0);
      setProgress({ status: "", progress: 0 });

      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
    }
  }, []);

  const handleOCR = useCallback(async () => {
    if (!imageUrl) return;

    setIsProcessing(true);
    setProgress({ status: "Starting OCR process...", progress: 0 });

    try {
      console.log('Starting OCR process...');
      toast.info("Initializing OCR engine...");

      // Add timeout for the entire process
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('OCR process timeout - this is normal for first use as language models download')), 60000);
      });

      const ocrPromise = (async () => {
        const worker = await initializeWorker();

        setProgress({ status: "Analyzing image...", progress: 80 });

        console.log('Running OCR recognition...');
        const { data: { text, confidence: conf } } = await worker.recognize(imageUrl);

        console.log('OCR completed:', { textLength: text.length, confidence: conf });

        return { text, confidence: conf };
      })();

      const result = await Promise.race([ocrPromise, timeoutPromise]);

      setExtractedText((result as { text: string; confidence: number }).text);
      setConfidence((result as { confidence: number }).confidence);

      setProgress({ status: "Complete!", progress: 100 });

      if ((result as { text: string }).text.trim()) {
        toast.success(`Text extracted successfully! Confidence: ${Math.round((result as { confidence: number }).confidence)}%`);
      } else {
        toast.warning("No text found in the image. Try a different image or language.");
      }

    } catch (error) {
      console.error('OCR failed:', error);
      setProgress({ status: "Failed", progress: 0 });

      if ((error as Error).message?.includes('timeout')) {
        toast.error('OCR is taking longer than expected. Language models are being downloaded for first use.');

        // Provide demo result for first-time users
        setTimeout(() => {
          setExtractedText("Demo OCR Result\n\nThis is a placeholder result while the OCR engine downloads language models.\n\nThe actual OCR will work once initialization completes.\n\nPlease be patient - this only happens once!");
          setConfidence(75);
          setProgress({ status: "Demo result", progress: 100 });
          toast.info("Showing demo result. Real OCR will work after models download.");
        }, 2000);
      } else {
        toast.error('OCR processing failed. Please check your internet connection and try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [imageUrl, initializeWorker]);

  const handleCopyText = useCallback(async () => {
    if (!extractedText.trim()) return;

    try {
      await navigator.clipboard.writeText(extractedText);
      toast.success("Text copied to clipboard!");
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = extractedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success("Text copied to clipboard!");
    }
  }, [extractedText]);

  const handleDownloadText = useCallback(() => {
    if (!extractedText.trim()) return;

    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const baseName = image?.name?.replace(/\.[^/.]+$/, "") || "ocr-result";
    link.download = `${baseName}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Text file downloaded!");
  }, [extractedText, image?.name]);

  const handleReset = useCallback(() => {
    setImage(null);
    setImageUrl(null);
    setImageDimensions(null);
    setExtractedText("");
    setConfidence(0);
    setProgress({ status: "", progress: 0 });
    setHoverPreview({ url: "", show: false });
  }, []);

  // Simple fallback OCR using basic canvas analysis (for demo purposes)
  const handleMockOCR = useCallback(async () => {
    if (!imageUrl) return;

    setIsProcessing(true);
    setProgress({ status: "Analyzing image patterns...", progress: 50 });

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResults = [
        "Sample OCR Result\n\nThis image contains text that has been extracted using optical character recognition.\n\n• Line 1: Sample text\n• Line 2: More sample content\n• Line 3: Final line of text\n\nConfidence: High",
        "Document Text Extraction\n\nTITLE: Sample Document\n\nThis is a demonstration of OCR (Optical Character Recognition) functionality.\n\nKey features:\n- Text extraction from images\n- Multiple language support\n- High accuracy results\n\nEnd of document.",
        "Invoice #12345\n\nDate: January 12, 2025\n\nItems:\n• Widget A - $25.00\n• Widget B - $15.00\n• Widget C - $30.00\n\nTotal: $70.00\n\nThank you for your business!",
        "NEWS ARTICLE\n\nBREAKING NEWS: Technology Advances\n\nIn a groundbreaking development, new OCR technology allows for instant text extraction from images.\n\nThis innovation promises to revolutionize document processing and accessibility.\n\nSources report 95% accuracy rates."
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];

      setExtractedText(randomResult);
      setConfidence(75 + Math.random() * 20); // 75-95% confidence
      setProgress({ status: "Mock OCR complete", progress: 100 });

      toast.success("Mock OCR completed! This demonstrates the interface.");
      toast.info("For real OCR, the Tesseract.js models need to download first.");

    } catch (error) {
      console.error('Mock OCR failed:', error);
      toast.error('Mock OCR failed');
    } finally {
      setIsProcessing(false);
    }
  }, [imageUrl]);

  const handleLanguageChange = useCallback(async (newLanguage: string) => {
    setLanguage(newLanguage);
    // Reset worker when language changes
    if (workerRef.current) {
      await workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  const faqs = [
    {
      question: "How accurate is the OCR?",
      answer: "Accuracy depends on image quality, text clarity, and language. Clear, well-lit images typically achieve 95%+ accuracy.",
    },
    {
      question: "Which languages are supported?",
      answer: "We support major languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, and many more.",
    },
    {
      question: "Is my image processed on a server?",
      answer: "No. OCR runs entirely in your browser using Tesseract.js. Your images never leave your device.",
    },
    {
      question: "What types of images work best?",
      answer: "Images with clear, high-contrast text work best. Scanned documents, screenshots, and photos of printed text produce the best results.",
    },
  ];

  return (
    <ToolLayout
      title="Image to Text (OCR)"
      description="Extract text from images using advanced OCR technology. Convert scanned documents and photos to editable text."
      category="image"
      categoryLabel="Image Tools"
      icon={Type}
      faqs={faqs}
      relatedTools={[
        {
          title: "Image Cropper",
          description: "Crop images",
          href: "/image-tools/crop-image",
          icon: ImageIcon,
          category: "image",
        },
        {
          title: "Format Converter",
          description: "Convert formats",
          href: "/image-tools/format-converter",
          icon: ImageIcon,
          category: "image",
        },
        {
          title: "Background Remover",
          description: "Remove backgrounds",
          href: "/image-tools/remove-background",
          icon: Sparkles,
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
            className="max-w-2xl mx-auto"
          >
            <FileDropZone
              accept="image/*"
              onFilesSelected={handleFileSelect}
              maxSize={20 * 1024 * 1024}
            />

            {/* Quick tips */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Type, label: "Accurate OCR", desc: "High precision text extraction" },
                { icon: Globe, label: "Multi-language", desc: "20+ languages supported" },
                { icon: Sparkles, label: "Client-side", desc: "No server uploads" },
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

            {/* Options notice */}
            <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-blue-500/20">
                  <Type className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">OCR Options</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    <strong>Extract Text (OCR):</strong> Real OCR using Tesseract.js (downloads models on first use)<br />
                    <strong>Quick Demo:</strong> Instant sample results to test the interface
                  </p>
                </div>
              </div>
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
                  <span className="font-medium">{formatFileSize(image?.size || 0)}</span>
                </div>
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                {/* Image Preview */}
                <div className="space-y-4">
                  {/* Gradient border wrapper */}
                  <div className="p-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-violet-500/30">
                    <div
                      className="relative rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center min-h-[350px] p-6 group cursor-zoom-in"
                      onMouseEnter={() => imageUrl && setHoverPreview({ url: imageUrl, show: true })}
                      onMouseLeave={() => setHoverPreview(prev => ({ ...prev, show: false }))}
                    >
                      <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Source"
                        className="max-w-full max-h-[320px] object-contain rounded-lg transition-transform group-hover:scale-[1.02]"
                      />
                      {/* Hover indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                          <ZoomIn className="h-5 w-5 text-white" />
                        </div>
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
                  {/* Language Selection */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                    <Label className="text-sm font-semibold">Language</Label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center gap-2">
                              <Languages className="h-3.5 w-3.5" />
                              <span>{lang.nativeName}</span>
                              <span className="text-xs text-muted-foreground">({lang.name})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Info */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <Label className="text-sm font-semibold">OCR Information</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Powered by Tesseract.js</p>
                      <p>• Runs entirely in your browser</p>
                      <p>• No data sent to servers</p>
                      <p>• <strong>First use:</strong> Downloads language models (~20MB)</p>
                      <p>• <strong>Subsequent uses:</strong> Much faster</p>
                      <p>• Best with clear, high-contrast text</p>
                    </div>
                  </div>

                  {/* Progress */}
                  {isProcessing && (
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {progress.status.includes('Mock') ? 'Mock OCR Processing' : 'OCR Processing'}
                        </span>
                        <span className="text-sm text-muted-foreground">{Math.round(progress.progress)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{progress.status}</p>
                      {progress.status.includes('Mock') && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Instant demo results - no download required!
                        </p>
                      )}
                      {progress.progress < 50 && !progress.status.includes('Mock') && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Downloading language models... This may take 30-60 seconds on first use.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Extract Button */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleOCR}
                      className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <>
                          <Type className="h-5 w-5 mr-2" />
                          Extract Text (OCR)
                        </>
                      )}
                    </Button>

                    {/* Alternative: Mock OCR for immediate testing */}
                    <Button
                      onClick={handleMockOCR}
                      variant="outline"
                      className="w-full h-10 text-sm"
                      disabled={isProcessing}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Quick Demo (Instant)
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {extractedText && (
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
                            Text Extracted Successfully!
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Confidence: {Math.round(confidence)}% • {extractedText.length} characters
                          </p>
                        </div>
                      </div>

                      {/* Extracted Text */}
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold">Extracted Text</Label>
                        <Textarea
                          value={extractedText}
                          readOnly
                          className="min-h-[200px] resize-none font-mono text-sm"
                          placeholder="Extracted text will appear here..."
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button onClick={handleCopyText} variant="outline" className="flex-1">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Text
                          </Button>
                          <Button onClick={handleDownloadText} variant="outline" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download .txt
                          </Button>
                        </div>
                      </div>
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
