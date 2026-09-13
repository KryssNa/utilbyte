import { SOCIAL_CARD } from "@/lib/social-card";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import { NavigationSafety } from "@/components/shared/NavigationSafety";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UtilByte - Free Online Tools for Images, PDFs & Developers",
    template: "%s | UtilByte",
  },
  description:
    "Free image, PDF, text and developer tools. No sign-up. Local file processing and clearly labeled network tools, with data-handling details on each tool.",
  keywords: [
    "free online tools",
    "image compressor",
    "pdf merger",
    "word counter",
    "json formatter",
    "base64 encoder",
    "qr code generator",
    "password generator",
    "online utilities",
    "privacy first tools",
    "no upload tools",
    "browser based tools",
    "free image tools",
    "free pdf tools",
    "free developer tools"
  ],
  authors: [{ name: "UtilByte" }],
  creator: "UtilByte",
  publisher: "UtilByte",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://utilbyte.app"),
  alternates: {
    canonical: "https://utilbyte.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://utilbyte.app",
    title: "UtilByte - Free Online Tools for Everyday Work",
    description:
      "Free image, PDF, text and developer tools. No sign-up. Local file processing and clearly labeled network tools, with data-handling details on each tool.",
    siteName: "UtilByte",
    images: [SOCIAL_CARD],
  },
  twitter: {
    card: "summary_large_image",
    title: "UtilByte - Free Online Tools",
    description: "Free image, PDF, text and developer tools. No sign-up. Local file processing and clearly labeled network tools, with data-handling details on each tool.",
    images: [SOCIAL_CARD],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "8OcRIrEyD5iBYI160jUjGdviKx59wPO8mG9MGzQxLN0",
  },
  other: {
    // Performance and SEO hints
    "format-detection": "telephone=no",
    "theme-color": "#000000",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "application-name": "UtilByte",
    "msapplication-TileColor": "#000000",
    // Advanced accessibility and performance
    "dns-prefetch": "//fonts.googleapis.com",
    "preconnect": "//fonts.gstatic.com",
    "referrer": "strict-origin-when-cross-origin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="UtilByte AI tool directory" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo_small.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <meta name="google-adsense-account" content="ca-pub-4931770581801597" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@graph": [
            { "@type": "WebSite", "@id": "https://utilbyte.app/#website", url: "https://utilbyte.app", name: "UtilByte", inLanguage: "en", publisher: { "@id": "https://utilbyte.app/#organization" } },
            { "@type": "Organization", "@id": "https://utilbyte.app/#organization", name: "UtilByte", url: "https://utilbyte.app", logo: "https://utilbyte.app/logo.svg", sameAs: ["https://github.com/KryssNa/utilbyte"] },
          ],
        }) }} />
        <Script src="/tool-preferences.js" strategy="beforeInteractive" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4931770581801597"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:ring-2 focus:ring-primary">Skip to content</a>
          <NavigationSafety>
          <Navbar />
          <WorkspaceLayout>
          <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">{children}</main>
          <Footer />
          </WorkspaceLayout>
          </NavigationSafety>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
