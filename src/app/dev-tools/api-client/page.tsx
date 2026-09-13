import { createToolMetadata } from "@/lib/tool-metadata";

import ApiClient from "@/components/tools/dev/ApiClient";

export const metadata = createToolMetadata("/dev-tools/api-client", {
  title: "API Client Online Free - Send HTTP Requests & Test APIs",
  description: "Send HTTP requests with custom headers and bodies through UtilByte’s server proxy. Inspect responses from permitted destinations; requests are not processed only in your browser.",
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
});

export default function ApiClientPage() {
  return <ApiClient />;
}
