"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFfmpegEngine } from "@/hooks/use-ffmpeg-engine";
import { fetchFile } from "@ffmpeg/util";
import { AlertCircle, CheckCircle, Download, FileVideo, Music, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { videoToAudioArticle } from "@/content/tools/video-to-audio";

type AudioFormat = "mp3" | "wav" | "aac" | "ogg" | "m4a";

export default function VideoToAudio() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFormat, setAudioFormat] = useState<AudioFormat>("mp3");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [processedAudio, setProcessedAudio] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const { ffmpegRef, ffmpegLoaded, ffmpegLoading, loadAttempts, loadFFmpeg, cancelEngine } = useFfmpegEngine(setError, setProgress);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError("Please select a valid video file.");
        return;
      }

      if (file.size > 500 * 1024 * 1024) { // 500MB limit
        setError("File size must be less than 500MB.");
        return;
      }

      setVideoFile(file);
      setProcessedAudio(null);
      setError("");
      setProgress(0);

      // Load FFmpeg when file is selected
      loadFFmpeg();
    }
  }, [loadFFmpeg]);

  const extractAudio = useCallback(async () => {
    if (!videoFile || !ffmpegLoaded || !ffmpegRef.current) return;

    setIsProcessing(true);
    setProgress(0);
    setError("");

    try {
      const ffmpeg = ffmpegRef.current;

      // Write input file to FFmpeg file system
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

      // Determine output format and codec
      let outputFile = "output.mp3";
      let codec = "libmp3lame";

      switch (audioFormat) {
        case "mp3":
          outputFile = "output.mp3";
          codec = "libmp3lame";
          break;
        case "wav":
          outputFile = "output.wav";
          codec = "pcm_s16le";
          break;
        case "aac":
          outputFile = "output.m4a";
          codec = "aac";
          break;
        case "ogg":
          outputFile = "output.ogg";
          codec = "libvorbis";
          break;
        case "m4a":
          outputFile = "output.m4a";
          codec = "aac";
          break;
      }

      // Extract audio using FFmpeg
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vn", // No video
        "-acodec", codec,
        "-ab", "192k", // Bitrate
        "-ar", "44100", // Sample rate
        "-y", // Overwrite output
        outputFile
      ]);

      // Read the output file
      const data = await ffmpeg.readFile(outputFile);
      if (ffmpegRef.current !== ffmpeg || !ffmpeg.loaded) return;
      const blob = new Blob([data as unknown as BlobPart], { type: `audio/${audioFormat}` });
      const url = URL.createObjectURL(blob);

      setProcessedAudio(url);
      toast.success(`Audio extracted successfully as ${audioFormat.toUpperCase()}!`);

      // Clean up
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile(outputFile);

    } catch (err) {
      console.error("Audio extraction failed:", err);
      setError("Failed to extract audio. Please try again.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [videoFile, audioFormat, ffmpegLoaded]);

  const downloadAudio = useCallback(() => {
    if (!processedAudio) return;

    const link = document.createElement('a');
    link.href = processedAudio;
    link.download = `extracted-audio.${audioFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Audio downloaded!");
  }, [processedAudio, audioFormat]);

  const resetTool = () => {
    setVideoFile(null);
    setProcessedAudio(null);
    setError("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const audioFormats = [
    { value: "mp3", label: "MP3", description: "Universal format, good quality" },
    { value: "wav", label: "WAV", description: "Uncompressed, highest quality" },
    { value: "aac", label: "AAC", description: "Good quality, smaller files" },
    { value: "ogg", label: "OGG", description: "Open format, good compression" },
    { value: "m4a", label: "M4A", description: "Container for AAC audio" },
  ];

  const faqs = [
    {
      question: "What video formats are supported?",
      answer: "Most common video formats are supported including MP4, AVI, MOV, MKV, WMV, FLV, and more. The tool works entirely in your browser.",
    },
    {
      question: "How long does processing take?",
      answer: "Processing time depends on video length and your device. Short videos process quickly, while longer videos may take several minutes.",
    },
    {
      question: "Is my video uploaded to a server?",
      answer: "No! All processing happens locally in your browser. Your video file never leaves your device for privacy and security.",
    },
    {
      question: "What audio quality can I expect?",
      answer: "Audio is extracted at high quality (192kbps for MP3, 44.1kHz sample rate). WAV format provides lossless quality.",
    },
  ];

  return (
    <ToolLayout
      article={videoToAudioArticle}
      title="Video to Audio Converter"
      description="Extract audio tracks from video files. Convert videos to MP3, WAV, AAC, OGG, and M4A formats with high quality audio extraction."
      category="video"
      categoryLabel="Video Tools"
      icon={Music}
      faqs={faqs}
      relatedTools={[
        { title: "Video Compressor", description: "Reduce video file size", href: "/video-tools/compress-video", icon: Music, category: "video" },
        { title: "Video to GIF", description: "Convert video to GIF", href: "/video-tools/video-to-gif", icon: Music, category: "video" },
        { title: "QR Code", description: "Generate QR codes", href: "/utility-tools/qr-code", icon: Music, category: "video" },
      ]}
    >
      {(ffmpegLoading || isProcessing) && <Button variant="outline" className="mb-4" onClick={() => { cancelEngine(); setIsProcessing(false); setError("Cancelled. Your selected file is unchanged. Reload the engine to try again."); }}>Cancel processing</Button>}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Video File</CardTitle>
            <CardDescription>Select a video file to extract audio from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {videoFile ? (
                <div className="space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <div>
                    <p className="font-medium">{videoFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(videoFile.size)} • {videoFile.type}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                      Change File
                    </Button>
                    <Button onClick={resetTool} variant="outline">
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileVideo className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">Drop a video file here or click to browse</p>
                    <p className="text-sm text-muted-foreground">
                      Supports MP4, AVI, MOV, MKV, WMV, FLV and more • Max 500MB
                    </p>
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Video File
                  </Button>
                </div>
              )}
            </div>

            {videoFile && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">Output Format</label>
                  <Select value={audioFormat} onValueChange={(value) => setAudioFormat(value as AudioFormat)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audioFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div>
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-muted-foreground">{format.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={extractAudio}
                    disabled={!ffmpegLoaded || isProcessing}
                    className="px-8"
                  >
                    {isProcessing ? "Extracting..." : "Extract Audio"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Processing Status */}
        {isProcessing && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing video...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}￼Advanced Settings

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Result */}
        {processedAudio && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Audio Extracted Successfully
              </CardTitle>
              <CardDescription>
                Your audio has been extracted as {audioFormat.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <audio controls className="w-full">
                  <source src={processedAudio} type={`audio/${audioFormat}`} />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <div className="flex gap-2">
                <Button onClick={downloadAudio} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download {audioFormat.toUpperCase()}
                </Button>
                <Button onClick={resetTool} variant="outline">
                  Process Another Video
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FFmpeg Loading Status */}
        {ffmpegLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <span className="text-sm">
                    Loading video processing engine...
                    {loadAttempts > 0 && ` (Retry ${loadAttempts}/3)`}
                  </span>
                </div>
                {progress > 0 && progress < 100 && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Downloading components...</div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading Error with Retry */}
        {!ffmpegLoading && !ffmpegLoaded && error && loadAttempts >= 3 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-destructive">
                  <div className="h-4 w-4 rounded-full bg-destructive/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Failed to load processing engine</span>
                    <p className="text-xs text-muted-foreground mt-1">Video processing unavailable</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{error}</p>

                  <div className="flex gap-2">
                    <Button onClick={() => loadFFmpeg(0)} variant="outline" size="sm">
                      Try Again
                    </Button>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                      Refresh Page
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <strong>Troubleshooting tips:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• Check your internet connection</li>
                      <li>• Try using a different browser (Chrome recommended)</li>
                      <li>• Disable browser extensions temporarily</li>
                      <li>• Allow third-party cookies if blocked</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Processing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h5 className="font-medium">Best Practices</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use high-quality source videos for better audio</li>
                  <li>• MP3 format offers good balance of quality and size</li>
                  <li>• WAV format preserves original audio quality</li>
                  <li>• Processing happens locally in your browser</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium">Supported Formats</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• MP4, AVI, MOV, MKV, WMV</li>
                  <li>• FLV, WebM, 3GP</li>
                  <li>• MP3, WAV, AAC, OGG output</li>
                  <li>• Up to 500MB file size</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
