'use client';

import { useState, useMemo } from 'react';

interface SearchEntry {
  slug: string;
  type: string;
  title: string;
  aliases: string[];
  status: string;
  excerpt: string;
  url: string;
}

const TYPE_COLORS: Record<string, string> = {
  concept: 'bg-blue-500/20 text-blue-400',
  entity: 'bg-purple-500/20 text-purple-400',
  source: 'bg-green-500/20 text-green-400',
  debate: 'bg-orange-500/20 text-orange-400',
  synthesis: 'bg-pink-500/20 text-pink-400',
  map: 'bg-cyan-500/20 text-cyan-400',
};

export default function SearchClient({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.aliases.some(a => a.toLowerCase().includes(q)) ||
      e.excerpt.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q)
    );
  }, [query, entries]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search pages..."
        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 font-mono focus:outline-none focus:border-zinc-600 mb-6"
        autoFocus
      />

      <div className="text-sm text-zinc-500 mb-4">
        {results.length} {results.length === 1 ? 'result' : 'results'}
        {query && ` for "${query}"`}
      </div>

      <div className="grid gap-3">
        {results.map(entry => (
          <a
            key={entry.slug}
            href={entry.url}
            className="block p-4 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-xs font-mono ${TYPE_COLORS[entry.type] || 'bg-zinc-800 text-zinc-400'}`}>
                {entry.type}
              </span>
              <span className="font-medium">{entry.title}</span>
            </div>
            {entry.excerpt && (
              <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{entry.excerpt}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
