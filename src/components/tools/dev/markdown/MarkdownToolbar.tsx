"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Link2,
  Image,
  Table,
  Minus,
  WrapText,
} from "lucide-react";

interface ToolbarAction {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  prefix: string;
  suffix?: string;
  block?: boolean;
}

const toolbarGroups: ToolbarAction[][] = [
  [
    { icon: Bold, label: "Bold", shortcut: "Ctrl+B", prefix: "**", suffix: "**" },
    { icon: Italic, label: "Italic", shortcut: "Ctrl+I", prefix: "*", suffix: "*" },
    { icon: Strikethrough, label: "Strikethrough", prefix: "~~", suffix: "~~" },
    { icon: Code, label: "Inline Code", prefix: "`", suffix: "`" },
  ],
  [
    { icon: Heading1, label: "Heading 1", prefix: "# ", block: true },
    { icon: Heading2, label: "Heading 2", prefix: "## ", block: true },
    { icon: Heading3, label: "Heading 3", prefix: "### ", block: true },
  ],
  [
    { icon: List, label: "Bullet List", prefix: "- ", block: true },
    { icon: ListOrdered, label: "Numbered List", prefix: "1. ", block: true },
    { icon: CheckSquare, label: "Task List", prefix: "- [ ] ", block: true },
  ],
  [
    { icon: Quote, label: "Blockquote", prefix: "> ", block: true },
    { icon: Link2, label: "Link", prefix: "[", suffix: "](url)" },
    { icon: Image, label: "Image", prefix: "![alt](", suffix: ")" },
    { icon: Minus, label: "Horizontal Rule", prefix: "\n---\n", block: true },
  ],
];

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownToolbar({ textareaRef, value, onChange }: MarkdownToolbarProps) {
  const insertMarkdown = (action: ToolbarAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    let newText: string;
    let cursorPos: number;

    if (action.block && !selected) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const before = value.substring(0, lineStart);
      const after = value.substring(start);
      newText = before + action.prefix + after;
      cursorPos = lineStart + action.prefix.length + (start - lineStart);
    } else if (action.suffix) {
      newText =
        value.substring(0, start) +
        action.prefix +
        (selected || "text") +
        action.suffix +
        value.substring(end);
      cursorPos = start + action.prefix.length + (selected || "text").length + action.suffix.length;
    } else {
      newText = value.substring(0, start) + action.prefix + value.substring(end);
      cursorPos = start + action.prefix.length;
    }

    onChange(newText);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const insertTable = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const table = `\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n`;
    const newText = value.substring(0, start) + table + value.substring(start);
    onChange(newText);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + table.length, start + table.length);
    });
  };

  const insertCodeBlock = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const block = `\n\`\`\`javascript\n${selected || "// your code here"}\n\`\`\`\n`;
    const newText = value.substring(0, start) + block + value.substring(end);
    onChange(newText);
    requestAnimationFrame(() => {
      textarea.focus();
    });
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 border-b border-border bg-muted/30">
        {toolbarGroups.map((group, gi) => (
          <div key={gi} className="contents">
            {gi > 0 && <Separator orientation="vertical" className="h-5 mx-1" />}
            {group.map((action) => (
              <Tooltip key={action.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => insertMarkdown(action)}
                  >
                    <action.icon className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {action.label}
                  {action.shortcut && (
                    <span className="ml-2 text-muted-foreground">{action.shortcut}</span>
                  )}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}

        <Separator orientation="vertical" className="h-5 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={insertTable}>
              <Table className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Insert Table
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={insertCodeBlock}>
              <WrapText className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Code Block
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
