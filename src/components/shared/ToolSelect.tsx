"use client";

import { useId } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ToolSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly { value: string; label: string; description?: string }[];
  className?: string;
}

/** Compact settings control with a readable, keyboard-accessible option list. */
export default function ToolSelect({ label, value, onValueChange, options, className }: ToolSelectProps) {
  const id = useId();
  return <div className={cn("grid min-w-0 gap-1.5", className)}>
    <label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} aria-label={label} className="tool-select-trigger h-11 gap-3 rounded-xl border-border/80 bg-card px-3.5 text-sm font-medium shadow-sm transition-colors hover:border-primary/40 hover:bg-muted/50 focus:ring-0 focus-visible:ring-2 focus-visible:ring-primary/40 data-[state=open]:border-primary/50 data-[state=open]:bg-muted/50 [&>svg]:shrink-0 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180">
        <SelectValue>{options.find(option => option.value === value)?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start" sideOffset={6} collisionPadding={12} className="z-[80] max-h-[min(320px,var(--radix-select-content-available-height))] min-w-[220px] max-w-[calc(100vw-1.5rem)] rounded-xl border-border/80 bg-popover p-1 shadow-xl data-[side=bottom]:translate-y-0 data-[side=top]:translate-y-0">
        {options.map(option => <SelectItem key={option.value} value={option.value} textValue={option.label} className="tool-select-option min-h-11 cursor-pointer rounded-lg py-2.5 pl-3 pr-9 focus:bg-muted focus:text-foreground focus-visible:shadow-none data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary [&>span:first-child]:right-3">
          <span className="block text-sm font-medium">{option.label}</span>
          {option.description && <span className="mt-0.5 block text-xs font-normal leading-relaxed text-muted-foreground">{option.description}</span>}
        </SelectItem>)}
      </SelectContent>
    </Select>
  </div>;
}
