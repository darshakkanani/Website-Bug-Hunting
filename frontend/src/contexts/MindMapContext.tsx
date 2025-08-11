import React, { createContext, useContext, useState, useEffect } from 'react';
import { MindMap } from '../types/mindmap';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

interface MindMapContextType {
  mindMaps: MindMap[];
  currentMindMap: MindMap | null;
  loading: boolean;
  error: string | null;
  setCurrentMindMap: (mindMap: MindMap | null) => void;
  saveMindMap: (mindMap: MindMap) => Promise<void>;
  deleteMindMap: (id: string) => Promise<void>;
  createMindMap: (title: string, description?: string) => Promise<MindMap | null>;
  updateMindMap: (mindMap: MindMap) => Promise<void>;
  loadMindMaps: () => Promise<void>;
}

const MindMapContext = createContext<MindMapContextType | undefined>(undefined);

export const MindMapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [currentMindMap, setCurrentMindMap] = useState<MindMap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load mindmaps from database when token changes
  useEffect(() => {
    if (token) {
      loadMindMaps();
    } else {
      setMindMaps([]);
      setCurrentMindMap(null);
    }
  }, [token]);

  const loadMindMaps = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    const response = await apiService.getAllMindmaps(token);
    
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setMindMaps(response.data);
    }
    setLoading(false);
  };

  const saveMindMap = async (mindMap: MindMap) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    const response = await apiService.updateMindmap(mindMap.id, mindMap, token);
    
    if (response.error) {
      setError(response.error);
    } else {
      setMindMaps(prev => {
        const existing = prev.find(m => m.id === mindMap.id);
        if (existing) {
          return prev.map(m => m.id === mindMap.id ? mindMap : m);
        }
        return [...prev, mindMap];
      });
    }
    setLoading(false);
  };

  const deleteMindMap = async (id: string) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    const response = await apiService.deleteMindmap(id, token);
    
    if (response.error) {
      setError(response.error);
    } else {
      setMindMaps(prev => prev.filter(m => m.id !== id));
      if (currentMindMap?.id === id) {
        setCurrentMindMap(null);
      }
    }
    setLoading(false);
  };

  const createMindMap = async (title: string, description?: string): Promise<MindMap | null> => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    const response = await apiService.createMindmap(title, description, token);
    
    if (response.error) {
      setError(response.error);
      setLoading(false);
      return null;
    }
    
    if (response.data) {
      setMindMaps(prev => [...prev, response.data]);
      setLoading(false);
      return response.data;
    }
    
    setLoading(false);
    return null;
  };

  const updateMindMap = async (mindMap: MindMap) => {
    const updatedMindMap = {
      ...mindMap,
      updatedAt: new Date().toISOString(),
    };
    await saveMindMap(updatedMindMap);
    setCurrentMindMap(updatedMindMap);
  };

  return (
    <MindMapContext.Provider
      value={{
        mindMaps,
        currentMindMap,
        loading,
        error,
        setCurrentMindMap,
        saveMindMap,
        deleteMindMap,
        createMindMap,
        updateMindMap,
        loadMindMaps,
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