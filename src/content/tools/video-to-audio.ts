import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const videoToAudioArticle: ToolArticleContent = {
  intro: [
    "The usual reason for pulling audio out of a video is that the video part is irrelevant. A recorded lecture you want to listen to on a commute. A conference talk you want as a podcast episode. A voice note somebody sent as a screen recording. An interview you need to transcribe.",
    "Stripping the picture also makes the file dramatically smaller, because in almost any recording the video stream is where nearly all the bytes are. An hour-long lecture that takes up a gigabyte on disk becomes something like eighty megabytes of speech.",
    "This page runs FFmpeg in your browser. It discards the video and re-encodes an audio stream as MP3, AAC, M4A, OGG or WAV at a 44.1 kHz sample rate. Compressed formats request 192 kbps; WAV uses 16-bit PCM instead of that bitrate target.",
  ],
  sections: [
    {
      heading: "This re-encodes, and that is worth knowing",
      body: [
        "There are two ways to get audio out of a video. You can copy the existing audio stream out of its container without touching it, which is instant and lossless. Or you can decode it and encode it again into a different format, which takes time and loses a little quality.",
        "This tool re-encodes rather than copying the original stream. It requests 192 kbps for compressed formats. WAV is uncompressed PCM, with size determined by sample rate, bit depth, duration and channel count.",
        "Listen to the exported file before discarding the source. Converting compressed audio to another compressed format adds a lossy encoding step, and audibility depends on the source and codec. Use a desktop stream-copy workflow when you need the original encoded audio unchanged.",
        "WAV uses uncompressed 16-bit PCM. Converting a source with a different sample rate or bit depth can still change it, and WAV cannot recover detail already lost in a compressed source.",
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
        "The fixed bitrate is a default, not an assessment of your recording. Speech may be usable at lower bitrates, but this page does not offer bitrate controls. Compare a sample in a configurable encoder if file size is critical.",
        "Music, background noise, channel count and the selected codec affect the result. A bitrate value alone does not guarantee perceptual quality.",
        "If file size matters more than fidelity for a spoken-word recording, re-encoding the output down afterwards will shrink it considerably. If quality is what matters, remember you are already on the second generation of lossy compression.",
      ],
    },
    {
      heading: "The practical size difference",
      body: [
        "This is the part people underestimate. In a typical recording, the video stream carries somewhere between ten and fifty times the data of the audio stream.",
        "Audio-only output removes the video stream. At a constant 192 kbps, an hour of audio is approximately 86.4 MB before container overhead; that calculation is an estimate, not a measured result or a file-size guarantee.",
        "This is why extraction is such a good move for anything you intend to listen to rather than watch. It also makes the file practical to email, sync to a phone, or feed into a transcription tool that charges by the megabyte.",
      ],
    },
  ],
  example: {
    title: "A recorded lecture converted for offline listening",
    input: "lecture-week-4.mp4\n1280 x 720, 30 fps, 1 h 12 m\n420 MB\nAudio: AAC stereo inside the container",
    output: "Video stream discarded\nAudio re-encoded: MP3, 192 kbps, 44.1 kHz\n\nOutput: lecture-week-4.mp3\n103 MB, 1 h 12 m",
    note: "Illustrative size estimate: 72 minutes at 192 kbps is about 103.7 MB before container overhead. The input is within the 500 MB limit, but available browser memory may still prevent conversion. AAC to MP3 adds a lossy encoding step; listen to the actual output.",
  },
  limitations: [
    "Audio is re-encoded at 44.1 kHz; compressed formats request 192 kbps and WAV uses 16-bit PCM. There is no stream-copy mode or bitrate control.",
    "That means a second generation of lossy compression when the source audio was already compressed - inaudible for speech, occasionally noticeable on music.",
    "Input is limited to one file up to 500 MB. Browser memory and CPU can impose lower practical limits, especially on a phone.",
    "The first run downloads the ffmpeg runtime before anything can start.",
    "There is no audio-track selector. FFmpeg chooses an audio stream automatically; alternate tracks cannot be selected through this interface.",
    "One file at a time.",
  ],
};
