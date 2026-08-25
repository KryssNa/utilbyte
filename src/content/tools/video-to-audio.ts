import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const videoToAudioArticle: ToolArticleContent = {
  intro: [
    "The usual reason for pulling audio out of a video is that the video part is irrelevant. A recorded lecture you want to listen to on a commute. A conference talk you want as a podcast episode. A voice note somebody sent as a screen recording. An interview you need to transcribe.",
    "Stripping the picture also makes the file dramatically smaller, because in almost any recording the video stream is where nearly all the bytes are. An hour-long lecture that takes up a gigabyte on disk becomes something like eighty megabytes of speech.",
    "This page runs ffmpeg in your browser to do it. The video stream is discarded and the audio is encoded to the format you choose - MP3, AAC, M4A, OGG or WAV - at 192 kbps and a 44.1 kHz sample rate.",
  ],
  sections: [
    {
      heading: "This re-encodes, and that is worth knowing",
      body: [
        "There are two ways to get audio out of a video. You can copy the existing audio stream out of its container without touching it, which is instant and lossless. Or you can decode it and encode it again into a different format, which takes time and loses a little quality.",
        "This tool does the second one. Every output goes through a fresh encode at 192 kbps, regardless of what was in the source.",
        "For speech that is comfortably transparent - 192 kbps is well above what a lecture or a podcast needs, and you will not hear the difference. For music that was already compressed once inside the video, you are stacking a second lossy encode on the first. It is usually still fine, but it is not free, and if you need a pristine copy of the audio you should extract it with a desktop tool that can stream-copy instead.",
        "WAV is the exception in the list: it is uncompressed, so nothing is discarded at the encode step, but the file is roughly ten times the size of the MP3 and it still cannot recover detail the source had already lost.",
      ],
    },
    {
      heading: "Which format to pick",
      body: [
        "MP3 is the default for a reason. Every device, car stereo, podcast app and ancient piece of software will play it. If you are not sure, this is the answer.",
        "AAC and M4A are technically better at the same bitrate and are what Apple devices prefer natively. M4A is the same AAC audio in a different container. Choose these if the destination is a phone or a modern media library.",
        "OGG Vorbis is efficient and fully open, and is the right choice if you are feeding it to something that prefers open formats. Support in consumer hardware is patchier.",
        "WAV is uncompressed. Pick it when the audio is going into an editor, a transcription pipeline or any further processing where you do not want compression artefacts compounding. Do not pick it for listening - a one hour recording will be around six hundred megabytes.",
      ],
      bullets: [
        "MP3: universal compatibility, the safe default.",
        "AAC / M4A: better quality per bit, best on Apple devices.",
        "OGG: open format, efficient, less universal hardware support.",
        "WAV: uncompressed, large, for editing and transcription rather than listening.",
      ],
    },
    {
      heading: "What 192 kbps means for what you are extracting",
      body: [
        "Bitrate is the amount of data spent per second of audio, and the right amount depends entirely on the content.",
        "Speech is simple to encode. A single voice in a quiet room is well served by 64 to 96 kbps, so 192 is generous - you are getting a file about twice the size it needs to be, with no audible benefit. That is a reasonable default for a tool that cannot know what you have given it, but it does mean lecture recordings come out larger than they strictly need to.",
        "Music is the opposite. 192 kbps is a sensible middle for stereo music, above the point where most people hear artefacts on most material and below the point of diminishing returns.",
        "If file size matters more than fidelity for a spoken-word recording, re-encoding the output down afterwards will shrink it considerably. If quality is what matters, remember you are already on the second generation of lossy compression.",
      ],
    },
    {
      heading: "The practical size difference",
      body: [
        "This is the part people underestimate. In a typical recording, the video stream carries somewhere between ten and fifty times the data of the audio stream.",
        "A one hour 720p lecture recorded at around 1500 kbps is roughly 700 megabytes. The audio inside it, at 192 kbps, is about 86 megabytes. Extracting it therefore removes about 88 percent of the file while losing nothing you were going to look at.",
        "This is why extraction is such a good move for anything you intend to listen to rather than watch. It also makes the file practical to email, sync to a phone, or feed into a transcription tool that charges by the megabyte.",
      ],
    },
  ],
  example: {
    title: "A recorded lecture converted for offline listening",
    input: "lecture-week-4.mp4\n1280 x 720, 30 fps, 1 h 12 m\n842 MB\nAudio: AAC stereo inside the container",
    output: "Video stream discarded\nAudio re-encoded: MP3, 192 kbps, 44.1 kHz\n\nOutput: lecture-week-4.mp3\n103 MB, 1 h 12 m",
    note: "Eight times smaller, and nothing lost that a listener would notice. Two things worth flagging: the audio was already AAC inside the container, so this is a second lossy encode rather than a straight extraction - inaudible for a lecture, but real. And at 192 kbps for a single speaker the file is roughly twice the size it needs to be; 96 kbps would have produced about 52 MB with no audible difference on speech.",
  },
  limitations: [
    "Audio is always re-encoded at 192 kbps and 44.1 kHz. There is no option to copy the original stream untouched, and no bitrate control.",
    "That means a second generation of lossy compression when the source audio was already compressed - inaudible for speech, occasionally noticeable on music.",
    "Long recordings are limited by browser memory and CPU. An hour-long file will take a while and may struggle on a phone.",
    "The first run downloads the ffmpeg runtime before anything can start.",
    "Only the primary audio track is extracted. Multi-track sources, alternate language tracks and surround layouts are not handled.",
    "One file at a time.",
  ],
};
