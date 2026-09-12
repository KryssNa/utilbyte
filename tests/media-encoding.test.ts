import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AUDIO_ENCODINGS } from "../src/components/tools/video/VideoToAudio";
import { VIDEO_ENCODINGS } from "../src/components/tools/video/VideoCompressor";
import { OUTPUT_FORMATS } from "../src/components/tools/image/FormatConverter";

test("advertised media encodings produce the expected containers in the actual bundled FFmpeg runtime", async () => {
  // Test the same wasm version loaded by the browser, not the host's FFmpeg.
  const createCore = require("@ffmpeg/core");
  const core = await createCore({ wasmBinary: readFileSync(require.resolve("@ffmpeg/core/wasm")) });
  const logs: string[] = [];
  core.setLogger(({ message }: { message: string }) => logs.push(message));
  function encode(args: string[], filename: string) {
    core.reset();
    const exitCode = core.exec("-hide_banner", ...args, "-y", filename);
    assert.equal(exitCode, 0, logs.slice(-12).join("\n"));
    const bytes = Buffer.from(core.FS.readFile(filename));
    assert.ok(bytes.length > 100, `${filename} contains encoded data`);
    core.FS.unlink(filename);
    return bytes;
  }
  for (const [format, encoding] of Object.entries(AUDIO_ENCODINGS)) {
    const data = encode(["-f", "lavfi", "-i", "sine=frequency=1000:duration=0.1", "-c:a", encoding.codec, "-ar", "44100", "-b:a", "192k", "-f", encoding.muxer], `output.${format}`);
    if (format === "aac") assert.equal(data.readUInt16BE(0) & 0xfff6, 0xfff0, "AAC output has ADTS syncword, not MP4 headers");
    if (format === "m4a") assert.equal(data.toString("ascii", 4, 8), "ftyp", "M4A has an MPEG-4 container header");
    if (format === "wav") assert.equal(data.toString("ascii", 0, 4), "RIFF");
    if (format === "ogg") assert.equal(data.toString("ascii", 0, 4), "OggS");
  }
  const webm = VIDEO_ENCODINGS.webm;
  const data = encode(["-f", "lavfi", "-i", "color=c=black:s=64x64:d=0.1", "-f", "lavfi", "-i", "sine=frequency=1000:duration=0.1", "-c:v", webm.videoCodec, "-c:a", webm.audioCodec, "-b:a", "128k", "-shortest"], "output.webm");
  assert.equal(data.subarray(0, 4).toString("hex"), "1a45dfa3");
  assert.ok(data.includes(Buffer.from("A_OPUS")), "WebM stores an Opus track");
  assert.deepEqual(OUTPUT_FORMATS.map(format => format.value), ["png", "jpeg", "webp", "svg"]);
});
