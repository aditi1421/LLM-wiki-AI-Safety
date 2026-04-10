import { getAllPages, WikiPage } from './wiki';

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  status: string;
  url: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Map page type to directory name for URL
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

export async function buildGraphData(): Promise<GraphData> {
  const pages = await getAllPages();

  // Build a set of known slugs
  const knownSlugs = new Set(pages.map(p => p.slug));

  const nodes: GraphNode[] = pages.map(page => ({
    id: page.slug,
    label: page.title,
    type: page.type,
    status: page.status,
    url: `/wiki/${typeToDir(page.type)}/${page.slug}`,
  }));

  const edges: GraphEdge[] = [];
  for (const page of pages) {
    for (const target of page.outlinks) {
      // Only add edges to pages that exist
      if (knownSlugs.has(target)) {
        edges.push({ source: page.slug, target });
      }
    }
  }

  return { nodes, edges };
}
