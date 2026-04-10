import { buildGraphData } from '@/lib/graph';
import Graph from '@/components/Graph';

const TYPE_COLORS: Record<string, string> = {
  concept: 'bg-blue-500',
  entity: 'bg-purple-500',
  source: 'bg-green-500',
  debate: 'bg-orange-500',
  synthesis: 'bg-pink-500',
  map: 'bg-cyan-500',
};

export default async function GraphPage() {
  const graphData = await buildGraphData();

  return (
    <div>
      <h1 className="text-3xl font-mono font-bold mb-2">Knowledge Graph</h1>
      <p className="text-zinc-400 mb-4">
        {graphData.nodes.length} pages, {graphData.edges.length} connections. Click a node to navigate.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-xs text-zinc-400">{type}</span>
          </div>
        ))}
      </div>

      <Graph data={graphData} />
    </div>
  );
}
