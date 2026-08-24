"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Clock, Copy, RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type TimestampFormat = "unix" | "iso" | "utc" | "locale" | "relative";

export default function TimestampConverter() {
  const [inputValue, setInputValue] = useState<string>("");
  const [inputFormat, setInputFormat] = useState<TimestampFormat>("unix");
  const [parsedDate, setParsedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string>("");

  const parseTimestamp = useCallback((value: string, format: TimestampFormat): Date | null => {
    if (!value.trim()) return null;

    try {
      switch (format) {
        case "unix":
          // Handle both seconds and milliseconds
          const timestamp = parseFloat(value);
          if (isNaN(timestamp)) return null;

          // If timestamp is in seconds (< 10^10), convert to milliseconds
          const ms = timestamp < 1e10 ? timestamp * 1000 : timestamp;
          return new Date(ms);

        case "iso":
          return new Date(value);

        case "utc":
          return new Date(value + (value.includes('Z') ? '' : 'Z'));

        case "locale":
          return new Date(value);

        default:
          return null;
      }
    } catch (err) {
      return null;
    }
  }, []);

  const formatTimestamp = useCallback((date: Date, format: TimestampFormat): string => {
    switch (format) {
      case "unix":
        return Math.floor(date.getTime() / 1000).toString();
      case "iso":
        return date.toISOString();
      case "utc":
        return date.toUTCString();
      case "locale":
        return date.toLocaleString();
      case "relative":
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
        const diffMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));

        if (Math.abs(diffMs) < 60000) { // Less than 1 minute
          return "Just now";
        } else if (Math.abs(diffMs) < 3600000) { // Less than 1 hour
          return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ${diffMs > 0 ? 'from now' : 'ago'}`;
        } else if (Math.abs(diffMs) < 86400000) { // Less than 1 day
          return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ${diffMs > 0 ? 'from now' : 'ago'}`;
        } else {
          return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${diffMs > 0 ? 'from now' : 'ago'}`;
        }
      default:
        return date.toString();
    }
  }, []);

  const parsedResult = useMemo(() => {
    if (!inputValue.trim()) {
      setParsedDate(null);
      setError("");
      return null;
    }

    const date = parseTimestamp(inputValue, inputFormat);
    setParsedDate(date);

    if (!date || isNaN(date.getTime())) {
      setError("Invalid timestamp format");
      return null;
    }

    setError("");

    return {
      unix: formatTimestamp(date, "unix"),
      unixMs: date.getTime().toString(),
      iso: formatTimestamp(date, "iso"),
      utc: formatTimestamp(date, "utc"),
      locale: formatTimestamp(date, "locale"),
      relative: formatTimestamp(date, "relative"),
      date: date,
    };
  }, [inputValue, inputFormat, parseTimestamp, formatTimestamp]);

  const handleCopy = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  }, []);

  const handleReset = () => {
    setInputValue("");
    setParsedDate(null);
    setError("");
  };

  const loadCurrentTime = () => {
    const now = new Date();
    setInputValue(now.getTime().toString());
    setInputFormat("unix");
  };

  const loadCommonTimestamps = (type: string) => {
    const now = new Date();

    switch (type) {
      case "now":
        setInputValue(Math.floor(now.getTime() / 1000).toString());
        setInputFormat("unix");
        break;
      case "tomorrow":
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        setInputValue(Math.floor(tomorrow.getTime() / 1000).toString());
        setInputFormat("unix");
        break;
      case "yesterday":
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        setInputValue(Math.floor(yesterday.getTime() / 1000).toString());
        setInputFormat("unix");
        break;
      case "new-year":
        const newYear = new Date(now.getFullYear() + 1, 0, 1);
        setInputValue(Math.floor(newYear.getTime() / 1000).toString());
        setInputFormat("unix");
        break;
    }
  };

  const formatExamples = {
    unix: [
      { value: Math.floor(Date.now() / 1000).toString(), description: "Current Unix timestamp (seconds)" },
      { value: Date.now().toString(), description: "Current Unix timestamp (milliseconds)" },
      { value: "1609459200", description: "January 1, 2021 00:00:00 UTC" },
    ],
    iso: [
      { value: new Date().toISOString(), description: "Current ISO 8601 timestamp" },
      { value: "2021-01-01T00:00:00.000Z", description: "New Year's Day 2021 UTC" },
      { value: "2023-12-25T12:00:00-05:00", description: "Christmas 2023 EST" },
    ],
    utc: [
      { value: new Date().toUTCString(), description: "Current UTC timestamp" },
      { value: "Mon, 01 Jan 2021 00:00:00 GMT", description: "New Year's Day 2021" },
    ],
    locale: [
      { value: new Date().toLocaleString(), description: "Current local timestamp" },
      { value: "1/1/2021, 12:00:00 AM", description: "New Year's Day 2021 (US format)" },
    ],
  };

  const faqs = [
    {
      question: "What is a Unix timestamp?",
      answer: "A Unix timestamp is the number of seconds (or milliseconds) that have elapsed since January 1, 1970 UTC, excluding leap seconds.",
    },
    {
      question: "What's the difference between Unix seconds and milliseconds?",
      answer: "Unix seconds are the standard format (10 digits), while milliseconds are the same value multiplied by 1000 (13 digits).",
    },
    {
      question: "What is ISO 8601 format?",
      answer: "ISO 8601 is an international standard for date and time representation, like '2023-12-25T15:30:00.000Z'.",
    },
  ];

  return (
    <ToolLayout
      title="Timestamp Converter"
      description="Convert between different timestamp formats: Unix, ISO 8601, UTC, and locale formats. Parse and format dates easily."
      category="utility"
      categoryLabel="Utility Tools"
      icon={Clock}
      faqs={faqs}
      relatedTools={[
        { title: "Unit Converter", description: "Convert measurements", href: "/utility-tools/unit-converter", icon: Clock, category: "utility" },
        { title: "Countdown Timer", description: "Set countdown timers", href: "/utility-tools/countdown", icon: Clock, category: "utility" },
        { title: "Color Converter", description: "Convert colors", href: "/utility-tools/color-converter", icon: Clock, category: "utility" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Timestamp Input</CardTitle>
            <CardDescription>Enter a timestamp in your preferred format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Input Format</Label>
                <Select value={inputFormat} onValueChange={(value) => setInputFormat(value as TimestampFormat)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unix">Unix Timestamp</SelectItem>
                    <SelectItem value="iso">ISO 8601</SelectItem>
                    <SelectItem value="utc">UTC String</SelectItem>
                    <SelectItem value="locale">Locale String</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timestamp Value</Label>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    inputFormat === "unix" ? "1704067200" :
                      inputFormat === "iso" ? "2023-12-25T00:00:00.000Z" :
                        inputFormat === "utc" ? "Mon, 25 Dec 2023 00:00:00 GMT" :
                          "12/25/2023, 12:00:00 AM"
                  }
                  className="font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={loadCurrentTime} className="gap-2">
                <Clock className="h-4 w-4" />
                Current Time
              </Button>
              <Button variant="outline" onClick={() => loadCommonTimestamps("now")}>
                Now
              </Button>
              <Button variant="outline" onClick={() => loadCommonTimestamps("tomorrow")}>
                Tomorrow
              </Button>
              <Button variant="outline" onClick={() => loadCommonTimestamps("yesterday")}>
                Yesterday
              </Button>
              <Button variant="outline" onClick={() => loadCommonTimestamps("new-year")}>
                Next New Year
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>
            </div>

            {/* Format Examples */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Format Examples</h4>
              <div className="grid gap-2">
                {formatExamples[inputFormat as keyof typeof formatExamples]?.map((example, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputValue(example.value)}
                    className="justify-start h-auto p-3 text-left"
                  >
                    <div>
                      <div className="font-mono text-xs font-medium">{example.value}</div>
                      <div className="text-xs text-muted-foreground">{example.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {parsedResult && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Parsed Date Info */}
            <Card>
              <CardHeader>
                <CardTitle>Parsed Date</CardTitle>
                <CardDescription>Information about the parsed timestamp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold">
                    {parsedResult.date.toLocaleDateString()}
                  </div>
                  <div className="text-lg font-mono text-muted-foreground">
                    {parsedResult.date.toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Year:</strong> {parsedResult.date.getFullYear()}
                  </div>
                  <div>
                    <strong>Month:</strong> {parsedResult.date.getMonth() + 1}
                  </div>
                  <div>
                    <strong>Day:</strong> {parsedResult.date.getDate()}
                  </div>
                  <div>
                    <strong>Weekday:</strong> {parsedResult.date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </div>
                  <div>
                    <strong>Timezone:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </div>
                  <div>
                    <strong>UTC Offset:</strong> {parsedResult.date.getTimezoneOffset() / -60}h
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Format Conversions */}
            <Card>
              <CardHeader>
                <CardTitle>All Formats</CardTitle>
                <CardDescription>The timestamp in different formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-1">Unix (seconds)</Badge>
                      <div className="font-mono text-sm">{parsedResult.unix}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(parsedResult.unix, 'Unix timestamp')}
                      className="gap-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-1">Unix (milliseconds)</Badge>
                      <div className="font-mono text-sm">{parsedResult.unixMs}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(parsedResult.unixMs, 'Unix timestamp (ms)')}
                      className="gap-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-1">ISO 8601</Badge>
                      <div className="font-mono text-sm break-all">{parsedResult.iso}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(parsedResult.iso, 'ISO 8601')}
                      className="gap-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-1">UTC String</Badge>
                      <div className="font-mono text-sm">{parsedResult.utc}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(parsedResult.utc, 'UTC string')}
                      className="gap-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-1">Local String</Badge>
                      <div className="font-mono text-sm">{parsedResult.locale}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(parsedResult.locale, 'Local string')}
                      className="gap-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div>
                    <Badge variant="secondary" className="mb-1">Relative Time</Badge>
                    <div className="text-sm">{parsedResult.relative}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Timestamp Info */}
        <Card>
          <CardHeader>
            <CardTitle>Timestamp Formats</CardTitle>
            <CardDescription>Understanding different timestamp representations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-medium mb-2">Unix Timestamp</h5>
                <p className="text-muted-foreground mb-2">
                  Number of seconds/milliseconds since January 1, 1970 UTC.
                </p>
                <div className="font-mono bg-muted p-2 rounded text-xs">
                  1704067200 (seconds)<br />
                  1704067200000 (milliseconds)
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">ISO 8601</h5>
                <p className="text-muted-foreground mb-2">
                  International standard format with timezone information.
                </p>
                <div className="font-mono bg-muted p-2 rounded text-xs">
                  2023-12-25T00:00:00.000Z
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">UTC String</h5>
                <p className="text-muted-foreground mb-2">
                  Human-readable UTC format (RFC 2822 style).
                </p>
                <div className="font-mono bg-muted p-2 rounded text-xs">
                  Mon, 25 Dec 2023 00:00:00 GMT
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Locale String</h5>
                <p className="text-muted-foreground mb-2">
                  Localized format based on user's system settings.
                </p>
                <div className="font-mono bg-muted p-2 rounded text-xs">
                  12/25/2023, 12:00:00 AM
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
