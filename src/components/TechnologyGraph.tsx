import { useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { SearchResult } from '@/types/search';

interface GraphNode {
  id: string;
  label: string;
  type: 'technology' | 'domain' | 'university' | 'application';
  data: SearchResult | null;
  size: number;
  color: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: GraphNode;
  target: GraphNode;
  type: 'belongs_to' | 'related_to' | 'applies_to';
  weight: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface TechnologyGraphProps {
  results: SearchResult[];
  onNodeClick: (result: SearchResult) => void;
  width?: number;
  height?: number;
}

const generateGraphData = (results: SearchResult[]): GraphData => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  
  // Create technology nodes with initial positions in a circular layout
  const radius = Math.max(400, results.length * 30);
  const angleStep = (2 * Math.PI) / results.length;
  
  results.forEach((result, index) => {
    const angle = angleStep * index;
    const techNode: GraphNode = {
      id: result.number,
      label: result.title,
      type: 'technology',
      data: result,
      size: 25,
      color: '#6B46C1',
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    };
    nodes.push(techNode);
    
    // Add university node and edge
    const universityId = `uni-${result.university}`;
    let uniNode = nodes.find(n => n.id === universityId);
    
    if (!uniNode) {
      // Position university nodes in an inner circle
      const uniAngle = angleStep * (nodes.length - 1);
      const innerRadius = radius * 0.5;
      uniNode = {
        id: universityId,
        label: result.university,
        type: 'university',
        data: null,
        size: 35,
        color: '#4B0082',
        x: innerRadius * Math.cos(uniAngle),
        y: innerRadius * Math.sin(uniAngle)
      };
      nodes.push(uniNode);
    }
    
    links.push({
      source: techNode,
      target: uniNode,
      type: 'belongs_to',
      weight: 1
    });
  });
  
  return { nodes, links };
};

const TechnologyGraph = ({ results, onNodeClick, width = 800, height = 600 }: TechnologyGraphProps) => {
  const graphRef = useRef<any>();
  const graphData = generateGraphData(results);

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.type === 'technology' && node.data) {
      onNodeClick(node.data);
    }
  }, [onNodeClick]);

  return (
    <div className="w-full h-full bg-white/95 rounded-xl shadow-lg overflow-hidden">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel="label"
        nodeColor={node => (node as GraphNode).color}
        nodeVal={node => (node as GraphNode).size}
        linkColor={() => '#E9D8FD'}
        linkWidth={2}
        width={width}
        height={height}
        onNodeClick={handleNodeClick}
        d3Force={(d3) => {
          d3.force('charge').strength(-400);
          d3.force('link').distance(200);
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = (node as GraphNode).label;
          const fontSize = (node as GraphNode).size / 2;
          ctx.font = `${fontSize}px Arial`;
          ctx.fillStyle = (node as GraphNode).color;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, (node as GraphNode).size, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#000';
          ctx.fillText(label, node.x!, node.y!);
        }}
      />
    </div>
  );
};

export default TechnologyGraph; 