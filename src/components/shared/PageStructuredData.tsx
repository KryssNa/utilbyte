export default function PageStructuredData({ route, name, description, type = "WebPage" }: {
  route: string; name: string; description: string; type?: "WebPage" | "AboutPage" | "ContactPage";
}) {
  const url = `https://utilbyte.app${route}`;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org", "@type": type, "@id": `${url}#webpage`,
    url, name, description, inLanguage: "en",
    isPartOf: { "@id": "https://utilbyte.app/#website" },
    publisher: { "@id": "https://utilbyte.app/#organization" },
  }).replace(/</g, "\\u003c") }} />;
}
