"use client";

import FileDropZone from "@/components/shared/FileDropZone";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eraser,
  FileDown,
  FileText,
  Highlighter,
  ImagePlus,
  Info,
  Merge,
  Minus,
  MousePointer2,
  MoveHorizontal,
  PenLine,
  Plus,
  RotateCcw,
  Scissors,
  Sparkles,
  Square,
  Type,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */
let pdfjsLib: any = null;

type ToolMode = "select" | "text" | "draw" | "highlight" | "image" | "shape" | "eraser";

interface Annotation {
  id: string;
  type: "text" | "draw" | "highlight" | "image" | "shape";
  page: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  color: string;
  fontSize?: number;
  fontWeight?: string;
  lineWidth?: number;
  points?: { x: number; y: number }[];
  imageData?: string;
}

interface PDFInfo {
  title: string;
  author: string;
  subject: string;
  creator: string;
  producer: string;
  creationDate: string;
  modDate: string;
  pageCount: number;
  fileSize: number;
  fileName: string;
  pageWidth: number;
  pageHeight: number;
}

const COLORS = [
  "#000000", "#EF4444", "#F59E0B", "#10B981",
  "#3B82F6", "#0EA5E9", "#EC4899", "#FFFFFF",
];

const SCALE_FACTOR = 1.5;

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
};

const faqs = [
  {
    question: "What can I edit in a PDF?",
    answer: "You can add text, freehand drawings, highlights, rectangles, and images on top of any PDF page. All annotations are rendered into the final exported PDF.",
  },
  {
    question: "Can I edit existing text in the PDF?",
    answer: "This editor adds annotations on top of the existing PDF content. You can cover existing text with a white rectangle and type new text over it for a similar effect.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer: "No. All processing happens entirely in your browser using PDF.js and pdf-lib. Your files never leave your device.",
  },
  {
    question: "What is the maximum file size?",
    answer: "You can upload PDFs up to 100MB. Larger files may take a moment to render depending on your device.",
  },
  {
    question: "Can I undo my changes?",
    answer: "Yes. Use the Undo button to remove the last annotation on the current page, or Clear to remove all annotations on the page.",
  },
  {
    question: "What format is the exported file?",
    answer: "The exported file is a standard PDF with all your annotations embedded permanently into the document.",
  },
];

const relatedTools = [
  { title: "Merge PDF", description: "Combine multiple PDFs", href: "/pdf-tools/merge-pdf", icon: Merge, category: "pdf" as const },
  { title: "Split PDF", description: "Separate pages", href: "/pdf-tools/split-pdf", icon: Scissors, category: "pdf" as const },
  { title: "Compress PDF", description: "Reduce file size", href: "/pdf-tools/compress-pdf", icon: FileDown, category: "pdf" as const },
];

