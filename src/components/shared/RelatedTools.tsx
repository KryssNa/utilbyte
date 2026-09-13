import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RelatedTool {
  title: string;
  description: string;
  href: string;
  category: string;
}

interface RelatedToolsProps {
  currentTool: string;
  tools: RelatedTool[];
}

export default function RelatedTools({ currentTool, tools }: RelatedToolsProps) {
  return (
    <section className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Related Tools</h2>
        <p className="text-muted-foreground">
          Explore more tools that might be useful for your tasks
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {tool.category}
                  </Badge>
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    →
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {tool.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
