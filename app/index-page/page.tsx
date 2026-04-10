import { getAllPages } from '@/lib/wiki';

function typeToDir(type: string): string {
  const map: Record<string, string> = {
    concept: 'concepts', entity: 'entities', source: 'sources',
    debate: 'debates', synthesis: 'synthesis', map: 'maps',
  };
  return map[type] || type + 's';
}

const TYPE_META: Record<string, { label: string; color: string }> = {
  concept: { label: 'Concepts', color: 'var(--color-concept)' },
  entity: { label: 'Entities', color: 'var(--color-entity)' },
  source: { label: 'Sources', color: 'var(--color-source)' },
  debate: { label: 'Debates', color: 'var(--color-debate)' },
  synthesis: { label: 'Synthesis', color: 'var(--color-synthesis)' },
  map: { label: 'Maps', color: 'var(--color-map)' },
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
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
        Index
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
        All {pages.length} pages in the wiki.
      </p>

      {typeOrder.map(type => {
        const typePages = grouped.get(type);
        if (!typePages || typePages.length === 0) return null;
        const meta = TYPE_META[type] || { label: type, color: 'var(--color-text-muted)' };

        return (
          <div key={type} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: meta.color, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color, display: 'inline-block' }} />
              {meta.label} ({typePages.length})
            </h2>
            <div style={{ display: 'grid', gap: '0.375rem' }}>
              {typePages.sort((a, b) => a.title.localeCompare(b.title)).map(page => (
                <a
                  key={page.slug}
                  href={`/wiki/${typeToDir(page.type)}/${page.slug}`}
                  className="page-card"
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>{page.title}</span>
                  <span className={`badge badge-${page.status}`}>{page.status}</span>
                  {page.updated && (
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>{page.updated}</span>
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
