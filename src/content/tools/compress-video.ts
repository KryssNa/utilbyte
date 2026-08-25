import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const compressVideoArticle: ToolArticleContent = {
  intro: [
    "A phone shoots at a bitrate that is generous by any standard, so a two minute clip lands somewhere north of two hundred megabytes and then refuses to attach to an email, upload to a portal, or sit in a chat thread without a warning.",
    "Compressing it means re-encoding: decode every frame, throw away information, encode again. That is expensive work, and this page does it with ffmpeg compiled to WebAssembly, running on your own processor inside the browser tab. Your video is never uploaded. The honest trade-off is that your laptop is slower than a server farm, and there is a size ceiling past which the browser simply runs out of memory. More on that below, because it is the thing most likely to affect you.",
    "The three presets set a bitrate, a resolution and a frame rate together. Low is 500 kbps at 854x480 and 24 fps, medium is 1000 kbps at 1280x720 and 30 fps, high is 2000 kbps at 1920x1080 and 30 fps. Video goes through libx264 for MP4 or VP9 for WebM, audio is re-encoded to AAC at 128 kbps.",
  ],
  sections: [
    {
      heading: "Bitrate is the lever, not quality",
      body: [
        "There is no quality percentage in video the way there is in a JPEG. What determines both file size and how good it looks is bitrate - how many bits per second of playback the encoder is allowed to spend.",
        "The arithmetic is simple and worth internalising. File size is roughly bitrate multiplied by duration. A two minute clip at 1000 kbps comes to about fifteen megabytes of video, plus about two for audio at 128 kbps. That relationship holds regardless of what is in the frame, which is why bitrate is a reliable way to hit a target size and a quality slider would not be.",
        "What varies is how good that bitrate looks. A static talking head at 1000 kbps looks fine. Handheld footage of moving water at the same bitrate looks like a mess, because almost every pixel changes every frame and the encoder has nothing to reuse.",
      ],
      bullets: [
        "Approximate size in MB = (video kbps + audio kbps) x seconds / 8000.",
        "500 kbps at 480p: acceptable for screen recordings and talking heads.",
        "1000 kbps at 720p: the sensible default for most phone footage.",
        "2000 kbps at 1080p: keeps detail, but the file is only about half the size of a typical phone original.",
      ],
    },
    {
      heading: "What to give up first",
      body: [
        "You have three dials and they are not equally valuable.",
        "Resolution is usually the right first sacrifice. Halving the linear dimensions quarters the pixel count, so 1080p to 720p removes more than half the work the encoder has to do. On a phone screen the difference is much smaller than the numbers suggest, and 720p at a decent bitrate looks considerably better than 1080p at a starved one.",
        "Frame rate is the second. Dropping 30 to 24 saves about a fifth with almost no perceived loss on most content. Below 24 motion starts to look wrong. Screen recordings of mostly-static content are the exception - they survive much lower frame rates comfortably.",
        "Bitrate is the last one to touch, because that is where the visible damage shows up as blocking in dark areas and smearing on movement.",
        "The one thing worth knowing about how this tool scales: it fits your video inside the target resolution preserving aspect ratio, then pads the remainder. So a vertical phone video compressed to a 1280x720 preset comes out as a 1280x720 file with black bars either side, not a cropped or stretched image.",
      ],
    },
    {
      heading: "The browser is the real constraint",
      body: [
        "This is the part that other browser-based video tools tend not to mention.",
        "ffmpeg.wasm has to load its own runtime the first time you use it, which is a substantial download. It then does all the work single-threaded-ish on your CPU, inside a memory space that the browser caps. There is no swap, no scaling up, no queue on someone else's hardware.",
        "In practice: short clips of a few tens of megabytes are fine on a laptop and workable on a recent phone. As files get into the hundreds of megabytes the encode gets slow enough to be tedious and the memory ceiling starts to be a real risk - and when it is hit, the tab does not degrade gracefully, it fails.",
        "If you have a long recording to compress, this is the wrong tool and a desktop application is the right one. What browser encoding is genuinely good for is a short clip you would rather not hand to a stranger's server, and for a phone video you need to send in the next five minutes.",
      ],
    },
    {
      heading: "Re-encoding is one-way",
      body: [
        "Compression discards information permanently. Detail lost at 500 kbps does not come back at 2000, and compressing an already-compressed file compounds the damage.",
        "So always work from the original. If the first attempt is too big, go back to the source file and re-run at a lower setting rather than compressing the output again. Two passes of lossy encoding look noticeably worse than one pass at the same final bitrate.",
        "Keep the original until you are certain the compressed version is accepted. This is not a reversible operation.",
      ],
    },
  ],
  example: {
    title: "A phone clip cut down for an email attachment",
    input: "IMG_1104.MOV\n1920 x 1080, 30 fps, 1 min 48 s\n214 MB (about 16 Mbps)\nTarget: under 25 MB",
    output: "Preset: medium\nVideo: libx264 at 1000 kbps, scaled to 1280 x 720, 30 fps\nAudio: AAC at 128 kbps\n\nOutput: 15.7 MB\nEncode time: roughly 2-3 minutes on a laptop",
    note: "The original was running at around 16 Mbps, which is normal for a phone and enormously more than the content needs. Dropping to 1000 kbps and 720p cut it by a factor of thirteen and the result is perfectly watchable on a phone screen. Note the encode time - this is real work happening on your machine, and it scales with duration and resolution. The same clip at the high preset would be roughly twice the size and take noticeably longer.",
  },
  limitations: [
    "Large files are the hard limit. ffmpeg.wasm runs inside the browser's memory ceiling, and a long or high-resolution video can be slow to the point of impractical, or fail outright. Use a desktop encoder for anything substantial.",
    "The first run downloads the ffmpeg runtime, so there is a wait before anything starts.",
    "Encoding is CPU-bound and single-machine. A two minute 1080p clip takes minutes, not seconds, and the tab will be busy throughout.",
    "Presets pad rather than crop, so a vertical video compressed to a landscape preset gains black bars.",
    "Audio is always re-encoded to AAC at 128 kbps. There is no option to copy the original audio stream untouched.",
    "One file at a time, and re-encoding is destructive - keep your original.",
  ],
};
