import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
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
    default: "UtilByte - Free Online Tools for Image, PDF, Text & Developer Work",
    template: "%s | UtilByte",
  },
  description:
    "Free online tools for image compression, PDF merging, text formatting, JSON validation, and more. No sign-up required. No uploads. Everything runs in your browser for complete privacy.",
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
    languages: {
      'en-US': 'https://utilbyte.app',
      'en-GB': 'https://utilbyte.app',
      'en-CA': 'https://utilbyte.app',
      'en-AU': 'https://utilbyte.app',
      'en-IN': 'https://utilbyte.app',
      'es-ES': 'https://utilbyte.app/es',
      'fr-FR': 'https://utilbyte.app/fr',
      'de-DE': 'https://utilbyte.app/de',
      'it-IT': 'https://utilbyte.app/it',
      'pt-BR': 'https://utilbyte.app/pt',
      'ja-JP': 'https://utilbyte.app/ja',
      'ko-KR': 'https://utilbyte.app/ko',
      'zh-CN': 'https://utilbyte.app/zh',
      'ru-RU': 'https://utilbyte.app/ru',
      'ar-SA': 'https://utilbyte.app/ar',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://utilbyte.app",
    title: "UtilByte - Free Online Tools for Everyday Work",
    description:
      "Free image, PDF, text & developer tools. No login. No uploads. 100% private.",
    siteName: "UtilByte",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UtilByte - Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UtilByte - Free Online Tools",
    description: "Free online tools that respect your privacy. No uploads, no tracking.",
    images: ["/images/og-image.jpg"],
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
    google: "your-google-site-verification-code",
  },
  // Advanced SEO for world-class ranking
  other: {
    "google-site-verification": "your-google-site-verification-code",
    "msvalidate.01": "your-bing-verification-code",
    "yandex-verification": "your-yandex-verification-code",
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <link rel="icon" type="image/svg+xml" href="/logo.svg?v=1" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico?v=1" />
      <link rel="apple-touch-icon" href="/logo.svg?v=1" />
      <link rel="shortcut icon" href="/favicon.ico?v=1" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#000000" />
      <meta name="google-adsense-account" content="ca-pub-4931770581801597" />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4931770581801597"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-5RLNPB28DW"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5RLNPB28DW');
        `}
      </Script>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
        <Analytics />

      </body>
    </html>
  );
}
