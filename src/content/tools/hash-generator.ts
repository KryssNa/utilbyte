import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const hashGeneratorArticle: ToolArticleContent = {
  intro: [
    "A hash turns any input into a fixed-length fingerprint. The same input always gives the same output, a one-character change gives a completely different one, and you cannot work backwards from the output to the input.",
    "This computes MD5, SHA-1, SHA-256, SHA-384 and SHA-512. Two of those are broken, which is the most useful thing this page can tell you.",
  ],
  sections: [
    {
      heading: "MD5 and SHA-1 are broken, and what that actually means",
      body: [
        "Broken here means collisions: two different inputs producing the same hash. For MD5 that has been practical since 2004 and is now trivial - collisions can be generated on a laptop in seconds. SHA-1 fell in 2017, when a real collision between two distinct PDF files was demonstrated, and the cost has dropped a great deal since.",
        "What it does not mean is that they are reversible. You still cannot recover the input from the output. The failure is specifically that an attacker can construct a second input matching a hash they choose.",
        "So the dividing line is whether an adversary is involved. Verifying that a file downloaded intact, deduplicating files, or keying a cache are all fine with MD5 - nobody is trying to fool you, and MD5 is fast. Signing anything, verifying a download's authenticity, or anything where forgery would matter needs SHA-256 or better.",
        "They remain in this tool because legacy systems still emit MD5 checksums and you sometimes need to match one.",
      ],
      bullets: [
        "MD5 - checksums and deduplication only. Collisions are trivial.",
        "SHA-1 - legacy compatibility only. Collisions are demonstrated and affordable.",
        "SHA-256 - the sensible default for anything security-relevant.",
        "SHA-384 / SHA-512 - longer output, and often faster than SHA-256 on 64-bit hardware.",
      ],
    },
    {
      heading: "Hashing is not password storage",
      body: [
        "This deserves its own section because getting it wrong is common and expensive.",
        "SHA-256 is designed to be fast. That is a virtue when you are checksumming a file and a catastrophe when you are storing passwords, because an attacker with a stolen database can try billions of candidates a second on commodity hardware. A leaked table of unsalted SHA-256 password hashes is close to a leaked table of passwords.",
        "Passwords need a deliberately slow function with a tunable cost factor: bcrypt, scrypt or Argon2. They also need a unique per-user salt, so identical passwords produce different stored values and precomputed rainbow tables are useless.",
        "None of that is what this tool does, and no general-purpose hash tool does it. If you are building authentication, use your framework's password hashing library.",
      ],
    },
    {
      heading: "Verifying a download",
      body: [
        "The everyday use is checking that a file you downloaded is the file that was published. Hash your copy, compare it to the published value character by character.",
        "The subtlety people miss: this only proves integrity if the hash came from somewhere the attacker does not control. A checksum published on the same page as the download, over the same connection, is defeated by anyone who can tamper with either. It catches a corrupted transfer, not a malicious one.",
        "Real assurance comes from a signature - the hash signed with a key you already trust - which is why package managers and Linux distributions sign their release files rather than just publishing a hash.",
      ],
    },
    {
      heading: "Where the computation happens",
      body: [
        "SHA-256, SHA-384 and SHA-512 use the browser's built-in Web Crypto implementation, which is native code. MD5 and SHA-1 are not offered by Web Crypto - deliberately, because they are broken - so those come from a JavaScript library and are correspondingly slower.",
        "Either way it happens on your machine. That matters when the thing you are hashing is a token, a key, or a password you are checking against a known value: pasting any of those into a server-side hash tool hands it to a stranger.",
      ],
    },
  ],
  example: {
    title: "One character, five algorithms",
    input: 'Input A: "utilbyte"\nInput B: "utilbytf"   (one letter changed)',
    output: "MD5      A: 2f5c8d70...  B: 9a1e4b23...\nSHA-1    A: 8e2b91f4...  B: c47a05de...\nSHA-256  A: b31f7a29...  B: 04ed8c61...\n\nLengths: MD5 32 hex chars, SHA-1 40,\nSHA-256 64, SHA-384 96, SHA-512 128",
    note: "One letter, and every output is unrecognisably different across its whole length - that is the avalanche property, and it is why hashes work as fingerprints. It is also why comparing two hashes means comparing them in full: a mismatch in one character means the inputs differ, and the first few characters matching means nothing at all.",
  },
  limitations: [
    "MD5 and SHA-1 are cryptographically broken. Use them only for non-adversarial checksums and legacy compatibility.",
    "This is not password hashing. Storing passwords needs bcrypt, scrypt or Argon2 with a per-user salt, and no general hash tool provides that.",
    "Text input only. There is no file hashing here, so you cannot verify a download directly.",
    "No HMAC or keyed hashing, which is what you need for message authentication rather than plain fingerprinting.",
    "Input is treated as UTF-8. Hashing the same text in a different encoding gives a different result, which is a frequent cause of two systems disagreeing about a hash.",
  ],
};
