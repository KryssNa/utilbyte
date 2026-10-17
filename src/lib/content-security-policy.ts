/** A fresh nonce is supplied by proxy.ts for each HTML response. */
export function contentSecurityPolicy(nonce: string, development = false): string {
  return [
    "default-src 'self'",
    // AdSense propagates this nonce to its dynamically loaded scripts.
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' 'unsafe-inline' https: http: blob:`,
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    // Google ads/CMP and the API/WebSocket tools use external connections.
    `connect-src 'self' blob: data: https: wss:${development ? " http: ws:" : ""}`,
    "frame-src 'self' https: blob: data:",
    "worker-src 'self' blob:",
    "media-src 'self' blob: data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}
