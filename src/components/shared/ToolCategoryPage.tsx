import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toolCategories } from "@/components/layout/navbar/data";

type CategoryTitle = "Image" | "PDF" | "Text" | "Dev" | "Video" | "Utility";

interface ToolCategoryPageProps {
  categoryTitle: CategoryTitle;
  badgeLabel: string;
  heading: string;
  description: string;
  accentClassName: string;
}

export default function ToolCategoryPage({
  categoryTitle,
  badgeLabel,
  heading,
  description,
  accentClassName,
}: ToolCategoryPageProps) {
  const category = toolCategories.find((item) => item.title === categoryTitle);
  const tools = category?.tools ?? [];

  return (
    <section className="container mx-auto px-4 py-10 md:py-16">
      <header className="mb-8 space-y-3">
        <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm ${accentClassName}`}>
          {badgeLabel}
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{heading}</h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-xl border border-border bg-card p-5 transition hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold">{tool.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{tool.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2">
              Open tool <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
