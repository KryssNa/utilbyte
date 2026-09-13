import type { Guide } from "@/content/guides/types";

export const browserVsUploadPrivacyGuide: Guide = {
  slug: "browser-vs-upload-privacy",
  title: "Uploads versus your browser: what really happens to a file, and how to check",
  metaTitle: "Browser vs Upload: What Happens to Your File",
  metaDescription:
    "What an online converter does with your file when it uploads it, what client-side processing actually means, and two checks anyone can run to find out which kind of site they are on.",
  keywords: [
    "are online file converters safe",
    "client side file conversion",
    "does this website upload my file",
    "browser based tools privacy",
    "online converter privacy",
    "check if website uploads file",
  ],
  published: "2026-08-24",
  updated: "2026-09-12",
  summary:
    "Two websites that look identical can do completely different things with the file you hand them. One sends it to a server, the other never lets it leave the tab. This guide explains both paths honestly, including what browser processing costs you, then shows two ways to find out for yourself which one a site is using.",
  readingMinutes: 7,
  intro: [
    "Every online converter looks the same from the outside. You drop a file into a dashed box, a progress bar moves, a download appears. Underneath, two completely different things might have happened, and the difference decides whether a copy of your file now exists on somebody else's disk.",
    "This is not an argument that one approach is evil and the other virtuous. Server-side processing is how a lot of good software works. The problem is narrower: most people cannot tell which kind of site they are on, and a homepage claim is not evidence, because it costs nothing to make.",
    "So the useful part of this guide is not the explanation. It is the two tests in the middle, which take about a minute between them and require you to trust nobody.",
  ],
  sections: [
    {
      heading: "Where the file goes when a site uploads it",
      body: [
        "Press the button on an upload-based converter and your file is read off your disk and pushed over the network to a server. HTTPS protects it in transit, but it ends at the server's front door. From there the file is ordinary data on somebody else's machine, readable by whatever runs there.",
        "What happens next varies, and the honest answer is that you cannot see any of it. Typically the upload lands in temporary storage, a queue picks it up, a worker converts it, and a download link comes back. On the way it may pass a load balancer, a CDN, a virus scanner and a logging system, each with its own retention behaviour.",
        "Then the server deletes it. Usually. That is the part worth looking at, because it is where the gap between a promise and the infrastructure behind it opens up.",
      ],
    },
    {
      heading: "Deletion is a policy, not a mechanism",
      body: [
        "A line saying files are deleted after one hour is a statement of intent. It describes what a company means to do, which is different from what its systems do. Several things routinely keep copies past that window without anyone acting in bad faith.",
      ],
      bullets: [
        "Access and application logs, which record filenames, sizes, IP addresses and timestamps, and are normally kept for weeks or months for debugging and abuse handling.",
        "Backups and snapshots, taken and expiring on their own schedule, so a file deleted at three in the afternoon can sit inside a nightly snapshot for a month.",
        "CDN and proxy caches, which may still hold the converted output at edge locations after the origin has cleared its copy.",
        "Subprocessors. Most sites do not own their servers. Storage, queues, error tracking and analytics are separate companies, each with its own retention rules and jurisdiction.",
        "And everything afterwards: a breach, a legal order, an acquisition, a quietly revised privacy policy. None of these require the original promise to have been dishonest.",
      ],
    },
    {
      heading: "What client-side actually means",
      body: [
        "None of that matters much for a holiday photo. It matters for a payslip, a passport scan or a signed contract. Which brings up the other approach: not sending the file at all.",
        "Selecting a file gives the page access to that file. The browser’s picker does not itself upload it, but the page can immediately read, store or transmit it in response. What happens next depends on the implementation.",
        "Local processing uses JavaScript or WebAssembly on your device. An image tool may use a canvas and browser encoders; a PDF tool may manipulate the document in JavaScript. Additional processing libraries can be downloaded when a feature is first used.",
        "A local result can be held in a Blob and downloaded through a blob: URL. That URL does not itself imply a server upload. It also does not prove the page made no other copy: browser storage or separate network requests must be considered independently.",
        "That is the entire mechanism. Nothing about it needs taking on faith. Either the page sends a request with your file inside it or it does not, and that is something you can watch.",
      ],
    },
    {
      heading: "The first check: pull the plug",
      body: [
        "Disconnecting before selecting a synthetic test file can show that a particular conversion works without a live server connection. It does not prove what the page did before disconnection or what it might send after reconnecting.",
      ],
      callout: {
        tone: "info",
        text: "Load the page, disconnect without reloading, then select a synthetic file and try the conversion. A valid result demonstrates offline processing for that run. Failure is inconclusive: a local tool may still need to download a runtime or language model.",
      },
      bullets: [
        "Let the page load fully first. Some tools fetch a WebAssembly module the first time you use a feature, so a failure may be about that rather than uploads. Reconnect, run it once, then disconnect and try again.",
        "Do not reload while offline. That tests whether the page has an offline cache, which is a different question.",
        "Open the downloaded file afterwards and check it is genuinely converted, not an empty placeholder.",
      ],
    },
    {
      heading: "The second check: watch the network yourself",
      body: [
        "The Network panel provides another view of the tested run. Combine it with an offline test and the implementation’s data-handling notes; neither observation alone proves that every feature is private.",
      ],
      bullets: [
        "Open the tool page, press F12 or right-click and choose Inspect, then pick the Network tab.",
        "Tick Preserve log if the option is there, then clear the list so you are starting from empty.",
        "Do the job: choose your file, run the conversion, download the result.",
        "Inspect request payloads and destinations during file selection, processing and download. Traffic may be split, transformed or sent over WebSocket, and the Size column often reflects response size rather than upload size.",
      ],
    },
    {
      heading: "Reading the result, and what neither test proves",
      body: [
        "A local tool may download a large runtime or model, so a large transfer is not automatically a file upload. Conversely, uploaded data can be compressed, split across requests or sent later. Inspect what was transmitted rather than inferring privacy from request size alone.",
        "These observations are limited to the actions, file and version tested. They do not exclude delayed uploads, persistent storage, conditional behavior or other data collection. Use synthetic data for investigation and a fuller implementation and network review when the distinction matters.",
      ],
    },
    {
      heading: "What running in the browser costs you",
      body: [
        "Client-side processing is not free, and a site that pretends otherwise is selling you something. The trade-offs are real.",
      ],
      bullets: [
        "Speed on large jobs. Your laptop is doing work a rack of servers would otherwise have done, in one tab. A 200 MB PDF or fifty camera files is where this shows.",
        "Memory. A canvas holds four bytes per pixel while it works, so a 50 megapixel image needs 200 MB for one buffer. Phones run out first, often as a crash rather than a clear message.",
        "Codec support. The page can only encode what the browser or a bundled library can encode, which is why browser tools often offer fewer output formats.",
        "First load is heavier. The code that does the work has to arrive before anything can happen.",
        "No queued or scheduled work. Close the tab and it stops. There is no job to come back to and no email when it finishes.",
      ],
    },
    {
      heading: "What in your browser does not promise",
      body: [
        "Two claims usually get bundled into one. Your file staying local is one thing. The page not tracking you is another, and the first does not imply the second.",
        "A page can process everything locally and still load an analytics script, serve ads, report errors to a third party and pull fonts from a CDN that sees your IP address. Your document is not in that traffic, but you are.",
        "Features that communicate with external services need a network connection. Other heavy work, including OCR and some codecs, can run locally when a suitable implementation is available, though device memory, runtime downloads and processing time may limit practicality.",
        "And a website can change. The code is fetched fresh on every visit, so the version you tested in August is not necessarily the one you get in November. Repeat the check occasionally.",
        "A useful privacy claim identifies the processing path and its limits. Tests can provide evidence for the run you observed, while source review, browser storage inspection and service policies answer different questions.",
      ],
    },
  ],
  relatedTools: [
    {
      label: "Format Converter",
      href: "/image-tools/format-converter",
      description:
        "Convert between image formats in the tab. Load the page, disconnect, and confirm the conversion still runs before using it for anything that matters.",
    },
    {
      label: "Image Compressor",
      href: "/image-tools/compress-image",
      description:
        "Re-encodes your photo on a canvas in the browser. The live size estimate runs the same encode, which is why it updates without a round trip anywhere.",
    },
    {
      label: "Document Photo",
      href: "/image-tools/document-photo",
      description:
        "Passport and visa photos are exactly the kind of file worth keeping off other people's servers, since they carry your face and usually travel with identity documents.",
    },
    {
      label: "Merge PDF",
      href: "/pdf-tools/merge-pdf",
      description:
        "Combining contracts, payslips or scanned records is a common reason people reach for a random upload site. This one assembles the pages in memory instead.",
    },
    {
      label: "Resize Image",
      href: "/image-tools/resize-image",
      description:
        "Changes pixel dimensions locally, and a good one to run the offline test on, because it is fast enough that a hidden upload would stand out.",
    },
  ],
  relatedGuides: ["documents-for-online-forms"],
  faqs: [
    {
      question: "How can I tell whether a website uploads my file?",
      answer:
        "Test with synthetic input: disconnect before selecting the file and check whether conversion completes, then inspect request payloads and destinations during an online run. Offline success demonstrates local capability for that run, not the absence of past or later uploads.",
    },
    {
      question: "Does HTTPS mean my file is private?",
      answer:
        "HTTPS encrypts traffic between the browser and the TLS endpoint. It does not prevent that endpoint or downstream application services from reading or retaining the data, and does not establish how the file is handled after receipt.",
    },
    {
      question: "Are free online file converters safe to use?",
      answer:
        "It depends on what the file is and where it gets processed. For a holiday photo the stakes are low either way. For a passport scan, a payslip, a contract or anything holding someone else's personal data, an upload means the file exists on infrastructure you cannot inspect, subject to logs, backups and subprocessors you will never see. A deletion promise is a policy rather than a mechanism, which is why it is worth checking whether the file needed to leave your machine at all.",
    },
    {
      question: "Why do browser-based tools sometimes feel slower?",
      answer:
        "Because your device is doing the work instead of a server. On a modest laptop or a phone, a large PDF or a high-resolution image takes noticeably longer, and a tab can run out of memory on very large files where a server would not. The first page load is also heavier, since the code that does the processing has to arrive before you can start.",
    },
    {
      question: "If a tool runs in my browser, does that mean the site is not tracking me?",
      answer:
        "No. Tool processing and site telemetry are separate. Analytics, ads, error reporting or embedded resources can send data even when a file conversion runs locally. Review the actual requests and privacy disclosures rather than assuming that local processing means no tracking.",
    },
  ],
};
