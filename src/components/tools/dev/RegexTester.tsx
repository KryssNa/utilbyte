"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, BookOpen, Copy, RotateCcw, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface MatchResult {
  match: string;
  index: number;
  groups: (string | undefined)[];
}

interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState<string>("");
  const [testString, setTestString] = useState<string>("");
  const [replaceString, setReplaceString] = useState<string>("");
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false,
  });
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const regex = useMemo(() => {
    if (!pattern) return null;

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => {
          switch (flag) {
            case 'global': return 'g';
            case 'ignoreCase': return 'i';
            case 'multiline': return 'm';
            case 'dotAll': return 's';
            case 'unicode': return 'u';
            case 'sticky': return 'y';
            default: return '';
          }
        })
        .join('');

      setError("");
      return new RegExp(pattern, flagString);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regex pattern");
      return null;
    }
  }, [pattern, flags]);

  const matches = useMemo((): MatchResult[] => {
    if (!regex || !testString) return [];

    try {
      const results: MatchResult[] = [];
      let match;

      if (flags.global) {
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });

          // Prevent infinite loop for zero-width matches
          if (match[0].length === 0) break;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error executing regex");
      return [];
    }
  }, [regex, testString, flags.global]);

  const highlightedText = useMemo(() => {
    if (!regex || !testString || matches.length === 0) return testString;

    let result = testString;
    let offset = 0;

    // Sort matches by index in reverse order to avoid index shifting
    const sortedMatches = [...matches].sort((a, b) => b.index - a.index);

    for (const match of sortedMatches) {
      const start = match.index + offset;
      const end = start + match.match.length;
      const before = result.slice(0, start);
      const matched = result.slice(start, end);
      const after = result.slice(end);

      result = `${before}<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${matched}</mark>${after}`;
      offset += 56; // Length of the mark tags
    }

    return result;
  }, [regex, testString, matches]);

  const replacedText = useMemo(() => {
    if (!regex || !testString) return testString;
    try {
      return testString.replace(regex, replaceString);
    } catch (err) {
      return testString;
    }
  }, [regex, testString, replaceString]);

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleReset = () => {
    setPattern("");
    setTestString("");
    setReplaceString("");
    setError("");
  };

  const loadExample = (examplePattern: string, exampleText: string, exampleFlags: Partial<RegexFlags> = {}) => {
    setPattern(examplePattern);
    setTestString(exampleText);
    setFlags(prev => ({ ...prev, ...exampleFlags }));
  };

  const commonPatterns = [
    {
      name: "Email",
      pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
      text: "Contact us at support@example.com or john.doe@test.co.uk",
      flags: { global: true, ignoreCase: true }
    },
    {
      name: "URL",
      pattern: "https?://(?:[-\\w.]|(?:%[\\da-fA-F]{2}))+",
      text: "Visit https://example.com and http://test.org/page",
      flags: { global: true }
    },
    {
      name: "Phone Number",
      pattern: "\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}",
      text: "+1-555-123-4567, (555) 123-4567, 555.123.4567",
      flags: { global: true }
    },
    {
      name: "Date (MM/DD/YYYY)",
      pattern: "\\b\\d{1,2}/\\d{1,2}/\\d{4}\\b",
      text: "Events on 12/25/2023 and 1/1/2024",
      flags: { global: true }
    },
    {
      name: "IPv4 Address",
      pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b",
      text: "Server IPs: 192.168.1.1 and 10.0.0.1",
      flags: { global: true }
    }
  ];

  const faqs = [
    {
      question: "What regex flags are supported?",
      answer: "Global (g), Ignore Case (i), Multiline (m), Dot All (s), Unicode (u), and Sticky (y) flags are supported.",
    },
    {
      question: "How does the highlighting work?",
      answer: "Matches are highlighted in yellow in the test string. Multiple matches are shown with individual highlights.",
    },
    {
      question: "Can I use capture groups?",
      answer: "Yes! Capture groups are displayed in the match results. Use parentheses () in your regex to create groups.",
    },
  ];

  return (
    <ToolLayout
      title="Regex Tester"
      description="Test and debug regular expressions with live matching, highlighting, and replacement. Supports all major regex flags and features."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Search}
      faqs={faqs}
      relatedTools={[
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: Search, category: "dev" },
        { title: "Base64", description: "Encode/decode base64", href: "/dev-tools/base64", icon: Search, category: "dev" },
        { title: "URL Encoder", description: "Encode URLs", href: "/dev-tools/url-encoder", icon: Search, category: "dev" },
      ]}
    >
      <div className="space-y-6">
        {/* Pattern Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="pattern">Regular Expression Pattern</Label>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Clear All
            </Button>
          </div>
          <Input
            id="pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter your regex pattern (e.g., \w+@\w+\.\w+)"
            className="font-mono"
          />

          {/* Flags */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="global"
                checked={flags.global}
                onCheckedChange={(checked) => setFlags(prev => ({ ...prev, global: checked as boolean }))}
              />
              <Label htmlFor="global" className="text-sm">Global (g)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ignoreCase"
                checked={flags.ignoreCase}
                onCheckedChange={(checked) => setFlags(prev => ({ ...prev, ignoreCase: checked as boolean }))}
              />
              <Label htmlFor="ignoreCase" className="text-sm">Ignore Case (i)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multiline"
                checked={flags.multiline}
                onCheckedChange={(checked) => setFlags(prev => ({ ...prev, multiline: checked as boolean }))}
              />
              <Label htmlFor="multiline" className="text-sm">Multiline (m)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dotAll"
                checked={flags.dotAll}
                onCheckedChange={(checked) => setFlags(prev => ({ ...prev, dotAll: checked as boolean }))}
              />
              <Label htmlFor="dotAll" className="text-sm">Dot All (s)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unicode"
                checked={flags.unicode}
                onCheckedChange={(checked) => setFlags(prev => ({ ...prev, unicode: checked as boolean }))}
              />
              <Label htmlFor="unicode" className="text-sm">Unicode (u)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sticky"
                checked={flags.sticky}
                onCheckedChange={(checked) => setFlags(prev => ({ ...prev, sticky: checked as boolean }))}
              />
              <Label htmlFor="sticky" className="text-sm">Sticky (y)</Label>
            </div>
          </div>

          {/* Common Patterns */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Common Patterns
            </Label>
            <div className="flex flex-wrap gap-2">
              {commonPatterns.map((pattern, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(pattern.pattern, pattern.text, pattern.flags)}
                >
                  {pattern.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Test String */}
        <div className="space-y-3">
          <Label htmlFor="testString">Test String</Label>
          <Textarea
            id="testString"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test your regex against..."
            className="min-h-[120px]"
          />
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Matches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Matches ({matches.length})</Label>
              {matches.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(matches.map(m => m.match).join('\n'))}
                  className="gap-2"
                >
                  <Copy className="h-3 w-3" />
                  Copy All
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {matches.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No matches found
                </div>
              ) : (
                matches.map((match, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Match {index + 1}</Badge>
                      <span className="text-xs text-muted-foreground">Index: {match.index}</span>
                    </div>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {match.match}
                    </div>
                    {match.groups.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium">Capture Groups:</div>
                        {match.groups.map((group, groupIndex) => (
                          <div key={groupIndex} className="text-xs font-mono bg-muted/50 p-1 rounded">
                            Group {groupIndex + 1}: {group || "(empty)"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Highlighted Text */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Highlighted Text</Label>
            <div
              className="min-h-[120px] p-4 border rounded-lg bg-muted/30 overflow-auto text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedText || "Enter a pattern and test string to see highlights..." }}
            />
          </div>
        </div>

        {/* Replace */}
        <div className="space-y-3">
          <Label htmlFor="replaceString">Replace With (Optional)</Label>
          <Input
            id="replaceString"
            value={replaceString}
            onChange={(e) => setReplaceString(e.target.value)}
            placeholder="Replacement string (use $1, $2, etc. for capture groups)"
          />

          {replaceString && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Replaced Text</Label>
              <div className="p-4 border rounded-lg bg-muted/30">
                <pre className="whitespace-pre-wrap text-sm">{replacedText}</pre>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(replacedText)}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Result
              </Button>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
