import { notFound } from 'next/navigation';
import { getAllSlugs, getAllPagesResolved, getBacklinks } from '@/lib/wiki';

function typeToDir(type: string): string {
  const map: Record<string, string> = {
    concept: 'concepts', entity: 'entities', source: 'sources',
    debate: 'debates', synthesis: 'synthesis', map: 'maps',
  };
  return map[type] || type + 's';
}

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

  const allPages = await getAllPagesResolved();
  const page = allPages.find(p => p.slug === slug);
  if (!page) notFound();

  const backlinks = await getBacklinks(slug, allPages);

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', gap: '3rem' }}>
        {/* Main */}
        <article style={{ flex: 1, minWidth: 0 }}>
          {/* Breadcrumb */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '1.5rem', letterSpacing: '0.04em' }}>
            <a href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>wiki</a>
            {' / '}
            <a href="/index-page" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>{type}</a>
            {' / '}
            <span style={{ color: 'var(--color-text)' }}>{slug}</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.2 }}>
            {page.title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span className={`badge badge-${page.type}`}>{page.type}</span>
            <span className={`badge badge-${page.status}`}>{page.status}</span>
            {page.updated && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                Updated {page.updated}
              </span>
            )}
            {page.url && (
              <a href={page.url} target="_blank" rel="noopener" style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'none', borderBottom: '1px solid var(--color-border)' }}>
                Source ↗
              </a>
            )}
          </div>

          {/* Authors (source pages) */}
          {page.type === 'source' && page.authors && (
            <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
              {page.authors.join(', ')}{page.year ? ` (${page.year})` : ''}
            </div>
          )}

          {/* Tags */}
          {page.tags && page.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '2rem' }}>
              {page.tags.map(tag => (
                <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: 3, color: 'var(--color-text-dim)', letterSpacing: '0.03em' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: '2rem' }} />

          {/* Content */}
          <div
            className="wiki-content"
            dangerouslySetInnerHTML={{ __html: page.htmlContent }}
          />
        </article>

        {/* Sidebar */}
        {backlinks.length > 0 && (
          <aside style={{ width: 240, flexShrink: 0, display: 'none' }} className="lg-sidebar">
            <div style={{ position: 'sticky', top: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-dim)', marginBottom: '0.75rem' }}>
                Linked from ({backlinks.length})
              </h3>
              <div style={{ display: 'grid', gap: '0.25rem' }}>
                {backlinks.map(bl => (
                  <a
                    key={bl.slug}
                    href={`/wiki/${typeToDir(bl.type)}/${bl.slug}`}
                    style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none', padding: '0.375rem 0', transition: 'color 0.2s' }}
                  >
                    {bl.title}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  );
}
