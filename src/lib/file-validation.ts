export interface FileLike { name: string; size: number; type: string; }
export function validateFile<T extends FileLike>(file: T, accept: string, maxSize: number): string | null {
  if (!file || file.size === 0) return "The selected file is empty.";
  if (file.size > maxSize) return `File exceeds the ${Math.round(maxSize / 1024 / 1024)} MB limit.`;
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  const types = accept.split(",").map(type => type.trim().toLowerCase());
  if (accept !== "*" && !types.some(type => type.startsWith(".") ? type === extension : type.endsWith("/*") ? file.type.toLowerCase().startsWith(type.slice(0, -1)) : type === file.type.toLowerCase())) return "The selected file type is not accepted.";
  return null;
}
