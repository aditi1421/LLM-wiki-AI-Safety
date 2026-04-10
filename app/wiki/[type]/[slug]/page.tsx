import { notFound } from 'next/navigation';
import { getAllSlugs, getAllPagesResolved, getBacklinks } from '@/lib/wiki';

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

const TYPE_COLORS: Record<string, string> = {
  concept: 'bg-blue-500/20 text-blue-400',
  entity: 'bg-purple-500/20 text-purple-400',
  source: 'bg-green-500/20 text-green-400',
  debate: 'bg-orange-500/20 text-orange-400',
  synthesis: 'bg-pink-500/20 text-pink-400',
  map: 'bg-cyan-500/20 text-cyan-400',
};

const STATUS_BADGE: Record<string, string> = {
  stub: 'bg-zinc-700 text-zinc-400',
  draft: 'bg-yellow-500/20 text-yellow-400',
  mature: 'bg-green-500/20 text-green-400',
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map(({ type, slug }) => ({ type, slug }));
}

export default async function WikiPageView({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;

  // Get all pages resolved (with wikilinks as <a> tags)
  const allPages = await getAllPagesResolved();
  const page = allPages.find(p => p.slug === slug);

  if (!page) {
    notFound();
  }

  const backlinks = await getBacklinks(slug, allPages);

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <article className="flex-1 min-w-0">
        <h1 className="text-3xl font-mono font-bold mb-4 text-zinc-100">
          {page.title}
        </h1>

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className={`px-2 py-0.5 rounded text-xs font-mono ${TYPE_COLORS[page.type] || 'bg-zinc-800 text-zinc-400'}`}>
            {page.type}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-mono ${STATUS_BADGE[page.status] || STATUS_BADGE.stub}`}>
            {page.status}
          </span>
          {page.updated && (
            <span className="text-xs text-zinc-600">Updated {page.updated}</span>
          )}
          {page.url && (
            <a
              href={page.url}
              target="_blank"
              rel="noopener"
              className="text-xs text-zinc-500 hover:text-zinc-300 underline ml-auto"
            >
              Original source ↗
            </a>
          )}
        </div>

        {/* Source-specific metadata */}
        {page.type === 'source' && page.authors && (
          <div className="text-sm text-zinc-400 mb-4">
            {page.authors.join(', ')}{page.year ? ` (${page.year})` : ''}
          </div>
        )}

        {/* Tags */}
        {page.tags && page.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {page.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-500">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-invert prose-zinc max-w-none prose-headings:font-mono prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline [&_.wikilink]:text-blue-400 [&_.wikilink]:no-underline [&_.wikilink:hover]:underline [&_.wikilink-unresolved]:text-zinc-600 [&_.wikilink-unresolved]:italic"
          dangerouslySetInnerHTML={{ __html: page.htmlContent }}
        />
      </article>

      {/* Sidebar — backlinks */}
      {backlinks.length > 0 && (
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-8">
            <h3 className="text-sm font-mono font-bold text-zinc-500 mb-3">
              Linked from ({backlinks.length})
            </h3>
            <div className="grid gap-1">
              {backlinks.map(bl => (
                <a
                  key={bl.slug}
                  href={`/wiki/${typeToDir(bl.type)}/${bl.slug}`}
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors py-1"
                >
                  {bl.title}
                </a>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
