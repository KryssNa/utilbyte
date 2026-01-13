"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ToolCategory } from "./types";

interface NavDropdownProps {
  category: ToolCategory;
}

export function NavDropdown({ category }: NavDropdownProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update position based on mouse X
  const updatePosition = useCallback((mouseX?: number) => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = 320; // w-80 = 20rem = 320px

      let left: number;
      if (mouseX !== undefined) {
        // Center dropdown under mouse, but keep it within screen bounds
        left = mouseX - dropdownWidth / 2;
        // Clamp to screen edges with padding
        const minLeft = 16;
        const maxLeft = window.innerWidth - dropdownWidth - 16;
        left = Math.max(minLeft, Math.min(maxLeft, left));
      } else {
        left = rect.left;
      }

      setPosition({
        top: rect.bottom + 12,
        left,
      });
    }
  }, []);

  // Handle mouse move on trigger - update horizontal position
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isOpen) {
      updatePosition(e.clientX);
    }
  }, [isOpen, updatePosition]);

  // Handle mouse enter - set position first, then show
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Update position first with mouse X
    updatePosition(e.clientX);

    // Then show dropdown after a tiny delay to ensure position is set
    setIsOpen(true);
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, [updatePosition]);

  // Handle mouse leave
  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget;

    // Check if moving to trigger or content - only if relatedTarget is a Node
    const isMovingToTrigger = relatedTarget && triggerRef.current?.contains(relatedTarget as Node);
    const isMovingToContent = relatedTarget && contentRef.current?.contains(relatedTarget as Node);

    if (!isMovingToTrigger && !isMovingToContent) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        // Wait for animation to finish before unmounting
        setTimeout(() => setIsOpen(false), 200);
      }, 100);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update position on scroll (keep dropdown aligned with trigger)
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => updatePosition();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, updatePosition]);

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          isOpen && "text-foreground bg-muted/50"
        )}
      >
        <category.icon className={cn("h-4 w-4", category.color)} />
        <span>{category.title}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Content - Rendered via Portal */}
      {mounted && isOpen && createPortal(
        <div
          ref={contentRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            top: position.top,
            left: position.left,
            transformOrigin: "top center"
          }}
          className={cn(
            "fixed z-100",
            "transition-[opacity,transform] duration-300 ease-out",
            isVisible
              ? "opacity-100 visible scale-100"
              : "opacity-0 invisible scale-95 pointer-events-none"
          )}
        >
          <div
            className={cn(
              "w-80 rounded-2xl border border-white/10 shadow-2xl shadow-black/30 overflow-hidden",
              "transition-all duration-200",
              isVisible
                ? "bg-card/80 backdrop-blur-2xl"
                : "bg-card/60 backdrop-blur-none"
            )}
          >
            {/* Header with gradient */}
            <div className="relative px-4 py-4 border-b border-white/10">
              <div className={cn("absolute inset-0 opacity-20", category.bgColor)} />
              <div className="relative flex items-center gap-3">
                <div className={cn("p-2.5 rounded-xl border border-white/10", category.bgColor)}>
                  <category.icon className={cn("h-5 w-5", category.color)} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{category.title} Tools</p>
                  <p className="text-xs text-muted-foreground">{category.tools.length} powerful tools</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
              {category.tools.map((tool, index) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={cn(
                    "group/item flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer",
                    "hover:bg-white/5",
                    pathname === tool.href && "bg-primary/10 hover:bg-primary/15"
                  )}
                >
                  <div
                    className={cn(
                      "relative p-2.5 rounded-xl transition-all duration-200 group-hover/item:scale-110",
                      pathname === tool.href ? "bg-primary/20" : category.bgColor
                    )}
                  >
                    <category.icon
                      className={cn(
                        "h-4 w-4 transition-colors relative z-10",
                        pathname === tool.href ? "text-primary" : category.color
                      )}
                    />
                    {/* Glow effect */}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-xl blur-md opacity-0 group-hover/item:opacity-60 transition-opacity",
                        category.bgColor
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        pathname === tool.href ? "text-primary" : "text-foreground"
                      )}
                    >
                      {tool.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{tool.desc}</p>
                  </div>
                  <div className="opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform translate-x-1 group-hover/item:translate-x-0">
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <ChevronDown className="h-3 w-3 -rotate-90 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/10 bg-white/[0.02]">
              <Link
                href={category.href}
                className={cn(
                  "group/footer flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer",
                  "text-muted-foreground hover:text-foreground",
                  "bg-white/5 hover:bg-white/10"
                )}
              >
                Explore all {category.title.toLowerCase()} tools
                <ChevronDown className="h-3 w-3 -rotate-90 transition-transform group-hover/footer:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
