import { getAllPages } from '@/lib/wiki';
import { buildSearchIndex } from '@/lib/search';
import SearchClient from '@/components/SearchClient';

export default async function SearchPage() {
  const pages = await getAllPages();
  const searchIndex = buildSearchIndex(pages);

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
        Search
      </h1>
      <SearchClient entries={searchIndex} />
    </div>
  );
}
