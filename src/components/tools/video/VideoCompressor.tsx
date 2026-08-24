"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { AlertCircle, CheckCircle, Download, FileVideo, Settings, Upload, Zap } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type VideoFormat = "mp4" | "webm" | "avi";
type QualityPreset = "low" | "medium" | "high" | "custom";

interface CompressionSettings {
  format: VideoFormat;
  quality: QualityPreset;
  resolution: string;
  bitrate: string;
  fps: number;
  customBitrate: number;
  customResolution: string;
}

export default function VideoCompressor() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<CompressionSettings>({
    format: "mp4",
    quality: "medium",
    resolution: "720p",
    bitrate: "1000k",
    fps: 30,
    customBitrate: 1000,
    customResolution: "1280x720",
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [compressedVideo, setCompressedVideo] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [ffmpegLoaded, setFfmpegLoaded] = useState<boolean>(false);
  const [ffmpegLoading, setFfmpegLoading] = useState<boolean>(false);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
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

      if (file.size > 1000 * 1024 * 1024) { // 1GB limit
        setError("File size must be less than 1GB.");
        return;
      }

      setVideoFile(file);
      setCompressedVideo(null);
      setCompressionStats(null);
      setError("");
      setProgress(0);

      // Load FFmpeg when file is selected
      loadFFmpeg();
    }
  }, [loadFFmpeg]);

  const getCompressionSettings = useCallback(() => {
    const presetSettings = {
      low: {
        bitrate: "500k",
        resolution: "480p",
        fps: 24,
      },
      medium: {
        bitrate: "1000k",
        resolution: "720p",
        fps: 30,
      },
      high: {
        bitrate: "2000k",
        resolution: "1080p",
        fps: 30,
      },
      custom: {
        bitrate: `${settings.customBitrate}k`,
        resolution: settings.customResolution,
        fps: settings.fps,
      },
    };

    return presetSettings[settings.quality];
  }, [settings]);

  const getResolutionDimensions = (resolution: string): string => {
    const dimensions = {
      "240p": "426x240",
      "360p": "640x360",
      "480p": "854x480",
      "720p": "1280x720",
      "1080p": "1920x1080",
      "1440p": "2560x1440",
      "2160p": "3840x2160",
    };
    return dimensions[resolution as keyof typeof dimensions] || resolution;
  };

  const compressVideo = useCallback(async () => {
    if (!videoFile || !ffmpegLoaded || !ffmpegRef.current) return;

    setIsProcessing(true);
    setProgress(0);
    setError("");

    try {
      const ffmpeg = ffmpegRef.current;
      const compressionSettings = getCompressionSettings();

      // Write input file to FFmpeg file system
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

      const outputFile = `output.${settings.format}`;
      const resolution = getResolutionDimensions(compressionSettings.resolution);

      // Build FFmpeg command based on settings
      const command = [
        "-i", "input.mp4",
        "-vf", `scale=${resolution}:force_original_aspect_ratio=decrease,pad=${resolution}:(ow-iw)/2:(oh-ih)/2`,
        "-c:v", settings.format === "webm" ? "libvpx-vp9" : "libx264",
        "-b:v", compressionSettings.bitrate,
        "-maxrate", compressionSettings.bitrate,
        "-bufsize", `${parseInt(compressionSettings.bitrate) * 2}k`,
        "-r", compressionSettings.fps.toString(),
        "-c:a", "aac",
        "-b:a", "128k",
        "-y",
        outputFile
      ];

      // Execute compression
      await ffmpeg.exec(command);

      // Read the output file
      const data = await ffmpeg.readFile(outputFile);
      const blob = new Blob([data as unknown as BlobPart], { type: `video/${settings.format}` });
      const url = URL.createObjectURL(blob);

      setCompressedVideo(url);
      setCompressionStats({
        originalSize: videoFile.size,
        compressedSize: blob.size,
        compressionRatio: ((videoFile.size - blob.size) / videoFile.size) * 100,
      });

      toast.success(`Video compressed successfully! Saved ${Math.round(((videoFile.size - blob.size) / videoFile.size) * 100)}%`);

      // Clean up
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile(outputFile);

    } catch (err) {
      console.error("Video compression failed:", err);
      setError("Failed to compress video. Please try again.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [videoFile, ffmpegLoaded, settings, getCompressionSettings]);

  const downloadVideo = useCallback(() => {
    if (!compressedVideo) return;

    const link = document.createElement('a');
    link.href = compressedVideo;
    link.download = `compressed-video.${settings.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Video downloaded!");
  }, [compressedVideo, settings.format]);

  const resetTool = () => {
    setVideoFile(null);
    setCompressedVideo(null);
    setCompressionStats(null);
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

  const qualityPresets = [
    { value: "low", label: "Low Quality", description: "Small file size, lower quality", bitrate: "500k", resolution: "480p" },
    { value: "medium", label: "Medium Quality", description: "Balanced quality and size", bitrate: "1000k", resolution: "720p" },
    { value: "high", label: "High Quality", description: "High quality, larger file", bitrate: "2000k", resolution: "1080p" },
    { value: "custom", label: "Custom Settings", description: "Full control over compression", bitrate: "Custom", resolution: "Custom" },
  ];

  const videoFormats = [
    { value: "mp4", label: "MP4", description: "Universal format, good compression" },
    { value: "webm", label: "WebM", description: "Modern format, excellent compression" },
    { value: "avi", label: "AVI", description: "Legacy format, basic compression" },
  ];

  const faqs = [
    {
      question: "How much can I reduce video file size?",
      answer: "Compression depends on quality settings. Typically 30-80% size reduction is possible while maintaining good quality.",
    },
    {
      question: "Will video quality be affected?",
      answer: "Yes, compression reduces quality to achieve smaller file sizes. Higher quality presets maintain better visual quality.",
    },
    {
      question: "What video formats are supported?",
      answer: "Most common formats including MP4, AVI, MOV, MKV, WMV, FLV, and WebM are supported for compression.",
    },
    {
      question: "Is my video data secure?",
      answer: "Yes! All processing happens locally in your browser. Your video never leaves your device.",
    },
  ];

  return (
    <ToolLayout
      title="Video Compressor"
      description="Compress video files to reduce size while maintaining quality. Support for MP4, WebM, AVI formats with customizable quality settings."
      category="video"
      categoryLabel="Video Tools"
      icon={Zap}
      faqs={faqs}
      relatedTools={[
        { title: "Video to Audio", description: "Extract audio from video", href: "/video-tools/video-to-audio", icon: Zap, category: "video" },
        { title: "Video to GIF", description: "Convert video to GIF", href: "/video-tools/video-to-gif", icon: Zap, category: "video" },
        { title: "Image Compressor", description: "Compress images", href: "/image-tools/compress-image", icon: Zap, category: "video" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="compress" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compress">Compress Video</TabsTrigger>
            <TabsTrigger value="settings">Compression Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="compress" className="space-y-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Video File</CardTitle>
                <CardDescription>Select a video file to compress</CardDescription>
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
                          Supports MP4, AVI, MOV, MKV, WMV, FLV and more • Max 1GB
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

            {/* Compression Controls */}
            {videoFile && (
              <Card>
                <CardHeader>
                  <CardTitle>Compression Settings</CardTitle>
                  <CardDescription>Configure quality and format options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Output Format</label>
                      <Select
                        value={settings.format}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, format: value as VideoFormat }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {videoFormats.map((format) => (
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

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quality Preset</label>
                      <Select
                        value={settings.quality}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, quality: value as QualityPreset }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {qualityPresets.map((preset) => (
                            <SelectItem key={preset.value} value={preset.value}>
                              <div>
                                <div className="font-medium">{preset.label}</div>
                                <div className="text-xs text-muted-foreground">{preset.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={compressVideo}
                      disabled={!ffmpegLoaded || isProcessing}
                      size="lg"
                      className="px-8"
                    >
                      {isProcessing ? "Compressing..." : "Compress Video"}
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
                      <span>Compressing video...</span>
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
            {compressedVideo && compressionStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Video Compressed Successfully
                  </CardTitle>
                  <CardDescription>
                    Compression completed with {Math.round(compressionStats.compressionRatio)}% size reduction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatFileSize(compressionStats.originalSize)}
                      </div>
                      <div className="text-xs text-muted-foreground">Original</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {formatFileSize(compressionStats.compressedSize)}
                      </div>
                      <div className="text-xs text-muted-foreground">Compressed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">
                        {Math.round(compressionStats.compressionRatio)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Saved</div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <video controls className="w-full max-h-64 rounded">
                      <source src={compressedVideo} type={`video/${settings.format}`} />
                      Your browser does not support the video element.
                    </video>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={downloadVideo} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download {settings.format.toUpperCase()}
                    </Button>
                    <Button onClick={resetTool} variant="outline">
                      Compress Another Video
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Compression Settings
                </CardTitle>
                <CardDescription>Fine-tune compression parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Video Bitrate: {settings.customBitrate}k</label>
                    <Slider
                      value={[settings.customBitrate]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, customBitrate: value[0] }))}
                      min={100}
                      max={5000}
                      step={100}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">
                      Lower values = smaller files, higher values = better quality
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Frame Rate: {settings.fps} FPS</label>
                    <Slider
                      value={[settings.fps]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, fps: value[0] }))}
                      min={15}
                      max={60}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Resolution</label>
                    <Select
                      value={settings.customResolution}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, customResolution: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="640x360">360p (640x360)</SelectItem>
                        <SelectItem value="854x480">480p (854x480)</SelectItem>
                        <SelectItem value="1280x720">720p (1280x720)</SelectItem>
                        <SelectItem value="1920x1080">1080p (1920x1080)</SelectItem>
                        <SelectItem value="2560x1440">1440p (2560x1440)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    These settings only apply when using the "Custom Settings" quality preset.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
      </div>
    </ToolLayout>
  );
}
