"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Palette, RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number; };
  hsl: { h: number; s: number; l: number; };
  hsv: { h: number; s: number; v: number; };
  cmyk: { c: number; m: number; y: number; k: number; };
}

export default function ColorConverter() {
  const [inputColor, setInputColor] = useState<string>("#3b82f6");
  const [inputFormat, setInputFormat] = useState<string>("hex");

  // Color conversion functions
  const hexToRgb = (hex: string): { r: number; g: number; b: number; } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number; } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number; } => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number; } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number; } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const parseInput = useCallback((input: string, format: string): ColorValues | null => {
    try {
      let rgb: { r: number; g: number; b: number; } | null = null;

      switch (format) {
        case "hex":
          rgb = hexToRgb(input);
          break;
        case "rgb":
          const rgbMatch = input.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
          if (rgbMatch) {
            rgb = { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
          }
          break;
        case "hsl":
          const hslMatch = input.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/i);
          if (hslMatch) {
            rgb = hslToRgb(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]));
          }
          break;
      }

      if (!rgb) return null;

      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

      return { hex, rgb, hsl, hsv, cmyk };
    } catch (error) {
      return null;
    }
  }, []);

  const colorValues = useMemo(() => {
    return parseInput(inputColor, inputFormat);
  }, [inputColor, inputFormat, parseInput]);

  const handleColorChange = (color: string) => {
    setInputColor(color);
  };

  const handleCopy = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  }, []);

  const handleReset = () => {
    setInputColor("#3b82f6");
    setInputFormat("hex");
  };

  const formatRgb = (rgb: { r: number; g: number; b: number; }) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const formatHsl = (hsl: { h: number; s: number; l: number; }) => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const formatHsv = (hsv: { h: number; s: number; v: number; }) => `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  const formatCmyk = (cmyk: { c: number; m: number; y: number; k: number; }) => `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

  const faqs = [
    {
      question: "What color formats are supported?",
      answer: "We support HEX, RGB, HSL, HSV, and CMYK color formats with real-time conversion between them.",
    },
    {
      question: "Can I use the color picker?",
      answer: "Yes! Use the color input to visually select colors, and all formats will update automatically.",
    },
    {
      question: "Are the conversions accurate?",
      answer: "Yes, all color conversions use standard color space mathematics and are accurate for web and print use.",
    },
  ];

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert between different color formats: HEX, RGB, HSL, HSV, CMYK. Includes color picker and visual preview."
      category="utility"
      categoryLabel="Utility Tools"
      icon={Palette}
      faqs={faqs}
      relatedTools={[
        { title: "Unit Converter", description: "Convert measurements", href: "/utility-tools/unit-converter", icon: Palette, category: "utility" },
        { title: "Barcode Generator", description: "Generate barcodes", href: "/utility-tools/barcode", icon: Palette, category: "utility" },
        { title: "QR Code", description: "Generate QR codes", href: "/utility-tools/qr-code", icon: Palette, category: "utility" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Color Preview and Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Color Preview</CardTitle>
            <CardDescription>Visual representation of your selected color</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-24 h-24 rounded-lg border-2 border-gray-200 shadow-lg"
                style={{ backgroundColor: colorValues?.hex || '#3b82f6' }}
              />
              <div className="flex-1">
                <Label htmlFor="colorPicker" className="text-sm font-medium">Color Picker</Label>
                <Input
                  id="colorPicker"
                  type="color"
                  value={colorValues?.hex || '#3b82f6'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-12 border-2"
                />
              </div>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Color Formats */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Formats</TabsTrigger>
            <TabsTrigger value="input">Input Format</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* HEX */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    HEX
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(colorValues?.hex || '', 'HEX')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-lg font-semibold">
                    {colorValues?.hex || 'Invalid'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Hexadecimal notation
                  </div>
                </CardContent>
              </Card>

              {/* RGB */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    RGB
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(colorValues ? formatRgb(colorValues.rgb) : '', 'RGB')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm">
                    {colorValues ? formatRgb(colorValues.rgb) : 'Invalid'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Red, Green, Blue (0-255)
                  </div>
                </CardContent>
              </Card>

              {/* HSL */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    HSL
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(colorValues ? formatHsl(colorValues.hsl) : '', 'HSL')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm">
                    {colorValues ? formatHsl(colorValues.hsl) : 'Invalid'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Hue, Saturation, Lightness
                  </div>
                </CardContent>
              </Card>

              {/* HSV */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    HSV
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(colorValues ? formatHsv(colorValues.hsv) : '', 'HSV')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm">
                    {colorValues ? formatHsv(colorValues.hsv) : 'Invalid'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Hue, Saturation, Value
                  </div>
                </CardContent>
              </Card>

              {/* CMYK */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    CMYK
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(colorValues ? formatCmyk(colorValues.cmyk) : '', 'CMYK')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm">
                    {colorValues ? formatCmyk(colorValues.cmyk) : 'Invalid'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Cyan, Magenta, Yellow, Black
                  </div>
                </CardContent>
              </Card>

              {/* Color Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Color Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {colorValues && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Luminance:</span>
                        <Badge variant="secondary">
                          {Math.round((0.299 * colorValues.rgb.r + 0.587 * colorValues.rgb.g + 0.114 * colorValues.rgb.b))}%
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Contrast:</span>
                        <Badge variant="secondary">
                          {colorValues.hsl.l > 50 ? 'Light' : 'Dark'}
                        </Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="input" className="space-y-4">
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label>Input Format</Label>
                <select
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="hex">HEX (#RRGGBB)</option>
                  <option value="rgb">RGB (rgb(r,g,b))</option>
                  <option value="hsl">HSL (hsl(h,s%,l%))</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Enter Color Value</Label>
                <Input
                  value={inputColor}
                  onChange={(e) => setInputColor(e.target.value)}
                  placeholder={
                    inputFormat === "hex" ? "#3b82f6" :
                      inputFormat === "rgb" ? "rgb(59, 130, 246)" :
                        "hsl(217, 91%, 60%)"
                  }
                  className="font-mono"
                />
              </div>

              {colorValues && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Parsed Color:</h4>
                  <div
                    className="w-full h-12 rounded border"
                    style={{ backgroundColor: colorValues.hex }}
                  />
                  <div className="text-sm font-mono mt-2">
                    {colorValues.hex.toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Colors</CardTitle>
            <CardDescription>Click to select common colors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-2">
              {[
                '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
                '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#808080', '#c0c0c0',
                '#ffa500', '#a52a2a', '#8a2be2', '#deb887', '#5f9ea0', '#7fff00', '#d2691e', '#6495ed'
              ].map(color => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
