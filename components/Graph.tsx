'use client';

import { useRef, useEffect } from 'react';

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
  concept: '#7c8aff',
  entity: '#c084fc',
  source: '#4ade80',
  debate: '#fb923c',
  synthesis: '#f472b6',
  map: '#22d3ee',
};

export default function Graph({ data, height = 600, hero = false }: { data: GraphData; height?: number; hero?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      const parent = canvas!.parentElement!;
      const dpr = window.devicePixelRatio || 1;
      w = parent.clientWidth;
      h = height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Initialize nodes spread across canvas
    const nodes: GraphNode[] = data.nodes.map((n, i) => ({
      ...n,
      x: w / 2 + (w * 0.35) * Math.cos((2 * Math.PI * i) / data.nodes.length),
      y: h / 2 + (h * 0.35) * Math.sin((2 * Math.PI * i) / data.nodes.length),
      vx: 0,
      vy: 0,
    }));

    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const edges = data.edges
      .map(e => ({
        source: nodeMap.get(typeof e.source === 'string' ? e.source : (e.source as GraphNode).id),
        target: nodeMap.get(typeof e.target === 'string' ? e.target : (e.target as GraphNode).id),
      }))
      .filter(e => e.source && e.target) as { source: GraphNode; target: GraphNode }[];

    let currentHovered: GraphNode | null = null;
    let settled = false;
    let tick = 0;

    function simulate() {
      if (settled) return;
      tick++;
      const alpha = Math.max(0.01, 0.3 * Math.pow(0.99, tick));
      if (alpha < 0.015) settled = true;

      const repulsion = 8000;
      const attraction = 0.003;

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

      for (const edge of edges) {
        const dx = edge.target.x! - edge.source.x!;
        const dy = edge.target.y! - edge.source.y!;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = dist * attraction;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        edge.source.vx! += fx;
        edge.source.vy! += fy;
        edge.target.vx! -= fx;
        edge.target.vy! -= fy;
      }

      for (const node of nodes) {
        node.vx! += (w / 2 - node.x!) * 0.0008;
        node.vy! += (h / 2 - node.y!) * 0.0008;
        node.x! += node.vx! * alpha;
        node.y! += node.vy! * alpha;
        node.vx! *= 0.85;
        node.vy! *= 0.85;
        // Keep in bounds
        node.x = Math.max(60, Math.min(w - 60, node.x!));
        node.y = Math.max(40, Math.min(h - 40, node.y!));
      }
    }

    function draw() {
      simulate();
      ctx!.clearRect(0, 0, w, h);

      // Draw edges with glow
      for (const edge of edges) {
        const s = edge.source;
        const t = edge.target;
        const isHighlighted = currentHovered && (s === currentHovered || t === currentHovered);

        ctx!.beginPath();
        ctx!.moveTo(s.x!, s.y!);
        ctx!.lineTo(t.x!, t.y!);

        if (isHighlighted) {
          ctx!.strokeStyle = 'rgba(124, 138, 255, 0.4)';
          ctx!.lineWidth = 2;
          ctx!.shadowColor = 'rgba(124, 138, 255, 0.3)';
          ctx!.shadowBlur = 8;
        } else {
          ctx!.strokeStyle = 'rgba(255, 255, 255, 0.06)';
          ctx!.lineWidth = 1;
          ctx!.shadowBlur = 0;
        }
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      }

      // Draw nodes
      for (const node of nodes) {
        const color = TYPE_COLORS[node.type] || '#71717a';
        const isHovered = node === currentHovered;
        const isConnected = currentHovered && edges.some(e => (e.source === currentHovered && e.target === node) || (e.target === currentHovered && e.source === node));
        const dimmed = currentHovered && !isHovered && !isConnected;
        const radius = isHovered ? 10 : 6;

        // Glow
        if (isHovered || isConnected) {
          ctx!.beginPath();
          ctx!.arc(node.x!, node.y!, radius + 8, 0, 2 * Math.PI);
          const glow = ctx!.createRadialGradient(node.x!, node.y!, radius, node.x!, node.y!, radius + 8);
          glow.addColorStop(0, color + '30');
          glow.addColorStop(1, color + '00');
          ctx!.fillStyle = glow;
          ctx!.fill();
        }

        // Node circle
        ctx!.beginPath();
        ctx!.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
        ctx!.fillStyle = dimmed ? color + '30' : color;
        ctx!.fill();

        // Label
        const fontSize = isHovered ? 13 : 11;
        ctx!.font = `${isHovered ? '600' : '400'} ${fontSize}px var(--font-mono), monospace`;
        ctx!.fillStyle = dimmed ? 'rgba(255,255,255,0.15)' : isHovered ? '#ffffff' : 'rgba(255,255,255,0.55)';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'bottom';
        const label = node.label.length > 24 ? node.label.slice(0, 22) + '...' : node.label;
        ctx!.fillText(label, node.x!, node.y! - radius - 4);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    animRef.current = requestAnimationFrame(draw);

    function handleClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (const node of nodes) {
        const dx = node.x! - x;
        const dy = node.y! - y;
        if (dx * dx + dy * dy < 200) {
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
        if (dx * dx + dy * dy < 200) {
          found = node;
          break;
        }
      }
      currentHovered = found;
      canvas!.style.cursor = found ? 'pointer' : 'default';
      // Re-trigger draw when hover state changes
      if (!settled) return;
      settled = false;
      tick = Math.max(tick, 200); // keep low alpha
    }

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [data, height]);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height,
          borderRadius: hero ? 0 : 8,
          background: hero ? 'transparent' : 'var(--color-surface)',
          border: hero ? 'none' : '1px solid var(--color-border)',
        }}
      />
    </div>
  );
}
