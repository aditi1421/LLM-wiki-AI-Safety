import { getAllPages } from '@/lib/wiki';
import { buildGraphData } from '@/lib/graph';
import Graph from '@/components/Graph';

function typeToDir(type: string): string {
  const map: Record<string, string> = {
    concept: 'concepts', entity: 'entities', source: 'sources',
    debate: 'debates', synthesis: 'synthesis', map: 'maps',
  };
  return map[type] || type + 's';
}

export default async function Home() {
  const pages = await getAllPages();
  const graphData = await buildGraphData();

  const stats = [
    { label: 'Concepts', count: pages.filter(p => p.type === 'concept').length, color: 'var(--color-concept)' },
    { label: 'Sources', count: pages.filter(p => p.type === 'source').length, color: 'var(--color-source)' },
    { label: 'Debates', count: pages.filter(p => p.type === 'debate').length, color: 'var(--color-debate)' },
    { label: 'Total', count: pages.length, color: 'var(--color-text)' },
  ];

  const recentPages = [...pages]
    .sort((a, b) => (b.updated || '').localeCompare(a.updated || ''))
    .slice(0, 6);

  return (
    <div>
      {/* Hero section with graph */}
      <section style={{ position: 'relative', marginBottom: '4rem' }}>
        <div className="hero-glow" />
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1.5rem 0' }}>
          <div className="animate-fade-up" style={{ marginBottom: '2rem', maxWidth: '36rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
              Mapping the landscape of AI Safety
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              A research wiki built with the{' '}
              <a href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f" target="_blank" rel="noopener" style={{ color: 'var(--color-accent)', textDecoration: 'none', borderBottom: '1px solid rgba(124,138,255,0.3)' }}>
                LLM Wiki
              </a>{' '}
              pattern. An LLM reads papers, articles, and transcripts — then maintains this interlinked knowledge base.
            </p>
          </div>
        </div>

        {/* Graph — hero sized */}
        <div className="animate-fade-up delay-1" style={{ position: 'relative', zIndex: 1 }}>
          <Graph data={graphData} height={500} hero />
        </div>

        {/* Legend overlaid on graph */}
        <div className="animate-fade-up delay-2" style={{ maxWidth: '72rem', margin: '-3rem auto 0', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { type: 'concept', color: 'var(--color-concept)' },
              { type: 'source', color: 'var(--color-source)' },
              { type: 'debate', color: 'var(--color-debate)' },
              { type: 'entity', color: 'var(--color-entity)' },
              { type: 'synthesis', color: 'var(--color-synthesis)' },
              { type: 'map', color: 'var(--color-map)' },
            ].map(({ type, color }) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats + Recent */}
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Stats */}
        <div className="animate-fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {stats.map(({ label, count, color }) => (
            <div key={label} className="stat-card">
              <div className="stat-number" style={{ color }}>{count}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Recent pages */}
        <div className="animate-fade-up delay-3">
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Recent Pages
          </h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {recentPages.map(page => (
              <a
                key={page.slug}
                href={`/wiki/${typeToDir(page.type)}/${page.slug}`}
                className="page-card"
              >
                <span className={`badge badge-${page.type}`}>{page.type}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>{page.title}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>{page.status}</span>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="animate-fade-up delay-4" style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
          <a href="/graph" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: 'var(--color-accent)', color: '#08090c', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.02em', textDecoration: 'none', transition: 'opacity 0.2s' }}>
            Explore Full Graph
          </a>
          <a href="/index-page" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            Browse All Pages
          </a>
        </div>
      </div>
    </div>
  );
}
