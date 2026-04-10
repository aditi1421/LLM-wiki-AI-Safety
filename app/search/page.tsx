import { getAllPages } from '@/lib/wiki';
import { buildSearchIndex } from '@/lib/search';
import SearchClient from '@/components/SearchClient';

export default async function SearchPage() {
  const pages = await getAllPages();
  const searchIndex = buildSearchIndex(pages);

  return (
    <div>
      <h1 className="text-3xl font-mono font-bold mb-6">Search</h1>
      <SearchClient entries={searchIndex} />
    </div>
  );
}
