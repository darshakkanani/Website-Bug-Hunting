import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Edit2, Trash2 } from 'lucide-react';

interface CustomNodeData {
  label: string;
  description?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ id, data, isConnectable }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg min-w-[150px] p-3">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
            {data.label}
          </h3>
          <div className="flex space-x-1 ml-2">
            <button
              onClick={() => data.onEdit(id)}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => data.onDelete(id)}
              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {data.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
            {data.description}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default memo(CustomNode);