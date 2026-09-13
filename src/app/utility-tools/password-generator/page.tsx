import { createToolMetadata } from "@/lib/tool-metadata";
import PasswordGenerator from "@/components/tools/utility/PasswordGenerator";

export const metadata = createToolMetadata("/utility-tools/password-generator", {
  title: "Password Generator Online Free - Generate Strong Secure Passwords",
  description: "Generate random passwords in your browser with length and character options. Copy your selection and store it securely; do not reuse passwords across accounts.",
  keywords: [
    "password generator online free",
    "generate strong password",
    "secure password creator",
    "random password generator",
    "password strength checker",
    "wifi password generator",
    "account password maker",
    "secure password tool",
    "password complexity generator",
    "online password creator",
    "strong password generator",
    "password security tool"
  ],
});

export default function PasswordGeneratorPage() {
  return (
    <PasswordGenerator />

  );
}
