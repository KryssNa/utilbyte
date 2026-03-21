# Security Policy

## Our Approach

UtilByte is designed with privacy and security as core principles. All tools process data locally in the user's browser — no files are uploaded to any server.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, email us at **hello@utilbyte.app** with:

1. A description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

We will acknowledge your report within **48 hours** and aim to provide a fix within **7 days** for critical issues.

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (`main`) | Yes |
| Older releases | No |

## Security Measures

### Client-Side Processing

All tools run entirely in the browser. User files are never transmitted to our servers or any third party. This eliminates an entire class of server-side vulnerabilities.

### HTTP Security Headers

The application sets the following security headers via `next.config.ts`:

- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation disabled)
- `Content-Security-Policy` (restrictive CSP)

### Dependencies

We regularly review and update dependencies. If you notice an outdated dependency with a known vulnerability, please open an issue or submit a PR.

## Scope

The following are **in scope** for security reports:

- Cross-site scripting (XSS)
- Content Security Policy bypasses
- Data leakage through network requests
- Dependency vulnerabilities with exploitable impact
- Authentication/authorization issues in API routes

The following are **out of scope**:

- Issues requiring physical access to a user's device
- Social engineering
- Denial of service (DoS)
- Issues in third-party services (Sentry, Vercel, Google Analytics)
