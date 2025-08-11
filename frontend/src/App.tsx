import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MindMapProvider } from './contexts/MindMapContext';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { Viewer } from './pages/Viewer';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <MindMapProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/editor/:id" element={<Editor />} />
              <Route path="/viewer/:id" element={<Viewer />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </Router>
      </MindMapProvider>
    </ThemeProvider>
  );
}

export default App;