"use client";

import ContentCluster from "@/components/shared/ContentCluster";
import ToolLayout from "@/components/shared/ToolLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadBlob } from "@/lib/utils";
import { Calendar, Check, Copy, Download, MapPin, Palette, QrCode, Settings, User, Wifi } from "lucide-react";
import QRCode from "qrcode";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type QRType = "text" | "url" | "email" | "phone" | "sms" | "wifi" | "vcard" | "location" | "calendar";
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type ExportFormat = "png" | "svg" | "jpeg";

interface QRTemplate {
  type: QRType;
  label: string;
  prefix: string;
  placeholder: string;
  example: string;
  icon: React.ReactNode;
}

interface QRSettings {
  size: number;
  errorCorrection: ErrorCorrectionLevel;
  margin: number;
  foregroundColor: string;
  backgroundColor: string;
  logoUrl?: string;
  logoSize?: number;
}

const qrTemplates: QRTemplate[] = [
  {
    type: "text",
    label: "Text",
    prefix: "",
    placeholder: "Enter any text...",
    example: "Hello, World!",
    icon: <QrCode className="h-4 w-4" />,
  },
  {
    type: "url",
    label: "Website URL",
    prefix: "",
    placeholder: "https://example.com",
    example: "https://utilbyte.com",
    icon: <QrCode className="h-4 w-4" />,
  },
  {
    type: "email",
    label: "Email",
    prefix: "mailto:",
    placeholder: "email@example.com",
    example: "hello@utilbyte.com",
    icon: <QrCode className="h-4 w-4" />,
  },
  {
    type: "phone",
    label: "Phone Number",
    prefix: "tel:",
    placeholder: "+1 (555) 123-4567",
    example: "+1 (555) 123-4567",
    icon: <QrCode className="h-4 w-4" />,
  },
  {
    type: "sms",
    label: "SMS",
    prefix: "sms:",
    placeholder: "+1 (555) 123-4567",
    example: "+1 (555) 123-4567",
    icon: <QrCode className="h-4 w-4" />,
  },
  {
    type: "wifi",
    label: "WiFi Network",
    prefix: "",
    placeholder: "WIFI:S:NetworkName;T:WPA;P:Password;;",
    example: "WIFI:S:MyWiFi;T:WPA;P:mypassword;;",
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    type: "vcard",
    label: "vCard Contact",
    prefix: "",
    placeholder: "BEGIN:VCARD\nFN:John Doe\nTEL:+1234567890\nEND:VCARD",
    example: "BEGIN:VCARD\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD",
    icon: <User className="h-4 w-4" />,
  },
  {
    type: "location",
    label: "Location",
    prefix: "",
    placeholder: "geo:37.7749,-122.4194",
    example: "geo:37.7749,-122.4194?q=San Francisco",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    type: "calendar",
    label: "Calendar Event",
    prefix: "",
    placeholder: "BEGIN:VEVENT\nSUMMARY:Meeting\nDTSTART:20231225T100000\nEND:VEVENT",
    example: "BEGIN:VEVENT\nSUMMARY:Team Meeting\nDTSTART:20231225T100000\nDTEND:20231225T110000\nLOCATION:Conference Room\nEND:VEVENT",
    icon: <Calendar className="h-4 w-4" />,
  },
];

