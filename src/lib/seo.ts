// Small helpers for page metadata.

export type Crumb = { name: string; href?: string };

// Shortens text on a word boundary so generated meta descriptions never end mid-word.
export function clip(text: string, max = 155): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:–—-]+$/, '') + '…';
}
