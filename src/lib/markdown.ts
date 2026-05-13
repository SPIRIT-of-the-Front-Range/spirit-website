import { marked } from 'marked';

// Render inline-or-block markdown stored in frontmatter to HTML.
// Astro's astro:content renders body markdown automatically, but structured
// frontmatter fields (per-spread `body`, `marginalia`, etc.) are strings and
// need rendering at build time. Marked runs synchronously at build only.
marked.setOptions({ gfm: true, breaks: false });

const BASE = import.meta.env.BASE_URL;

// Relative-link rewriter: editors write `[label](connect/)` in markdown and we
// prepend BASE_URL so the link works under both '/' and '/spirit-website/' bases.
// External URLs, mailto:, tel:, anchors, and protocol-relative URLs pass through.
function rewriteRelativeLinks(html: string): string {
  return html.replace(/href="(?!https?:|mailto:|tel:|#|\/\/)([^"]+)"/g, (_, path) => {
    const normalized = String(path).replace(/^\/+/, '');
    return `href="${BASE}${normalized}"`;
  });
}

export function mdToHtml(input: string | undefined | null): string {
  if (!input) return '';
  const raw = marked.parse(input, { async: false }) as string;
  return rewriteRelativeLinks(raw);
}

// Inline variant: strips the wrapping <p> for use inside existing block elements
// (eyebrows, marginalia phrases, etc.) where a paragraph would break the layout.
export function mdToInline(input: string | undefined | null): string {
  const html = mdToHtml(input).trim();
  return html.replace(/^<p>([\s\S]*)<\/p>$/, '$1');
}
