import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | UtilByte",
  description: "Get in touch with the UtilByte team. We're here to help with questions, feedback, and support for our free online tools.",
  keywords: "contact utilbyte, support, help, feedback, get in touch",
  openGraph: {
    title: "Contact Us | UtilByte",
    description: "Get in touch with the UtilByte team for questions, feedback, and support.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
