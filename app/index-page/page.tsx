import { getAllPages } from '@/lib/wiki';

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

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  concept: { label: 'Concepts', color: 'text-blue-400' },
  entity: { label: 'Entities', color: 'text-purple-400' },
  source: { label: 'Sources', color: 'text-green-400' },
  debate: { label: 'Debates', color: 'text-orange-400' },
  synthesis: { label: 'Synthesis', color: 'text-pink-400' },
  map: { label: 'Maps', color: 'text-cyan-400' },
};

const STATUS_BADGE: Record<string, string> = {
  stub: 'bg-zinc-700 text-zinc-400',
  draft: 'bg-yellow-500/20 text-yellow-400',
  mature: 'bg-green-500/20 text-green-400',
};

export default async function IndexPage() {
  const pages = await getAllPages();

  const grouped = new Map<string, typeof pages>();
  for (const page of pages) {
    const list = grouped.get(page.type) || [];
    list.push(page);
    grouped.set(page.type, list);
  }

  const typeOrder = ['concept', 'entity', 'source', 'debate', 'synthesis', 'map'];

  return (
    <div>
      <h1 className="text-3xl font-mono font-bold mb-2">Index</h1>
      <p className="text-zinc-400 mb-8">All {pages.length} pages in the wiki, grouped by type.</p>

      {typeOrder.map(type => {
        const typePages = grouped.get(type);
        if (!typePages || typePages.length === 0) return null;
        const info = TYPE_LABELS[type] || { label: type, color: 'text-zinc-400' };

        return (
          <div key={type} className="mb-8">
            <h2 className={`text-lg font-mono font-bold mb-3 ${info.color}`}>
              {info.label} ({typePages.length})
            </h2>
            <div className="grid gap-2">
              {typePages.sort((a, b) => a.title.localeCompare(b.title)).map(page => (
                <a
                  key={page.slug}
                  href={`/wiki/${typeToDir(page.type)}/${page.slug}`}
                  className="flex items-center gap-3 p-2 rounded hover:bg-zinc-900 transition-colors"
                >
                  <span className="font-medium">{page.title}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${STATUS_BADGE[page.status] || STATUS_BADGE.stub}`}>
                    {page.status}
                  </span>
                  {page.updated && (
                    <span className="ml-auto text-xs text-zinc-600">{page.updated}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
