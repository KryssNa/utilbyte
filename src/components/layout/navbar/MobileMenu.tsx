"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toolCategories } from "./data";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const pathname = usePathname();

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
          <div className="container mx-auto px-4 py-4 space-y-2">
            {toolCategories.map((category) => (
              <div key={category.title} className="rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedCategory(expandedCategory === category.title ? null : category.title)
                  }
                  className="flex w-full items-center justify-between p-3 text-left font-medium hover:bg-muted transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", category.bgColor)}>
                      <category.icon className={cn("h-4 w-4", category.color)} />
                    </div>
                    {category.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
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
                      className="border-t border-border bg-muted/30"
                    >
                      {category.tools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={onClose}
                          className={cn(
                            "block px-4 py-2.5 text-sm hover:bg-muted transition-colors cursor-pointer",
                            pathname === tool.href && "bg-muted font-medium"
                          )}
                        >
                          {tool.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

