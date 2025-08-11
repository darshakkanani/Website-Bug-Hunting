import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useMindMap } from '../contexts/MindMapContext';
import { Button } from '../components/ui/Button';
import MindMapCanvasWrapper from '../components/mindmap/MindMapCanvas';
import { MindMapNode, MindMapEdge } from '../types/mindmap';

export const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { mindMaps, currentMindMap, setCurrentMindMap, updateMindMap } = useMindMap();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save functionality
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id && !currentMindMap) {
      const mindMap = mindMaps.find(m => m.id === id);
      if (mindMap) {
        setCurrentMindMap(mindMap);
      }
    }
  }, [id, mindMaps, currentMindMap, setCurrentMindMap]);

  const handleNodesChange = useCallback((nodes: MindMapNode[]) => {
    if (!currentMindMap) return;
    
    const updatedMindMap = {
      ...currentMindMap,
      nodes,
    };
    
    setCurrentMindMap(updatedMindMap);
    setHasUnsavedChanges(true);
    
    // Auto-save with debounce
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(async () => {
      await updateMindMap(updatedMindMap);
      setHasUnsavedChanges(false);
    }, 2000);
    
    setAutoSaveTimeout(timeout);
  }, [currentMindMap, setCurrentMindMap, updateMindMap, autoSaveTimeout]);

  const handleEdgesChange = useCallback((edges: MindMapEdge[]) => {
    if (!currentMindMap) return;
    
    const updatedMindMap = {
      ...currentMindMap,
      edges,
    };
    
    setCurrentMindMap(updatedMindMap);
    setHasUnsavedChanges(true);
    
    // Auto-save with debounce
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(async () => {
      await updateMindMap(updatedMindMap);
      setHasUnsavedChanges(false);
    }, 2000);
    
    setAutoSaveTimeout(timeout);
  }, [currentMindMap, setCurrentMindMap, updateMindMap, autoSaveTimeout]);

  const handleManualSave = async () => {
    if (currentMindMap && hasUnsavedChanges) {
      await updateMindMap(currentMindMap);
      setHasUnsavedChanges(false);
      
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
        setAutoSaveTimeout(null);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  if (!currentMindMap) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Mind Map Not Found
          </h2>
          <Link to="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentMindMap.title}
              </h1>
              {hasUnsavedChanges && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Auto-saving changes...
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <Button
                onClick={handleManualSave}
                variant="outline"
                size="sm"
                icon={Save}
              >
                Save Now
              </Button>
            )}
            <Link to={`/viewer/${currentMindMap.id}`}>
              <Button variant="outline" size="sm" icon={Eye}>
                Preview
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 relative" id="mind-map-canvas">
        <MindMapCanvasWrapper
          initialNodes={currentMindMap.nodes}
          initialEdges={currentMindMap.edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
        />
      </div>
    </div>
  );
};