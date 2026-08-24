import { LucideIcon } from "lucide-react";

export interface Tool {
  title: string;
  href: string;
  desc: string;
}

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

