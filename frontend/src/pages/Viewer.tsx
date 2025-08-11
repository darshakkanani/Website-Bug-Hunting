import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Edit } from 'lucide-react';
import { useMindMap } from '../contexts/MindMapContext';
import { Button } from '../components/ui/Button';
import MindMapCanvasWrapper from '../components/mindmap/MindMapCanvas';
import { exportToPNG, exportToSVG } from '../utils/export';

export const Viewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { mindMaps, currentMindMap, setCurrentMindMap } = useMindMap();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (id && !currentMindMap) {
      const mindMap = mindMaps.find(m => m.id === id);
      if (mindMap) {
        setCurrentMindMap(mindMap);
      }
    }
  }, [id, mindMaps, currentMindMap, setCurrentMindMap]);

  const handleExportPNG = async () => {
    if (!currentMindMap) return;
    setIsExporting(true);
    try {
      await exportToPNG('mind-map-viewer', currentMindMap.title);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSVG = () => {
    if (!currentMindMap) return;
    exportToSVG('mind-map-viewer', currentMindMap.title);
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
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
              {currentMindMap.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentMindMap.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleExportPNG}
              variant="outline"
              size="sm"
              icon={Download}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'PNG'}
            </Button>
            <Button
              onClick={handleExportSVG}
              variant="outline"
              size="sm"
              icon={Download}
            >
              SVG
            </Button>
            <Link to={`/editor/${currentMindMap.id}`}>
              <Button size="sm" icon={Edit}>
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 relative" id="mind-map-viewer">
        <MindMapCanvasWrapper
          initialNodes={currentMindMap.nodes}
          initialEdges={currentMindMap.edges}
          readOnly
        />
      </div>
    </div>
  );
};