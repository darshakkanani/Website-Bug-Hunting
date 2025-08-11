import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { NodeEditModal } from './NodeEditModal';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import { MindMapNode, MindMapEdge } from '../../types/mindmap';

interface MindMapCanvasProps {
  initialNodes?: MindMapNode[];
  initialEdges?: MindMapEdge[];
  onNodesChange?: (nodes: MindMapNode[]) => void;
  onEdgesChange?: (edges: MindMapEdge[]) => void;
  readOnly?: boolean;
}

const nodeTypes = {
  custom: CustomNode,
};

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  readOnly = false,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);

  // Initialize nodes and edges state first with basic conversion
  const convertToBasicFlowNodes = (mindMapNodes: MindMapNode[]): Node[] =>
    mindMapNodes.map(node => ({
      ...node,
      type: 'custom',
      data: {
        ...node.data,
        onEdit: () => {},
        onDelete: () => {},
      },
    }));

  const convertToBasicFlowEdges = (mindMapEdges: MindMapEdge[]): Edge[] =>
    mindMapEdges.map(edge => ({
      ...edge,
      type: 'smoothstep',
      animated: true,
    }));

  const [nodes, setNodes, onNodesStateChange] = useNodesState(
    convertToBasicFlowNodes(initialNodes)
  );
  const [edges, setEdges, onEdgesStateChange] = useEdgesState(
    convertToBasicFlowEdges(initialEdges)
  );

  // Now define the callbacks that depend on nodes and edges
  const handleEditNode = useCallback((nodeId: string) => {
    if (readOnly) return;
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(node);
      setIsEditModalOpen(true);
    }
  }, [nodes, readOnly]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (readOnly) return;
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    const updatedEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    
    if (onNodesChange) {
      onNodesChange(updatedNodes.map(node => ({
        id: node.id,
        type: node.type,
        data: { label: node.data.label, description: node.data.description },
        position: node.position,
        style: node.style,
      })));
    }
    
    if (onEdgesChange) {
      onEdgesChange(updatedEdges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
      })));
    }
  }, [nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, readOnly]);

  // Update nodes with proper callbacks after initial render
  useEffect(() => {
    const updatedNodes = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onEdit: handleEditNode,
        onDelete: handleDeleteNode,
      },
    }));
    
    // Only update if callbacks have changed
    if (nodes.length > 0 && nodes[0].data.onEdit !== handleEditNode) {
      setNodes(updatedNodes);
    }
  }, [handleEditNode, handleDeleteNode]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return;
      const newEdge = addEdge(
        { ...params, type: 'smoothstep', animated: true },
        edges
      );
      setEdges(newEdge);
      
      if (onEdgesChange) {
        onEdgesChange(newEdge.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
        })));
      }
    },
    [edges, setEdges, onEdgesChange, readOnly]
  );

  const addNode = useCallback(() => {
    if (readOnly || !reactFlowInstance) return;

    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: 'custom',
      position: reactFlowInstance.screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }),
      data: {
        label: 'New Node',
        description: '',
        onEdit: handleEditNode,
        onDelete: handleDeleteNode,
      },
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    
    if (onNodesChange) {
      onNodesChange(updatedNodes.map(node => ({
        id: node.id,
        type: node.type,
        data: { label: node.data.label, description: node.data.description },
        position: node.position,
        style: node.style,
      })));
    }
    
    // Open edit modal immediately for new node
    setEditingNode(newNode);
    setIsEditModalOpen(true);
  }, [reactFlowInstance, nodes, setNodes, onNodesChange, handleEditNode, handleDeleteNode, readOnly]);

  const handleSaveNode = useCallback((label: string, description: string) => {
    if (!editingNode) return;

    const updatedNodes = nodes.map(node =>
      node.id === editingNode.id
        ? {
            ...node,
            data: {
              ...node.data,
              label,
              description,
            },
          }
        : node
    );

    setNodes(updatedNodes);
    
    if (onNodesChange) {
      onNodesChange(updatedNodes.map(node => ({
        id: node.id,
        type: node.type,
        data: { label: node.data.label, description: node.data.description },
        position: node.position,
        style: node.style,
      })));
    }

    setEditingNode(null);
  }, [editingNode, nodes, setNodes, onNodesChange]);

  const handleNodesChange = useCallback((changes: any) => {
    onNodesStateChange(changes);
    
    // Trigger callback for position changes
    if (onNodesChange && changes.some((change: any) => change.type === 'position')) {
      setTimeout(() => {
        setNodes(currentNodes => {
          onNodesChange(currentNodes.map(node => ({
            id: node.id,
            type: node.type,
            data: { label: node.data.label, description: node.data.description },
            position: node.position,
            style: node.style,
          })));
          return currentNodes;
        });
      }, 0);
    }
  }, [onNodesStateChange, onNodesChange, setNodes]);

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesStateChange(changes);
    
    if (onEdgesChange) {
      setTimeout(() => {
        setEdges(currentEdges => {
          onEdgesChange(currentEdges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
          })));
          return currentEdges;
        });
      }, 0);
    }
  }, [onEdgesStateChange, onEdgesChange, setEdges]);

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
        className="bg-gray-50 dark:bg-gray-900"
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
      >
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            return '#3B82F6';
          }}
          className="bg-white dark:bg-gray-800"
        />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      {!readOnly && (
        <div className="absolute top-4 left-4 z-10">
          <Button onClick={addNode} icon={Plus} size="sm">
            Add Node
          </Button>
        </div>
      )}

      <NodeEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingNode(null);
        }}
        onSave={handleSaveNode}
        initialLabel={editingNode?.data?.label || ''}
        initialDescription={editingNode?.data?.description || ''}
      />
    </div>
  );
};

export default function MindMapCanvasWrapper(props: MindMapCanvasProps) {
  return (
    <ReactFlowProvider>
      <MindMapCanvas {...props} />
    </ReactFlowProvider>
  );
}