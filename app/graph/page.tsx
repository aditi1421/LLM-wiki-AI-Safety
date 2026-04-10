import { buildGraphData } from '@/lib/graph';
import Graph from '@/components/Graph';

const LEGEND = [
  { type: 'concept', color: 'var(--color-concept)' },
  { type: 'entity', color: 'var(--color-entity)' },
  { type: 'source', color: 'var(--color-source)' },
  { type: 'debate', color: 'var(--color-debate)' },
  { type: 'synthesis', color: 'var(--color-synthesis)' },
  { type: 'map', color: 'var(--color-map)' },
];

export default async function GraphPage() {
  const graphData = await buildGraphData();

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Knowledge Graph
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          {graphData.nodes.length} pages, {graphData.edges.length} connections. Click a node to navigate. Hover to highlight connections.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {LEGEND.map(({ type, color }) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{type}</span>
          </div>
        ))}
      </div>

      <Graph data={graphData} height={700} />
    </div>
  );
}
