"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  GripVertical,
} from "lucide-react";

interface PanelConfig {
  label: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

interface ResizableEditorProps {
  left: PanelConfig;
  right: PanelConfig;
  defaultSplit?: number;
  minPanelWidth?: number;
}

type ViewMode = "split" | "left" | "right";

export default function ResizableEditor({
  left,
  right,
  defaultSplit = 50,
  minPanelWidth = 20,
}: ResizableEditorProps) {
  const [split, setSplit] = useState(defaultSplit);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawPct = ((ev.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(100 - minPanelWidth, Math.max(minPanelWidth, rawPct));
      setSplit(clamped);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [minPanelWidth]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const onTouchMove = (ev: TouchEvent) => {
      if (!containerRef.current) return;
      const touch = ev.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const rawPct = ((touch.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(100 - minPanelWidth, Math.max(minPanelWidth, rawPct));
      setSplit(clamped);
    };

    const onTouchEnd = () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  }, [minPanelWidth]);

  const toggleLeft = () => setViewMode(v => v === "left" ? "split" : "left");
  const toggleRight = () => setViewMode(v => v === "right" ? "split" : "right");

  const leftVisible = viewMode === "split" || viewMode === "left";
  const rightVisible = viewMode === "split" || viewMode === "right";

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
          <button
            onClick={() => setViewMode("left")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
              viewMode === "left"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <PanelLeftOpen className="h-3.5 w-3.5" />
            Input only
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
              viewMode === "split"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <GripVertical className="h-3.5 w-3.5" />
            Split
          </button>
          <button
            onClick={() => setViewMode("right")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
              viewMode === "right"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
            Output only
          </button>
        </div>

        {viewMode === "split" && (
          <span className="text-xs text-muted-foreground">
            Drag the divider to resize panels
          </span>
        )}
      </div>

      {/* Panels */}
      <div
        ref={containerRef}
        className="relative flex gap-0 rounded-xl border border-border overflow-hidden bg-muted/20"
        style={{ minHeight: 420 }}
      >
        {/* Left panel */}
        {leftVisible && (
          <div
            className="flex flex-col overflow-hidden"
            style={{
              width: viewMode === "split" ? `${split}%` : "100%",
              minWidth: 0,
            }}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {left.label}
              </span>
              {left.actions && (
                <div className="flex items-center gap-1">{left.actions}</div>
              )}
            </div>
            <div className="flex-1 overflow-auto p-3">{left.children}</div>
          </div>
        )}

        {/* Resize handle */}
        {viewMode === "split" && (
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="group relative flex w-1.5 flex-col items-center justify-center bg-border hover:bg-sky-500/40 cursor-col-resize shrink-0 transition-colors duration-150 select-none"
            title="Drag to resize"
          >
            <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-80 transition-opacity">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-foreground" />
              ))}
            </div>
          </div>
        )}

        {/* Right panel */}
        {rightVisible && (
          <div
            className="flex flex-col overflow-hidden"
            style={{
              width: viewMode === "split" ? `${100 - split}%` : "100%",
              minWidth: 0,
            }}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {right.label}
              </span>
              {right.actions && (
                <div className="flex items-center gap-1">{right.actions}</div>
              )}
            </div>
            <div className="flex-1 overflow-auto p-3">{right.children}</div>
          </div>
        )}
      </div>
    </div>
  );
}
