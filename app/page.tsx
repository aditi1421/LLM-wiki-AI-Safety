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

const TYPE_COLORS: Record<string, string> = {
  concept: 'bg-blue-500/20 text-blue-400',
  entity: 'bg-purple-500/20 text-purple-400',
  source: 'bg-green-500/20 text-green-400',
  debate: 'bg-orange-500/20 text-orange-400',
  synthesis: 'bg-pink-500/20 text-pink-400',
  map: 'bg-cyan-500/20 text-cyan-400',
};

export default async function Home() {
  const pages = await getAllPages();

  const stats = {
    concepts: pages.filter(p => p.type === 'concept').length,
    entities: pages.filter(p => p.type === 'entity').length,
    sources: pages.filter(p => p.type === 'source').length,
    debates: pages.filter(p => p.type === 'debate').length,
    synthesis: pages.filter(p => p.type === 'synthesis').length,
    maps: pages.filter(p => p.type === 'map').length,
    total: pages.length,
  };

  // Sort by updated date, most recent first
  const recentPages = [...pages]
    .sort((a, b) => (b.updated || '').localeCompare(a.updated || ''))
    .slice(0, 8);

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-mono font-bold mb-4 tracking-tight">AI Safety Wiki</h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          A research wiki on AI safety, built with the{' '}
          <a href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f" className="underline hover:text-zinc-200" target="_blank" rel="noopener">LLM Wiki</a>{' '}
          pattern. An LLM reads papers and articles, then builds and maintains this structured, interlinked knowledge base.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Concepts', count: stats.concepts, color: 'text-blue-400' },
          { label: 'Sources', count: stats.sources, color: 'text-green-400' },
          { label: 'Debates', count: stats.debates, color: 'text-orange-400' },
          { label: 'Total Pages', count: stats.total, color: 'text-zinc-100' },
        ].map(({ label, count, color }) => (
          <div key={label} className="border border-zinc-800 rounded-lg p-4">
            <div className={`text-2xl font-mono font-bold ${color}`}>{count}</div>
            <div className="text-sm text-zinc-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Explore */}
      <div className="flex gap-4 mb-12">
        <a href="/graph" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors">
          Explore Graph View →
        </a>
        <a href="/index-page" className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:border-zinc-600 rounded-lg text-sm font-medium transition-colors">
          Browse All Pages
        </a>
      </div>

      {/* Recent pages */}
      <div>
        <h2 className="text-xl font-mono font-bold mb-4">Recent Pages</h2>
        <div className="grid gap-3">
          {recentPages.map(page => (
            <a
              key={page.slug}
              href={`/wiki/${typeToDir(page.type)}/${page.slug}`}
              className="flex items-center gap-3 p-3 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors"
            >
              <span className={`px-2 py-0.5 rounded text-xs font-mono ${TYPE_COLORS[page.type] || 'bg-zinc-800 text-zinc-400'}`}>
                {page.type}
              </span>
              <span className="font-medium">{page.title}</span>
              <span className="ml-auto text-xs text-zinc-600">{page.status}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
