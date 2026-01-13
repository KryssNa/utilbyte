"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { allTools } from "./data";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Filter tools based on search
  const filteredTools = searchQuery
    ? allTools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : allTools.slice(0, 8);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle close and reset
  const handleClose = useCallback(() => {
    onClose();
    setSearchQuery("");
  }, [onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        handleClose();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredTools.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter" && filteredTools[selectedIndex]) {
        e.preventDefault();
        router.push(filteredTools[selectedIndex].href);
        handleClose();
      }
    },
    [isOpen, filteredTools, selectedIndex, router, handleClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-100 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 top-[10%] z-101 w-full max-w-2xl -translate-x-1/2 px-4"
          >
            {/* Animated border wrapper */}
            <div className="relative rounded-2xl p-[1px] overflow-hidden">
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-60"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--primary), var(--accent), var(--primary), transparent)",
                  backgroundSize: "200% 100%",
                }}
                animate={{
                  backgroundPosition: ["0% center", "200% center"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Modal content */}
              <div className="relative rounded-2xl border border-white/10 bg-card/95 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                {/* Search Input */}
                <div className="relative flex items-center gap-4 border-b border-white/[0.08] px-5 py-5">
                  <motion.div
                    className="p-2.5 rounded-xl bg-primary/15 border border-primary/20"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Search className="h-5 w-5 text-primary" />
                  </motion.div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for any tool..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-muted-foreground/60"
                  />
                  <kbd className="flex h-7 items-center rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 font-mono text-xs text-muted-foreground">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto p-3 custom-scrollbar">
                  {filteredTools.length === 0 ? (
                    <div className="px-4 py-16 text-center">
                      <motion.div
                        className="mx-auto w-16 h-16 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-5"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Search className="h-7 w-7 text-muted-foreground" />
                      </motion.div>
                      <p className="text-base font-medium text-foreground mb-2">No results found</p>
                      <p className="text-sm text-muted-foreground">
                        Try &quot;compress&quot;, &quot;convert&quot;, or &quot;generator&quot;
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {!searchQuery && (
                        <div className="flex items-center gap-3 px-3 py-2">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Popular Tools</span>
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                        </div>
                      )}
                      {filteredTools.map((tool, index) => (
                        <motion.button
                          key={tool.href}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.025 }}
                          onClick={() => {
                            router.push(tool.href);
                            handleClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={cn(
                            "group flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-200",
                            selectedIndex === index
                              ? "bg-primary/10 ring-1 ring-primary/30"
                              : "hover:bg-white/[0.05]"
                          )}
                        >
                          <div className="relative">
                            <div className={cn(
                              "p-3 rounded-xl transition-all duration-200 group-hover:scale-110",
                              tool.bgColor
                            )}>
                              <div className={cn("h-5 w-5 flex items-center justify-center text-sm font-bold", tool.color)}>
                                {tool.category[0]}
                              </div>
                            </div>
                            {/* Glow effect */}
                            <div className={cn(
                              "absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity",
                              tool.bgColor
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-semibold truncate transition-colors",
                              selectedIndex === index ? "text-primary" : "text-foreground"
                            )}>
                              {tool.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{tool.desc}</p>
                          </div>
                          <span className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all duration-200",
                            selectedIndex === index
                              ? "bg-primary/15 text-primary"
                              : "bg-white/[0.05] text-muted-foreground"
                          )}>
                            {tool.category}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/[0.08] bg-white/[0.02] px-5 py-3.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-5">
                    <span className="flex items-center gap-2">
                      <kbd className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-2.5 py-1 font-mono text-[10px]">↑↓</kbd>
                      <span className="text-muted-foreground/80">navigate</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <kbd className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-2.5 py-1 font-mono text-[10px]">↵</kbd>
                      <span className="text-muted-foreground/80">select</span>
                    </span>
                  </div>
                  <span className="font-medium text-muted-foreground/80">
                    {filteredTools.length} tool{filteredTools.length !== 1 && "s"} available
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

