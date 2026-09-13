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

import { passwordGeneratorArticle } from "@/content/tools/password-generator";
interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

/**
 * A uniformly distributed integer in [0, range), from the platform CSPRNG.
 *
 * `Math.random()` is not suitable here: it is not cryptographically secure and
 * its internal state can be recovered from enough observed output. Nor is
 * `getRandomValues() % range` on its own, which skews toward the low end
 * whenever `range` does not divide 2^32 evenly. Rejection sampling removes
 * that bias by discarding the values in the short final block.
 */
function randomIndex(range: number): number {
  const limit = Math.floor(0xffffffff / range) * range;
  const buffer = new Uint32Array(1);
  let value = 0;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % range;
}

/** Fisher-Yates, driven by the same CSPRNG. */
function shuffleInPlace<T>(items: T[]): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
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

  const charsetSize = useMemo(() => {
    let size = 0;
    if (options.uppercase) size += UPPERCASE.length;
    if (options.lowercase) size += LOWERCASE.length;
    if (options.numbers) size += NUMBERS.length;
    if (options.symbols) size += SYMBOLS.length;
    return size;
  }, [options]);

  /**
   * Entropy in bits: length x log2(alphabet size).
   *
   * This is the only honest measure of a randomly generated password, and it
   * is deliberately not the same thing as the "strength meters" that count how
   * many character classes you ticked. A 20-character lowercase-only password
   * has more entropy than an 8-character one using every class, and a meter
   * that scores classes gets that backwards.
   */
  const entropyBits = useMemo(
    () => (charsetSize > 0 ? options.length * Math.log2(charsetSize) : 0),
    [charsetSize, options.length]
  );

  const strength = useMemo(() => {
    if (entropyBits < 45) return { label: "Weak", color: "text-red-600", bg: "bg-red-100" };
    if (entropyBits < 60) return { label: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (entropyBits < 80) return { label: "Strong", color: "text-green-600", bg: "bg-green-100" };
    return { label: "Very Strong", color: "text-blue-600", bg: "bg-blue-100" };
  }, [entropyBits]);

  const generatePassword = useCallback(() => {
    const pools: string[] = [];
    if (options.uppercase) pools.push(UPPERCASE);
    if (options.lowercase) pools.push(LOWERCASE);
    if (options.numbers) pools.push(NUMBERS);
    if (options.symbols) pools.push(SYMBOLS);

    if (pools.length === 0) {
      toast.error("Please select at least one character type");
      return;
    }

    const charset = pools.join("");

    if (options.length < pools.length) {
      toast.error(`Length must be at least ${pools.length} to include every selected type`);
      return;
    }

    // One character from each selected pool first, so the result satisfies
    // sites that demand "at least one number, one symbol" and so on. The rest
    // is drawn from the full alphabet, then the whole thing is shuffled so the
    // guaranteed characters are not always in the same positions.
    const chars = pools.map((pool) => pool[randomIndex(pool.length)]);
    for (let i = pools.length; i < options.length; i++) {
      chars.push(charset[randomIndex(charset.length)]);
    }
    shuffleInPlace(chars);

    setPassword(chars.join(""));
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
      answer: "Every character comes from your browser's cryptographic random number generator (crypto.getRandomValues), with rejection sampling so no character is more likely than any other. What that buys you depends entirely on length and alphabet size, which is what the entropy figure shown next to the password measures.",
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
      article={passwordGeneratorArticle}
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
      <div className="max-w-5xl mx-auto space-y-8">
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
              <span
                className="text-sm text-muted-foreground"
                title="Entropy = length x log2(alphabet size). Each extra bit doubles the work of guessing it."
              >
                {Math.round(entropyBits)} bits of entropy
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
