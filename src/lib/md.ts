import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

export function md(input: string | undefined | null): string {
  if (!input) return '';
  return marked.parse(input.trim(), { async: false }) as string;
}

export function mdInline(input: string | undefined | null): string {
  if (!input) return '';
  return marked.parseInline(input.trim(), { async: false }) as string;
}
