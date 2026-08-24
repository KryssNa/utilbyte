"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { KeyValuePair, createPair } from "./types";

interface KeyValueEditorProps {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export default function KeyValueEditor({
  pairs,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
}: KeyValueEditorProps) {
  const updatePair = (id: string, field: "key" | "value" | "enabled", val: string | boolean) => {
    onChange(pairs.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  const removePair = (id: string) => {
    const updated = pairs.filter((p) => p.id !== id);
    onChange(updated.length === 0 ? [createPair()] : updated);
  };

  const addPair = () => {
    onChange([...pairs, createPair()]);
  };

  return (
    <div className="space-y-1.5">
      {pairs.map((pair) => (
        <div key={pair.id} className="flex items-center gap-1.5">
          <button
            onClick={() => updatePair(pair.id, "enabled", !pair.enabled)}
            className={cn(
              "w-5 h-5 rounded border shrink-0 flex items-center justify-center text-[10px] transition-colors cursor-pointer",
              pair.enabled
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-500"
                : "border-border bg-muted/30 text-muted-foreground"
            )}
          >
            {pair.enabled && "✓"}
          </button>
          <input
            type="text"
            value={pair.key}
            onChange={(e) => updatePair(pair.id, "key", e.target.value)}
            placeholder={keyPlaceholder}
            className="flex-1 h-8 px-2 rounded-md border border-border bg-background text-xs font-mono outline-none focus:border-primary/50"
          />
          <input
            type="text"
            value={pair.value}
            onChange={(e) => updatePair(pair.id, "value", e.target.value)}
            placeholder={valuePlaceholder}
            className="flex-1 h-8 px-2 rounded-md border border-border bg-background text-xs font-mono outline-none focus:border-primary/50"
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 shrink-0"
            onClick={() => removePair(pair.id)}
          >
            <Trash2 className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs gap-1.5 text-muted-foreground"
        onClick={addPair}
      >
        <Plus className="h-3 w-3" />
        Add
      </Button>
    </div>
  );
}
