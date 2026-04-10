import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const WIKI_DIR = path.join(process.cwd(), 'wiki');

export interface WikiPage {
  slug: string;
  type: string;      // concept | entity | source | debate | synthesis | map
  title: string;
  aliases: string[];
  created: string;
  updated: string;
  status: string;     // stub | draft | mature
  sources: string[];
  related: string[];
  content: string;    // raw markdown
  htmlContent: string; // rendered HTML with wikilinks converted to <a> tags
  outlinks: string[]; // slugs this page links to via [[wikilinks]]
  // Source-specific fields (optional)
  authors?: string[];
  year?: number;
  source_type?: string;
  url?: string;
  raw_file?: string;
  tags?: string[];
  // Debate-specific
  positions?: string[];
  // Entity-specific
  entity_type?: string;
  affiliation?: string[];
}

// Get all page types (subdirectory names)
const PAGE_TYPES = ['concepts', 'entities', 'sources', 'debates', 'synthesis', 'maps'];

// Extract [[wikilinks]] from markdown content, return array of slugs
function extractWikilinks(content: string): string[] {
  const regex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1].trim());
  }
  return [...new Set(links)]; // deduplicate
}

// Convert [[wikilinks]] in HTML to clickable <a> tags
// [[page-name]] → <a href="/wiki/TYPE/page-name">page-name</a>
// [[page-name|display]] → <a href="/wiki/TYPE/page-name">display</a>
function resolveWikilinks(htmlContent: string, slugToType: Map<string, string>): string {
  return htmlContent.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, slug, display) => {
    const trimmedSlug = slug.trim();
    const type = slugToType.get(trimmedSlug);
    const displayText = display?.trim() || trimmedSlug.replace(/-/g, ' ');
    if (type) {
      return `<a href="/wiki/${type}/${trimmedSlug}" class="wikilink">${displayText}</a>`;
    }
    // Unresolved link — page doesn't exist yet
    return `<span class="wikilink-unresolved">${displayText}</span>`;
  });
}

// Read a single markdown file and parse it
async function parseWikiFile(filePath: string, type: string): Promise<WikiPage> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const slug = path.basename(filePath, '.md');

  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    type: data.type || type.replace(/s$/, ''), // strip trailing 's' from dir name
    title: data.title || slug.replace(/-/g, ' '),
    aliases: data.aliases || [],
    created: data.created || '',
    updated: data.updated || '',
    status: data.status || 'stub',
    sources: data.sources || [],
    related: data.related || [],
    content,
    htmlContent: processedContent.toString(),
    outlinks: extractWikilinks(content),
    // Optional fields
    authors: data.authors,
    year: data.year,
    source_type: data.source_type,
    url: data.url,
    raw_file: data.raw_file,
    tags: data.tags,
    positions: data.positions,
    entity_type: data.entity_type,
    affiliation: data.affiliation,
  };
}

// Get all wiki pages
export async function getAllPages(): Promise<WikiPage[]> {
  const pages: WikiPage[] = [];

  for (const type of PAGE_TYPES) {
    const typeDir = path.join(WIKI_DIR, type);
    if (!fs.existsSync(typeDir)) continue;

    const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const page = await parseWikiFile(path.join(typeDir, file), type);
      pages.push(page);
    }
  }

  return pages;
}

// Get a single page by type and slug
export async function getPage(type: string, slug: string): Promise<WikiPage | null> {
  const filePath = path.join(WIKI_DIR, type, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parseWikiFile(filePath, type);
}

// Get all pages with wikilinks resolved to proper <a> tags
export async function getAllPagesResolved(): Promise<WikiPage[]> {
  const pages = await getAllPages();

  // Build slug → type map for link resolution
  const slugToType = new Map<string, string>();
  for (const page of pages) {
    // Map to the directory name (plural), not the page type
    const dirName = PAGE_TYPES.find(t => t.startsWith(page.type)) || page.type + 's';
    slugToType.set(page.slug, dirName);
  }

  // Resolve wikilinks in all pages
  for (const page of pages) {
    page.htmlContent = resolveWikilinks(page.htmlContent, slugToType);
  }

  return pages;
}

// Get backlinks for a given slug — pages that link TO this page
export async function getBacklinks(slug: string, allPages?: WikiPage[]): Promise<WikiPage[]> {
  const pages = allPages || await getAllPages();
  return pages.filter(p => p.outlinks.includes(slug));
}

// Get all unique slugs (for static generation)
export async function getAllSlugs(): Promise<{ type: string; slug: string }[]> {
  const slugs: { type: string; slug: string }[] = [];

  for (const type of PAGE_TYPES) {
    const typeDir = path.join(WIKI_DIR, type);
    if (!fs.existsSync(typeDir)) continue;

    const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      slugs.push({ type, slug: path.basename(file, '.md') });
    }
  }

  return slugs;
}
