import React, { useRef } from 'react';
import { Moon, Sun, Download, Upload, Trash2, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useMindMap } from '../contexts/MindMapContext';
import { Button } from '../components/ui/Button';
import { exportToJSON, importFromJSON } from '../utils/export';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { mindMaps, saveMindMap } = useMindMap();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportAll = () => {
    exportToJSON(mindMaps, 'mindmaps-backup');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedMindMaps = await importFromJSON(file);
      
      // Save all imported mind maps
      importedMindMaps.forEach(mindMap => {
        // Generate new IDs to avoid conflicts
        const newMindMap = {
          ...mindMap,
          id: Date.now().toString() + Math.random(),
          title: `${mindMap.title} (Imported)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveMindMap(newMindMap);
      });

      alert(`Successfully imported ${importedMindMaps.length} mind map(s)!`);
    } catch (error) {
      alert('Error importing file: ' + (error as Error).message);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete all mind maps? This action cannot be undone.')) {
      localStorage.removeItem('mindMaps');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Customize your mind mapping experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Theme
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose between light and dark mode
                </p>
              </div>
              <Button
                onClick={toggleTheme}
                variant="outline"
                icon={theme === 'light' ? Moon : Sun}
              >
                {theme === 'light' ? 'Dark' : 'Light'} Mode
              </Button>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Export All Mind Maps
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download all your mind maps as a JSON file
                  </p>
                </div>
                <Button
                  onClick={handleExportAll}
                  variant="outline"
                  icon={Download}
                  disabled={mindMaps.length === 0}
                >
                  Export JSON
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Import Mind Maps
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a JSON file to import mind maps
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    icon={Upload}
                  >
                    Import JSON
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Clear All Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permanently delete all mind maps and settings
                  </p>
                </div>
                <Button
                  onClick={handleClearAllData}
                  variant="danger"
                  icon={Trash2}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Storage Information
            </h2>
            <div className="flex items-center space-x-4">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {mindMaps.length} mind map{mindMaps.length !== 1 ? 's' : ''} stored locally
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data is automatically saved to your browser's local storage
                </p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>
                Mind Map Notes helps you visualize and organize your ideas through interactive mind maps.
              </p>
              <p>
                • Create unlimited mind maps with custom nodes and connections
              </p>
              <p>
                • Auto-save ensures your work is never lost
              </p>
              <p>
                • Export your mind maps as PNG, SVG, or JSON files
              </p>
              <p>
                • Works entirely offline - your data stays private
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};