export default function PDFEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState<ToolMode>("select");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeColor, setActiveColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const [lineWidth, setLineWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawPoints, setCurrentDrawPoints] = useState<{ x: number; y: number }[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !pdfjsLib) {
      import("pdfjs-dist").then((pdfjs) => {
        pdfjsLib = pdfjs;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      }).catch(() => {
        toast.error("Failed to load PDF engine.");
      });
    }
  }, []);

  const extractPdfInfo = useCallback(async (pdf: any, fileObj: File, bytes: ArrayBuffer) => {
    try {
      const metadata = await pdf.getMetadata().catch(() => null);
      const page1 = await pdf.getPage(1);
      const viewport = page1.getViewport({ scale: 1 });

      const info = metadata?.info || {};

      const formatDate = (dateStr: string) => {
        if (!dateStr) return "Unknown";
        try {
          const cleaned = dateStr.replace("D:", "").replace(/'/g, "");
          const year = cleaned.substring(0, 4);
          const month = cleaned.substring(4, 6);
          const day = cleaned.substring(6, 8);
          return `${year}-${month}-${day}`;
        } catch {
          return dateStr;
        }
      };

      setPdfInfo({
        title: info.Title || "Untitled",
        author: info.Author || "Unknown",
        subject: info.Subject || "None",
        creator: info.Creator || "Unknown",
        producer: info.Producer || "Unknown",
        creationDate: formatDate(info.CreationDate || ""),
        modDate: formatDate(info.ModDate || ""),
        pageCount: pdf.numPages,
        fileSize: bytes.byteLength,
        fileName: fileObj.name,
        pageWidth: Math.round(viewport.width * 0.3528),
        pageHeight: Math.round(viewport.height * 0.3528),
      });
    } catch {
      setPdfInfo(null);
    }
  }, []);

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setAnnotations([]);
    setCurrentPage(1);
    setZoom(1);
    setTool("select");
    setIsLoading(true);
    setPdfInfo(null);
    setShowInfo(false);

    try {
      if (!pdfjsLib) {
        const pdfjs = await import("pdfjs-dist");
        pdfjsLib = pdfjs;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      }
      const arrayBuffer = await selectedFile.arrayBuffer();
      setPdfBytes(arrayBuffer);
      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        disableStream: true,
        disableAutoFetch: true,
      }).promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      await extractPdfInfo(pdf, selectedFile, arrayBuffer);
      toast.success(`PDF loaded - ${pdf.numPages} page${pdf.numPages !== 1 ? "s" : ""}`);
    } catch {
      toast.error("Failed to load PDF. The file may be corrupted or password-protected.");
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  }, [extractPdfInfo]);

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;
    setIsRendering(true);

    try {
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch { /* ignore */ }
      }

      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: zoom * SCALE_FACTOR });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (drawCanvasRef.current) {
        drawCanvasRef.current.width = viewport.width;
        drawCanvasRef.current.height = viewport.height;
      }

      const renderTask = page.render({
        canvasContext: ctx,
        viewport,
        canvas,
      });
      renderTaskRef.current = renderTask;

      await renderTask.promise;
    } catch (err: any) {
      if (err?.name !== "RenderingCancelledException") {
        console.error("PDF render error:", err);
      }
    } finally {
      setIsRendering(false);
    }
  }, [pdfDoc, currentPage, zoom]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  const renderAnnotations = useCallback(() => {
    if (!drawCanvasRef.current) return;
    const ctx = drawCanvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);

    const s = zoom * SCALE_FACTOR;
    const pageAnnotations = annotations.filter((a) => a.page === currentPage);

    for (const ann of pageAnnotations) {
      if (ann.type === "draw" && ann.points && ann.points.length > 1) {
        ctx.strokeStyle = ann.color;
        ctx.lineWidth = (ann.lineWidth || 2) * zoom;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(ann.points[0].x * s, ann.points[0].y * s);
        for (let i = 1; i < ann.points.length; i++) {
          ctx.lineTo(ann.points[i].x * s, ann.points[i].y * s);
        }
        ctx.stroke();
      } else if (ann.type === "highlight" && ann.width && ann.height) {
        ctx.fillStyle = ann.color + "40";
        ctx.fillRect(ann.x * s, ann.y * s, ann.width * s, ann.height * s);
      } else if (ann.type === "shape" && ann.width && ann.height) {
        ctx.strokeStyle = ann.color;
        ctx.lineWidth = (ann.lineWidth || 2) * zoom;
        ctx.strokeRect(ann.x * s, ann.y * s, ann.width * s, ann.height * s);
      }
    }
  }, [annotations, currentPage, zoom]);

  useEffect(() => {
    renderAnnotations();
  }, [renderAnnotations]);

  const getCanvasCoords = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const s = zoom * SCALE_FACTOR;
    return {
      x: (e.clientX - rect.left) / s,
      y: (e.clientY - rect.top) / s,
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);

    if (tool === "text") {
      const id = crypto.randomUUID();
      const newAnnotation: Annotation = {
        id,
        type: "text",
        page: currentPage,
        x: coords.x,
        y: coords.y,
        content: "",
        color: activeColor,
        fontSize,
        fontWeight: "normal",
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
      setEditingTextId(id);
      setTool("select");
      return;
    }

    if (tool === "draw" || tool === "eraser") {
      setIsDrawing(true);
      setCurrentDrawPoints([coords]);
      return;
    }

    if (tool === "highlight" || tool === "shape") {
      setIsDrawing(true);
      setCurrentDrawPoints([coords]);
      return;
    }

    if (tool === "select") {
      const pageAnnotations = annotations.filter((a) => a.page === currentPage);
      const clicked = pageAnnotations.find((a) => {
        if (a.type === "text") {
          const w = (a.content?.length || 1) * (a.fontSize || 16) * 0.6;
          const h = (a.fontSize || 16) * 1.2;
          return coords.x >= a.x && coords.x <= a.x + w && coords.y >= a.y - h && coords.y <= a.y;
        }
        return false;
      });
      setSelectedAnnotation(clicked?.id || null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    setCurrentDrawPoints((prev) => [...prev, coords]);
    const s = zoom * SCALE_FACTOR;

    if ((tool === "draw" || tool === "eraser") && drawCanvasRef.current) {
      const ctx = drawCanvasRef.current.getContext("2d");
      if (!ctx) return;
      renderAnnotations();
      ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : activeColor;
      ctx.lineWidth = (tool === "eraser" ? lineWidth * 4 : lineWidth) * zoom;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      const pts = currentDrawPoints;
      if (pts.length > 0) {
        ctx.moveTo(pts[0].x * s, pts[0].y * s);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x * s, pts[i].y * s);
        }
        ctx.lineTo(coords.x * s, coords.y * s);
      }
      ctx.stroke();
    }

    if ((tool === "highlight" || tool === "shape") && drawCanvasRef.current) {
      const ctx = drawCanvasRef.current.getContext("2d");
      if (!ctx || currentDrawPoints.length === 0) return;
      renderAnnotations();
      const start = currentDrawPoints[0];
      const w = (coords.x - start.x) * s;
      const h = (coords.y - start.y) * s;
      if (tool === "highlight") {
        ctx.fillStyle = activeColor + "40";
        ctx.fillRect(start.x * s, start.y * s, w, h);
      } else {
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = lineWidth * zoom;
        ctx.strokeRect(start.x * s, start.y * s, w, h);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if ((tool === "draw" || tool === "eraser") && currentDrawPoints.length > 1) {
      setAnnotations((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "draw",
          page: currentPage,
          x: 0,
          y: 0,
          color: tool === "eraser" ? "#FFFFFF" : activeColor,
          lineWidth: tool === "eraser" ? lineWidth * 4 : lineWidth,
          points: [...currentDrawPoints],
        },
      ]);
    }

    if ((tool === "highlight" || tool === "shape") && currentDrawPoints.length > 0) {
      const start = currentDrawPoints[0];
      const end = currentDrawPoints[currentDrawPoints.length - 1];
      setAnnotations((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: tool,
          page: currentPage,
          x: Math.min(start.x, end.x),
          y: Math.min(start.y, end.y),
          width: Math.abs(end.x - start.x),
          height: Math.abs(end.y - start.y),
          color: activeColor,
          lineWidth,
        },
      ]);
    }

    setCurrentDrawPoints([]);
  };

  const handleImageAdd = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        setAnnotations((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            type: "image",
            page: currentPage,
            x: 50,
            y: 50,
            width: 200,
            height: 150,
            imageData: reader.result as string,
            color: "",
          },
        ]);
        toast.success("Image added to page");
      };
      reader.readAsDataURL(f);
    };
    input.click();
  };

  const handleExport = async () => {
    if (!pdfBytes) return;
    setIsExporting(true);

    try {
      const doc = await PDFDocument.load(pdfBytes);
      const helvetica = await doc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();

      for (const ann of annotations) {
        if (ann.page < 1 || ann.page > pages.length) continue;
        const page = pages[ann.page - 1];
        const { height } = page.getSize();

        if (ann.type === "text" && ann.content) {
          const font = ann.fontWeight === "bold" ? helveticaBold : helvetica;
          page.drawText(ann.content, {
            x: ann.x,
            y: height - ann.y,
            size: ann.fontSize || 16,
            font,
            color: hexToRgb(ann.color),
          });
        }

        if (ann.type === "draw" && ann.points && ann.points.length > 1) {
          for (let i = 0; i < ann.points.length - 1; i++) {
            page.drawLine({
              start: { x: ann.points[i].x, y: height - ann.points[i].y },
              end: { x: ann.points[i + 1].x, y: height - ann.points[i + 1].y },
              thickness: ann.lineWidth || 2,
              color: hexToRgb(ann.color),
            });
          }
        }

        if (ann.type === "highlight" && ann.width && ann.height) {
          page.drawRectangle({
            x: ann.x,
            y: height - ann.y - ann.height,
            width: ann.width,
            height: ann.height,
            color: hexToRgb(ann.color),
            opacity: 0.25,
          });
        }

        if (ann.type === "shape" && ann.width && ann.height) {
          page.drawRectangle({
            x: ann.x,
            y: height - ann.y - ann.height,
            width: ann.width,
            height: ann.height,
            borderColor: hexToRgb(ann.color),
            borderWidth: ann.lineWidth || 2,
          });
        }

        if (ann.type === "image" && ann.imageData && ann.width && ann.height) {
          try {
            const imageBytes = await fetch(ann.imageData).then((r) => r.arrayBuffer());
            let embeddedImage;
            if (ann.imageData.includes("image/png")) {
              embeddedImage = await doc.embedPng(imageBytes);
            } else {
              embeddedImage = await doc.embedJpg(imageBytes);
            }
            page.drawImage(embeddedImage, {
              x: ann.x,
              y: height - ann.y - ann.height,
              width: ann.width,
              height: ann.height,
            });
          } catch {
            /* skip images that fail */
          }
        }
      }

      const savedBytes = await doc.save();
      const blob = new Blob([savedBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited-${file?.name || "document.pdf"}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF exported successfully!");
    } catch {
      toast.error("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    setSelectedAnnotation(null);
    setEditingTextId(null);
  };

  const undoLast = () => {
    setAnnotations((prev) => {
      const pageAnns = prev.filter((a) => a.page === currentPage);
      if (pageAnns.length === 0) return prev;
      const lastId = pageAnns[pageAnns.length - 1].id;
      return prev.filter((a) => a.id !== lastId);
    });
  };

  const tools: { mode: ToolMode; icon: React.ElementType; label: string }[] = [
    { mode: "select", icon: MousePointer2, label: "Select" },
    { mode: "text", icon: Type, label: "Text" },
    { mode: "draw", icon: PenLine, label: "Draw" },
    { mode: "highlight", icon: Highlighter, label: "Highlight" },
    { mode: "shape", icon: Square, label: "Rectangle" },
    { mode: "eraser", icon: Eraser, label: "Eraser" },
  ];

  const pageAnnotations = annotations.filter((a) => a.page === currentPage);
  const s = zoom * SCALE_FACTOR;

  return (
    <ToolLayout
      title="PDF Editor"
      description="Edit any PDF document. Add text, drawings, highlights, images, and annotations directly in your browser."
      category="pdf"
      categoryLabel="PDF Tools"
      icon={FileText}
      faqs={faqs}
      relatedTools={relatedTools}
      isWorking={!!file}
    >
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <FileDropZone
              onFilesSelected={handleFileSelect}
              accept="application/pdf,.pdf"
              multiple={false}
              maxSize={100 * 1024 * 1024}
            />
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: PenLine, label: "Draw & Annotate", desc: "Freehand, highlights" },
                { icon: Type, label: "Add Text", desc: "Custom fonts & colors" },
                { icon: ImagePlus, label: "Insert Images", desc: "Embed images in PDF" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/30">
                  <item.icon className="h-5 w-5 text-rose-500 mb-2" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-10 w-10 border-3 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </motion.div>
        ) : (
          <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex flex-col gap-3">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                  {tools.map((t) => (
                    <button
                      key={t.mode}
                      onClick={() => setTool(t.mode)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
                        tool === t.mode
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      title={t.label}
                    >
                      <t.icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{t.label}</span>
                    </button>
                  ))}
                </div>

                <div className="w-px h-6 bg-border" />

                <Button variant="ghost" size="sm" onClick={handleImageAdd} className="gap-1.5 text-xs">
                  <ImagePlus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Image</span>
                </Button>

                <div className="w-px h-6 bg-border" />

                <div className="flex items-center gap-1">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveColor(c)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all cursor-pointer",
                        activeColor === c ? "border-foreground scale-110" : "border-border hover:scale-105"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="w-px h-6 bg-border" />

                {tool === "text" && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => setFontSize((s) => Math.max(8, s - 2))} className="p-1 rounded hover:bg-muted cursor-pointer">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-mono w-8 text-center">{fontSize}</span>
                    <button onClick={() => setFontSize((s) => Math.min(72, s + 2))} className="p-1 rounded hover:bg-muted cursor-pointer">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {(tool === "draw" || tool === "shape" || tool === "eraser") && (
                  <div className="flex items-center gap-1">
                    <MoveHorizontal className="h-3 w-3 text-muted-foreground" />
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={lineWidth}
                      onChange={(e) => setLineWidth(Number(e.target.value))}
                      className="w-16 h-1 accent-foreground"
                    />
                    <span className="text-xs font-mono w-4">{lineWidth}</span>
                  </div>
                )}

                <div className="flex-1" />

                <Button variant="ghost" size="sm" onClick={undoLast} className="gap-1.5 text-xs">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Undo</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAnnotations((prev) => prev.filter((a) => a.page !== currentPage))}
                  className="gap-1.5 text-xs text-destructive hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>

                <div className="w-px h-6 bg-border" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInfo(!showInfo)}
                  className={cn("gap-1.5 text-xs", showInfo && "bg-muted")}
                >
                  <Info className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Info</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="gap-1.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white"
                >
                  {isExporting ? (
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export PDF"}</span>
                </Button>
              </div>

              {/* Page navigation & zoom */}
              <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Prev
                  </Button>
                  <span className="text-sm font-medium">
                    Page {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
                  <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setPdfDoc(null);
                    setPdfBytes(null);
                    setAnnotations([]);
                    setPdfInfo(null);
                    setShowInfo(false);
                  }}
                  className="gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  New PDF
                </Button>
              </div>

              <div className="flex gap-3">
                {/* Canvas area */}
                <div
                  ref={containerRef}
                  className="relative flex-1 flex justify-center overflow-auto rounded-xl border border-border bg-muted/30 p-4"
                  style={{ maxHeight: "70vh" }}
                >
                  {isRendering && (
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/90 border border-border text-xs text-muted-foreground">
                      <div className="h-3 w-3 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                      Rendering...
                    </div>
                  )}
                  <div className="relative inline-block shadow-lg">
                    <canvas ref={canvasRef} className="block" />
                    <canvas
                      ref={drawCanvasRef}
                      className="absolute inset-0"
                      style={{
                        cursor: tool === "text" ? "text" : tool === "draw" ? "crosshair" : tool === "eraser" ? "cell" : tool === "highlight" || tool === "shape" ? "crosshair" : "default",
                      }}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={() => { if (isDrawing) handleCanvasMouseUp(); }}
                    />

                    <div ref={overlayRef} className="absolute inset-0 pointer-events-none">
                      {pageAnnotations
                        .filter((a) => a.type === "text")
                        .map((ann) => (
                          <div
                            key={ann.id}
                            className="absolute pointer-events-auto"
                            style={{ left: ann.x * s, top: ann.y * s }}
                          >
                            {editingTextId === ann.id ? (
                              <input
                                autoFocus
                                value={ann.content || ""}
                                onChange={(e) =>
                                  setAnnotations((prev) =>
                                    prev.map((a) => a.id === ann.id ? { ...a, content: e.target.value } : a)
                                  )
                                }
                                onBlur={() => {
                                  if (!ann.content?.trim()) deleteAnnotation(ann.id);
                                  setEditingTextId(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    if (!ann.content?.trim()) deleteAnnotation(ann.id);
                                    setEditingTextId(null);
                                  }
                                }}
                                className="bg-transparent border-b-2 border-dashed border-sky-500 outline-none min-w-[100px]"
                                style={{
                                  color: ann.color,
                                  fontSize: (ann.fontSize || 16) * s,
                                  fontWeight: ann.fontWeight,
                                  fontFamily: "Helvetica, Arial, sans-serif",
                                }}
                              />
                            ) : (
                              <span
                                onClick={() => {
                                  setEditingTextId(ann.id);
                                  setSelectedAnnotation(ann.id);
                                }}
                                className={cn(
                                  "cursor-text whitespace-nowrap select-none",
                                  selectedAnnotation === ann.id && "ring-2 ring-sky-500 ring-offset-1 rounded"
                                )}
                                style={{
                                  color: ann.color,
                                  fontSize: (ann.fontSize || 16) * s,
                                  fontWeight: ann.fontWeight,
                                  fontFamily: "Helvetica, Arial, sans-serif",
                                }}
                              >
                                {ann.content || " "}
                              </span>
                            )}
                            {selectedAnnotation === ann.id && (
                              <button
                                onClick={() => deleteAnnotation(ann.id)}
                                className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[10px] cursor-pointer hover:scale-110 transition-transform"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}

                      {pageAnnotations
                        .filter((a) => a.type === "image")
                        .map((ann) => (
                          <div
                            key={ann.id}
                            className="absolute pointer-events-auto group"
                            style={{
                              left: ann.x * s,
                              top: ann.y * s,
                              width: (ann.width || 200) * s,
                              height: (ann.height || 150) * s,
                            }}
                          >
                            <img src={ann.imageData} alt="annotation" className="w-full h-full object-contain" draggable={false} />
                            <button
                              onClick={() => deleteAnnotation(ann.id)}
                              className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* PDF Info Panel */}
                <AnimatePresence>
                  {showInfo && pdfInfo && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 280 }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden shrink-0"
                    >
                      <div className="w-[280px] rounded-xl border border-border bg-card p-4 space-y-4 h-full overflow-y-auto" style={{ maxHeight: "70vh" }}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">PDF Details</h3>
                          <button onClick={() => setShowInfo(false)} className="p-1 rounded hover:bg-muted cursor-pointer">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="space-y-3 text-xs">
                          {[
                            { label: "File Name", value: pdfInfo.fileName },
                            { label: "File Size", value: formatFileSize(pdfInfo.fileSize) },
                            { label: "Pages", value: String(pdfInfo.pageCount) },
                            { label: "Page Size", value: `${pdfInfo.pageWidth} x ${pdfInfo.pageHeight} mm` },
                            { label: "Title", value: pdfInfo.title },
                            { label: "Author", value: pdfInfo.author },
                            { label: "Subject", value: pdfInfo.subject },
                            { label: "Creator", value: pdfInfo.creator },
                            { label: "Producer", value: pdfInfo.producer },
                            { label: "Created", value: pdfInfo.creationDate },
                            { label: "Modified", value: pdfInfo.modDate },
                          ].map((item) => (
                            <div key={item.label} className="flex justify-between gap-2">
                              <span className="text-muted-foreground shrink-0">{item.label}</span>
                              <span className="font-medium text-right truncate" title={item.value}>{item.value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-border pt-3 space-y-2">
                          <h4 className="text-xs font-semibold">Annotations</h4>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-medium">{annotations.length}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">This Page</span>
                            <span className="font-medium">{pageAnnotations.length}</span>
                          </div>
                          {annotations.length > 0 && (
                            <div className="space-y-1 pt-1">
                              {["text", "draw", "highlight", "shape", "image"].map((type) => {
                                const count = annotations.filter((a) => a.type === type).length;
                                if (count === 0) return null;
                                return (
                                  <div key={type} className="flex justify-between text-xs">
                                    <span className="text-muted-foreground capitalize">{type}</span>
                                    <span className="font-medium">{count}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {annotations.length} annotation{annotations.length !== 1 ? "s" : ""} total
                  {pageAnnotations.length > 0 && ` (${pageAnnotations.length} on this page)`}
                </span>
                <span>All changes are saved when you export</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}
