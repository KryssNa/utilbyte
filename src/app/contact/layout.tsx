import PageStructuredData from "@/components/shared/PageStructuredData";
import { withPageMetadata } from "@/lib/page-metadata";
import { Metadata } from "next";

export const metadata: Metadata = withPageMetadata("/contact", {
  title: "Contact Us",
  description: "Get in touch with the UtilByte team. We're here to help with questions, feedback, and support for our free online tools.",
  keywords: "contact utilbyte, support, help, feedback, get in touch",
  openGraph: {
    title: "Contact Us | UtilByte",
    description: "Get in touch with the UtilByte team for questions, feedback, and support.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | UtilByte",
    description: "Get in touch with the UtilByte team for questions, feedback, and support.",
  },
  alternates: {
    canonical: "/contact",
  },
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <><PageStructuredData route="/contact" name="Contact Us" description={metadata.description!} type="ContactPage" />{children}</>;
}
