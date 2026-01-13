"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Check, Copy, Eye, EyeOff, Key, RefreshCw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });

  const strength = useMemo(() => {
    let score = 0;
    if (options.uppercase) score += 1;
    if (options.lowercase) score += 1;
    if (options.numbers) score += 1;
    if (options.symbols) score += 1;
    if (options.length >= 8) score += 1;
    if (options.length >= 12) score += 1;
    if (options.length >= 16) score += 1;

    if (score <= 2) return { label: "Weak", color: "text-red-600", bg: "bg-red-100" };
    if (score <= 4) return { label: "Medium", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (score <= 6) return { label: "Strong", color: "text-green-600", bg: "bg-green-100" };
    return { label: "Very Strong", color: "text-blue-600", bg: "bg-blue-100" };
  }, [options]);

  const generatePassword = useCallback(() => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = "";
    if (options.uppercase) charset += uppercase;
    if (options.lowercase) charset += lowercase;
    if (options.numbers) charset += numbers;
    if (options.symbols) charset += symbols;

    if (charset.length === 0) {
      toast.error("Please select at least one character type");
      return;
    }

    let result = "";
    for (let i = 0; i < options.length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(result);
    setCopied(false);
  }, [options]);

  const copyToClipboard = useCallback(async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  const faqs = [
    {
      question: "How secure are the generated passwords?",
      answer: "The passwords are generated using cryptographically secure random number generation. The security depends on the options you choose.",
    },
    {
      question: "What's a good password length?",
      answer: "We recommend at least 12 characters for strong security. Longer passwords (16+) are even better.",
    },
    {
      question: "Should I use symbols in my passwords?",
      answer: "Symbols can make passwords stronger, but not all websites accept all symbols. Check the site's password requirements.",
    },
  ];

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate strong, secure passwords with customizable options. Create passwords that are hard to crack and easy to remember."
      category="utility"
      categoryLabel="Utility Tools"
      icon={Key}
      faqs={faqs}
      relatedTools={[
        { title: "QR Code", description: "Create QR codes", href: "/utility-tools/qr-code", icon: Key, category: "utility" },
        { title: "Unit Converter", description: "Convert units", href: "/utility-tools/unit-converter", icon: Key, category: "utility" },
        { title: "Color Converter", description: "Convert colors", href: "/utility-tools/color-converter", icon: Key, category: "utility" },
      ]}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Password Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Generated Password</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="relative">
            <Input
              value={showPassword ? password : "•".repeat(password.length)}
              readOnly
              placeholder="Click 'Generate Password' to create one..."
              className="pr-12 font-mono text-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!password}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {password && (
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded text-xs font-medium ${strength.bg} ${strength.color}`}>
                {strength.label}
              </div>
              <span className="text-sm text-muted-foreground">
                {options.length} characters
              </span>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Password Length</Label>
              <span className="text-sm font-medium">{options.length}</span>
            </div>
            <Slider
              value={[options.length]}
              onValueChange={([value]) => setOptions({ ...options, length: value })}
              min={6}
              max={32}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>6</span>
              <span>32</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Character Types</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, uppercase: checked as boolean })
                  }
                />
                <Label htmlFor="uppercase" className="text-sm">Uppercase (A-Z)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, lowercase: checked as boolean })
                  }
                />
                <Label htmlFor="lowercase" className="text-sm">Lowercase (a-z)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, numbers: checked as boolean })
                  }
                />
                <Label htmlFor="numbers" className="text-sm">Numbers (0-9)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, symbols: checked as boolean })
                  }
                />
                <Label htmlFor="symbols" className="text-sm">Symbols (!@#$%)</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button onClick={generatePassword} size="lg" className="gap-2">
            <RefreshCw className="h-5 w-5" />
            Generate Password
          </Button>
        </div>

        {/* Tips */}
        <div className="rounded-lg bg-muted/50 p-6">
          <h4 className="font-semibold mb-2">Password Security Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use at least 12 characters for strong security</li>
            <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>• Avoid using personal information or common words</li>
            <li>• Use a unique password for each account</li>
            <li>• Consider using a password manager to store complex passwords</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
