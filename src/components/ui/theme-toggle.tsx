"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("h-9 w-9 rounded-lg bg-white/5", className)} />
    );
  }

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-lg",
        "border border-border bg-muted/50 hover:bg-muted",
        "transition-colors duration-200",
        className
      )}
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.15 }}
        >
          {theme === "dark" && <Moon className="h-4 w-4" />}
          {theme === "light" && <Sun className="h-4 w-4" />}
          {theme === "system" && <Monitor className="h-4 w-4" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export function ThemeToggleExpanded({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("h-9 rounded-lg bg-white/5 w-28", className)} />
    );
  }

  const themes = [
    { key: "light", icon: Sun, label: "Light" },
    { key: "dark", icon: Moon, label: "Dark" },
    { key: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-muted/50 p-1",
        className
      )}
    >
      {themes.map(({ key, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={cn(
            "relative flex h-7 w-7 items-center justify-center rounded-md transition-colors",
            theme === key
              ? "bg-background text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={`Set theme to ${key}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {theme === key && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 rounded-md bg-background shadow-sm"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

