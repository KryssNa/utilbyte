import ApiClient from "@/components/tools/dev/ApiClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Client Online Free - Send HTTP Requests & Test APIs",
  description:
    "Send HTTP requests to any API endpoint and inspect responses. Supports GET, POST, PUT, DELETE with custom headers, authentication, and body. A browser-based Postman alternative.",
  keywords: [
    "api client online",
    "http request tester",
    "rest api tester",
    "online postman",
    "send http request",
    "api testing tool",
    "rest client online",
    "http client browser",
    "api debugger",
    "web api tester",
  ],
  openGraph: {
    title: "API Client Online Free - Test APIs in Your Browser",
    description:
      "Send HTTP requests and inspect responses. Browser-based API testing with authentication, headers, and body support.",
    type: "website",
    locale: "en_US",
  },
  alternates: {
    canonical: "/dev-tools/api-client",
  },
};

export default function ApiClientPage() {
  return <ApiClient />;
}
