import CopyButton from "./CopyButton";

/** Keep the displayed text server-rendered and copy exactly the same value. */
export default function CopyBlock({ value, label, multiline = false }: { value: string; label: string; multiline?: boolean }) {
  return <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-background">
    {multiline ? <>
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-3 py-1"><span className="text-xs font-medium text-muted-foreground">{label}</span><CopyButton value={value} label={label} /></div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed"><code>{value}</code></pre>
    </> : <div className="flex items-center gap-2 py-1 pl-3 pr-1"><code className="min-w-0 flex-1 select-all whitespace-pre-wrap break-all text-sm">{value}</code><CopyButton value={value} label={label} /></div>}
  </div>;
}
