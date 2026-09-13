import type { Guide } from "@/content/guides/types";

export const heicExplainedGuide: Guide = {
  slug: "heic-explained",
  title: "HEIC explained: why iPhone photos will not open, and how to get a JPG",
  metaTitle: "HEIC Explained: Getting a JPG From an iPhone",
  metaDescription:
    "What a .HEIC file is, why Windows and upload forms refuse it, the iPhone setting that stops it happening, and the honest limits of converting one in a browser.",
  keywords: [
    "heic",
    "what is a heic file",
    "heic to jpg",
    "open heic on windows",
    "iphone photo format",
    "most compatible iphone setting",
    "heif hevc",
    "convert heic",
  ],
  published: "2026-08-24",
  updated: "2026-09-12",
  summary:
    "HEIC is the format iPhones have used for photos since 2017. It stores a picture in roughly half the space of a JPEG, and it fails to open on a large share of the computers you might send it to. Here is what the format is, exactly where it breaks, the setting that stops your phone producing it, and what conversion can and cannot do.",
  readingMinutes: 7,
  intro: [
    "You attach a photo to a form and it tells you the file type is not supported, without saying which types are. Or you email a picture to somebody and they see a blank icon. The photo looked completely normal on the phone that took it, which is what makes this so hard to diagnose from the sending end.",
    "The file is a .HEIC, and it has been the iPhone camera default since iOS 11 in 2017. On its technical merits it beats JPEG comfortably. That is no help at all when the file will not open, and nothing goes wrong until the photo leaves Apple's world, so the person who took it usually has no idea anything is wrong.",
    "There are three separate things worth understanding, and they solve different problems: what the format is, how to stop your phone making them, and how to rescue the ones you already have.",
  ],
  sections: [
    {
      heading: "What a .heic file actually contains",
      body: [
        "Two acronyms get used as if they were one thing. HEIF is the container - a box that holds image data plus everything that goes with it, in the same way an MP4 holds video, audio and subtitles together. HEVC, also known as H.265, is the codec that compresses the picture itself. A .heic file is normally HEVC-encoded image data sitting inside a HEIF container. Apple made that combination the camera default in iOS 11.",
        "The motivation was space. JPEG was standardised in the early 1990s and works on eight by eight blocks of pixels. HEVC arrived roughly two decades later, designed for video, and can predict one region of an image from another region of the same image before it encodes anything at all. The practical result is around half the file size at comparable quality, which is a large saving when a phone holds thousands of photos. How large depends on the picture: a plain wall compresses beautifully either way, fine gravel does not.",
        "The container also carries things JPEG has no way to express, which matters later when you convert. A single .heic can hold ten bits per colour channel instead of JPEG's eight, which is why skies band less. It can carry transparency. It can store the depth map from Portrait mode that lets the phone re-adjust background blur after the fact, and it can hold a whole burst of frames as one file rather than forty.",
      ],
    },
    {
      heading: "Where it opens, and where it does not",
      body: [
        "A format is only as portable as its decoder, and the HEVC decoder is genuinely not everywhere. Underneath the patchiness sits patent licensing: HEVC is covered by patents administered through more than one pool, which has made browser vendors and open-source projects cautious about shipping a decoder at all. JPEG's patents expired a long time ago, while JPEG has broad compatibility. Format support still depends on the application.",
      ],
      table: {
        columns: ["Where the file ends up", "Does a .heic open?", "What is going on"],
        rows: [
          [
            "iPhone, iPad, recent Mac",
            "Yes",
            "Decoding is built into the operating system and has been since 2017.",
          ],
          [
            "Windows 10 and 11",
            "Only with codecs installed",
            "HEIF and HEVC support arrives as separate add-ons from the Microsoft Store rather than being present out of the box.",
          ],
          [
            "Recent Android",
            "Usually",
            "Android gained system-level HEIF decoding around 2018, but individual apps and older handsets often still cannot.",
          ],
          [
            "Safari",
            "Yes",
            "Supported combinations can use native decoding; a particular file can still fail.",
          ],
          [
            "Chrome, Firefox, Edge",
            "Historically no",
            "Support depends on the browser version, operating system and file. Test the actual environment rather than relying on this historical summary.",
          ],
          [
            "Upload forms",
            "Usually rejected",
            "Most check the file extension against a short allowlist, typically jpg, jpeg, png and pdf.",
          ],
          [
            "Photo editors and office software",
            "Mixed",
            "Recent versions of the major editors handle it. Older releases, print kiosks and in-house corporate tools frequently do not.",
          ],
          [
            "Anything reading JPEG only",
            "No",
            "Renaming the file to .jpg does not help. The extension is a label, not a description of the bytes.",
          ],
        ],
        caption:
          "The same file, sent to eight different places, produces at least four different outcomes. That is why the problem is so hard to reproduce on the phone that created it.",
      },
      callout: {
        tone: "info",
        text: "Renaming a .heic to .jpg is the most common piece of bad advice on this subject and it never works. A JPEG decoder reads the first few bytes, finds HEVC data in an ISO base media container, recognises nothing, and stops.",
      },
    },
    {
      heading: "Why upload forms are the strictest of all",
      body: [
        "Forms fail earlier and more bluntly than software does. A typical file input checks the extension against a list before anything examines the image, so the rejection happens without your photo ever being decoded. The error message is generic because at that point the site genuinely does not know what you sent.",
        "Even forms that accept the upload can fail afterwards. Plenty of sites run on server-side image libraries that were built without HEIF support, so the file uploads successfully and then the thumbnail comes out blank, or the processing step errors out some time later. Government portals, university admissions systems and job applications are the usual offenders, and they are exactly the situations where a silent failure costs you the most.",
        "If a form rejects your photo and the message only says invalid file type, look at the extension before you look at anything else. That single check explains the large majority of these cases.",
      ],
    },
    {
      heading: "The setting that stops the problem at the source",
      body: [
        "Converting files one at a time treats the symptom. If you keep hitting this, change what the camera writes. On the phone, open Settings, then Camera, then Formats. High Efficiency writes HEIC stills and HEVC video. Most Compatible writes JPEG and H.264 instead.",
        "Two things worth knowing before you switch. It only affects photos taken from that moment onwards, so it does nothing for the thousands already in your camera roll. And it costs storage: expect roughly double the space per photo, which is the whole saving you were getting handed back. A couple of high frame rate video modes require High Efficiency, and the phone will tell you if you try to use them.",
        "There is a second setting that causes most of the arguments about this, because it changes what happens without changing what the camera does. Settings, then Photos, then Transfer to Mac or PC, offers Automatic or Keep Originals. Automatic converts HEIC to JPEG when you connect the phone to a computer. Keep Originals hands over the file exactly as stored. Plenty of people are on Keep Originals without ever having chosen it, which is why the same phone can seem to produce openable photos one week and not the next.",
      ],
    },
    {
      heading: "How you send it decides what arrives",
      body: [
        "This is the part that makes the problem feel random. The format that reaches the other end depends on the route the photo took off the phone, and none of the routes announce what they did.",
      ],
      bullets: [
        "AirDrop to another Apple device generally preserves the original HEIC, because it assumes the receiving end can read it.",
        "A USB cable to a computer transfers whatever Transfer to Mac or PC is set to - the original HEIC on Keep Originals, a converted JPEG on Automatic.",
        "Mail and Messages attachments are frequently converted to JPEG on the way out, which is why some of your photos seem fine and others do not.",
        "Most social and chat apps re-encode everything they receive anyway, usually to JPEG and usually smaller than you sent.",
        "Uploading through Safari on the phone often hands the site a JPEG, though this varies and is not something you can rely on.",
      ],
    },
    {
      heading: "Converting the files you already have",
      body: [
        "For an existing HEIC file, a compatible viewer may open it directly. Convert a copy when the receiving application requires another format. The available decoder depends on the browser, operating system and particular file.",
        "Some browser converters bundle a WebAssembly decoder; others use the browser’s native decoding support or send files to a server. UtilByte uses the browser decoder and does not bundle a HEIC decoder. If the browser cannot decode the source, the tool reports failure rather than uploading it.",
        "Unsupported encoding variants, corrupt input and device memory limits can all cause failure. Try opening the original in a compatible photo application and exporting a JPEG copy. Do not assume that a different extension or a browser update will fix every file.",
      ],
      callout: {
        tone: "warning",
        text: "HEIC compatibility varies. Apple documents exporting a HEIF image from Photos or Preview on a Mac through File > Export, choosing JPEG or PNG. See https://support.apple.com/en-us/116944 for supported devices, sharing behavior and capture settings.",
      },
    },
    {
      heading: "What conversion costs you",
      body: [
        "Exporting JPEG decodes the source and then applies lossy encoding. The amount of visible change depends on the image, decoder and quality setting; source bit depth is not always the same. Retain the HEIC original and inspect color, detail and metadata in the exported copy.",
        "The JPEG can be larger or smaller depending on source encoding, dimensions and selected quality. There is no fixed multiplier. Compare the actual file size, particularly when the receiving application also imposes a byte limit.",
        "Live Photos lose the most. A Live Photo is not one file but a still image paired with a short video clip, shown as a single item in the Photos app. Convert it and you keep the key frame; the motion and its audio do not travel. For a document scan or a receipt that is exactly what you wanted. For a picture of a child mid-run, the frame the phone picked may not be the moment you had in mind.",
        "None of this should stop you converting. A file that will not open has a quality of zero to the person who needs it. Keep the HEIC as your original, export a fresh JPEG from it each time you need one, and never convert a conversion.",
      ],
    },
  ],
  relatedTools: [
    {
      label: "Format Converter",
      href: "/image-tools/format-converter",
      description:
        "Convert HEIC to JPEG or PNG in the browser, with the file staying on your own machine.",
    },
    {
      label: "Compress Image",
      href: "/image-tools/compress-image",
      description:
        "Bring the JPEG back down after conversion, since a converted file is usually larger than the HEIC was.",
    },
    {
      label: "Compress to Size",
      href: "/image-tools/compress-to-size",
      description:
        "Hit a specific kilobyte limit when the form that rejected your HEIC also has a size cap.",
    },
  ],
  relatedGuides: ["image-formats-compared"],
  faqs: [
    {
      question: "How do I open a HEIC file on Windows?",
      answer:
        "Recent Windows versions can, provided the HEIF and HEVC extensions from the Microsoft Store are installed, and on some machines they already are. If yours will not open the file, converting it to JPEG is usually quicker than working out which extension is missing. Some third-party viewers bundle their own decoder and open HEIC files without any of that.",
    },
    {
      question: "Why will this website not accept my iPhone photo?",
      answer:
        "The receiving application may not accept HEIC, or it may reject the dimensions, size or file contents. Check its stated requirements and export a supported format where needed. Converting to JPEG does not guarantee that all other requirements are met.",
    },
    {
      question: "How do I make my iPhone take JPGs instead?",
      answer:
        "On supported iPhones or iPads, open Settings, Camera, Formats and select Most Compatible for future captures. Existing photos are unchanged. Apple’s current instructions explain sharing and USB conversion separately: https://support.apple.com/en-us/116944",
    },
    {
      question: "Does converting HEIC to JPEG lose quality?",
      answer:
        "JPEG export uses lossy encoding, so detail can change. Source properties and the quality setting determine how visible that is; there is no guaranteed invisible conversion. Preserve the original and make fresh copies from it.",
    },
    {
      question: "Why did the converter fail on one photo but work on the rest?",
      answer:
        "Different converters use different decoders. UtilByte relies on your browser’s native image decoding, which may not support the particular file. Corruption and memory limits can also cause failure. Try a compatible photo application to inspect and export the original.",
    },
  ],
};
