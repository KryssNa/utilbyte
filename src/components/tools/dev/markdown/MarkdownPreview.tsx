"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { FileText } from "lucide-react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export default function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const components = useMemo(
    () => ({
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0 pb-2 border-b border-border">
          {children}
        </h1>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-xl font-semibold mb-3 mt-5 pb-1.5 border-b border-border/50">
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>
      ),
      h4: ({ children }: { children?: React.ReactNode }) => (
        <h4 className="text-base font-medium mb-2 mt-3">{children}</h4>
      ),
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-4 leading-relaxed">{children}</p>
      ),
      ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>
      ),
      ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>
      ),
      li: ({ children }: { children?: React.ReactNode }) => (
        <li className="leading-relaxed">{children}</li>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4 py-1">
          {children}
        </blockquote>
      ),
      code: ({ className: codeClassName, children }: { className?: string; children?: React.ReactNode }) => {
        const isLanguage = /language-(\w+)/.test(codeClassName || "");
        return isLanguage ? (
          <code className={codeClassName}>{children}</code>
        ) : (
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-rose-500 dark:text-rose-400">
            {children}
          </code>
        );
      },
      pre: ({ children }: { children?: React.ReactNode }) => (
        <pre className="bg-[#0d1117] text-gray-300 p-4 rounded-lg overflow-x-auto my-4 text-sm border border-border/50">
          {children}
        </pre>
      ),
      table: ({ children }: { children?: React.ReactNode }) => (
        <div className="overflow-x-auto my-4 rounded-lg border border-border">
          <table className="min-w-full border-collapse">{children}</table>
        </div>
      ),
      thead: ({ children }: { children?: React.ReactNode }) => (
        <thead className="bg-muted/50">{children}</thead>
      ),
      th: ({ children }: { children?: React.ReactNode }) => (
        <th className="border-b border-border px-4 py-2.5 text-left font-semibold text-sm">
          {children}
        </th>
      ),
      td: ({ children }: { children?: React.ReactNode }) => (
        <td className="border-b border-border/50 px-4 py-2.5 text-sm">{children}</td>
      ),
      a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          {children}
        </a>
      ),
      img: ({ src, alt }: { src?: string; alt?: string }) => (
        <img
          src={src}
          alt={alt || ""}
          className="rounded-lg max-w-full h-auto my-4 border border-border"
          loading="lazy"
        />
      ),
      hr: () => <hr className="my-6 border-border" />,
      input: ({ type, checked, ...rest }: { type?: string; checked?: boolean }) => {
        if (type === "checkbox") {
          return (
            <input
              type="checkbox"
              checked={checked}
              readOnly
              className="mr-2 rounded accent-primary"
              {...rest}
            />
          );
        }
        return <input type={type} {...rest} />;
      },
    }),
    []
  );

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground min-h-[300px]">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">Start typing to see the live preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components as Record<string, React.ComponentType>}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