export default function QRCodeGenerator() {
  const [input, setInput] = useState<string>("");
  const [qrType, setQrType] = useState<QRType>("url");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Advanced settings
  const [settings, setSettings] = useState<QRSettings>({
    size: 300,
    errorCorrection: "M",
    margin: 2,
    foregroundColor: "#000000",
    backgroundColor: "#FFFFFF",
  });

  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [includeLogo, setIncludeLogo] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTemplate = useMemo(
    () => qrTemplates.find((t) => t.type === qrType) || qrTemplates[0],
    [qrType]
  );

  const qrContent = useMemo(() => {
    if (!input.trim()) return "";
    return currentTemplate.prefix + input.trim();
  }, [input, currentTemplate]);

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error("Logo file must be less than 1MB");
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const generateQRWithLogo = useCallback(async (qrCanvas: HTMLCanvasElement, logoUrl: string): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Set canvas size (QR code + margin for logo)
      const size = qrCanvas.width;
      canvas.width = size;
      canvas.height = size;

      // Draw QR code
      ctx.drawImage(qrCanvas, 0, 0);

      // Load and draw logo
      const img = new Image();
      img.onload = () => {
        const logoSize = Math.min(size * 0.2, 60); // Logo is 20% of QR size, max 60px
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        // Draw white background circle for logo
        ctx.fillStyle = settings.backgroundColor;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, logoSize / 2 + 4, 0, 2 * Math.PI);
        ctx.fill();

        // Draw logo
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, logoSize / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
        ctx.restore();

        resolve(canvas);
      };
      img.src = logoUrl;
    });
  }, [settings.backgroundColor]);

  const generateQR = useCallback(async () => {
    if (!qrContent.trim()) {
      toast.error("Please enter some content");
      return;
    }

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Generate QR code on canvas first
      await QRCode.toCanvas(canvas, qrContent, {
        width: settings.size,
        margin: settings.margin,
        errorCorrectionLevel: settings.errorCorrection,
        color: {
          dark: settings.foregroundColor,
          light: settings.backgroundColor,
        },
      });

      let finalCanvas = canvas;

      // Add logo if enabled
      if (includeLogo && logoPreview) {
        finalCanvas = await generateQRWithLogo(canvas, logoPreview);
      }

      // Convert to data URL
      const url = finalCanvas.toDataURL(`image/${exportFormat === 'jpeg' ? 'jpeg' : 'png'}`);
      setQrCodeUrl(url);
      toast.success("QR code generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate QR code");
    } finally {
      setIsGenerating(false);
    }
  }, [qrContent, settings, includeLogo, logoPreview, exportFormat, generateQRWithLogo]);

  const downloadQR = useCallback(() => {
    if (!qrCodeUrl) return;

    fetch(qrCodeUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const extension = exportFormat === 'svg' ? 'svg' : exportFormat;
        downloadBlob(blob, `qrcode.${extension}`);
        toast.success(`QR code downloaded as ${extension.toUpperCase()}!`);
      })
      .catch(() => {
        toast.error("Failed to download QR code");
      });
  }, [qrCodeUrl, exportFormat]);

  const generateSVG = useCallback(async () => {
    if (!qrContent.trim()) return;

    try {
      const options = {
        type: 'svg' as const,
        color: {
          dark: settings.foregroundColor,
          light: settings.backgroundColor,
        },
        errorCorrectionLevel: settings.errorCorrection,
        margin: settings.margin,
      };

      const svgString = await QRCode.toString(qrContent, options);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      setQrCodeUrl(url);
      setExportFormat('svg');
      toast.success("SVG QR code generated!");
    } catch (error) {
      toast.error("Failed to generate SVG QR code");
    }
  }, [qrContent, settings]);

  const copyToClipboard = useCallback(async () => {
    if (!qrContent) return;
    await navigator.clipboard.writeText(qrContent);
    setCopied(true);
    toast.success("Content copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [qrContent]);

  const loadExample = () => {
    setInput(currentTemplate.example);
  };

  const faqs = [
    {
      question: "What can I encode in a QR code?",
      answer: "You can encode text, URLs, email addresses, phone numbers, SMS messages, WiFi credentials, vCard contacts, locations, calendar events, and more.",
    },
    {
      question: "What are the best practices for QR codes?",
      answer: "Keep URLs short, test your QR codes before publishing, use high contrast colors, ensure there's enough white space around the code, and consider error correction levels.",
    },
    {
      question: "Can I customize the QR code appearance?",
      answer: "Yes! You can customize colors, add logos, adjust size, change error correction levels, and export in different formats (PNG, SVG, JPEG).",
    },
    {
      question: "What error correction levels should I use?",
      answer: "L (7%): Basic, M (15%): Standard, Q (25%): Good, H (30%): Best. Higher levels allow more damage recovery but create denser codes.",
    },
  ];

  return (
    <ToolLayout
      title="Advanced QR Code Generator"
      description="Create fully customizable QR codes with colors, logos, error correction, and advanced settings. Generate QR codes for URLs, WiFi, vCards, locations, calendar events, and more."
      category="utility"
      categoryLabel="Utility Tools"
      icon={QrCode}
      faqs={faqs}
      relatedTools={[
        { title: "Barcode Generator", description: "Generate barcodes", href: "/utility-tools/barcode", icon: QrCode, category: "utility" },
        { title: "Password Generator", description: "Generate secure passwords", href: "/utility-tools/password-generator", icon: QrCode, category: "utility" },
        { title: "Color Converter", description: "Convert colors", href: "/utility-tools/color-converter", icon: QrCode, category: "utility" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate QR Code</TabsTrigger>
            <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Input Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Select content type and enter your data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="qr-type">QR Code Type</Label>
                      <Select value={qrType} onValueChange={(value) => setQrType(value as QRType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {qrTemplates.map((template) => (
                            <SelectItem key={template.type} value={template.type}>
                              <div className="flex items-center gap-2">
                                {template.icon}
                                {template.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <textarea
                        id="content"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={currentTemplate.placeholder}
                        className="w-full min-h-[100px] p-3 border rounded-md resize-none font-mono text-sm"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={loadExample} size="sm">
                        Load Example
                      </Button>
                      <Button variant="ghost" onClick={copyToClipboard} disabled={!qrContent} size="sm">
                        {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        Copy Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Preview */}
                {qrContent && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Content Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 bg-muted/30 rounded-lg max-h-32 overflow-y-auto">
                        <pre className="text-xs font-mono whitespace-pre-wrap break-all">{qrContent}</pre>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-2">
                  <Button onClick={generateQR} disabled={!qrContent || isGenerating} className="flex-1">
                    {isGenerating ? "Generating..." : "Generate QR Code"}
                  </Button>
                  <Button onClick={generateSVG} disabled={!qrContent} variant="outline">
                    Generate SVG
                  </Button>
                </div>
              </div>

              {/* QR Code Display */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Preview</CardTitle>
                    <CardDescription>
                      Size: {settings.size}x{settings.size}px • Format: {exportFormat.toUpperCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <canvas
                          ref={canvasRef}
                          className="border rounded-lg shadow-sm"
                          style={{
                            width: Math.min(settings.size, 400),
                            height: Math.min(settings.size, 400)
                          }}
                        />
                        {!qrCodeUrl && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                            <div className="text-center text-muted-foreground">
                              <QrCode className="h-16 w-16 mx-auto mb-4 opacity-20" />
                              <p className="text-sm">QR code will appear here</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {qrCodeUrl && (
                      <div className="flex gap-2 mt-4">
                        <Button onClick={downloadQR} className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download {exportFormat.toUpperCase()}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* QR Stats */}
                {qrCodeUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">QR Code Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Size:</strong> {settings.size}x{settings.size}px
                        </div>
                        <div>
                          <strong>Error Correction:</strong> {settings.errorCorrection} ({settings.errorCorrection === 'L' ? '7%' : settings.errorCorrection === 'M' ? '15%' : settings.errorCorrection === 'Q' ? '25%' : '30%'})
                        </div>
                        <div>
                          <strong>Margin:</strong> {settings.margin}px
                        </div>
                        <div>
                          <strong>Content Length:</strong> {qrContent.length} chars
                        </div>
                      </div>
                      {includeLogo && logoFile && (
                        <Badge variant="secondary" className="mt-2">
                          Logo: {logoFile.name}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Size & Quality */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Size & Quality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Size: {settings.size}px</Label>
                    <Slider
                      value={[settings.size]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, size: value[0] }))}
                      min={200}
                      max={1000}
                      step={50}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Error Correction Level</Label>
                    <Select
                      value={settings.errorCorrection}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, errorCorrection: value as ErrorCorrectionLevel }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">L - Low (7%)</SelectItem>
                        <SelectItem value="M">M - Medium (15%)</SelectItem>
                        <SelectItem value="Q">Q - High (25%)</SelectItem>
                        <SelectItem value="H">H - Very High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Margin: {settings.margin}px</Label>
                    <Slider
                      value={[settings.margin]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, margin: value[0] }))}
                      min={0}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Foreground Color</Label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={settings.foregroundColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        className="w-12 h-10 border rounded cursor-pointer"
                      />
                      <Input
                        value={settings.foregroundColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        className="font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Background Color</Label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={settings.backgroundColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-12 h-10 border rounded cursor-pointer"
                      />
                      <Input
                        value={settings.backgroundColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="font-mono"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="transparent-bg"
                      checked={settings.backgroundColor === 'transparent'}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        backgroundColor: checked ? 'transparent' : '#FFFFFF'
                      }))}
                    />
                    <Label htmlFor="transparent-bg">Transparent Background</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Logo */}
              <Card>
                <CardHeader>
                  <CardTitle>Logo Embedding</CardTitle>
                  <CardDescription>Add a logo to the center of your QR code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-logo"
                      checked={includeLogo}
                      onCheckedChange={setIncludeLogo}
                    />
                    <Label htmlFor="include-logo">Include Logo</Label>
                  </div>

                  {includeLogo && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        {logoFile ? `Change Logo (${logoFile.name})` : 'Upload Logo'}
                      </Button>

                      {logoPreview && (
                        <div className="flex justify-center">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-16 h-16 object-contain border rounded"
                          />
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Logo will be automatically sized and centered. Max file size: 1MB
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>Choose your preferred export format</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG (Lossless)</SelectItem>
                        <SelectItem value="jpeg">JPEG (Smaller file)</SelectItem>
                        <SelectItem value="svg">SVG (Scalable)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <strong>PNG:</strong> Best quality, supports transparency<br />
                    <strong>JPEG:</strong> Smaller files, no transparency<br />
                    <strong>SVG:</strong> Scalable vector format
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h5 className="font-medium">Design Tips</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use high contrast colors for better scanning</li>
                  <li>• Keep content concise (under 200 characters)</li>
                  <li>• Test your QR code before publishing</li>
                  <li>• Add white space around the code</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium">Technical Tips</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Higher error correction allows more damage recovery</li>
                  <li>• Larger sizes improve scan reliability</li>
                  <li>• SVG format is best for printing at any size</li>
                  <li>• PNG with transparency works best for web</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ContentCluster
        category="utility"
        title="Complete QR Code & Barcode Suite"
        description="Generate QR codes, barcodes, and digital identifiers for business, marketing, and inventory management. Advanced customization and high-quality output."
        mainTool={{
          title: "Advanced QR Code Generator",
          href: "/utility-tools/qr-code",
          description: "Create custom QR codes with logos, colors, and advanced settings. Supports URLs, WiFi, contacts, and more."
        }}
        topics={[
          {
            title: "QR Code Marketing Guide",
            description: "Complete guide to using QR codes for marketing campaigns, lead generation, and customer engagement.",
            href: "/guides/qr-code-marketing-guide",
            type: "guide",
            category: "Marketing"
          },
          {
            title: "QR Code vs Barcodes: Complete Comparison",
            description: "Detailed comparison of QR codes, barcodes, and other identification systems with use cases and benefits.",
            href: "/guides/qr-codes-vs-barcodes",
            type: "comparison",
            category: "Technical Guide"
          },
          {
            title: "Business Card QR Codes Tutorial",
            description: "Learn how to create digital business cards with QR codes for easy contact sharing.",
            href: "/guides/business-card-qr-codes",
            type: "tutorial",
            category: "Business"
          },
          {
            title: "WiFi QR Code Setup Guide",
            description: "Generate QR codes for WiFi sharing - perfect for cafes, offices, and events.",
            href: "/guides/wifi-qr-code-setup",
            type: "guide",
            category: "Productivity"
          },
          {
            title: "Barcode Generator",
            description: "Generate EAN13, CODE128, UPC, and other barcode formats",
            href: "/utility-tools/barcode",
            type: "tool",
            category: "Utility Tools"
          },
          {
            title: "Password Generator",
            description: "Create secure passwords for accounts and WiFi networks",
            href: "/utility-tools/password-generator",
            type: "tool",
            category: "Utility Tools"
          },
          {
            title: "Color Converter",
            description: "Convert between color formats for design and development",
            href: "/utility-tools/color-converter",
            type: "tool",
            category: "Utility Tools"
          },
          {
            title: "Countdown Timer",
            description: "Set timers for meetings, breaks, and productivity sessions",
            href: "/utility-tools/countdown",
            type: "tool",
            category: "Utility Tools"
          },
          {
            title: "Unit Converter",
            description: "Convert between measurement units and currencies",
            href: "/utility-tools/unit-converter",
            type: "tool",
            category: "Utility Tools"
          }
        ]}
      />
    </ToolLayout>
  );
}
