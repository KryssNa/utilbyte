import { AlertTriangle, FileText, Heart, Scale, Shield, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | UtilByte",
  description: "Read UtilByte's terms of service and usage guidelines. Understand your rights and responsibilities when using our tools.",
  keywords: "terms of service, terms and conditions, user agreement, UtilByte terms",
  openGraph: {
    title: "Terms of Service | UtilByte",
    description: "Read UtilByte's terms of service and usage guidelines.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | UtilByte",
    description: "Read UtilByte's terms of service and usage guidelines.",
  },
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-transparent to-violet-50/30 dark:to-violet-950/10">
        <div className="container mx-auto px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 mb-6">
              <Scale className="h-4 w-4" />
              Terms of Service
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Please read these terms carefully before using UtilByte. By using our services, you agree to these terms.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Acceptance of Terms */}
            <section className="mb-12">
              <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                <FileText className="h-6 w-6 text-violet-500" />
                Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Welcome to UtilByte! These Terms of Service ("Terms") govern your use of our website, services, and tools.
                By accessing or using UtilByte, you agree to be bound by these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If you do not agree to these Terms, please do not use our services.
              </p>
            </section>

            {/* Description of Service */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Description of Service
              </h2>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">What We Offer</h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  UtilByte provides free online tools for processing images, PDFs, text, and other files.
                  All processing happens in your browser - your files never leave your device.
                </p>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Image processing (crop, compress, convert)</li>
                    <li>• PDF manipulation (merge, split, convert)</li>
                    <li>• Text processing tools</li>
                  </ul>
                  <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Developer utilities</li>
                    <li>• Unit converters</li>
                    <li>• Code formatters</li>
                  </ul>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Privacy by Design</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                      All file processing occurs locally in your browser. We never upload or store your files on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="mb-12">
              <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                <Users className="h-6 w-6 text-violet-500" />
                User Responsibilities
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">Acceptable Use</h3>
                  <p className="text-muted-foreground mb-4">You agree to use UtilByte only for lawful purposes and in accordance with these Terms.</p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">✅ Allowed</h4>
                      <ul className="text-muted-foreground text-sm space-y-1">
                        <li>• Personal and business use</li>
                        <li>• Educational purposes</li>
                        <li>• Non-commercial projects</li>
                        <li>• File processing and conversion</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">❌ Not Allowed</h4>
                      <ul className="text-muted-foreground text-sm space-y-1">
                        <li>• Illegal activities</li>
                        <li>• Copyright infringement</li>
                        <li>• Harmful content</li>
                        <li>• System abuse</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">Content Guidelines</h3>
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-800 dark:text-amber-200">Prohibited Content</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 mb-2">
                          You must not upload or process content that is:
                        </p>
                        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 ml-4">
                          <li>• Illegal, harmful, or offensive</li>
                          <li>• Copyrighted without permission</li>
                          <li>• Contains malware or viruses</li>
                          <li>• Violates privacy rights</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Intellectual Property
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">Our Rights</h3>
                  <p className="text-muted-foreground mb-4">
                    UtilByte and its original content, features, and functionality are owned by us and are protected by copyright,
                    trademark, and other intellectual property laws.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>The UtilByte name, logo, and branding are our trademarks</li>
                    <li>Website design, code, and user interface are protected</li>
                    <li>Documentation and help content are our intellectual property</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">Your Content</h3>
                  <p className="text-muted-foreground mb-4">
                    When you upload files to UtilByte, you retain ownership of your content. However:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>You grant us a limited license to process your files</li>
                    <li>We do not claim ownership of your uploaded content</li>
                    <li>You are responsible for ensuring you have rights to process the content</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Service Availability
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">Free Service Limitations</h3>
                  <p className="text-muted-foreground mb-4">
                    UtilByte is provided free of charge, but we reserve the right to modify or discontinue services at any time.
                  </p>

                  <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-lg p-4">
                    <h4 className="font-semibold text-violet-800 dark:text-violet-200 mb-2">Service Level Expectations</h4>
                    <ul className="text-violet-700 dark:text-violet-300 text-sm space-y-1">
                      <li>• Best-effort service availability</li>
                      <li>• No guaranteed uptime SLA</li>
                      <li>• Potential service interruptions for maintenance</li>
                      <li>• Features may change or be removed</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">Technical Requirements</h3>
                  <p className="text-muted-foreground">
                    To use UtilByte effectively, you need:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                    <li>A modern web browser with JavaScript enabled</li>
                    <li>Stable internet connection for loading the website</li>
                    <li>Sufficient device resources for file processing</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Limitation of Liability
              </h2>

              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                      Important Legal Notice
                    </h3>
                    <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                      UtilByte is provided "as is" without warranties of any kind. We are not liable for damages arising from your use of our service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Disclaimers</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>We do not guarantee the accuracy or reliability of processing results</li>
                  <li>We are not responsible for data loss or corruption during processing</li>
                  <li>We disclaim all warranties, express or implied</li>
                  <li>Service interruptions may occur without notice</li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Termination
              </h2>

              <p className="text-muted-foreground mb-4">
                We reserve the right to terminate or suspend your access to UtilByte immediately, without prior notice or liability,
                for any reason whatsoever, including without limitation if you breach these Terms.
              </p>

              <p className="text-muted-foreground">
                Upon termination, your right to use the service will cease immediately.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Governing Law
              </h2>

              <p className="text-muted-foreground mb-4">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which UtilByte operates,
                without regard to conflict of law provisions.
              </p>

              <p className="text-muted-foreground">
                Any disputes arising from these Terms or your use of UtilByte will be resolved through binding arbitration
                or the courts of competent jurisdiction.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Changes to Terms
              </h2>

              <p className="text-muted-foreground mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material,
                we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <p className="text-muted-foreground mb-4">
                What constitutes a material change will be determined at our sole discretion.
              </p>

              <p className="text-muted-foreground">
                By continuing to access or use our service after those revisions become effective,
                you agree to be bound by the revised terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Contact Information
              </h2>

              <p className="text-muted-foreground mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>

              <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-lg p-6">
                <div className="space-y-3">
                  <p className="text-violet-800 dark:text-violet-200">
                    <strong>Email:</strong> legal@utilbyte.app
                  </p>
                  <p className="text-violet-800 dark:text-violet-200">
                    <strong>Subject:</strong> Terms of Service Inquiry
                  </p>
                  <p className="text-violet-800 dark:text-violet-200">
                    <strong>Response Time:</strong> We aim to respond within 7 business days
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  These terms are designed to protect both users and UtilByte while ensuring fair and transparent service usage.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
