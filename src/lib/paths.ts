// Resolve a path against Astro's BASE_URL.
// Tolerant of leading slashes so content authors and Decap uploads (which
// prefix '/') both render correctly under '/' or '/spirit-website/' bases.
export function basePath(p: string): string {
  const base = import.meta.env.BASE_URL;
  const normalized = p.replace(/^\/+/, '');
  return base + normalized;
}

// Resolve a CTA link from a content field. Handles three forms:
//   1. http(s):// — external, gets rel="noopener"
//   2. mailto:/tel: — passthrough, no base prefix
//   3. relative path — gets BASE_URL prepended
export interface ResolvedLink {
  href: string;
  rel: string | undefined;
  isMailto: boolean;
}

export function resolveLink(href: string): ResolvedLink {
  const isHttp = /^https?:/i.test(href);
  const isMailto = /^mailto:/i.test(href);
  const isTel = /^tel:/i.test(href);
  return {
    href: isHttp || isMailto || isTel ? href : basePath(href),
    rel: isHttp ? 'noopener' : undefined,
    isMailto,
  };
}
