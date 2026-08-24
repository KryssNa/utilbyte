# Contributing to UtilByte

Thanks for your interest in contributing to UtilByte! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding a New Tool](#adding-a-new-tool)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold respectful and inclusive behavior.

## Getting Started

### Prerequisites

- Node.js 18.18+
- npm 9+

### Setup

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/utilbyte.git
cd utilbyte

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Turbopack, port 3000) |
| `npm run build` | Production build |
| `npm run type-check` | TypeScript type checking |

## Development Workflow

1. **Fork & clone** the repository.
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** following the conventions below.
4. **Verify** your changes:
   ```bash
   npm run type-check
   npm run build
   ```
5. **Commit** with a descriptive message (see [Commit Messages](#commit-messages)).
6. **Push** and open a Pull Request against `main`.

## Adding a New Tool

UtilByte makes it straightforward to add new tools. Follow this pattern:

### 1. Create the tool component

Create `src/components/tools/{category}/{ToolName}.tsx`:

```tsx
"use client";

import { ToolLayout } from "@/components/shared/ToolLayout";
import { useState } from "react";

export default function MyTool() {
  // Tool state and logic here

  return (
    <ToolLayout
      title="My Tool"
      description="What this tool does in one sentence."
    >
      {/* Tool UI here */}
    </ToolLayout>
  );
}
```

### 2. Create the page route

Create `src/app/{category}/{tool-slug}/page.tsx`:

```tsx
import MyTool from "@/components/tools/{category}/MyTool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tool - Short Description Free",
  description: "A longer description for search engines (150-160 chars).",
  keywords: ["relevant", "keywords", "for", "seo"],
  openGraph: {
    title: "My Tool - Short Description Free",
    description: "A longer description for social sharing.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Tool - Short Description Free",
    description: "A longer description for Twitter cards.",
  },
  alternates: {
    canonical: "/{category}/{tool-slug}",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "My Tool",
    description: "Tool description for structured data.",
    url: "https://utilbyte.app/{category}/{tool-slug}",
    applicationCategory: "Utility",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://utilbyte.app" },
      { "@type": "ListItem", position: 2, name: "Category", item: "https://utilbyte.app/{category}" },
      { "@type": "ListItem", position: 3, name: "My Tool", item: "https://utilbyte.app/{category}/{tool-slug}" },
    ],
  },
];

export default function MyToolPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MyTool />
    </>
  );
}
```

### 3. Register the tool

Add the tool to the navigation data in `src/components/layout/navbar/data.ts` so it appears in the navbar mega menu.

### 4. Add to the sitemap

Add the route to `src/app/sitemap.ts`:

```ts
{
  url: `${baseUrl}/{category}/{tool-slug}`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.8,
},
```

### Key Principles for Tools

- **Client-side only** — All processing must happen in the browser. Never send user data to a server.
- **No external dependencies at runtime** — The tool should work without API keys or backend services (exceptions: Supabase-backed dev tools).
- **Responsive** — Must work on mobile and desktop.
- **Accessible** — Use semantic HTML, proper labels, and keyboard navigation.
- **Dark mode** — Use Tailwind's `dark:` variants. Test in both themes.

## Code Style

### TypeScript

- Use TypeScript for all files. Avoid `any` types.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Use descriptive variable and function names.

### React

- Use functional components with hooks.
- Mark client components with `"use client"` at the top of the file.
- Server components (pages) should be minimal — just metadata + the tool component.
- Use `@/` path aliases (maps to `src/`).

### Styling

- Use Tailwind CSS utility classes.
- Follow the existing design system tokens defined in `src/app/globals.css`.
- Use the `cn()` utility from `src/lib/utils.ts` for conditional classes.
- Avoid inline styles.

### Components

- Use shadcn/ui primitives from `src/components/ui/` where applicable.
- Follow the existing patterns in `src/components/shared/`.

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]
```

### Types

| Type | Use For |
|------|---------|
| `feat` | New features or tools |
| `fix` | Bug fixes |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, no logic change) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `chore` | Build config, dependencies, tooling |

### Examples

```
feat(image): add webp to png converter
fix(pdf): handle corrupt PDF files gracefully
docs: update contributing guide
chore: bump next.js to 16.2
```

## Pull Requests

1. Keep PRs focused — one feature or fix per PR.
2. Fill out the PR template (provided automatically).
3. Ensure `npm run type-check` and `npm run build` pass.
4. Include screenshots or a screen recording for UI changes.
5. Link any related issues.

### PR Title Format

Use the same format as commit messages:
```
feat(category): short description
```

## Reporting Bugs

Use the [Bug Report](https://github.com/KryssNa/utilbyte/issues/new?template=bug_report.yml) template. Include:

- Steps to reproduce
- Expected vs. actual behavior
- Browser and OS
- Screenshots if applicable

## Requesting Features

Use the [Feature Request](https://github.com/KryssNa/utilbyte/issues/new?template=feature_request.yml) template. Describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

---

Thank you for helping make UtilByte better!
