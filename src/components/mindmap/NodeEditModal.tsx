import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface NodeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (label: string, description: string) => void;
  initialLabel?: string;
  initialDescription?: string;
}

export const NodeEditModal: React.FC<NodeEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLabel = '',
  initialDescription = '',
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setLabel(initialLabel);
    setDescription(initialDescription);
  }, [initialLabel, initialDescription, isOpen]);

  const handleSave = () => {
    if (label.trim()) {
      onSave(label.trim(), description.trim());
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Node">
      <div className="space-y-4">
        <Input
          label="Title"
          value={label}
          onChange={setLabel}
          placeholder="Enter node title"
          required
          onKeyPress={handleKeyPress}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter node description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button onClick={handleSave} className="flex-1" disabled={!label.trim()}>
            Save
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};