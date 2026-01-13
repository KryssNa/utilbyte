"use client";

import { Button } from "@/components/ui/button";
import { cn, formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, File, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";

interface FileDropZoneProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function FileDropZone({
  onFilesSelected,
  accept = "*",
  multiple = false,
  maxSize = 50 * 1024 * 1024, // 50MB default
  maxFiles = 10,
  className,
  children,
}: FileDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isPageDrag, setIsPageDrag] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  // Validate files helper (defined first so it can be used by processDroppedFiles)
  const validateFiles = useCallback(
    (fileList: File[]): File[] => {
      const validFiles: File[] = [];
      const acceptedTypes = accept.split(",").map((t) => t.trim());

      for (const file of fileList) {
        if (file.size > maxSize) {
          setError(
            `File "${file.name}" exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`
          );
          continue;
        }

        if (accept !== "*") {
          const fileType = file.type;
          const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
          const isAccepted = acceptedTypes.some((type) => {
            if (type.startsWith(".")) {
              return fileExt === type.toLowerCase();
            }
            if (type.endsWith("/*")) {
              return fileType.startsWith(type.replace("/*", "/"));
            }
            return fileType === type;
          });

          if (!isAccepted) {
            setError(`File "${file.name}" is not an accepted file type`);
            continue;
          }
        }

        validFiles.push(file);
      }

      return validFiles;
    },
    [accept, maxSize]
  );

  // Process dropped files (shared logic for both local and global drops)
  const processDroppedFiles = useCallback(
    (droppedFiles: File[]) => {
      setError(null);
      const filesToAdd = multiple ? droppedFiles.slice(0, maxFiles) : [droppedFiles[0]];
      const validFiles = validateFiles(filesToAdd);

      if (validFiles.length > 0) {
        const newFiles = multiple ? [...files, ...validFiles].slice(0, maxFiles) : validFiles;
        setFiles(newFiles);
        onFilesSelected?.(newFiles);
      }
    },
    [files, multiple, maxFiles, validateFiles, onFilesSelected]
  );

  // Global page drag detection and drop handling
  useEffect(() => {
    const handleDragEnter = (e: globalThis.DragEvent) => {
      e.preventDefault();
      dragCounterRef.current++;
      if (e.dataTransfer?.types.includes("Files")) {
        setIsPageDrag(true);
        document.body.classList.add("is-dragging-file");
      }
    };

    const handleDragLeave = (e: globalThis.DragEvent) => {
      e.preventDefault();
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setIsPageDrag(false);
        document.body.classList.remove("is-dragging-file");
      }
    };

    const handleGlobalDrop = (e: globalThis.DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsPageDrag(false);
      setIsDragActive(false);
      document.body.classList.remove("is-dragging-file");

      // Process files dropped anywhere on the page
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        processDroppedFiles(droppedFiles);
      }
    };

    const handleDragOver = (e: globalThis.DragEvent) => {
      e.preventDefault();
      // Allow drop
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleGlobalDrop);
    document.addEventListener("dragover", handleDragOver);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleGlobalDrop);
      document.removeEventListener("dragover", handleDragOver);
      document.body.classList.remove("is-dragging-file");
    };
  }, [processDroppedFiles]);

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleLocalDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      // Note: Files will be processed by the global drop handler
    },
    []
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const selectedFiles = Array.from(e.target.files || []);
      const filesToAdd = multiple ? selectedFiles.slice(0, maxFiles) : [selectedFiles[0]];
      const validFiles = validateFiles(filesToAdd);

      if (validFiles.length > 0) {
        const newFiles = multiple ? [...files, ...validFiles].slice(0, maxFiles) : validFiles;
        setFiles(newFiles);
        onFilesSelected?.(newFiles);
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [files, multiple, maxFiles, validateFiles, onFilesSelected]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      onFilesSelected?.(newFiles);
    },
    [files, onFilesSelected]
  );

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
    onFilesSelected?.([]);
  }, [onFilesSelected]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone with Animated Border */}
      <div className={cn("dropzone-wrapper", (isDragActive || isPageDrag) && "is-active")}>
        {/* Animated border element */}
        <i className="animated-border" />

        {/* Actual drop zone */}
        <div
          ref={dropzoneRef}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleLocalDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "drop-zone group cursor-pointer relative z-10",
            isDragActive && "drag-active border-transparent! bg-primary/5 ",
            files.length > 0 && "border-emerald-500/50 bg-emerald-500/5"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {files.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  className={cn(
                    "mb-4 p-4 rounded-2xl transition-colors duration-200",
                    isDragActive || isPageDrag ? "bg-primary/10" : "bg-muted"
                  )}
                  animate={isDragActive || isPageDrag ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isDragActive || isPageDrag ? Infinity : 0 }}
                >
                  <Upload
                    className={cn(
                      "h-8 w-8 transition-colors duration-200",
                      isDragActive || isPageDrag ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </motion.div>
                <p className="text-base font-medium">
                  {isDragActive || isPageDrag ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {multiple ? `Up to ${maxFiles} files, ` : ""}
                  max {Math.round(maxSize / 1024 / 1024)}MB each
                </p>
                {children}
              </motion.div>
            ) : (
              <motion.div
                key="files"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-emerald-500/10">
                    <Check className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
                <p className="text-center text-sm font-medium mb-4">
                  {files.length} file{files.length !== 1 ? "s" : ""} selected
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  Click or drag to add more files
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Selected Files</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFiles();
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="p-2 rounded-md bg-muted">
                    <File className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
