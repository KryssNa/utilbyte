import { Cookie, Database, Eye, Lock, Mail, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | UtilByte",
  description: "Learn about how UtilByte protects your privacy and handles your data. We believe in transparency and user control.",
  keywords: "privacy policy, data protection, user privacy, UtilByte privacy",
  openGraph: {
    title: "Privacy Policy | UtilByte",
    description: "Learn about how UtilByte protects your privacy and handles your data.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | UtilByte",
    description: "Learn about how UtilByte protects your privacy and handles your data.",
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-transparent to-violet-50/30 dark:to-violet-950/10">
        <div className="container mx-auto px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 mb-6">
              <Shield className="h-4 w-4" />
              Privacy First
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Your privacy is our top priority. This policy explains how we collect, use, and protect your information.
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
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                <Eye className="h-6 w-6 text-violet-500" />
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At UtilByte, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using UtilByte, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                <Database className="h-6 w-6 text-violet-500" />
                Information We Collect
              </h2>

              <h3 className="font-semibold text-lg text-foreground mb-4">Information You Provide</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Files you upload for processing (images, PDFs, documents)</li>
                <li>Usage data and preferences</li>
                <li>Feedback and support requests</li>
              </ul>

              <h3 className="font-semibold text-lg text-foreground mb-4">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>IP address and geolocation data</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Usage patterns and analytics data</li>
                <li>Cookies and similar technologies</li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Cookie className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200">Cookies</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      We use cookies for analytics, functionality, and to improve your experience.
                      You can control cookie preferences through your browser settings.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-12">
              <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                <Lock className="h-6 w-6 text-violet-500" />
                How We Use Your Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-foreground">Service Provision</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>To provide and maintain our services</li>
                    <li>To process your files and generate results</li>
                    <li>To improve service performance</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-foreground">Analytics & Improvement</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>To analyze usage patterns</li>
                    <li>To improve user experience</li>
                    <li>To develop new features</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Processing Location */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Data Processing & Location
              </h2>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                      Client-Side Processing Only
                    </h3>
                    <p className="text-emerald-700 dark:text-emerald-300 mb-4">
                      All file processing happens in your browser. Your files never leave your device or get uploaded to our servers.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 text-sm">
                      <div>
                        <strong className="text-emerald-800 dark:text-emerald-200">Data Location:</strong>
                        <p className="text-emerald-700 dark:text-emerald-300">Your device only</p>
                      </div>
                      <div>
                        <strong className="text-emerald-800 dark:text-emerald-200">Processing:</strong>
                        <p className="text-emerald-700 dark:text-emerald-300">Browser-based</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Data Sharing & Third Parties
              </h2>

              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 font-semibold mb-2">We Do NOT Share Your Data</p>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    We do not sell, trade, or share your personal information with third parties for marketing purposes.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">Analytics Services</h3>
                  <p className="text-muted-foreground mb-4">
                    We use Google Analytics to understand how our website is used. This helps us improve our services.
                    Google Analytics may collect information about your use of our website.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For more information about how Google Analytics collects and processes data, please visit
                    <a href="https://policies.google.com/privacy" className="text-violet-600 hover:text-violet-700 ml-1">
                      Google's Privacy Policy
                    </a>.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Data Security
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Security Measures</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>HTTPS encryption for all connections</li>
                    <li>Client-side processing only</li>
                    <li>No data storage on our servers</li>
                    <li>Regular security updates</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Your Responsibility</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>Use strong passwords</li>
                    <li>Keep your browser updated</li>
                    <li>Be cautious with file uploads</li>
                    <li>Report security concerns</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Your Rights
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Access & Control</h3>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your data</li>
                    <li>Object to processing</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Additional Rights</h3>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li>Data portability</li>
                    <li>Withdraw consent</li>
                    <li>Lodge complaints</li>
                    <li>Opt-out of analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                <Mail className="h-6 w-6 text-violet-500" />
                Contact Us
              </h2>

              <p className="text-muted-foreground mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>

              <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-lg p-6">
                <div className="space-y-3">
                  <p className="text-violet-800 dark:text-violet-200">
                    <strong>Email:</strong> privacy@utilbyte.app
                  </p>
                  <p className="text-violet-800 dark:text-violet-200">
                    <strong>Response Time:</strong> We aim to respond within 48 hours
                  </p>
                  <p className="text-violet-800 dark:text-violet-200">
                    <strong>Updates:</strong> We will notify users of significant policy changes
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                Changes to This Policy
              </h2>

              <p className="text-muted-foreground mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending an email notification (if applicable)</li>
              </ul>

              <p className="text-muted-foreground">
                We recommend checking this page periodically for any changes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
