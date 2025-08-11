import React, { createContext, useContext, useState, useEffect } from 'react';
import { MindMap } from '../types/mindmap';

interface MindMapContextType {
  mindMaps: MindMap[];
  currentMindMap: MindMap | null;
  setCurrentMindMap: (mindMap: MindMap | null) => void;
  saveMindMap: (mindMap: MindMap) => void;
  deleteMindMap: (id: string) => void;
  createMindMap: (title: string, description?: string) => MindMap;
  updateMindMap: (mindMap: MindMap) => void;
}

const MindMapContext = createContext<MindMapContextType | undefined>(undefined);

export const MindMapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [currentMindMap, setCurrentMindMap] = useState<MindMap | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mindMaps');
    if (saved) {
      setMindMaps(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mindMaps', JSON.stringify(mindMaps));
  }, [mindMaps]);

  const saveMindMap = (mindMap: MindMap) => {
    setMindMaps(prev => {
      const existing = prev.find(m => m.id === mindMap.id);
      if (existing) {
        return prev.map(m => m.id === mindMap.id ? mindMap : m);
      }
      return [...prev, mindMap];
    });
  };

  const deleteMindMap = (id: string) => {
    setMindMaps(prev => prev.filter(m => m.id !== id));
    if (currentMindMap?.id === id) {
      setCurrentMindMap(null);
    }
  };

  const createMindMap = (title: string, description?: string): MindMap => {
    const newMindMap: MindMap = {
      id: Date.now().toString(),
      title,
      description,
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveMindMap(newMindMap);
    return newMindMap;
  };

  const updateMindMap = (mindMap: MindMap) => {
    const updatedMindMap = {
      ...mindMap,
      updatedAt: new Date().toISOString(),
    };
    saveMindMap(updatedMindMap);
    setCurrentMindMap(updatedMindMap);
  };

  return (
    <MindMapContext.Provider
      value={{
        mindMaps,
        currentMindMap,
        setCurrentMindMap,
        saveMindMap,
        deleteMindMap,
        createMindMap,
        updateMindMap,
      }}
    >
      {children}
    </MindMapContext.Provider>
  );
};

export const useMindMap = () => {
  const context = useContext(MindMapContext);
  if (context === undefined) {
    throw new Error('useMindMap must be used within a MindMapProvider');
  }
  return context;
};