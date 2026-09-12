import { createToolMetadata } from "@/lib/tool-metadata";
import HashGenerator from "@/components/tools/dev/HashGenerator";

export const metadata = createToolMetadata("/dev-tools/hash-generator", {
  title: "Hash Generator Online Free - MD5 SHA-256 SHA-512 Hash Calculator",
  description: "Generate hashes from text in your browser with MD5 and SHA algorithms. Compare text digests; these fast hashes are not a password-storage system.",
  keywords: [
    "hash generator online free",
    "md5 hash generator",
    "sha256 hash generator",
    "sha512 hash generator",
    "cryptographic hash calculator",
    "password hash online",
    "file hash calculator",
    "md5 checksum",
    "sha256 checksum",
    "hash function online",
    "online hash tool",
    "generate hash from text"
  ],
});

export default function HashGeneratorPage() {
  return (
    <HashGenerator />

  );
}
