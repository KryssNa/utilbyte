import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const heicToJpgArticle: ToolArticleContent = {
  intro: [
    "You emailed some photos from your iPhone, or copied them off it with a cable, and the person at the other end cannot open them. Or an upload form rejected them. The files end in .HEIC and nothing on a Windows machine seems to want them.",
    "This page converts HEIC to JPG. It is also going to be straight with you about a limitation that most pages offering this conversion are not: whether it works at all depends on which browser you are using.",
  ],
  sections: [
    {
      heading: "The browser problem, stated plainly",
      body: [
        "Converting an image in a browser means the browser has to decode it first. For JPEG, PNG, WebP and GIF that is a given. For HEIC it is not.",
        "HEIC wraps HEVC-encoded images, and HEVC is patent-encumbered. Apple licensed it, so Safari decodes HEIC natively. Chrome, Firefox and Edge have not, so they cannot - and no amount of JavaScript changes that, because the decoder simply is not there.",
        "So: in Safari, this works. In Chrome or Firefox, it will most likely fail, and the tool will tell you so rather than spinning forever or producing a broken file.",
        "Some converters get around this by shipping a WebAssembly HEIC decoder, which is several megabytes of download and slow. Others get around it by uploading your photo to a server, which is a meaningful thing to do with a personal photograph and is rarely mentioned. Neither trade seemed worth making silently, so this page does the honest thing and explains the alternative below.",
      ],
    },
    {
      heading: "The fix that is better than any converter",
      body: [
        "If you convert HEIC files regularly, you are solving the wrong problem. Stop the phone producing them.",
        "On the iPhone: Settings, then Camera, then Formats, then Most Compatible. The camera captures JPEG from that moment on. Photos you have already taken stay HEIC, but the problem stops recurring.",
        "The cost is disk space. HEIC is genuinely better at compression - roughly half the size of JPEG at comparable quality - so JPEG capture fills the phone faster. If storage is tight, keeping HEIC and converting the handful you actually need to share is the better trade.",
        "For photos you already have, the easiest route is often not a converter at all. Sharing or emailing a photo from the iPhone's own share sheet usually converts it to JPEG automatically on the way out. AirDrop and a direct cable transfer preserve HEIC, which is why files copied that way are the ones that cause trouble.",
      ],
      bullets: [
        "Settings, Camera, Formats, Most Compatible - stops it happening again.",
        "Emailing or sharing from the phone usually converts automatically.",
        "AirDrop and cable transfers keep HEIC, which is why those files break things.",
        "On a Mac, Preview will export HEIC to JPEG without any of this.",
      ],
    },
    {
      heading: "What you give up in the conversion",
      body: [
        "HEIC to JPEG is a lossy-to-lossy conversion, so it is not free.",
        "The file typically gets considerably larger, because JPEG is a much older codec and needs more bits for the same visual quality. Doubling in size is normal.",
        "Some quality goes, since the image is decoded and re-encoded. At quality 90 it is not something you will see on a photograph, but it is real and it accumulates if you keep converting the same file.",
        "The things HEIC can carry that JPEG cannot are simply dropped: depth maps used for Portrait mode, the extra frames of a Live Photo, HDR gain maps, and any editing history. A converted Portrait photo keeps the blurred background as it was rendered, and loses the ability to change it later.",
        "None of that matters when the destination is a form that wants a JPG. It matters a great deal if you are converting your only copy. Keep the originals.",
      ],
    },
    {
      heading: "Which quality setting",
      body: [
        "90% is the right default for a photograph and it is what this page starts on. The difference from 100% is invisible and the file is a fraction of the size.",
        "Below about 70% you will start to see it - blocking in smooth areas like a plain wall or sky, and a softness around hair and edges.",
        "If you are converting to meet a size limit rather than a format requirement, the quality slider is the wrong tool for the job. Convert here at 90, then use the compress-to-size tool, which searches for the highest quality that fits under your limit instead of making you guess.",
      ],
    },
  ],
  example: {
    title: "The same photo, three ways",
    input: "IMG_4471.HEIC\n4032 x 3024 px, 2.1 MB\nShot on iPhone, Portrait mode",
    output: "In Safari, quality 90:\n  IMG_4471.jpg  4032 x 3024, 4.3 MB\n  depth map: gone\n\nIn Chrome:\n  decode failed - no HEIC decoder available\n\nEmailed from the phone instead:\n  IMG_4471.jpg  arrives converted, no tool needed",
    note: "Two things worth noticing. The JPEG is twice the size of the HEIC for the same picture, which is the compression advantage you are giving up. And the third line is usually the fastest answer - the phone will convert on the way out if you share rather than copy, which makes the whole question moot for most people most of the time.",
  },
  limitations: [
    "Conversion depends on your browser being able to decode HEIC. Safari can; Chrome, Firefox and Edge generally cannot, and the tool will tell you rather than failing silently.",
    "Depth maps, Live Photo frames, HDR gain maps and edit history are not carried into JPEG. They cannot be.",
    "The output is usually larger than the input, often about twice. That is JPEG being an older codec, not a fault in the conversion.",
    "One file at a time. There is no batch conversion for a whole camera roll.",
    "Re-encoding costs a little quality. Keep your originals if the photographs matter.",
  ],
};
