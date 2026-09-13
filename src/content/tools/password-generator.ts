import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const passwordGeneratorArticle: ToolArticleContent = {
  intro: [
    "A password generator has one job: produce something an attacker cannot guess, in a form the site in front of you will accept. Both halves matter, and most generators get the second half right and are vague about the first.",
    "This one draws every character from your browser's cryptographic random number generator, and it tells you how much that is actually worth in bits of entropy rather than showing you a coloured bar that means nothing in particular.",
    "The rest of this page is about what that number means, because once you understand it the usual password advice starts to look quite different.",
  ],
  sections: [
    {
      heading: "Entropy is the only number that matters",
      body: [
        "Entropy measures how many guesses an attacker needs. It is the length of the password multiplied by the base-2 logarithm of the alphabet size, and it is expressed in bits. Each extra bit doubles the work.",
        "A twelve character password using upper case, lower case and digits draws from an alphabet of 62, which works out at about 71 bits. Sixteen characters from the same alphabet gives about 95 bits. Adding symbols takes the alphabet to 94 and buys you roughly six extra bits at twelve characters - which is worth having, but far less than four more characters would be.",
        "The consequence is the thing most password advice gets backwards: length beats variety, by a wide margin. Twenty lowercase letters is about 94 bits. Eight characters using every class you can find is about 52. The short complicated one looks stronger to a human and to most strength meters, and it is dramatically weaker.",
      ],
      bullets: [
        "Under 45 bits: guessable by anyone with a rented GPU and a reason.",
        "60 to 80 bits: fine for ordinary accounts behind a rate limiter.",
        "80 bits and up: not brute-forceable with current or foreseeable hardware.",
        "Every additional character is worth more than every additional character class.",
      ],
    },
    {
      heading: "Why the source of randomness is the whole game",
      body: [
        "A generated password is only as unpredictable as the numbers behind it. This is where a lot of tools quietly fail.",
        "The obvious way to pick a random character in JavaScript is Math.random. It is fast, it looks random, and it is not cryptographically secure. Its internal state is small and deterministic, and an attacker who observes enough output can recover that state and predict every value it will produce next. For a dice roll in a game that is fine. For something protecting your email it is not.",
        "This tool uses crypto.getRandomValues, which is the browser's interface to the operating system's cryptographic random source. There is a second, subtler trap there too. Taking a 32-bit random number modulo your alphabet size skews the result toward the low end whenever the alphabet does not divide evenly into 2^32 - so the first few characters of the alphabet come up slightly more often than the last. The fix is rejection sampling: discard values that fall in the short final block and draw again. That is what happens here, so every character really is equally likely.",
        "It is a small piece of code and it is the difference between a password generator and a password-shaped-string generator.",
      ],
    },
    {
      heading: "Satisfying the site's rules without weakening the password",
      body: [
        "Plenty of sites demand at least one number and one symbol, and reject an otherwise excellent password that happens not to contain one. So the generator takes one character from each class you have selected before filling the rest from the whole alphabet, then shuffles the result so those guaranteed characters do not always land in the same positions.",
        "Technically this removes a sliver of entropy, because you have constrained the space slightly. The loss is a fraction of a bit and it is not worth thinking about. Having your password rejected and choosing a worse one out of frustration costs far more.",
        "The other side of this is the sites that impose a maximum length, or ban particular symbols. A site that caps passwords at twelve characters is telling you something unflattering about how it stores them. There is nothing you can do except use the length it allows and make sure that password is used nowhere else.",
      ],
    },
    {
      heading: "The advice that actually reduces risk",
      body: [
        "Most real account compromises do not involve anyone brute-forcing a password. They involve a password that was reused on a site that got breached, and then tried against your email.",
        "So the single highest-value habit is a different password everywhere, which in practice means a password manager, because nobody memorises forty of these. Generate, paste, forget. The strength of any individual password matters much less than the fact that breaking one does not break the others.",
        "Second: turn on two-factor authentication wherever it is offered. It defends against the reuse problem directly.",
        "Third, and against the grain of decades of advice: stop rotating passwords on a schedule. Forced expiry makes people pick predictable variations, and the major standards bodies dropped the recommendation years ago. Change a password when you have reason to think it is exposed, not because ninety days elapsed.",
      ],
    },
  ],
  example: {
    title: "What the settings are actually worth",
    input: "Alphabet sizes\n  lower only        26\n  lower + upper     52\n  + digits          62\n  + symbols         94",
    output: "8  chars, all classes (94)  -> 52 bits   Fair\n12 chars, alphanumeric (62) -> 71 bits   Strong\n16 chars, alphanumeric (62) -> 95 bits   Very strong\n20 chars, lowercase (26)    -> 94 bits   Very strong",
    note: "Compare the first and last lines. The eight character password with symbols, mixed case and digits is the one that looks like a security requirement, and it has 52 bits. Twenty lowercase letters has 94 - roughly seventeen trillion times harder to guess - and it is easier to type on a phone. If you take one thing from this page, make it that.",
  },
  limitations: [
    "The strength label is derived purely from entropy, which is the right measure for a randomly generated password and the wrong one for a password you invented yourself. A memorable phrase has far less entropy than its length suggests.",
    "The generator cannot know a site's rules. If a site bans certain symbols or caps length, you have to set that here yourself.",
    "Nothing is stored. Passwords are generated in the page and vanish when you close it - use a password manager to keep them.",
    "Randomness comes from your browser's crypto API. On a device with a compromised or badly seeded random source, no generator can help you.",
    "One password at a time. There is no bulk generation.",
  ],
};
