import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Calendar, FileText } from 'lucide-react';
import { useMindMap } from '../contexts/MindMapContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export const Dashboard: React.FC = () => {
  const { mindMaps, createMindMap, deleteMindMap, setCurrentMindMap } = useMindMap();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreateMindMap = () => {
    if (newTitle.trim()) {
      const mindMap = createMindMap(newTitle.trim(), newDescription.trim());
      setCurrentMindMap(mindMap);
      setNewTitle('');
      setNewDescription('');
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteMindMap = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMindMap(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mind Maps
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Organize your thoughts and ideas visually
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              icon={Plus}
              size="lg"
            >
              Create Mind Map
            </Button>
          </div>
        </div>

        {mindMaps.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No mind maps yet
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Get started by creating your first mind map
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                icon={Plus}
              >
                Create Mind Map
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mindMaps.map((mindMap) => (
              <div
                key={mindMap.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {mindMap.title}
                    </h3>
                    <div className="flex space-x-1 ml-2">
                      <Link
                        to={`/editor/${mindMap.id}`}
                        className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setCurrentMindMap(mindMap)}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteMindMap(mindMap.id, mindMap.title)}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {mindMap.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {mindMap.description}
                    </p>
                  )}

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Updated {formatDate(mindMap.updatedAt)}</span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {mindMap.nodes.length} nodes, {mindMap.edges.length} connections
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/editor/${mindMap.id}`}
                      onClick={() => setCurrentMindMap(mindMap)}
                      className="flex-1"
                    >
                      <Button variant="primary" className="w-full" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link
                      to={`/viewer/${mindMap.id}`}
                      onClick={() => setCurrentMindMap(mindMap)}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewTitle('');
          setNewDescription('');
        }}
        title="Create New Mind Map"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={newTitle}
            onChange={setNewTitle}
            placeholder="Enter mind map title"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter mind map description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleCreateMindMap}
              className="flex-1"
              disabled={!newTitle.trim()}
            >
              Create
            </Button>
            <Button
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewTitle('');
                setNewDescription('');
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};