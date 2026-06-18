export interface GraphNode {
  id: string;
  path: string;
  title: string;
  section: string;
  category?: string;
  tags?: string[];
  date?: string;
  author?: string;
  snippet?: string;
  nodeType: 'page' | 'heading' | 'key-term' | 'external-link' | 'comment';
  parentId?: string;
  depth: number;
  metadata?: {
    likes?: number;
    dislikes?: number;
    commentCount?: number;
    domain?: string;
  };
}

export interface GraphEdge {
  source: string;
  target: string;
  edgeType:
    | 'explicit-link'
    | 'tag-similarity'
    | 'nlp-similarity'
    | 'dictionary-internal'
    | 'external-link'
    | 'comment-thread';
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphQueryOptions {
  sections?: string[];
  depth?: number;
  minEdges?: number;
  edgeTypes?: string[];
  showDictInternal?: boolean;
  showComments?: boolean;
  showExternal?: boolean;
  search?: string;
  limit?: number;
}

export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<string, number>;
  edgesByType: Record<string, number>;
  nodesBySection: Record<string, number>;
}
