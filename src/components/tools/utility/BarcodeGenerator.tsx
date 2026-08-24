"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JsBarcode from "jsbarcode";
import { AlertCircle, Barcode, CheckCircle, Copy, Download, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type BarcodeFormat =
  | "CODE128"
  | "CODE39"
  | "EAN13"
  | "EAN8"
  | "UPC"
  | "ITF14"
  | "MSI"
  | "pharmacode";

interface BarcodeInfo {
  name: string;
  description: string;
  length: string;
  example: string;
}

export default function BarcodeGenerator() {
  const [inputText, setInputText] = useState<string>("123456789012");
  const [selectedFormat, setSelectedFormat] = useState<BarcodeFormat>("CODE128");
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barcodeFormats: Record<BarcodeFormat, BarcodeInfo> = {
    CODE128: {
      name: "Code 128",
      description: "Most versatile barcode format, supports all ASCII characters",
      length: "Variable (up to 48 characters)",
      example: "Hello123"
    },
    CODE39: {
      name: "Code 39",
      description: "Simple barcode format, supports uppercase letters, numbers, and some symbols",
      length: "Variable (up to 43 characters)",
      example: "CODE39TEST"
    },
    EAN13: {
      name: "EAN-13",
      description: "Standard barcode for retail products worldwide",
      length: "13 digits",
      example: "1234567890128"
    },
    EAN8: {
      name: "EAN-8",
      description: "Short version of EAN-13 for small products",
      length: "8 digits",
      example: "12345670"
    },
    UPC: {
      name: "UPC-A",
      description: "Universal Product Code, used primarily in the United States",
      length: "12 digits",
      example: "012345678905"
    },
    ITF14: {
      name: "ITF-14",
      description: "Used for packaging and shipping containers",
      length: "14 digits",
      example: "12345678901231"
    },
    MSI: {
      name: "MSI Plessey",
      description: "Used for inventory control and marking",
      length: "Variable",
      example: "12345674"
    },
    pharmacode: {
      name: "Pharmacode",
      description: "Used in pharmaceutical industry",
      length: "Variable",
      example: "12345"
    }
  };

  const validateInput = useCallback((text: string, format: BarcodeFormat): boolean => {
    if (!text.trim()) return false;

    switch (format) {
      case "EAN13":
        return /^\d{13}$/.test(text);
      case "EAN8":
        return /^\d{8}$/.test(text);
      case "UPC":
        return /^\d{12}$/.test(text);
      case "ITF14":
        return /^\d{14}$/.test(text);
      case "CODE39":
        return /^[A-Z0-9\-\.\$\/\+\%\*\s]*$/.test(text.toUpperCase());
      case "CODE128":
        return text.length > 0 && text.length <= 48;
      case "MSI":
        return /^\d+$/.test(text);
      case "pharmacode":
        return /^\d+$/.test(text) && parseInt(text) > 0;
      default:
        return text.length > 0;
    }
  }, []);

  const generateBarcode = useCallback(() => {
    if (!canvasRef.current) return;

    try {
      const isValidInput = validateInput(inputText, selectedFormat);
      setIsValid(isValidInput);

      if (!isValidInput) {
        setError(`Invalid input for ${barcodeFormats[selectedFormat].name}. ${barcodeFormats[selectedFormat].length}`);
        return;
      }

      setError("");

      // Generate barcode
      JsBarcode(canvasRef.current, inputText, {
        format: selectedFormat.toLowerCase(),
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 14,
        margin: 10,
        background: "#ffffff",
        lineColor: "#000000",
      });

      toast.success("Barcode generated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate barcode");
      setIsValid(false);
    }
  }, [inputText, selectedFormat, validateInput, barcodeFormats]);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `barcode-${selectedFormat}-${inputText}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();

    toast.success("Barcode downloaded!");
  }, [selectedFormat, inputText]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((blob) => resolve(blob!), 'image/png');
      });

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);

      toast.success("Barcode copied to clipboard!");
    } catch (err) {
      // Fallback for browsers that don't support clipboard.write
      const dataUrl = canvasRef.current.toDataURL();
      await navigator.clipboard.writeText(dataUrl);
      toast.success("Barcode data URL copied to clipboard!");
    }
  }, []);

  const loadExample = (format: BarcodeFormat) => {
    setSelectedFormat(format);
    setInputText(barcodeFormats[format].example);
  };

  const handleReset = () => {
    setInputText("");
    setError("");
    setIsValid(true);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Auto-generate barcode when inputs change
  useEffect(() => {
    if (inputText.trim()) {
      const timeoutId = setTimeout(() => {
        generateBarcode();
      }, 300); // Debounce

      return () => clearTimeout(timeoutId);
    }
  }, [inputText, selectedFormat, generateBarcode]);

  const faqs = [
    {
      question: "What barcode formats are supported?",
      answer: "We support CODE128, CODE39, EAN13, EAN8, UPC-A, ITF14, MSI Plessey, and Pharmacode formats.",
    },
    {
      question: "How do I choose the right barcode format?",
      answer: "Choose based on your use case: EAN13/UPC for retail products, CODE128 for general use, CODE39 for alphanumeric data.",
    },
    {
      question: "Can I download the generated barcode?",
      answer: "Yes! Click the download button to save the barcode as a PNG image file.",
    },
  ];

  return (
    <ToolLayout
      title="Barcode Generator"
      description="Generate various barcode formats including EAN13, CODE128, UPC, and more. Download as PNG or copy to clipboard."
      category="utility"
      categoryLabel="Utility Tools"
      icon={Barcode}
      faqs={faqs}
      relatedTools={[
        { title: "QR Code", description: "Generate QR codes", href: "/utility-tools/qr-code", icon: Barcode, category: "utility" },
        { title: "Password Generator", description: "Generate secure passwords", href: "/utility-tools/password-generator", icon: Barcode, category: "utility" },
        { title: "Color Converter", description: "Convert color formats", href: "/utility-tools/color-converter", icon: Barcode, category: "utility" },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Controls */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inputText">Barcode Content</Label>
              <Input
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text or numbers for barcode..."
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Barcode Format</Label>
              <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as BarcodeFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(barcodeFormats).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <div className="font-medium">{info.name}</div>
                        <div className="text-xs text-muted-foreground">{info.length}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={generateBarcode} className="flex-1">
                Generate Barcode
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>

          {/* Format Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{barcodeFormats[selectedFormat].name}</CardTitle>
              <CardDescription>{barcodeFormats[selectedFormat].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Length:</strong> {barcodeFormats[selectedFormat].length}
                </div>
                <div>
                  <strong>Example:</strong> {barcodeFormats[selectedFormat].example}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample(selectedFormat)}
                className="w-full"
              >
                Load Example
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          <div className="flex items-center gap-2">
            {isValid ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Badge variant="secondary">Valid Input</Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-500" />
                <Badge variant="destructive">Invalid Input</Badge>
              </>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Barcode Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Generated Barcode</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                disabled={!isValid || !inputText}
                className="gap-2"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!isValid || !inputText}
                className="gap-2"
              >
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border rounded bg-white max-w-full h-auto"
                  style={{ maxHeight: "200px" }}
                />
              </div>
              {!inputText && (
                <div className="text-center text-muted-foreground py-12">
                  <Barcode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter content and select format to generate barcode</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Ensure good print quality for reliable scanning</div>
              <div>• Leave adequate white space around the barcode</div>
              <div>• Test scan your barcode before final use</div>
              <div>• Different formats have different length requirements</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
