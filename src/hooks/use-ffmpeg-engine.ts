"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

export function useFfmpegEngine(setError: (message: string) => void, setProgress: (value: number) => void) {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);
  const cancelEngine = useCallback(() => {
    abortRef.current?.abort(); abortRef.current = null;
    ffmpegRef.current?.terminate(); ffmpegRef.current = null;
    setFfmpegLoaded(false); setFfmpegLoading(false); setProgress(0);
  }, [setProgress]);
  useEffect(() => () => { abortRef.current?.abort(); ffmpegRef.current?.terminate(); }, []);
  const loadFFmpeg = useCallback(async (_retry = 0) => {
    if (ffmpegRef.current?.loaded || abortRef.current) return;
    const abort = new AbortController(); abortRef.current = abort;
    setFfmpegLoading(true); setError("");
    const urls: string[] = [];
    let engine: FFmpeg | null = null;
    const timeout = setTimeout(() => { abort.abort(); engine?.terminate(); }, 45000);
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      if (abort.signal.aborted) return;
      engine = new FFmpeg(); ffmpegRef.current = engine;
      engine.on("progress", ({ progress }) => setProgress(Math.max(0, Math.min(100, Math.round(progress * 100)))));
      const base = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
      const resources = await Promise.all(["ffmpeg-core.js", "ffmpeg-core.wasm"].map(async name => {
        const response = await fetch(`${base}/${name}`, { signal: abort.signal });
        if (!response.ok) throw new Error("Runtime download failed.");
        const blob = await response.blob();
        if (abort.signal.aborted) throw new Error("Cancelled.");
        const url = URL.createObjectURL(new Blob([blob], { type: name.endsWith("wasm") ? "application/wasm" : "text/javascript" }));
        urls.push(url); return url;
      }));
      await engine.load({ coreURL: resources[0], wasmURL: resources[1] });
      if (abort.signal.aborted || ffmpegRef.current !== engine) return;
      setFfmpegLoaded(true);
    } catch {
      abort.abort(); engine?.terminate();
      if (ffmpegRef.current === engine) ffmpegRef.current = null;
      if (abortRef.current === abort) setError("Unable to load the video engine, or loading timed out. Retry when connected.");
    } finally {
      clearTimeout(timeout); urls.forEach(url => URL.revokeObjectURL(url));
      if (abortRef.current === abort) { abortRef.current = null; setFfmpegLoading(false); }
    }
  }, [setError, setProgress]);
  return { ffmpegRef, ffmpegLoaded, ffmpegLoading, loadAttempts: 0, loadFFmpeg, cancelEngine };
}
