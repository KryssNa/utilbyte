import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Award, Shield } from "lucide-react";

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
  testimonials?: Testimonial[];
  stats?: {
    users: string;
    tools: string;
    satisfaction: string;
    uptime: string;
  };
}

export default function SocialProof({ testimonials, stats }: SocialProofProps) {
  const defaultTestimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      role: "Web Developer",
      company: "TechCorp",
      avatar: "SJ",
      rating: 5,
      review: "UtilByte tools are incredibly fast and secure. The image compressor reduced my file sizes by 80% without any quality loss. Perfect for web optimization!",
      tool: "Image Compressor"
    },
    {
      name: "Michael Chen",
      role: "Full Stack Developer",
      company: "StartupXYZ",
      avatar: "MC",
      rating: 5,
      review: "As a developer, I use the JSON formatter and Base64 tools daily. They're fast, accurate, and work perfectly in the browser. No downloads needed!",
      tool: "JSON Formatter"
    },
    {
      name: "Emily Rodriguez",
      role: "Content Manager",
      company: "MediaPro",
      avatar: "ER",
      rating: 5,
      review: "The PDF tools are a lifesaver! Merge, split, and compress PDFs instantly. The interface is intuitive and the results are perfect every time.",
      tool: "PDF Merger"
    },
    {
      name: "David Kim",
      role: "UX Designer",
      company: "DesignStudio",
      avatar: "DK",
      rating: 5,
      review: "Background removal and image optimization tools are game-changers for my workflow. Professional quality results in seconds!",
      tool: "Background Remover"
    },
    {
      name: "Lisa Thompson",
      role: "Marketing Manager",
      company: "BrandCo",
      avatar: "LT",
      rating: 5,
      review: "QR code generator and password tools are essential for our marketing campaigns. Secure, fast, and incredibly reliable.",
      tool: "QR Code Generator"
    },
    {
      name: "Alex Patel",
      role: "DevOps Engineer",
      company: "CloudTech",
      avatar: "AP",
      rating: 5,
      review: "Cron parser and timestamp converter are invaluable for server management. Accurate and easy to use for complex scheduling tasks.",
      tool: "Cron Parser"
    }
  ];

  const defaultStats = {
    users: "500K+",
    tools: "38",
    satisfaction: "4.9/5",
    uptime: "99.9%"
  };

  const displayTestimonials = testimonials || defaultTestimonials;
  const displayStats = stats || defaultStats;

  return (
    <section className="mt-16">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{displayStats.users}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{displayStats.tools}</div>
            <div className="text-sm text-muted-foreground">Free Tools</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{displayStats.satisfaction}</div>
            <div className="text-sm text-muted-foreground">User Rating</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{displayStats.uptime}</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Trusted by Developers Worldwide</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Join thousands of developers, designers, and professionals who rely on UtilByte tools daily.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayTestimonials.map((testimonial, index) => (
          <Card key={index} className="h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <blockquote className="text-sm mb-4 italic">
                "{testimonial.review}"
              </blockquote>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Used {testimonial.tool}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>100% Private</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>No Sign-up</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span>Free Forever</span>
          </div>
        </div>
      </div>
    </section>
  );
}
