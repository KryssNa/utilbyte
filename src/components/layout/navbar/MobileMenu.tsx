"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { toolCategories, allTools } from "./data";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allTools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:hidden border-b border-border bg-background overflow-hidden"
        >
          <div className="container mx-auto px-4 py-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-muted/50 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {filtered ? (
              <div className="max-h-[60vh] overflow-y-auto space-y-1">
                {filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No tools found</p>
                ) : (
                  filtered.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => { onClose(); setSearch(""); }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{tool.title}</p>
                        <p className="text-xs text-muted-foreground">{tool.desc}</p>
                      </div>
                      <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full", tool.bgColor, tool.color)}>
                        {tool.category}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto space-y-1.5">
                {toolCategories.map((category) => (
                  <div key={category.title} className="rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() =>
                        setExpandedCategory(expandedCategory === category.title ? null : category.title)
                      }
                      className="flex w-full items-center justify-between p-3 text-left font-medium hover:bg-muted transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className={cn("p-1.5 rounded-lg", category.bgColor)}>
                          <category.icon className={cn("h-4 w-4", category.color)} />
                        </div>
                        <span className="text-sm">{category.title}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">{category.tools.length}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          expandedCategory === category.title && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedCategory === category.title && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.15 }}
                          className="border-t border-border bg-muted/20"
                        >
                          {category.tools.map((tool) => (
                            <Link
                              key={tool.href}
                              href={tool.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors cursor-pointer",
                                pathname === tool.href && "bg-muted font-medium text-primary"
                              )}
                            >
                              <span>{tool.title}</span>
                              <span className="text-xs text-muted-foreground">{tool.desc}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
