import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const videoToGifArticle: ToolArticleContent = {
  intro: [
    "GIF survives for one reason: it plays automatically, silently, everywhere, without a player. Chat apps, issue trackers, documentation, forum posts and email clients that would refuse a video will happily loop a GIF. That is the whole value proposition, and it is enough to keep a format from 1987 in daily use.",
    "Everything else about it is bad. GIF is limited to 256 colours per frame, it has no modern compression, and file sizes get out of hand fast. A five second clip that is 400 kilobytes as an MP4 can easily be six megabytes as a GIF.",
    "This page runs ffmpeg in your browser to do the conversion, and it does it the right way - two passes, generating a colour palette from your specific clip first and then applying it. That single detail is the difference between a GIF that looks reasonable and one that looks like it came off a 1998 web page.",
  ],
  sections: [
    {
      heading: "Why the palette pass matters",
      body: [
        "A GIF frame can contain at most 256 distinct colours. Your video has millions. Something has to decide which 256 to keep.",
        "The lazy approach is to use a fixed generic palette, which is what naive converters do. Skin tones go blotchy, gradients turn into visible stripes, and a sunset becomes four bands of orange.",
        "The better approach, and what happens here, is to scan the clip first and build a palette from the colours that are actually in it. A video of a forest gets a palette that is mostly greens. A screen recording of a code editor gets a palette full of the exact syntax highlighting colours. Then a second pass encodes the frames using that palette, dithering to smooth out what is left.",
        "It costs an extra pass over the video, which is why conversion is not instant. It is worth it.",
      ],
    },
    {
      heading: "The three things that control file size",
      body: [
        "Duration, frame rate and width, and they multiply rather than add.",
        "Duration is the most brutal. GIF has no inter-frame compression worth the name, so ten seconds costs roughly twice what five seconds costs. Trim hard. Almost every GIF in the wild is longer than it needs to be, and the interesting part is usually two or three seconds.",
        "Frame rate is next. Fifteen frames per second is the default here and it is a good one - motion reads as smooth enough for a demo or a reaction clip, at half the frames of a 30 fps source. Ten works fine for screen recordings and slow movement. Below eight it starts to look like a slideshow.",
        "Width determines the pixel count per frame, and pixel count is what the palette has to describe. Dropping from 800 to 480 pixels wide removes about two thirds of the data. For something that will be viewed inline in a chat thread or an issue comment, 480 is usually plenty.",
        "If a GIF comes out too big, cut the duration first, then the frame rate, then the width. In that order.",
      ],
      bullets: [
        "Trim to the two or three seconds that actually matter.",
        "15 fps for general motion, 10 fps for screen recordings.",
        "480 px wide is enough for inline viewing in most places.",
        "Ten seconds at 30 fps and 800 px wide will produce a file nobody wants to load.",
      ],
    },
    {
      heading: "When you should not be making a GIF at all",
      body: [
        "If the destination accepts video, use video. A short muted looping MP4 or WebM is smaller than the equivalent GIF by an order of magnitude, plays at full colour depth, and is supported by every browser. Most platforms that appear to accept GIFs actually convert them to video on upload, which tells you something.",
        "Animated WebP sits in between - much smaller than GIF, full colour, but with patchier support in older software and some upload forms.",
        "GIF remains the right answer specifically when you are pasting into something that will not accept a video file: a GitHub issue, a Slack message where autoplay matters, an email, a documentation page that only handles images, or an old forum. That is a real and common set of destinations, which is why the format refuses to die.",
      ],
    },
    {
      heading: "What kinds of clip convert well",
      body: [
        "Screen recordings are the best case by a distance. Interfaces are made of flat colour and limited palettes already, so 256 colours is not much of a restriction, and the background does not change between frames.",
        "Anything with a static camera and a small moving subject also does well, for the same reason - most of the frame is identical each time.",
        "The worst cases are handheld footage, camera pans, gradients, film grain and anything shot outdoors. Every pixel changes every frame, the palette has to cover an enormous range, and the file size climbs steeply while the picture still looks poor. If that is what you have, convert a short clip and set your expectations accordingly.",
      ],
    },
  ],
  example: {
    title: "A screen recording turned into a GIF for a bug report",
    input: "screen-recording.mp4\n1920 x 1080, 60 fps, 22 s\n8.4 MB\nThe relevant bug happens between 00:09 and 00:13",
    output: "Trim: start 9 s, duration 4 s\nFrame rate: 12 fps\nWidth: 640 px (height follows aspect ratio)\nPass 1: palette generated from the trimmed clip\nPass 2: encoded with that palette\n\nOutput: 1.7 MB, 4 s, 48 frames",
    note: "The trim did most of the work - four seconds instead of twenty-two, taken from the part that actually shows the bug. Twelve frames per second is plenty for a UI recording and cut the frame count by a factor of five against the 60 fps source. Had this been converted whole at full resolution and frame rate, the GIF would have been somewhere in the region of 60 MB, which no issue tracker would accept and nobody would wait for.",
  },
  limitations: [
    "GIF is capped at 256 colours per frame. Gradients, skin tones and film grain will band no matter how good the palette is.",
    "There is no audio. GIF has no sound track and never has.",
    "File sizes grow roughly linearly with duration and frame count. Long clips are not practical in this format.",
    "Conversion runs ffmpeg in your browser on your own CPU, in two passes. Long or high-resolution sources are slow and can exhaust browser memory.",
    "The first run downloads the ffmpeg runtime before anything can start.",
    "One clip at a time, and only a single trim range per conversion.",
  ],
};
