import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Code2, FileText, Image, Video, Wrench } from "lucide-react";
import Link from "next/link";

interface ClusterTopic {
  title: string;
  description: string;
  href: string;
  type: 'guide' | 'tutorial' | 'comparison' | 'tool';
  category: string;
}

interface ContentClusterProps {
  category: string;
  title: string;
  description: string;
  topics: ClusterTopic[];
  mainTool?: {
    title: string;
    href: string;
    description: string;
  };
}

export default function ContentCluster({ category, title, description, topics, mainTool }: ContentClusterProps) {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'image': return Image;
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'text': return BookOpen;
      case 'dev': return Code2;
      case 'utility': return Wrench;
      default: return Wrench;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'image': return 'text-violet-600';
      case 'pdf': return 'text-rose-600';
      case 'video': return 'text-purple-600';
      case 'text': return 'text-emerald-600';
      case 'dev': return 'text-amber-600';
      case 'utility': return 'text-cyan-600';
      default: return 'text-gray-600';
    }
  };

  const CategoryIcon = getCategoryIcon(category);

  return (
    <section className="mt-16 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-8 border">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <CategoryIcon className={`h-6 w-6 ${getCategoryColor(category)}`} />
          <Badge variant="secondary" className="text-sm">
            {category.charAt(0).toUpperCase() + category.slice(1)} Tools
          </Badge>
        </div>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {mainTool && (
        <div className="mb-8">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-primary">Featured Tool</Badge>
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">
                <Link href={mainTool.href} className="hover:text-primary transition-colors">
                  {mainTool.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {mainTool.description}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic, index) => (
          <Link key={topic.href} href={topic.href}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {topic.type.charAt(0).toUpperCase() + topic.type.slice(1)}
                  </Badge>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm line-clamp-3">
                  {topic.description}
                </CardDescription>
                <div className="mt-3 text-xs text-muted-foreground">
                  {topic.category}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
