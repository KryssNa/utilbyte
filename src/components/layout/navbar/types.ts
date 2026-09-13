import type { CatalogTool } from "@/lib/tool-catalog";
import { LucideIcon } from "lucide-react";

export type Tool = CatalogTool;

export interface ToolCategory {
  title: string;
  icon: LucideIcon;
  href: string;
  color: string;
  bgColor: string;
  hoverBg: string;
  tools: Tool[];
}

export interface FlattenedTool extends Tool {
  category: string;
  color: string;
  bgColor: string;
}

