import { allTools } from "@/components/layout/navbar/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Github, ShieldCheck, UploadCloud, Wrench } from "lucide-react";
import Link from "next/link";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  review: string;
  tool: string;
}

interface SocialProofProps {
  /**
   * Real, attributable testimonials only. Left undefined the section is not
   * rendered — placeholder or invented reviews are a Google publisher-policy
   * risk and are not worth the conversion lift.
   */
  testimonials?: Testimonial[];
  stats?: {
    tools: string;
    uploads: string;
    signup: string;
    license: string;
  };
}

const GITHUB_URL = "https://github.com/KryssNa/utilbyte";

export default function SocialProof({ testimonials, stats }: SocialProofProps) {
  // Every figure below is verifiable from the sitemap, the source, or the LICENSE.
  const defaultStats = {
    tools: String(allTools.length),
    uploads: "0",
    signup: "None",
    license: "MIT",
  };

  const displayStats = stats || defaultStats;
  const hasTestimonials = Boolean(testimonials?.length);

  const facts = [
    {
      icon: Wrench,
      value: displayStats.tools,
      label: "Tools, all free",
    },
    {
      icon: UploadCloud,
      value: displayStats.uploads,
      label: "File uploads by local tools",
    },
    {
      icon: ShieldCheck,
      value: displayStats.signup,
      label: "Sign-up required",
    },
    {
      icon: Github,
      value: displayStats.license,
      label: "Licensed, source public",
    },
  ];

  return (
    <section className="mt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {facts.map(({ icon: Icon, value, label }) => (
          <Card key={label} className="text-center">
            <CardContent className="pt-6">
              <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">How UtilByte handles your files</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Image, PDF and video tools process selected files in your browser. Network
          tools send data to the services described on their pages. Site analytics
          and advertising are separate from tool processing.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="h-full">
          <CardContent className="pt-6">
            <Cpu className="h-6 w-6 mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Local file processing</h3>
            <p className="text-sm text-muted-foreground">
              Local file tools use your device to process files. Processing time depends
              on the file, the tool and your device. Some tools download an engine
              or language data before they can start.
            </p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="pt-6">
            <ShieldCheck className="h-6 w-6 mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Check each tool’s data choices</h3>
            <p className="text-sm text-muted-foreground">
              Read the processing disclosure before adding content. Network tools need
              a connection, and local tools may need one to load their processing
              resources. Offline availability varies by tool.
            </p>
            <Link href="/privacy" className="mt-3 inline-block text-sm text-primary underline underline-offset-4">
              Read how data is handled
            </Link>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="pt-6">
            <Github className="h-6 w-6 mb-3 text-primary" />
            <h3 className="font-semibold mb-2">You can read the code</h3>
            <p className="text-sm text-muted-foreground">
              The whole site is MIT-licensed and public. If you would rather not take a
              privacy claim on faith, check it, or run the project locally.
            </p>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline underline-offset-4 mt-3 inline-block"
            >
              View the source on GitHub
            </Link>
          </CardContent>
        </Card>
      </div>

      {hasTestimonials && (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials!.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="pt-6">
                <blockquote className="text-sm mb-4 italic">
                  &ldquo;{testimonial.review}&rdquo;
                </blockquote>
                <div className="font-semibold text-sm">{testimonial.name}</div>
                <div className="text-xs text-muted-foreground">
                  {testimonial.role} at {testimonial.company}
                </div>
                <Badge variant="secondary" className="text-xs mt-1">
                  Used {testimonial.tool}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
