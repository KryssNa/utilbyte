"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MD5 from "crypto-js/md5";
import SHA1 from "crypto-js/sha1";
import { AlertCircle, Check, Copy, FileText, Hash, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
  length: number;
}

export default function HashGenerator() {
  const [inputText, setInputText] = useState<string>("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [results, setResults] = useState<HashResult[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<string>("");

  const generateHash = useCallback(async (text: string, algorithm: HashAlgorithm): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    try {
      switch (algorithm) {
        case "MD5":
          return MD5(text).toString();
        case "SHA-1":
          return SHA1(text).toString();
        case "SHA-256":
          const sha256Hash = await crypto.subtle.digest("SHA-256", data);
          return Array.from(new Uint8Array(sha256Hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        case "SHA-384":
          const sha384Hash = await crypto.subtle.digest("SHA-384", data);
          return Array.from(new Uint8Array(sha384Hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        case "SHA-512":
          const sha512Hash = await crypto.subtle.digest("SHA-512", data);
          return Array.from(new Uint8Array(sha512Hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
    } catch (err) {
      throw new Error(`Failed to generate ${algorithm} hash: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  const generateAllHashes = useCallback(async (text: string) => {
    setIsGenerating(true);
    setError("");

    try {
      const algorithms: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];
      const hashPromises = algorithms.map(async (algorithm) => {
        const hash = await generateHash(text, algorithm);
        return {
          algorithm,
          hash,
          length: hash.length,
        };
      });

      const hashResults = await Promise.all(hashPromises);
      setResults(hashResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate hashes");
    } finally {
      setIsGenerating(false);
    }
  }, [generateHash]);

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) {
      setResults([]);
      return;
    }

    await generateAllHashes(inputText);
  }, [inputText, generateAllHashes]);

  const handleGenerateSingle = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setError("");

    try {
      const hash = await generateHash(inputText, selectedAlgorithm);
      setResults([{
        algorithm: selectedAlgorithm,
        hash,
        length: hash.length,
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate hash");
    } finally {
      setIsGenerating(false);
    }
  }, [inputText, selectedAlgorithm, generateHash]);

  const handleCopy = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopied(""), 2000);
  }, []);

  const handleReset = () => {
    setInputText("");
    setResults([]);
    setError("");
  };

  const loadExample = (example: string) => {
    setInputText(example);
  };

  const examples = [
    "Hello, World!",
    "password123",
    "The quick brown fox jumps over the lazy dog",
    "user@example.com",
    "sensitive-data-here",
  ];

  const algorithmInfo = {
    "MD5": {
      description: "MD5 is a widely used hash function that produces a 128-bit hash value. It's fast but considered cryptographically weak.",
      security: "Weak - susceptible to collision attacks",
      useCase: "File integrity checks, non-cryptographic purposes"
    },
    "SHA-1": {
      description: "SHA-1 produces a 160-bit hash value. It was widely used but is now considered cryptographically weak.",
      security: "Weak - vulnerable to collision attacks",
      useCase: "Legacy systems, Git commit hashes"
    },
    "SHA-256": {
      description: "SHA-256 is part of the SHA-2 family and produces a 256-bit hash. It's widely used for security applications.",
      security: "Strong - resistant to collision attacks",
      useCase: "Digital signatures, blockchain, password hashing"
    },
    "SHA-384": {
      description: "SHA-384 produces a 384-bit hash and is more secure than SHA-256 but slower.",
      security: "Strong - very resistant to attacks",
      useCase: "High-security applications, government use"
    },
    "SHA-512": {
      description: "SHA-512 produces a 512-bit hash and is the most secure SHA-2 variant.",
      security: "Strong - highest security level",
      useCase: "Military applications, extremely sensitive data"
    },
  };

  const currentAlgorithmInfo = algorithmInfo[selectedAlgorithm];

  const faqs = [
    {
      question: "Which hash algorithm should I use?",
      answer: "For security, use SHA-256 or higher. MD5 and SHA-1 are cryptographically weak and should only be used for non-security purposes like file integrity checks.",
    },
    {
      question: "Are these hashes reversible?",
      answer: "No, hash functions are one-way. You cannot recover the original text from a hash. They're designed for integrity verification and password storage.",
    },
    {
      question: "What's the difference between hashing and encryption?",
      answer: "Hashing is one-way and produces fixed-length output. Encryption is two-way and can be decrypted to recover the original data.",
    },
  ];

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate cryptographic hashes using MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms. Perfect for password hashing and data integrity."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Hash}
      faqs={faqs}
      relatedTools={[
        { title: "Base64", description: "Encode/decode base64", href: "/dev-tools/base64", icon: Hash, category: "dev" },
        { title: "JWT Decoder", description: "Decode JWT tokens", href: "/dev-tools/jwt-decoder", icon: Hash, category: "dev" },
        { title: "URL Encoder", description: "Encode URLs", href: "/dev-tools/url-encoder", icon: Hash, category: "dev" },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Input Text</h3>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to hash..."
            className="min-h-[120px] text-base"
          />

          {/* Algorithm Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Hash Algorithm</h4>
            <Select value={selectedAlgorithm} onValueChange={(value) => setSelectedAlgorithm(value as HashAlgorithm)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MD5">MD5 (128-bit)</SelectItem>
                <SelectItem value="SHA-1">SHA-1 (160-bit)</SelectItem>
                <SelectItem value="SHA-256">SHA-256 (256-bit)</SelectItem>
                <SelectItem value="SHA-384">SHA-384 (384-bit)</SelectItem>
                <SelectItem value="SHA-512">SHA-512 (512-bit)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Examples
            </h4>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(example)}
                  className="w-full text-left justify-start h-auto p-3"
                >
                  <div className="truncate text-xs">
                    "{example}"
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerateSingle} className="flex-1" disabled={isGenerating}>
              Generate {selectedAlgorithm}
            </Button>
            <Button onClick={handleGenerate} variant="outline" className="flex-1" disabled={isGenerating}>
              Generate All
            </Button>
          </div>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Hash Results</h3>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.algorithm} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{result.algorithm}</Badge>
                      <span className="text-xs text-muted-foreground">({result.length} chars)</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(result.hash, `${result.algorithm} hash`)}
                      className="gap-2"
                    >
                      <Copy className="h-3 w-3" />
                      {copied === `${result.algorithm} hash` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="font-mono text-sm bg-muted p-3 rounded break-all">
                    {result.hash}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Algorithm Info */}
          {currentAlgorithmInfo && (
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium">About {selectedAlgorithm}</h4>
              <div className="space-y-2 text-sm">
                <p>{currentAlgorithmInfo.description}</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Security:</span>
                  <Badge variant={selectedAlgorithm.includes("SHA-256") || selectedAlgorithm.includes("SHA-384") || selectedAlgorithm.includes("SHA-512") ? "secondary" : "destructive"}>
                    {currentAlgorithmInfo.security}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Use Case:</span> {currentAlgorithmInfo.useCase}
                </div>
              </div>
            </div>
          )}

          {results.length === 0 && !error && (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              <div className="text-center">
                <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Generate hashes to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
