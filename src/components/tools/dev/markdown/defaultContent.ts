export const defaultMarkdown = `# Welcome to Markdown Renderer

A powerful, feature-rich markdown editor with **live preview**, syntax highlighting, and advanced formatting tools.

## Getting Started

Start typing in the editor on the left, and watch the preview update in real-time on the right. Use the formatting toolbar above the editor or write markdown syntax directly.

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl + B\` | **Bold** |
| \`Ctrl + I\` | *Italic* |
| \`Ctrl + S\` | Save as .md |

## Text Formatting

You can write **bold**, *italic*, ***bold italic***, and ~~strikethrough~~ text. Use \`inline code\` for technical terms.

## Code Blocks

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\\\`/api/users/\\\${id}\\\`);
  return response.json();
}
\`\`\`

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]
\`\`\`

## Tables

| Feature | Status | Description |
|---------|--------|-------------|
| Live Preview | Done | Real-time markdown rendering |
| GFM Support | Done | Tables, task lists, strikethrough |
| Syntax Highlighting | Done | Multi-language code highlighting |
| File Import | Done | Open .md files from disk |
| Multiple Exports | Done | HTML, Markdown, and plain text |
| Table of Contents | Done | Auto-generated from headings |

## Task Lists

- [x] Build the markdown editor
- [x] Add live preview with GFM
- [x] Implement syntax highlighting
- [x] Add formatting toolbar
- [x] Table of contents generation
- [ ] Collaborate in real-time

## Blockquotes

> "The best way to predict the future is to invent it."
>
> -- Alan Kay

> **Tip:** You can nest blockquotes for multi-level citations.
>
> > This is a nested blockquote with important context.

## Lists

### Unordered
- First item
- Second item
  - Nested item A
  - Nested item B
    - Deep nested

### Ordered
1. Step one
2. Step two
   1. Sub-step
   2. Another sub-step
3. Step three

## Links & Images

Visit [GitHub](https://github.com) for more information.

---

*Built with React, TypeScript, and remark/rehype*
`;
