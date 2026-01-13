"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { AlertCircle, CheckCircle, Download, FileVideo, Image, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface GifSettings {
  startTime: number;
  duration: number;
  width: number;
  fps: number;
  quality: number;
}

export default function VideoToGif() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<GifSettings>({
    startTime: 0,
    duration: 5,
    width: 480,
    fps: 15,
    quality: 80,
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generatedGif, setGeneratedGif] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [ffmpegLoaded, setFfmpegLoaded] = useState<boolean>(false);
  const [ffmpegLoading, setFfmpegLoading] = useState<boolean>(false);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  // Initialize FFmpeg with improved error handling
  const loadFFmpeg = useCallback(async (retryCount = 0) => {
    if (ffmpegLoaded || ffmpegRef.current) return;

    setFfmpegLoading(true);
    setError("");

    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      // Try multiple CDNs for better reliability - using different CDNs to avoid QUIC issues
      const cdns = [
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/umd",
        "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd",
        "https://esm.run/@ffmpeg/core@0.12.4/dist/umd",
        "https://fastly.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/umd"
      ];

      const baseURL = cdns[retryCount % cdns.length];
      console.log(`Attempting to load FFmpeg from: ${baseURL} (attempt ${retryCount + 1})`);

      ffmpeg.on("log", ({ message }) => {
        console.log("FFmpeg log:", message);
      });
      ffmpeg.on("progress", ({ progress: prog }) => {
        const percent = Math.round(prog * 100);
        setProgress(percent);
        console.log(`FFmpeg loading progress: ${percent}%`);
      });

      // Try loading with different strategies
      let loadPromise;

      try {
        console.log("Testing CDN availability and downloading files...");
        console.log("Testing URL:", `${baseURL}/ffmpeg-core.js`);

        // First test if the CDN is reachable
        const testResponse = await fetch(`${baseURL}/ffmpeg-core.js`, {
          method: 'HEAD',
          mode: 'cors'
        });

        if (!testResponse.ok) {
          throw new Error(`CDN not reachable: ${testResponse.status}`);
        }

        console.log("CDN is reachable, downloading FFmpeg files...");

        // Try fetchFile first, then fallback to regular fetch if it fails
        let coreFile, wasmFile;
        try {
          console.log("Trying fetchFile approach...");
          const coreFilePromise = fetchFile(`${baseURL}/ffmpeg-core.js`);
          const wasmFilePromise = fetchFile(`${baseURL}/ffmpeg-core.wasm`);

          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("File download timeout")), 25000);
          });

          [coreFile, wasmFile] = await Promise.race([
            Promise.all([coreFilePromise, wasmFilePromise]),
            timeoutPromise.then(() => { throw new Error("Timeout"); })
          ]);

          console.log("fetchFile successful, sizes:", coreFile.length, wasmFile.length);
        } catch (fetchFileError) {
          console.log("fetchFile failed, trying regular fetch...", fetchFileError);

          // Fallback to regular fetch
          const coreResponse = await fetch(`${baseURL}/ffmpeg-core.js`);
          const wasmResponse = await fetch(`${baseURL}/ffmpeg-core.wasm`);

          if (!coreResponse.ok || !wasmResponse.ok) {
            throw new Error(`Fetch failed: core=${coreResponse.status}, wasm=${wasmResponse.status}`);
          }

          coreFile = new Uint8Array(await coreResponse.arrayBuffer());
          wasmFile = new Uint8Array(await wasmResponse.arrayBuffer());

          console.log("Regular fetch successful, sizes:", coreFile.length, wasmFile.length);
        }

        console.log("Loading FFmpeg with downloaded files...");
        loadPromise = ffmpeg.load({
          coreURL: URL.createObjectURL(new Blob([coreFile as any], { type: 'text/javascript' })),
          wasmURL: URL.createObjectURL(new Blob([wasmFile as any], { type: 'application/wasm' })),
        });
      } catch (downloadError) {
        console.error("File download failed:", downloadError);

        // Try direct loading as fallback
        console.log("Trying direct loading as fallback...");
        try {
          console.log("Using direct URLs for fallback loading");
          loadPromise = ffmpeg.load({
            coreURL: `${baseURL}/ffmpeg-core.js`,
            wasmURL: `${baseURL}/ffmpeg-core.wasm`,
          });
        } catch (directError) {
          console.error("Direct loading also failed:", directError);
          throw new Error(`Loading failed: ${downloadError instanceof Error ? downloadError.message : 'Unknown error'}`);
        }
      }

      // Shorter timeout for faster feedback
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Loading timeout after 45 seconds")), 45000);
      });

      console.log("Starting FFmpeg load with timeout...");
      await Promise.race([loadPromise, timeoutPromise]);

      console.log("FFmpeg loaded successfully!");
      setFfmpegLoaded(true);
      setFfmpegLoading(false);
      setLoadAttempts(0);
      toast.success("Video processing engine loaded successfully!");
    } catch (err) {
      console.error("Failed to load FFmpeg:", err);
      setFfmpegLoading(false);

      if (retryCount < 2) {
        console.log(`Retrying FFmpeg load (attempt ${retryCount + 1})...`);
        setLoadAttempts(retryCount + 1);
        setTimeout(() => loadFFmpeg(retryCount + 1), 1000);
      } else {
        const errorMsg = `Failed to load video processing engine after ${retryCount + 1} attempts. This might be due to network issues, browser restrictions, or CDN problems. Please try refreshing the page or using a different browser.`;
        setError(errorMsg);
        console.error("All FFmpeg loading attempts failed:", err);
        setLoadAttempts(0);
      }
    }
  }, [ffmpegLoaded]);

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
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setGeneratedGif(null);
      setError("");
      setProgress(0);
      setSettings(prev => ({ ...prev, startTime: 0, duration: 5 }));

      // Load FFmpeg when file is selected
      loadFFmpeg();
    }
  }, [loadFFmpeg]);

  const handleVideoLoad = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      // Auto-adjust duration if video is shorter
      if (settings.duration > videoRef.current.duration) {
        setSettings(prev => ({ ...prev, duration: Math.min(5, videoRef.current!.duration) }));
      }
    }
  }, [settings.duration]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const convertToGif = useCallback(async () => {
    if (!videoFile || !ffmpegLoaded || !ffmpegRef.current) return;

    setIsProcessing(true);
    setProgress(0);
    setError("");

    try {
      const ffmpeg = ffmpegRef.current;

      // Write input file to FFmpeg file system
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

      // Calculate height maintaining aspect ratio
      // For GIF conversion, we'll use a default aspect ratio since we don't have video dimensions from File
      const defaultAspectRatio = 16 / 9; // Default aspect ratio
      const height = Math.round(settings.width / defaultAspectRatio);

      // Build FFmpeg command for GIF conversion
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-ss", settings.startTime.toString(),
        "-t", settings.duration.toString(),
        "-vf", `fps=${settings.fps},scale=${settings.width}:${height}:flags=lanczos,palettegen`,
        "-y",
        "palette.png"
      ]);

      await ffmpeg.exec([
        "-i", "input.mp4",
        "-i", "palette.png",
        "-ss", settings.startTime.toString(),
        "-t", settings.duration.toString(),
        "-lavfi", `fps=${settings.fps},scale=${settings.width}:${height}:flags=lanczos [x]; [x][1:v] paletteuse`,
        "-y",
        "output.gif"
      ]);

      // Read the output file
      const data = await ffmpeg.readFile("output.gif");
      const blob = new Blob([data as unknown as BlobPart], { type: "image/gif" });
      const url = URL.createObjectURL(blob);

      setGeneratedGif(url);
      toast.success("GIF created successfully!");

      // Clean up
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("palette.png");
      await ffmpeg.deleteFile("output.gif");

    } catch (err) {
      console.error("GIF conversion failed:", err);
      setError("Failed to convert video to GIF. Please try again.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [videoFile, ffmpegLoaded, settings]);

  const downloadGif = useCallback(() => {
    if (!generatedGif) return;

    const link = document.createElement('a');
    link.href = generatedGif;
    link.download = `animated-gif-${Date.now()}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("GIF downloaded!");
  }, [generatedGif]);

  const resetTool = () => {
    setVideoFile(null);
    setVideoUrl(null);
    setGeneratedGif(null);
    setError("");
    setProgress(0);
    setVideoDuration(0);
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

  const qualityPresets = [
    { label: "Low Quality", width: 320, fps: 10, description: "Small file, basic quality" },
    { label: "Medium Quality", width: 480, fps: 15, description: "Balanced quality and size" },
    { label: "High Quality", width: 640, fps: 20, description: "High quality, larger file" },
  ];

  const faqs = [
    {
      question: "How long can GIFs be?",
      answer: "GIF duration is limited by your settings. We recommend keeping GIFs under 10 seconds for optimal file size and compatibility.",
    },
    {
      question: "What affects GIF quality?",
      answer: "Frame rate (FPS), resolution, and the original video quality all affect the final GIF. Higher settings produce better quality but larger files.",
    },
    {
      question: "Why use GIF instead of video?",
      answer: "GIFs are universally supported, autoplay in most contexts, and work well for short clips, memes, and demonstrations.",
    },
    {
      question: "Can I edit the start time and duration?",
      answer: "Yes! You can specify exactly which part of the video to convert to GIF by setting the start time and duration.",
    },
  ];

  return (
    <ToolLayout
      title="Video to GIF Converter"
      description="Convert video clips to animated GIFs. Extract specific segments with customizable quality, size, and frame rate settings."
      category="video"
      categoryLabel="Video Tools"
      icon={Image}
      faqs={faqs}
      relatedTools={[
        { title: "Video to Audio", description: "Extract audio from video", href: "/video-tools/video-to-audio", icon: Image, category: "video" },
        { title: "Video Compressor", description: "Compress video files", href: "/video-tools/compress-video", icon: Image, category: "video" },
        { title: "Image to PDF", description: "Convert images to PDF", href: "/pdf-tools/image-to-pdf", icon: Image, category: "video" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Video File</CardTitle>
            <CardDescription>Select a video file to convert to GIF</CardDescription>
          </CardHeader>
          <CardContent>
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

                  {/* Video Preview */}
                  {videoUrl && (
                    <div className="mt-4">
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="max-w-full max-h-48 mx-auto rounded"
                        onLoadedMetadata={handleVideoLoad}
                        controls
                      />
                      {videoDuration > 0 && (
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          Duration: {formatTime(videoDuration)}
                        </p>
                      )}
                    </div>
                  )}

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
          </CardContent>
        </Card>

        {/* GIF Settings */}
        {videoFile && (
          <Card>
            <CardHeader>
              <CardTitle>GIF Settings</CardTitle>
              <CardDescription>Customize your GIF conversion parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Presets */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quality Presets</Label>
                <div className="grid grid-cols-3 gap-2">
                  {qualityPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        width: preset.width,
                        fps: preset.fps,
                      }))}
                      className="h-auto p-3 text-left"
                    >
                      <div>
                        <div className="font-medium text-xs">{preset.label}</div>
                        <div className="text-xs text-muted-foreground">{preset.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Settings */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time: {formatTime(settings.startTime)}</Label>
                  <Slider
                    value={[settings.startTime]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, startTime: value[0] }))}
                    min={0}
                    max={Math.max(0, videoDuration - settings.duration)}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration: {formatTime(settings.duration)}</Label>
                  <Slider
                    value={[settings.duration]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, duration: value[0] }))}
                    min={1}
                    max={Math.min(30, videoDuration - settings.startTime)}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Quality Settings */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Width: {settings.width}px</Label>
                  <Slider
                    value={[settings.width]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, width: value[0] }))}
                    min={240}
                    max={1280}
                    step={40}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>FPS: {settings.fps}</Label>
                  <Slider
                    value={[settings.fps]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, fps: value[0] }))}
                    min={5}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quality: {settings.quality}%</Label>
                  <Slider
                    value={[settings.quality]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, quality: value[0] }))}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={convertToGif}
                  disabled={!ffmpegLoaded || isProcessing}
                  size="lg"
                  className="px-8"
                >
                  {isProcessing ? "Converting..." : "Convert to GIF"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Converting video to GIF...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Result */}
        {generatedGif && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                GIF Created Successfully
              </CardTitle>
              <CardDescription>
                Your video has been converted to an animated GIF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* GIF Preview */}
              <div className="flex justify-center">
                <img
                  src={generatedGif}
                  alt="Generated GIF"
                  className="max-w-full max-h-96 rounded-lg shadow-sm"
                />
              </div>

              {/* GIF Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-1">Width</Badge>
                  <div className="text-sm">{settings.width}px</div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="mb-1">FPS</Badge>
                  <div className="text-sm">{settings.fps}</div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="mb-1">Duration</Badge>
                  <div className="text-sm">{settings.duration}s</div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="mb-1">Quality</Badge>
                  <div className="text-sm">{settings.quality}%</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={downloadGif} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download GIF
                </Button>
                <Button onClick={resetTool} variant="outline">
                  Create Another GIF
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
            <CardTitle>GIF Creation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h5 className="font-medium">Optimization Tips</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Keep GIFs under 10 seconds for best performance</li>
                  <li>• Lower FPS (10-15) for smoother playback</li>
                  <li>• Smaller dimensions load faster</li>
                  <li>• Use high contrast colors for better visibility</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium">Best Use Cases</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Short video clips and animations</li>
                  <li>• Memes and social media content</li>
                  <li>• Tutorials and demonstrations</li>
                  <li>• Loading animations and placeholders</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
