import html2canvas from 'html2canvas';
import { MindMap } from '../types/mindmap';

export const exportToPNG = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: 'white',
      scale: 2,
    });
    
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Error exporting to PNG:', error);
  }
};

export const exportToSVG = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const svgData = new XMLSerializer().serializeToString(element);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to SVG:', error);
  }
};

export const exportToJSON = (mindMaps: MindMap[], filename: string = 'mindmaps') => {
  try {
    const dataStr = JSON.stringify(mindMaps, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${filename}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
  }
};

export const importFromJSON = (file: File): Promise<MindMap[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        resolve(Array.isArray(data) ? data : [data]);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};