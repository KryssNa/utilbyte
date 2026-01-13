"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, Fingerprint, Plus, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [count, setCount] = useState<number>(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateUUID = useCallback(() => {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    setUuids(newUuids);
    setCopiedIndex(null);
    toast.success(`Generated ${count} UUID${count > 1 ? 's' : ''}!`);
  }, [count]);

  const generateSingle = useCallback(() => {
    const newUuid = uuidv4();
    setUuids([newUuid]);
    setCopiedIndex(null);
    toast.success("Generated new UUID!");
  }, []);

  const copyToClipboard = useCallback(async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    toast.success("UUID copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const copyAll = useCallback(async () => {
    const allUuids = uuids.join('\n');
    await navigator.clipboard.writeText(allUuids);
    toast.success(`Copied ${uuids.length} UUID${uuids.length > 1 ? 's' : ''} to clipboard!`);
  }, [uuids]);

  const faqs = [
    {
      question: "What is a UUID?",
      answer: "UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information in computer systems.",
    },
    {
      question: "What version does this generator create?",
      answer: "This tool generates UUID v4, which uses random numbers. This is the most commonly used version.",
    },
    {
      question: "How many UUIDs can I generate at once?",
      answer: "You can generate up to 100 UUIDs at once. For more, simply generate multiple batches.",
    },
  ];

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate unique UUIDs (Universally Unique Identifiers) instantly. Perfect for database keys, API tokens, and unique identifiers."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Fingerprint}
      faqs={faqs}
      relatedTools={[
        { title: "JSON Formatter", description: "Format and validate JSON", href: "/dev-tools/json-formatter", icon: Fingerprint, category: "dev" },
        { title: "Base64", description: "Encode/decode Base64", href: "/dev-tools/base64", icon: Fingerprint, category: "dev" },
        { title: "Regex Tester", description: "Test regular expressions", href: "/dev-tools/regex-tester", icon: Fingerprint, category: "dev" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="space-y-2 flex-1">
            <Label htmlFor="count">Number of UUIDs</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full sm:w-32"
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={generateSingle} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Generate One
            </Button>
            <Button onClick={generateUUID}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate {count}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Generated UUIDs ({uuids.length})
            </h3>
            {uuids.length > 1 && (
              <Button variant="outline" onClick={copyAll} size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {uuids.map((uuid, index) => (
              <div
                key={`${uuid}-${index}`}
                className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-card/80 transition-colors"
              >
                <div className="flex-1">
                  <code className="text-sm font-mono break-all">{uuid}</code>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(uuid, index)}
                  className="shrink-0"
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="rounded-lg bg-muted/50 p-6">
          <h4 className="font-semibold mb-2">About UUIDs</h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>UUID v4</strong> uses random numbers to generate unique identifiers.
              The probability of generating the same UUID twice is extremely low.
            </p>
            <p>
              <strong>Format:</strong> 8-4-4-4-12 hexadecimal digits (36 characters total).
            </p>
            <p>
              <strong>Use cases:</strong> Database primary keys, API tokens, session IDs,
              unique identifiers in distributed systems.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
