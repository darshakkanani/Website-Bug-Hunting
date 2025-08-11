export interface MindMapNode {
  id: string;
  type?: string;
  data: {
    label: string;
    description?: string;
  };
  position: {
    x: number;
    y: number;
  };
  style?: {
    background?: string;
    color?: string;
    border?: string;
    borderRadius?: string;
  };
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  style?: {
    stroke?: string;
    strokeWidth?: number;
  };
}

export interface MindMap {
  id: string;
  title: string;
  description?: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  autoSave: boolean;
  exportFormat: 'png' | 'svg' | 'json';
}