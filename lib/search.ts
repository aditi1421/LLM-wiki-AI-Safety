import { WikiPage } from './wiki';

export interface SearchEntry {
  slug: string;
  type: string;
  title: string;
  aliases: string[];
  status: string;
  excerpt: string; // first 200 chars of content
  url: string;
}

function typeToDir(type: string): string {
  const map: Record<string, string> = {
    concept: 'concepts',
    entity: 'entities',
    source: 'sources',
    debate: 'debates',
    synthesis: 'synthesis',
    map: 'maps',
  };
  return map[type] || type + 's';
}

export function buildSearchIndex(pages: WikiPage[]): SearchEntry[] {
  return pages.map(page => ({
    slug: page.slug,
    type: page.type,
    title: page.title,
    aliases: page.aliases,
    status: page.status,
    excerpt: page.content
      .replace(/^---[\s\S]*?---\n?/, '') // remove frontmatter
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, s, d) => d || s) // strip wikilinks
      .replace(/[#*_>`\[\]]/g, '') // strip markdown
      .trim()
      .substring(0, 200),
    url: `/wiki/${typeToDir(page.type)}/${page.slug}`,
  }));
}
