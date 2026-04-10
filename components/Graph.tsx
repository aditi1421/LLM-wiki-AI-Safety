'use client';

import { useCallback, useRef, useEffect, useState } from 'react';

interface GraphNode {
  id: string;
  label: string;
  type: string;
  status: string;
  url: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphEdge {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const TYPE_COLORS: Record<string, string> = {
  concept: '#3b82f6',   // blue
  entity: '#a855f7',    // purple
  source: '#22c55e',    // green
  debate: '#f97316',    // orange
  synthesis: '#ec4899', // pink
  map: '#06b6d4',       // cyan
};

export default function Graph({ data }: { data: GraphData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize node positions in a circle
    const nodes = data.nodes.map((n, i) => ({
      ...n,
      x: 400 + 250 * Math.cos((2 * Math.PI * i) / data.nodes.length),
      y: 300 + 250 * Math.sin((2 * Math.PI * i) / data.nodes.length),
      vx: 0,
      vy: 0,
    }));
    nodesRef.current = nodes;

    // Resolve edges to node references
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const edges = data.edges
      .map(e => ({
        source: nodeMap.get(typeof e.source === 'string' ? e.source : (e.source as GraphNode).id),
        target: nodeMap.get(typeof e.target === 'string' ? e.target : (e.target as GraphNode).id),
      }))
      .filter(e => e.source && e.target) as { source: GraphNode; target: GraphNode }[];
    edgesRef.current = edges;

    // Simple force simulation
    function simulate() {
      const alpha = 0.1;
      const repulsion = 5000;
      const attraction = 0.005;
      const centerX = canvas!.width / 2;
      const centerY = canvas!.height / 2;

      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x! - nodes[i].x!;
          const dy = nodes[j].y! - nodes[i].y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          nodes[i].vx! -= fx * alpha;
          nodes[i].vy! -= fy * alpha;
          nodes[j].vx! += fx * alpha;
          nodes[j].vy! += fy * alpha;
        }
      }

      // Attraction along edges
      for (const edge of edges) {
        const s = edge.source;
        const t = edge.target;
        const dx = t.x! - s.x!;
        const dy = t.y! - s.y!;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = dist * attraction;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        s.vx! += fx;
        s.vy! += fy;
        t.vx! -= fx;
        t.vy! -= fy;
      }

      // Center gravity
      for (const node of nodes) {
        node.vx! += (centerX - node.x!) * 0.001;
        node.vy! += (centerY - node.y!) * 0.001;
        node.x! += node.vx! * alpha;
        node.y! += node.vy! * alpha;
        node.vx! *= 0.9; // damping
        node.vy! *= 0.9;
      }
    }

    // Keep a stable ref to hoveredNode for the draw loop
    let currentHovered: GraphNode | null = null;

    function draw() {
      simulate();
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Draw edges
      ctx!.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx!.lineWidth = 1;
      for (const edge of edges) {
        const s = edge.source;
        const t = edge.target;
        ctx!.beginPath();
        ctx!.moveTo(s.x!, s.y!);
        ctx!.lineTo(t.x!, t.y!);
        ctx!.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const color = TYPE_COLORS[node.type] || '#71717a';
        const isHovered = node === currentHovered;
        const radius = isHovered ? 8 : 5;

        ctx!.beginPath();
        ctx!.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
        ctx!.fillStyle = color;
        ctx!.fill();

        // Label
        ctx!.font = isHovered ? 'bold 12px monospace' : '10px monospace';
        ctx!.fillStyle = isHovered ? '#ffffff' : 'rgba(255,255,255,0.6)';
        ctx!.textAlign = 'center';
        ctx!.fillText(node.label, node.x!, node.y! - 10);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    // Handle resize
    function resize() {
      canvas!.width = canvas!.parentElement!.clientWidth;
      canvas!.height = 600;
    }
    resize();
    window.addEventListener('resize', resize);

    animRef.current = requestAnimationFrame(draw);

    // Handle click
    function handleClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const node of nodes) {
        const dx = node.x! - x;
        const dy = node.y! - y;
        if (dx * dx + dy * dy < 100) {
          window.location.href = node.url;
          return;
        }
      }
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found: GraphNode | null = null;
      for (const node of nodes) {
        const dx = node.x! - x;
        const dy = node.y! - y;
        if (dx * dx + dy * dy < 100) {
          found = node;
          break;
        }
      }
      currentHovered = found;
      setHoveredNode(found);
      canvas!.style.cursor = found ? 'pointer' : 'default';
    }

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50"
      style={{ height: 600 }}
    />
  );
}
