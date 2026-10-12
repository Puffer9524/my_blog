export interface SearchEntry {
  title: string;
  url: string;
  kind: string;
  description: string;
  tags: string[];
  body: string;
}

export function normalizeSearch(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

export function searchTerms(query: string): string[] {
  return [...new Set(normalizeSearch(query).split(' ').filter(Boolean))];
}

/** Plain text for search, preserving prose and code but excluding Markdown URLs. */
export function markdownToText(markdown: string): string {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*\[[^\]]+\]:\s+\S+.*$/gm, ' ')
    .replace(/!?\[([^\]]*)\]\([^\n]*?\)/g, '$1')
    .replace(/!?\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/^\s*(`{3,}|~{3,}).*$/gm, ' ')
    .replace(/:{1,3}[\w-]+(?:\[([^\]]*)\])?(?:\{[^}]*\})?/g, '$1')
    .replace(/\{\.[^}]+\}/g, '')
    .replace(/^[\s#>:-]+|[*`~]/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function prepareSearch(entries: SearchEntry[]) {
  return entries.map((entry) => ({
    entry,
    title: normalizeSearch(entry.title),
    tags: entry.tags.map(normalizeSearch).join(' '),
    description: normalizeSearch(entry.description),
    body: normalizeSearch(entry.body),
  }));
}

export function findSearchResults(index: ReturnType<typeof prepareSearch>, query: string) {
  const terms = searchTerms(query);
  if (!terms.length) return [];

  return index.map((item) => {
    let score = 0;
    for (const term of terms) {
      const termScore = (item.title.includes(term) ? 12 : 0)
        + (item.tags.includes(term) ? 8 : 0)
        + (item.description.includes(term) ? 4 : 0)
        + (item.body.includes(term) ? 1 : 0);
      if (!termScore) return { entry: item.entry, score: 0 };
      score += termScore;
    }
    if (item.title === normalizeSearch(query)) score += 20;
    return { entry: item.entry, score };
  }).filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.entry);
}

export function searchExcerpt(entry: SearchEntry, query: string): string {
  const terms = searchTerms(query);
  const text = [entry.description, entry.body].filter(Boolean).join(' ');
  const normalized = normalizeSearch(text);
  const positions = terms.map((term) => normalized.indexOf(term)).filter((i) => i >= 0);
  const match = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, match - 36);
  return `${start ? '…' : ''}${text.slice(start, start + 140)}${text.length > start + 140 ? '…' : ''}`;
}
