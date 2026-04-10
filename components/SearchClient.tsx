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
        placeholder="Search pages by title, alias, or content..."
        className="search-input"
        autoFocus
      />

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '1rem', marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
        {results.length} {results.length === 1 ? 'result' : 'results'}
        {query && ` for "${query}"`}
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {results.map(entry => (
          <a
            key={entry.slug}
            href={entry.url}
            className="page-card"
            style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.375rem', padding: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge badge-${entry.type}`}>{entry.type}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>{entry.title}</span>
            </div>
            {entry.excerpt && (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {entry.excerpt}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
