"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Clock, Copy, Key, RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface JwtParts {
  header: any;
  payload: any;
  signature: string;
}

export default function JwtDecoder() {
  const [jwtToken, setJwtToken] = useState<string>("");
  const [decoded, setDecoded] = useState<JwtParts | null>(null);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const decodeJWT = useCallback((token: string): JwtParts | null => {
    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. JWT should have 3 parts separated by dots.");
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const signature = parts[2];

      return { header, payload, signature };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decode JWT");
      return null;
    }
  }, []);

  const handleDecode = useCallback(() => {
    if (!jwtToken.trim()) {
      setDecoded(null);
      setError("");
      return;
    }

    const result = decodeJWT(jwtToken.trim());
    setDecoded(result);
    if (result) {
      setError("");
    }
  }, [jwtToken, decodeJWT]);

  const isTokenExpired = useMemo(() => {
    if (!decoded?.payload?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return decoded.payload.exp < now;
  }, [decoded]);

  const expirationDate = useMemo(() => {
    if (!decoded?.payload?.exp) return null;
    return new Date(decoded.payload.exp * 1000);
  }, [decoded]);

  const issuedDate = useMemo(() => {
    if (!decoded?.payload?.iat) return null;
    return new Date(decoded.payload.iat * 1000);
  }, [decoded]);

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleReset = () => {
    setJwtToken("");
    setDecoded(null);
    setError("");
  };

  const loadExample = (token: string) => {
    setJwtToken(token);
  };

  const exampleTokens = [
    // Valid JWT token example
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3Mzk5OTk5OTl9.4Adcj3UFYzPUVaVF43FmMZeWz7sFg4fH6U8kVqGc3c",
    // Expired token example
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  ];

  const formatJSON = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

  const faqs = [
    {
      question: "What is a JWT token?",
      answer: "JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of three parts: header, payload, and signature.",
    },
    {
      question: "How does JWT validation work?",
      answer: "JWT validation typically involves checking the signature, expiration time (exp), and issuer (iss). The signature ensures the token hasn't been tampered with.",
    },
    {
      question: "What are the common JWT claims?",
      answer: "Common claims include: sub (subject), exp (expiration), iat (issued at), iss (issuer), aud (audience), and custom claims specific to your application.",
    },
  ];

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens. View header, payload, and signature information with expiration validation."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Key}
      faqs={faqs}
      relatedTools={[
        { title: "Base64", description: "Encode/decode base64", href: "/dev-tools/base64", icon: Key, category: "dev" },
        { title: "URL Encoder", description: "Encode URLs", href: "/dev-tools/url-encoder", icon: Key, category: "dev" },
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: Key, category: "dev" },
      ]}
    >
      <div className="space-y-6">
        {/* JWT Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">JWT Token</h3>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
          <Textarea
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            placeholder="Paste your JWT token here..."
            className="min-h-[100px] font-mono text-sm"
          />

          {/* Example Tokens */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Example Tokens</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample(exampleTokens[0])}
                className="w-full text-left justify-start h-auto p-3"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs">Valid JWT Token</span>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample(exampleTokens[1])}
                className="w-full text-left justify-start h-auto p-3"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs">Expired JWT Token</span>
                </div>
              </Button>
            </div>
          </div>

          <Button onClick={handleDecode} className="w-full" size="lg">
            Decode JWT
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Decoded Output */}
        {decoded && (
          <div className="space-y-4">
            {/* Token Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isTokenExpired ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <Badge variant="destructive">Expired</Badge>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="secondary">Valid</Badge>
                  </>
                )}
              </div>

              {expirationDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Expires: {expirationDate.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Token Parts */}
            <Tabs defaultValue="header" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="header">Header</TabsTrigger>
                <TabsTrigger value="payload">Payload</TabsTrigger>
                <TabsTrigger value="signature">Signature</TabsTrigger>
              </TabsList>

              <TabsContent value="header" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Header</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(formatJSON(decoded.header))}
                    className="gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {formatJSON(decoded.header)}
                </pre>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Algorithm:</strong> {decoded.header.alg || 'Not specified'}
                  </div>
                  <div>
                    <strong>Type:</strong> {decoded.header.typ || 'Not specified'}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payload" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Payload</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(formatJSON(decoded.payload))}
                    className="gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {formatJSON(decoded.payload)}
                </pre>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Subject:</strong> {decoded.payload.sub || 'Not specified'}
                  </div>
                  <div>
                    <strong>Issuer:</strong> {decoded.payload.iss || 'Not specified'}
                  </div>
                  <div>
                    <strong>Issued At:</strong> {issuedDate ? issuedDate.toLocaleString() : 'Not specified'}
                  </div>
                  <div>
                    <strong>Expires At:</strong> {expirationDate ? expirationDate.toLocaleString() : 'Not specified'}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signature" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Signature</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(decoded.signature)}
                    className="gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">
                  {decoded.signature}
                </div>
                <div className="text-sm text-muted-foreground">
                  The signature is used to verify that the token hasn't been tampered with.
                  It cannot be decoded as it contains binary data encoded in Base64URL format.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
